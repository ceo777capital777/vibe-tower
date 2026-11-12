import type { ReactNode } from "react";
import { InlineText } from "./InlineText";

type MdBlock =
  | { type: "p"; text: string }
  | { type: "h"; level: 3 | 4; text: string }
  | { type: "list"; ordered: boolean; items: { text: string; depth: number }[] }
  | { type: "code"; code: string }
  | { type: "quote"; text: string }
  | { type: "hr" };

/** Небольшой безопасный парсер Markdown для ответов генератора (без HTML) */
export function parseMarkdown(src: string): MdBlock[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let para: string[] = [];

  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flush();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      blocks.push({ type: "code", code: code.join("\n") });
      continue;
    }
    if (!trimmed) {
      flush();
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flush();
      blocks.push({ type: "hr" });
      continue;
    }
    const h = /^(#{3,6})\s+(.+)$/.exec(trimmed);
    if (h) {
      flush();
      blocks.push({ type: "h", level: h[1].length === 3 ? 3 : 4, text: h[2].replace(/#+$/, "").trim() });
      continue;
    }
    const li = /^(\s*)([-*+]|\d+[.)])\s+(.+)$/.exec(line);
    if (li) {
      flush();
      const ordered = /\d/.test(li[2]);
      const depth = Math.min(3, Math.floor(li[1].replace(/\t/g, "  ").length / 2));
      const last = blocks[blocks.length - 1];
      if (last?.type === "list" && (last.ordered === ordered || depth > 0)) {
        last.items.push({ text: li[3], depth });
      } else {
        blocks.push({ type: "list", ordered, items: [{ text: li[3], depth }] });
      }
      continue;
    }
    if (trimmed.startsWith(">")) {
      flush();
      blocks.push({ type: "quote", text: trimmed.replace(/^>\s?/, "") });
      continue;
    }
    // Продолжение пункта списка с отступом
    const last = blocks[blocks.length - 1];
    if (!para.length && last?.type === "list" && /^\s{2,}/.test(line)) {
      last.items[last.items.length - 1].text += ` ${trimmed}`;
      continue;
    }
    para.push(trimmed);
  }
  flush();
  return blocks;
}

export function Markdown({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className="prose-vt space-y-4 text-[0.98rem] leading-7">
      {blocks.map((b, i): ReactNode => {
        switch (b.type) {
          case "p":
            return (
              <p key={i}>
                <InlineText text={b.text} />
              </p>
            );
          case "h":
            return b.level === 3 ? (
              <h3 key={i} className="pt-2 font-display text-[0.95rem] font-medium uppercase tracking-[0.06em] text-white">
                <InlineText text={b.text} />
              </h3>
            ) : (
              <h4 key={i} className="pt-1 text-sm font-bold text-white">
                <InlineText text={b.text} />
              </h4>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className={b.ordered ? "list-decimal space-y-1.5 pl-6 marker:text-accent-2" : "space-y-1.5"}>
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    style={{ marginLeft: `${it.depth * 1.1}rem` }}
                    className={b.ordered ? "pl-1" : "relative pl-5 before:absolute before:left-0.5 before:top-[0.72em] before:size-1.5 before:rounded-full before:bg-accent-2/70"}
                  >
                    <InlineText text={it.text} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-2xl border border-line bg-black/40 p-4 font-mono text-[0.82rem] leading-6 text-[#cfe0ff]"
              >
                <code>{b.code}</code>
              </pre>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-accent-2/60 pl-4 text-white/75">
                <InlineText text={b.text} />
              </blockquote>
            );
          case "hr":
            return <hr key={i} className="border-line" />;
        }
      })}
    </div>
  );
}
