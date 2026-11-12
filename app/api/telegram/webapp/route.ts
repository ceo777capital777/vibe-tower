import { connection, type NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/generator/rate-limit";
import { validateTelegramInitData } from "@/lib/telegram/validate-init-data";

const noStore = { "Cache-Control": "no-store" };

function clientIp(request: NextRequest) {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

/**
 * Optional initData check. Does not grant access: the platform is public.
 * TELEGRAM_BOT_TOKEN is optional; when it is missing the response is { ok: true, validated: false }.
 */
export async function POST(request: NextRequest) {
  await connection();

  const limit = checkRateLimit(`telegram-webapp:${clientIp(request)}`);
  if (!limit.ok) {
    return Response.json({ ok: false }, { status: 429, headers: { ...noStore, "Retry-After": String(limit.retryAfter) } });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > 32_768) {
    return Response.json({ ok: false }, { status: 413, headers: noStore });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400, headers: noStore });
  }

  const initData =
    payload && typeof payload === "object" && "initData" in payload && typeof payload.initData === "string"
      ? payload.initData
      : "";

  const result = validateTelegramInitData(initData);
  if (!result.ok) return Response.json({ ok: false }, { status: 401, headers: noStore });
  return Response.json({ ok: true, validated: result.validated }, { headers: noStore });
}
