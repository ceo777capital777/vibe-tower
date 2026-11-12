import "server-only";

/**
 * Простое ограничение частоты в памяти процесса (скользящее окно).
 * Для нескольких инстансов на продакшене замените на Redis/Upstash.
 */
const WINDOWS = [
  { ms: 60_000, max: 5 },
  { ms: 60 * 60_000, max: 30 },
];

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const longest = Math.max(...WINDOWS.map((w) => w.ms));
  const list = (hits.get(key) ?? []).filter((t) => now - t < longest);

  for (const w of WINDOWS) {
    const inWindow = list.filter((t) => now - t < w.ms);
    if (inWindow.length >= w.max) {
      const retryAfter = Math.ceil((w.ms - (now - inWindow[0])) / 1000);
      hits.set(key, list);
      return { ok: false, retryAfter };
    }
  }

  list.push(now);
  hits.set(key, list);

  // Периодическая очистка, чтобы карта не росла бесконечно
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= longest)) hits.delete(k);
  }
  return { ok: true };
}
