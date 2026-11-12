"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Lightbulb, Loader2, Square, Wand2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  EXAMPLE_IDEA,
  GENERATOR_SECTIONS,
  LIMITS,
  MODES,
  PLACEHOLDER,
  TARGETS,
  type GenerateRequest,
  type GeneratorMode,
  type GeneratorTarget,
} from "@/lib/generator/config";
import type { ParsedSection } from "@/lib/generator/parse";
import { cn } from "@/lib/utils";
import { NotConfigured } from "./NotConfigured";
import { ResultView } from "./ResultView";
import { Segmented } from "./Segmented";
import { useGenerator } from "./useGenerator";

export function GeneratorClient() {
  const { status, statusError, phase, output, error, lastRequest, run, stop } = useGenerator();
  const [idea, setIdea] = useState("");
  const [mode, setMode] = useState<GeneratorMode>("quick");
  const [target, setTarget] = useState<GeneratorTarget>("cursor");
  const [validation, setValidation] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const streaming = phase === "streaming";
  const notConfigured = status !== null && !status.configured;
  const canGenerate = !streaming && !notConfigured && status !== null;
  const ideaLength = idea.trim().length;

  const generate = (req?: Partial<GenerateRequest>) => {
    const text = (req?.idea ?? idea).trim();
    if (text.length < LIMITS.ideaMin) {
      setValidation(`Опишите идею подробнее — хотя бы пару предложений (минимум ${LIMITS.ideaMin} символов).`);
      return;
    }
    setValidation(null);
    void run({ mode, target, ...req, idea: text });
    requestAnimationFrame(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const onPdf = async (sections: ParsedSection[]) => {
    if (!lastRequest) return;
    setPdfBusy(true);
    setPdfError(null);
    try {
      const { exportPdf } = await import("@/lib/generator/pdf");
      const modeLabel = MODES.find((m) => m.id === lastRequest.mode)?.label;
      const targetLabel = TARGETS.find((t) => t.id === lastRequest.target)?.label;
      await exportPdf({
        idea: lastRequest.idea,
        meta: `${modeLabel} · ${targetLabel} · ${new Date().toLocaleDateString("ru-RU")}`,
        sections,
        fileName: `vibe-tower-tz-${Date.now()}.pdf`,
      });
    } catch (e) {
      console.error(e);
      setPdfError("Не удалось создать PDF. Попробуйте ещё раз или скопируйте текст.");
    } finally {
      setPdfBusy(false);
    }
  };

  const hasResult = (phase === "streaming" || phase === "done") && lastRequest;

  return (
    <div>
      {/* Композитор */}
      <section aria-label="Описание идеи" className="mx-auto max-w-4xl">
        {notConfigured && <NotConfigured />}
        {statusError && (
          <p className="mb-4 text-center text-sm text-amber-200/80">Не удалось проверить статус генератора. Обновите страницу.</p>
        )}

        <div className="glass glass-strong edge-glow relative rounded-[32px] p-3 md:p-4 shadow-[0_40px_120px_-40px_rgb(40_107_255/0.45)]">
          <label htmlFor="idea" className="sr-only">
            Описание сайта
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value.slice(0, LIMITS.ideaMax));
              if (validation) setValidation(null);
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canGenerate) generate();
            }}
            placeholder={PLACEHOLDER}
            rows={6}
            disabled={streaming}
            aria-invalid={Boolean(validation)}
            aria-describedby="idea-help"
            className="block min-h-[200px] w-full resize-y rounded-[24px] border border-line bg-black/30 p-5 text-base leading-relaxed text-white outline-none transition placeholder:text-white/40 focus:border-accent-2/50 md:min-h-[220px] md:p-6 md:text-lg"
          />

          <div id="idea-help" className="flex flex-wrap items-center justify-between gap-2 px-2 pt-3 text-xs text-muted">
            <button
              type="button"
              onClick={() => {
                setIdea(EXAMPLE_IDEA);
                setValidation(null);
              }}
              disabled={streaming}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-white/70 transition hover:text-white disabled:opacity-40"
            >
              <Lightbulb className="size-3.5 text-accent-2" aria-hidden /> Подставить пример
            </button>
            <span className={cn(ideaLength > LIMITS.ideaMax * 0.9 && "text-amber-200")}>
              {idea.length} / {LIMITS.ideaMax}
            </span>
          </div>

          <div className="mt-3 grid gap-3 border-t border-line px-1 pt-4 md:grid-cols-[auto_1fr] md:items-center">
            <Segmented id="mode" label="Режим генерации" value={mode} options={MODES} onChange={setMode} disabled={streaming} />
            <Segmented id="target" label="Целевой AI-инструмент" value={target} options={TARGETS} onChange={setTarget} disabled={streaming} />
            {streaming ? (
              <Button variant="secondary" onClick={stop} className="h-12 md:col-span-2 md:justify-self-end md:px-10">
                <Square className="size-3.5" aria-hidden /> Стоп
              </Button>
            ) : (
              <Button onClick={() => generate()} disabled={!canGenerate} className="h-12 md:col-span-2 md:justify-self-end md:px-10" title={notConfigured ? "Генератор не подключён" : undefined}>
                {status === null ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Wand2 className="size-4" aria-hidden />}
                Generate prompt
              </Button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          {MODES.find((m) => m.id === mode)?.hint}. Ctrl/⌘ + Enter — отправить. Не вводите персональные данные и секреты.
        </p>

        <AnimatePresence>
          {(validation || (error && phase === "error")) && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 px-5 py-4 text-sm text-red-100"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{validation ?? error?.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Результат */}
      <section id="result" aria-label="Результат" aria-live="polite" aria-busy={streaming} className="mt-16 scroll-mt-28">
        {hasResult ? (
          <>
            {error && phase === "done" && (
              <p role="alert" className="mb-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-5 py-3 text-sm text-amber-100">{error.message}</p>
            )}
            {pdfError && <p className="mb-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-5 py-3 text-sm text-red-100">{pdfError}</p>}
            <ResultView
              output={output}
              streaming={streaming}
              resultTarget={lastRequest.target}
              currentTarget={target}
              pdfBusy={pdfBusy}
              onPdf={onPdf}
              onRegenerate={() => void run(lastRequest)}
              onRetarget={() => void run({ ...lastRequest, target, previous: undefined, instruction: undefined })}
              onRefine={(instruction) =>
                void run({ idea: lastRequest.idea, mode: lastRequest.mode, target: lastRequest.target, previous: output, instruction })
              }
              onAnswer={(answers) => {
                const nextIdea = `${lastRequest.idea}\n\nОтветы на уточняющие вопросы:\n${answers}`.slice(0, LIMITS.ideaMax);
                setIdea(nextIdea);
                void run({ idea: nextIdea, mode: lastRequest.mode, target: lastRequest.target });
              }}
            />
          </>
        ) : (
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow mb-5 text-center">Структура результата</p>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GENERATOR_SECTIONS.map((s, i) => (
                <li key={s.key} className="glass rounded-2xl px-4 py-3.5">
                  <span className="font-display text-[0.6rem] tracking-[0.2em] text-accent-2/80">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-1 text-[0.82rem] font-semibold text-white/85">{s.key}</p>
                  <p className="text-[0.72rem] text-muted">{s.label}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
