import { Terminal } from "lucide-react";
import type { PromptItem } from "@/content/types";
import { CopyButton } from "@/components/ui/CopyButton";

export function PromptCard({ prompt, index }: { prompt: PromptItem; index: number }) {
  return (
    <div className="glass edge-glow overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-accent-2/30 bg-accent/10 text-accent-2">
            <Terminal className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/40">Промпт {String(index + 1).padStart(2, "0")}</p>
            <h3 className="font-bold leading-snug text-white">{prompt.title}</h3>
          </div>
        </div>
        <CopyButton text={prompt.text} />
      </div>
      {prompt.note && <p className="px-5 pt-4 text-sm text-muted md:px-6">{prompt.note}</p>}
      <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words px-5 py-5 font-mono text-[0.84rem] leading-6 text-[#d6e4ff] md:px-6">
        {prompt.text}
      </pre>
    </div>
  );
}
