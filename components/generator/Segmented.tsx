"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: T;
  options: { id: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-2xl border border-line bg-black/25 p-1">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.hint}
            disabled={disabled}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative isolate flex-1 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[0.72rem] font-semibold transition-colors duration-300 disabled:opacity-50",
              active ? "text-white" : "text-white/55 hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 -z-10 rounded-xl border border-accent-2/40 bg-accent/25 shadow-[0_0_24px_-8px_rgb(40_107_255/0.9)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
