"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Уважаем системную настройку «уменьшить движение» во всех анимациях Motion */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
