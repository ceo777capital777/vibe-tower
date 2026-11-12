import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HubSection } from "@/content/sections";
import { cn } from "@/lib/utils";

export function SectionCard({
  section,
  index,
  size = "md",
}: {
  section: HubSection;
  index: number;
  size?: "md" | "lg";
}) {
  const Icon = section.icon;
  return (
    <Link
      href={section.href}
      className={cn(
        "glass edge-glow group relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 transition-all duration-500 ease-[var(--ease-lux)] hover:-translate-y-1 hover:border-white/15 md:p-8",
        size === "lg" ? "min-h-[380px]" : "min-h-[300px]",
      )}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
        <Image
          src={section.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-[0.34] saturate-[0.8] transition-all duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-105 group-hover:opacity-50"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_9_13/0.15),rgb(7_9_13/0.7)_45%,rgb(7_9_13/0.96)_85%)]" />
      </div>

      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-white/[0.04] text-accent-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="font-display text-xs tracking-[0.3em] text-white/30">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="mt-auto pt-12">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.18em] text-accent-2/90">{section.count}</p>
        <h3
          className={cn(
            "font-display font-medium uppercase leading-tight tracking-[-0.01em] text-white",
            size === "lg" ? "text-2xl md:text-[2rem]" : "text-xl md:text-2xl",
          )}
        >
          {section.title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">{section.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-display text-[0.65rem] uppercase tracking-[0.2em] text-white/80 transition-colors group-hover:text-white">
          Перейти
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
