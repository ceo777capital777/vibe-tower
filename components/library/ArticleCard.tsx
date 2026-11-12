import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleCardData {
  href: string;
  title: string;
  description: string;
  group: string;
  meta?: string;
  snippet?: string;
}

export function ArticleCard({ data, className }: { data: ArticleCardData; className?: string }) {
  return (
    <Link
      href={data.href}
      className={cn(
        "glass edge-glow group flex h-full flex-col rounded-3xl p-6 transition-all duration-500 ease-[var(--ease-lux)] hover:-translate-y-1 hover:border-white/15",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-accent-2/90">{data.group}</span>
        <ArrowUpRight className="size-4 text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug text-white">{data.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{data.snippet ?? data.description}</p>
      {data.meta && (
        <p className="mt-auto flex items-center gap-1.5 pt-5 text-xs text-white/45">
          <Clock className="size-3.5" aria-hidden />
          {data.meta}
        </p>
      )}
    </Link>
  );
}
