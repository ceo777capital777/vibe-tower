import type { Article, Block, CategoryId } from "../types";
import { stripInline } from "@/lib/utils";
import { vibeCodingArticles } from "./vibe-coding";
import { aiToolsArticles } from "./ai-tools";
import { developmentArticles } from "./development";
import { monetizationArticles } from "./monetization";
import { promptArticles } from "./prompts";

/** Чтобы добавить статью — допишите объект в файл нужной категории. */
export const articles: Article[] = [
  ...vibeCodingArticles,
  ...aiToolsArticles,
  ...developmentArticles,
  ...monetizationArticles,
  ...promptArticles,
];

export function getArticlesByCategory(category: CategoryId): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getArticle(category: string, slug: string): Article | undefined {
  return articles.find((a) => a.category === category && a.slug === slug);
}

export function articleHref(a: Pick<Article, "category" | "slug">): string {
  return `/library/${a.category}/${a.slug}`;
}

function blockText(b: Block): string {
  switch (b.type) {
    case "list":
      return b.items.join(" ");
    case "code":
      return b.code;
    case "callout":
      return `${b.title ?? ""} ${b.text}`;
    default:
      return b.text;
  }
}

/** Полный текст статьи без разметки — для поиска и оценки времени чтения */
export function articlePlainText(a: Article): string {
  return stripInline(
    [
      ...a.body.map(blockText),
      ...a.steps.map((s) => `${s.title} ${s.text}`),
      ...a.examples.map((e) => `${e.title} ${e.text}`),
      ...a.prompts.map((p) => `${p.title} ${p.note ?? ""} ${p.text}`),
      ...a.tips,
    ].join(" "),
  );
}

export function readingMinutes(a: Article): number {
  const words = articlePlainText(a).split(/\s+/).length;
  return Math.max(3, Math.round(words / 180));
}

export function getAdjacent(a: Article): { prev?: Article; next?: Article } {
  const list = getArticlesByCategory(a.category);
  const i = list.findIndex((x) => x.slug === a.slug);
  return { prev: list[i - 1], next: list[i + 1] };
}

export const promptCount = articles.reduce((n, a) => n + a.prompts.length, 0);
