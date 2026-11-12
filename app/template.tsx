"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Лёгкий сдвиг при переходе. Прозрачность не трогаем: если анимация
 * в WebView Telegram не стартует, страница не остаётся невидимой.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
