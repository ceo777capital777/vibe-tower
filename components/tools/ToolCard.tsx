import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Tool } from "@/content/types";
import { toolCategoryLabel } from "@/content/tools";
import { ToolLogo } from "./ToolLogo";

export function ToolCard({ tool }: { tool: Tool }) {
  const host = new URL(tool.url).hostname.replace(/^www\./, "");
  return (
    <div className="glass edge-glow group flex h-full flex-col rounded-3xl p-6 transition-all duration-500 ease-[var(--ease-lux)] hover:-translate-y-1 hover:border-white/15">
      <div className="flex items-start gap-4">
        <ToolLogo mark={tool.mark} />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white">{tool.name}</h3>
          <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-accent-2/90">{toolCategoryLabel(tool.category)}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-white/70">{tool.description}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {tool.capabilities.map((c) => (
          <li key={c} className="rounded-full border border-line bg-white/[0.02] px-2.5 py-1 text-[0.72rem] text-white/60">
            {c}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-accent-2"
          aria-label={`Официальный сайт ${tool.name} (${host}), откроется в новой вкладке`}
        >
          {host}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
        {tool.guide && (
          <Link href={tool.guide} className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-white">
            <BookOpen className="size-3.5" aria-hidden /> Гайд
          </Link>
        )}
      </div>
    </div>
  );
}
