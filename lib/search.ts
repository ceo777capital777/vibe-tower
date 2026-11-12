import { normalize } from "./utils";

export interface SearchEntry {
  id: string;
  kind: "article" | "tool";
  title: string;
  description: string;
  href: string;
  /** Подпись группы: название раздела или категории инструмента */
  group: string;
  groupId: string;
  tags: string[];
  text: string;
  meta?: string;
}

export interface SearchHit {
  entry: SearchEntry;
  score: number;
  snippet?: string;
}

function snippetAround(text: string, term: string): string | undefined {
  const idx = normalize(text).indexOf(term);
  if (idx < 0) return undefined;
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + term.length + 90);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/** Поиск по всем терминам запроса: каждый термин должен где-то найтись */
export function searchEntries(entries: SearchEntry[], query: string, limit = 50): SearchHit[] {
  const terms = normalize(query).split(/\s+/).filter((t) => t.length > 1);
  if (terms.length === 0) return [];

  const hits: SearchHit[] = [];
  for (const entry of entries) {
    const title = normalize(entry.title);
    const desc = normalize(entry.description);
    const tags = normalize(entry.tags.join(" "));
    const group = normalize(entry.group);
    const text = normalize(entry.text);

    let score = 0;
    let all = true;
    for (const t of terms) {
      let s = 0;
      if (title.includes(t)) s += title.startsWith(t) ? 12 : 8;
      if (tags.includes(t)) s += 5;
      if (desc.includes(t)) s += 3;
      if (group.includes(t)) s += 2;
      if (text.includes(t)) s += 1;
      if (s === 0) {
        all = false;
        break;
      }
      score += s;
    }
    if (!all) continue;
    const firstInText = terms.find((t) => !title.includes(t) && !desc.includes(t));
    hits.push({
      entry,
      score,
      snippet: firstInText ? snippetAround(entry.text, firstInText) : undefined,
    });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
