import { CLARIFY_HEADING, GENERATOR_SECTIONS, OPEN_QUESTIONS_HEADING } from "./config";

export interface ParsedSection {
  /** Заголовок как его вернула модель (без номера) */
  title: string;
  /** Канонический ключ из GENERATOR_SECTIONS, если распознан */
  key?: string;
  body: string;
}

export interface ParsedResult {
  preamble: string;
  sections: ParsedSection[];
  /** Модель вернула только уточняющие вопросы */
  needsClarification: boolean;
}

const normalizeKey = (s: string) => s.toLowerCase().replace(/[^a-z/]/g, "");

function matchKey(title: string): string | undefined {
  const n = normalizeKey(title);
  const known = [...GENERATOR_SECTIONS.map((s) => s.key), CLARIFY_HEADING, OPEN_QUESTIONS_HEADING];
  return known.find((k) => n.startsWith(normalizeKey(k)));
}

/** Разбирает Markdown-ответ модели на разделы по заголовкам второго уровня */
export function parseGenerated(markdown: string): ParsedResult {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections: ParsedSection[] = [];
  const preamble: string[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const m = /^##\s+(?:\d+[.)]\s*)?(.+?)\s*#*\s*$/.exec(line);
    if (m && !line.startsWith("###")) {
      const title = m[1].replace(/\*\*/g, "").trim();
      current = { title, key: matchKey(title), body: "" };
      sections.push(current);
    } else if (current) {
      current.body += `${line}\n`;
    } else {
      preamble.push(line);
    }
  }

  for (const s of sections) s.body = s.body.trim();

  const specSections = sections.filter((s) => s.key && s.key !== CLARIFY_HEADING && s.key !== OPEN_QUESTIONS_HEADING);
  const needsClarification = specSections.length === 0 && sections.some((s) => s.key === CLARIFY_HEADING);

  return { preamble: preamble.join("\n").trim(), sections, needsClarification };
}

export function sectionToMarkdown(s: ParsedSection): string {
  return `## ${s.title}\n\n${s.body}`;
}
