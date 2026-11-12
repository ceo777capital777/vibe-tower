import type { LucideIcon } from "lucide-react";

export type CategoryId =
  | "vibe-coding"
  | "ai-tools"
  | "development"
  | "monetization"
  | "prompts";

export interface Category {
  id: CategoryId;
  title: string;
  /** Русское название раздела */
  label: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

/** Блоки основного текста статьи. Строки поддерживают **жирный** и `код`. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone?: "info" | "warn"; title?: string; text: string }
  | { type: "code"; lang?: string; code: string };

export interface Step {
  title: string;
  text: string;
}

export interface Example {
  title: string;
  text: string;
}

export interface PromptItem {
  title: string;
  text: string;
  /** Когда использовать промпт */
  note?: string;
}

export type Level = "Новичок" | "Средний" | "Продвинутый";

export interface Article {
  slug: string;
  category: CategoryId;
  title: string;
  description: string;
  level: Level;
  tags: string[];
  body: Block[];
  steps: Step[];
  examples: Example[];
  prompts: PromptItem[];
  tips: string[];
}

export type ToolCategory =
  | "ai-dev"
  | "images"
  | "video"
  | "design"
  | "code"
  | "productivity";

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  capabilities: string[];
  url: string;
  /** Короткая монограмма для логотипа */
  mark: string;
  /** Ссылка на статью в базе знаний, если она есть */
  guide?: string;
}

export interface ShowcaseProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image?: string;
  stack: string[];
  features: string[];
  url?: string;
  /** Пометка «демо», если проект не реальный */
  kind: "client" | "own" | "demo";
  year?: string;
}
