import Link from "next/link";
import { cn } from "@/lib/utils";

/** Знак VIBE TOWER: три стеклянные грани башни, сходящиеся к шпилю */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <defs>
        <linearGradient id="vt-g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9cc4ff" />
          <stop offset="1" stopColor="#286bff" />
        </linearGradient>
        <linearGradient id="vt-g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#63a4ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#10151e" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d="M16 2 L22 30 H16 Z" fill="url(#vt-g1)" />
      <path d="M16 2 L10 30 H16 Z" fill="url(#vt-g2)" />
      <path d="M16 2 L16 30" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.6" />
      <path d="M8 30 H24" stroke="#63a4ff" strokeOpacity="0.6" strokeWidth="0.8" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="VIBE TOWER — на главную" className={cn("group flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="font-display text-[0.82rem] font-semibold tracking-[0.28em] text-white">
        VIBE<span className="text-accent-2"> TOWER</span>
      </span>
    </Link>
  );
}
