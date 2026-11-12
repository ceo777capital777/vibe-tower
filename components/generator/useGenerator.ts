"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  STREAM_ERROR_MARKER,
  type GenerateRequest,
  type GeneratorStatus,
} from "@/lib/generator/config";

export type Phase = "idle" | "streaming" | "done" | "error";

export interface GeneratorError {
  code: string;
  message: string;
}

/** Логика общения с /api/generate: статус, потоковое чтение, отмена, ошибки */
export function useGenerator() {
  const [status, setStatus] = useState<GeneratorStatus | null>(null);
  const [statusError, setStatusError] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<GeneratorError | null>(null);
  const [lastRequest, setLastRequest] = useState<GenerateRequest | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Последний успешный результат: не теряем его, если повторный запрос отклонён (429, 5xx)
  const lastGoodRef = useRef<{ output: string; request: GenerateRequest } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/generate", { cache: "no-store" })
      .then((r) => r.json() as Promise<GeneratorStatus>)
      .then((s) => !cancelled && setStatus(s))
      .catch(() => !cancelled && setStatusError(true));
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, []);

  const run = useCallback(async (req: GenerateRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLastRequest(req);
    setError(null);
    setOutput("");
    setPhase("streaming");

    let text = "";
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        let err: GeneratorError = { code: "http", message: `Ошибка сервера (${res.status}). Попробуйте ещё раз.` };
        try {
          const data = (await res.json()) as { error?: GeneratorError };
          if (data.error) err = data.error;
        } catch {
          /* ответ не JSON */
        }
        if (err.code === "not_configured") setStatus({ configured: false, provider: null });
        setError(err);
        const prev = lastGoodRef.current;
        if (prev && err.code !== "not_configured") {
          setOutput(prev.output);
          setLastRequest(prev.request);
          setPhase("done");
        } else {
          setPhase("error");
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let frame = 0;
      const flush = () => {
        frame = 0;
        setOutput(text);
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        if (!frame) frame = requestAnimationFrame(flush);
      }
      text += decoder.decode();
      if (frame) cancelAnimationFrame(frame);

      if (text.includes(STREAM_ERROR_MARKER)) {
        text = text.replace(STREAM_ERROR_MARKER, "").trimEnd();
        setOutput(text);
        setError({ code: "interrupted", message: "Генерация прервалась на стороне AI-провайдера. Результат может быть неполным — повторите запрос." });
        setPhase(text ? "done" : "error");
        return;
      }
      if (!text.trim()) {
        setError({ code: "empty", message: "Модель вернула пустой ответ. Попробуйте ещё раз или уточните описание." });
        setPhase("error");
        return;
      }
      setOutput(text);
      lastGoodRef.current = { output: text, request: req };
      setPhase("done");
    } catch (e) {
      if (controller.signal.aborted) {
        setOutput(text);
        setPhase(text ? "done" : "idle");
        if (text) setError({ code: "aborted", message: "Генерация остановлена. Результат неполный." });
        return;
      }
      setError({ code: "network", message: "Нет соединения с сервером. Проверьте интернет и повторите." });
      setPhase("error");
      console.error(e);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, []);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return { status, statusError, phase, output, error, lastRequest, run, stop };
}
