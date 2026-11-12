import { Bot, Code2, Coins, Sparkles, Wrench } from "lucide-react";
import type { Category, CategoryId } from "./types";

export const categories: Category[] = [
  {
    id: "vibe-coding",
    title: "VIBE CODING",
    label: "Основы вайб-кодинга",
    description:
      "Что такое вайб-кодинг, как думать вместе с AI, ставить задачи и не терять контроль над проектом.",
    icon: Sparkles,
    image: "/images/lowangle.webp",
  },
  {
    id: "ai-tools",
    title: "AI TOOLS",
    label: "Инструменты AI",
    description:
      "Cursor, Claude, ChatGPT, Codex и другие сервисы: для чего каждый подходит и как выжать из него максимум.",
    icon: Bot,
    image: "/images/tower-blue.webp",
  },
  {
    id: "development",
    title: "DEVELOPMENT",
    label: "Разработка сайтов",
    description:
      "От пустой папки до опубликованного сайта: лендинги, многостраничники, магазины, веб-приложения, анимации и адаптив.",
    icon: Code2,
    image: "/images/fog-towers.webp",
  },
  {
    id: "monetization",
    title: "MONETIZATION",
    label: "Заработок на разработке",
    description:
      "Ниша, оффер, клиенты, оценка стоимости и портфолио — как превратить навык в стабильные заказы.",
    icon: Coins,
    image: "/images/skyline-dusk.webp",
  },
  {
    id: "prompts",
    title: "PROMPT LIBRARY",
    label: "Библиотека промптов",
    description:
      "Проверенные промпты для дизайна, разработки, отладки, анимаций, оптимизации и отдельных блоков сайта.",
    icon: Wrench,
    image: "/images/high-floor.webp",
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function isCategoryId(id: string): id is CategoryId {
  return categories.some((c) => c.id === id);
}
