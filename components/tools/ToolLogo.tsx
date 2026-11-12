import { cn } from "@/lib/utils";

/**
 * Чистая монограмма вместо фирменного логотипа: официальные знаки
 * защищены товарными знаками, а единый стиль лучше смотрится в каталоге.
 */
export function ToolLogo({ mark, className }: { mark: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line-strong bg-[linear-gradient(145deg,rgb(99_164_255/0.18),rgb(16_21_30/0.6)_60%)] font-display text-sm font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]",
        className,
      )}
    >
      <span className="absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.5),transparent)]" />
      {mark}
    </span>
  );
}
