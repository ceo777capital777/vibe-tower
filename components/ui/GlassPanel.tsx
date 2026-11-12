import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps<T extends ElementType> = {
  as?: T;
  /** Подсветка границы за курсором (работает через SpotlightTracker) */
  glow?: boolean;
  strong?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function GlassPanel<T extends ElementType = "div">({
  as,
  glow = false,
  strong = false,
  className,
  children,
  ...rest
}: GlassPanelProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={cn("glass rounded-3xl", strong && "glass-strong", glow && "edge-glow", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
