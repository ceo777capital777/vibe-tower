import { Bot, Code2, Coins, LayoutGrid, Sparkles, Wand2, Wrench, type LucideIcon } from "lucide-react";
import { articles, getArticlesByCategory, promptCount } from "./articles";
import { tools } from "./tools";
import { showcase } from "./showcase";
import { GENERATOR_SECTIONS } from "@/lib/generator/config";
import { plural } from "@/lib/utils";

export interface HubSection {
  id: string;
  title: string;
  description: string;
  href: string;
  count: string;
  icon: LucideIcon;
  image: string;
}

const guides = (n: number) => `${n} ${plural(n, ["гайд", "гайда", "гайдов"])}`;

export function getHubSections(): HubSection[] {
  const promptGuides = getArticlesByCategory("prompts");
  const promptsInLibrary = promptGuides.reduce((n, a) => n + a.prompts.length, 0);
  return [
    {
      id: "vibe-coding",
      title: "VIBE CODING",
      description: "Основы вайб-кодинга: как думать вместе с AI, ставить задачи и организовать разработку.",
      href: "/library/vibe-coding",
      count: guides(getArticlesByCategory("vibe-coding").length),
      icon: Sparkles,
      image: "/images/lowangle.webp",
    },
    {
      id: "ai-tools",
      title: "AI TOOLS",
      description: "Каталог AI-сервисов для разработки, дизайна, изображений и видео — с фильтрами и поиском.",
      href: "/tools",
      count: `${tools.length} ${plural(tools.length, ["сервис", "сервиса", "сервисов"])} · ${guides(getArticlesByCategory("ai-tools").length)}`,
      icon: Bot,
      image: "/images/tower-blue.webp",
    },
    {
      id: "development",
      title: "DEVELOPMENT",
      description: "Сайты с нуля, лендинги, магазины, веб-приложения, анимации, адаптив и публикация.",
      href: "/library/development",
      count: guides(getArticlesByCategory("development").length),
      icon: Code2,
      image: "/images/fog-towers.webp",
    },
    {
      id: "monetization",
      title: "MONETIZATION",
      description: "Ниша, оффер, клиенты, оценка стоимости и портфолио — как зарабатывать на разработке.",
      href: "/library/monetization",
      count: guides(getArticlesByCategory("monetization").length),
      icon: Coins,
      image: "/images/skyline-dusk.webp",
    },
    {
      id: "prompts",
      title: "PROMPT LIBRARY",
      description: "Готовые промпты для дизайна, разработки, отладки, анимаций, оптимизации и блоков сайта.",
      href: "/library/prompts",
      count: `${promptsInLibrary} ${plural(promptsInLibrary, ["промпт", "промпта", "промптов"])}`,
      icon: Wrench,
      image: "/images/high-floor.webp",
    },
    {
      id: "showcase",
      title: "SHOWCASE",
      description: "Реальные проекты: задачи, решения, технологии и живые ссылки.",
      href: "/showcase",
      count: `${showcase.length} ${plural(showcase.length, ["проект", "проекта", "проектов"])}`,
      icon: LayoutGrid,
      image: "/images/showcase-axon.webp",
    },
    {
      id: "generator",
      title: "AI PROMPT GENERATOR",
      description: "Опишите идею — получите профессиональное ТЗ и промпт для Cursor, Claude Code или Codex.",
      href: "/generator",
      count: `${GENERATOR_SECTIONS.length} разделов ТЗ`,
      icon: Wand2,
      image: "/images/hero.webp",
    },
  ];
}

export const platformStats = {
  articles: articles.length,
  prompts: promptCount,
  tools: tools.length,
  sections: GENERATOR_SECTIONS.length,
};
