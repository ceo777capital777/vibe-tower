import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_AGE_SEC = 60 * 60 * 24;
const MAX_LENGTH = 16_384;

export type InitDataResult = { ok: true; validated: boolean } | { ok: false };

/**
 * Validates Telegram Mini App initData with the bot token.
 * Without TELEGRAM_BOT_TOKEN the check is skipped and the site keeps working.
 * The token is read only on the server and is never returned.
 */
export function validateTelegramInitData(initData: string): InitDataResult {
  // Bracket access so the token is read at runtime and is not inlined into the build.
  const token = process.env["TELEGRAM_BOT_TOKEN"]?.trim() ?? "";
  if (!token) return { ok: true, validated: false };
  if (!initData || initData.length > MAX_LENGTH) return { ok: false };

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) return { ok: false };

  const fields = new Map<string, string>();
  for (const [key, value] of params) {
    if (key !== "hash") fields.set(key, value);
  }
  const dataCheckString = [...fields.entries()]
    .sort(([a], [b]) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = createHmac("sha256", "WebAppData").update(token).digest();
  const computed = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const left = Buffer.from(computed, "hex");
  const right = Buffer.from(hash, "hex");
  if (left.length !== right.length || !timingSafeEqual(left, right)) return { ok: false };

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate)) return { ok: false };
  const age = Math.floor(Date.now() / 1000) - authDate;
  if (age < -30 || age > MAX_AGE_SEC) return { ok: false };

  return { ok: true, validated: true };
}
