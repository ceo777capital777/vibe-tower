import { AlertTriangle, Info } from "lucide-react";
import type { Block } from "@/content/types";
import { InlineText } from "@/components/ui/InlineText";
import { cn } from "@/lib/utils";

export function headingId(index: number) {
  return `part-${index + 1}`;
}

/** Рендер основного текста статьи; h2 получают якоря для оглавления */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  let h2 = -1;
  return (
    <div className="prose-vt">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="mt-5 first:mt-0">
                <InlineText text={b.text} />
              </p>
            );
          case "h2":
            h2++;
            return (
              <h2
                key={i}
                id={headingId(h2)}
                className="mt-14 scroll-mt-28 font-display text-[clamp(1.25rem,2.2vw,1.6rem)] font-medium leading-snug tracking-[-0.01em] text-white"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-8 text-lg font-bold text-white">
                {b.text}
              </h3>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className="mt-5 space-y-3">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3.5">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-[0.55em] shrink-0",
                        b.ordered
                          ? "-mt-0.5 grid size-7 place-items-center rounded-full border border-accent-2/40 font-display text-[0.62rem] text-accent-2"
                          : "size-1.5 rounded-full bg-accent-2 shadow-[0_0_10px_rgb(99_164_255/0.8)]",
                      )}
                    >
                      {b.ordered ? j + 1 : null}
                    </span>
                    <span>
                      <InlineText text={item} />
                    </span>
                  </li>
                ))}
              </Tag>
            );
          }
          case "callout": {
            const warn = b.tone === "warn";
            const Icon = warn ? AlertTriangle : Info;
            return (
              <aside
                key={i}
                className={cn(
                  "glass mt-8 flex gap-4 rounded-2xl p-5 md:p-6",
                  warn ? "border-amber-300/20" : "border-accent-2/25",
                )}
              >
                <Icon className={cn("mt-0.5 size-5 shrink-0", warn ? "text-amber-300/90" : "text-accent-2")} aria-hidden />
                <div className="text-[0.98rem] leading-7">
                  {b.title && <p className="mb-1 font-bold text-white">{b.title}</p>}
                  <p className="text-white/75">
                    <InlineText text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
          case "code":
            return (
              <pre
                key={i}
                className="mt-6 overflow-x-auto rounded-2xl border border-line bg-black/40 p-5 font-mono text-sm leading-6 text-[#cfe0ff]"
              >
                <code>{b.code}</code>
              </pre>
            );
        }
      })}
    </div>
  );
}
