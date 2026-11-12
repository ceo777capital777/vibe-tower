import { connection, type NextRequest } from "next/server";
import {
  LIMITS,
  STREAM_ERROR_MARKER,
  isMode,
  isTarget,
  type GenerateRequest,
  type GeneratorStatus,
} from "@/lib/generator/config";
import { buildMessages, buildSystemPrompt, maxTokensFor } from "@/lib/generator/prompt";
import { ProviderError, resolveProvider, streamCompletion } from "@/lib/generator/providers";
import { checkRateLimit } from "@/lib/generator/rate-limit";

export const maxDuration = 120;

type ErrorCode =
  | "not_configured"
  | "invalid_input"
  | "rate_limited"
  | "auth"
  | "rate_limit"
  | "bad_request"
  | "upstream"
  | "timeout";

function errorResponse(status: number, code: ErrorCode, message: string, headers?: HeadersInit) {
  return Response.json({ error: { code, message } }, { status, headers });
}

/** Статус генератора: настроен ли ключ (без раскрытия самого ключа) */
export async function GET() {
  await connection();
  const provider = resolveProvider();
  const body: GeneratorStatus = { configured: provider !== null, provider };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}

function validate(raw: unknown): GenerateRequest | string {
  if (!raw || typeof raw !== "object") return "Некорректный запрос.";
  const r = raw as Record<string, unknown>;
  const idea = typeof r.idea === "string" ? r.idea.trim() : "";
  if (idea.length < LIMITS.ideaMin) return `Опишите идею подробнее — минимум ${LIMITS.ideaMin} символов.`;
  if (idea.length > LIMITS.ideaMax) return `Описание слишком длинное — максимум ${LIMITS.ideaMax} символов.`;
  if (!isMode(r.mode)) return "Неизвестный режим генерации.";
  if (!isTarget(r.target)) return "Неизвестный целевой инструмент.";

  const req: GenerateRequest = { idea, mode: r.mode, target: r.target };

  if (r.instruction !== undefined || r.previous !== undefined) {
    const instruction = typeof r.instruction === "string" ? r.instruction.trim() : "";
    const previous = typeof r.previous === "string" ? r.previous.trim() : "";
    if (!instruction) return "Напишите, что нужно улучшить.";
    if (instruction.length > LIMITS.instructionMax) return `Инструкция слишком длинная — максимум ${LIMITS.instructionMax} символов.`;
    if (!previous || previous.length > LIMITS.previousMax) return "Нет предыдущего результата для доработки.";
    req.instruction = instruction;
    req.previous = previous;
  }
  return req;
}

function clientKey(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function POST(request: NextRequest) {
  const provider = resolveProvider();
  if (!provider) {
    return errorResponse(
      503,
      "not_configured",
      "Генератор ещё не подключён: на сервере не задан OPENAI_API_KEY или ANTHROPIC_API_KEY.",
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 200_000) return errorResponse(413, "invalid_input", "Запрос слишком большой.");

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(400, "invalid_input", "Не удалось прочитать запрос.");
  }

  const parsed = validate(raw);
  if (typeof parsed === "string") return errorResponse(400, "invalid_input", parsed);

  const limit = checkRateLimit(clientKey(request));
  if (!limit.ok) {
    return errorResponse(
      429,
      "rate_limited",
      `Слишком много запросов. Повторите через ${limit.retryAfter} с.`,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(110_000)]);
  const iterator = streamCompletion(provider, {
    system: buildSystemPrompt(parsed.mode, parsed.target),
    messages: buildMessages(parsed),
    maxTokens: maxTokensFor(parsed.mode),
    signal,
  });

  // Ждём первый фрагмент, чтобы ошибки авторизации и лимитов вернуть нормальным HTTP-статусом
  let first: IteratorResult<string>;
  try {
    first = await iterator.next();
  } catch (e) {
    return toErrorResponse(e);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done && first.value) controller.enqueue(encoder.encode(first.value));
        if (!first.done) {
          for await (const chunk of { [Symbol.asyncIterator]: () => iterator }) {
            controller.enqueue(encoder.encode(chunk));
          }
        }
      } catch (e) {
        console.error("[generate] stream interrupted:", e instanceof Error ? e.message : e);
        controller.enqueue(encoder.encode(STREAM_ERROR_MARKER));
      } finally {
        controller.close();
      }
    },
    cancel() {
      void iterator.return?.(undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-AI-Provider": provider,
    },
  });
}

function toErrorResponse(e: unknown): Response {
  if (e instanceof ProviderError) {
    console.error("[generate] provider error:", e.code, e.message);
    return errorResponse(e.status, e.code, e.message);
  }
  if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) {
    return errorResponse(504, "timeout", "Модель отвечала слишком долго. Попробуйте QUICK MODE или повторите запрос.");
  }
  console.error("[generate] unexpected error:", e);
  return errorResponse(502, "upstream", "Не удалось связаться с AI-провайдером. Попробуйте ещё раз.");
}
