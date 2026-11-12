import "server-only";
import type { ChatMessage } from "./prompt";

export type Provider = "openai" | "anthropic";

export class ProviderError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: "auth" | "rate_limit" | "bad_request" | "upstream" | "timeout",
  ) {
    super(message);
  }
}

export function resolveProvider(): Provider | null {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  const preferred = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (preferred === "anthropic" && hasAnthropic) return "anthropic";
  if (preferred === "openai" && hasOpenAI) return "openai";
  if (hasOpenAI) return "openai";
  if (hasAnthropic) return "anthropic";
  return null;
}

interface StreamArgs {
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
  signal: AbortSignal;
}

function mapStatus(status: number, detail: string): ProviderError {
  if (status === 401 || status === 403) {
    return new ProviderError("Ключ AI-провайдера недействителен или не имеет доступа к модели.", 502, "auth");
  }
  if (status === 429) {
    return new ProviderError("AI-провайдер временно ограничил запросы. Попробуйте через минуту.", 503, "rate_limit");
  }
  if (status === 400 || status === 404 || status === 422) {
    return new ProviderError(`Провайдер отклонил запрос: ${detail}`.slice(0, 300), 502, "bad_request");
  }
  return new ProviderError("AI-провайдер временно недоступен. Попробуйте ещё раз.", 502, "upstream");
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: string } };
    return data?.error?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

/** Разбирает SSE-поток и отдаёт data-строки */
async function* sseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (line.startsWith("data:")) yield line.slice(5).trim();
    }
  }
  if (buffer.trim().startsWith("data:")) yield buffer.trim().slice(5).trim();
}

async function* streamOpenAI({ system, messages, maxTokens, signal }: StreamArgs): AsyncGenerator<string> {
  const base = (process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4.1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_completion_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok || !res.body) throw mapStatus(res.status, await readErrorDetail(res));

  for await (const data of sseData(res.body)) {
    if (data === "[DONE]") return;
    try {
      const json = JSON.parse(data) as {
        choices?: { delta?: { content?: string } }[];
        error?: { message?: string };
      };
      if (json.error) throw new ProviderError(json.error.message ?? "Ошибка провайдера", 502, "upstream");
      const text = json.choices?.[0]?.delta?.content;
      if (text) yield text;
    } catch (e) {
      if (e instanceof ProviderError) throw e;
      /* пропускаем неполные/служебные строки */
    }
  }
}

async function* streamAnthropic({ system, messages, maxTokens, signal }: StreamArgs): AsyncGenerator<string> {
  const base = (process.env.ANTHROPIC_BASE_URL?.trim() || "https://api.anthropic.com").replace(/\/$/, "");
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-5";
  const res = await fetch(`${base}/v1/messages`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model, system, messages, max_tokens: maxTokens, stream: true }),
  });
  if (!res.ok || !res.body) throw mapStatus(res.status, await readErrorDetail(res));

  for await (const data of sseData(res.body)) {
    try {
      const json = JSON.parse(data) as {
        type?: string;
        delta?: { type?: string; text?: string };
        error?: { message?: string };
      };
      if (json.type === "error") {
        throw new ProviderError(json.error?.message ?? "Ошибка провайдера", 502, "upstream");
      }
      if (json.type === "content_block_delta" && json.delta?.type === "text_delta" && json.delta.text) {
        yield json.delta.text;
      }
      if (json.type === "message_stop") return;
    } catch (e) {
      if (e instanceof ProviderError) throw e;
    }
  }
}

export function streamCompletion(provider: Provider, args: StreamArgs): AsyncGenerator<string> {
  return provider === "openai" ? streamOpenAI(args) : streamAnthropic(args);
}
