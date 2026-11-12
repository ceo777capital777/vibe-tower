import { articles, articleHref, articlePlainText, readingMinutes } from "@/content/articles";
import { getCategory } from "@/content/categories";
import { tools, toolCategoryLabel } from "@/content/tools";
import type { SearchEntry } from "./search";

export function buildArticleEntries(maxText = 6000): SearchEntry[] {
  return articles.map((a) => ({
    id: `${a.category}/${a.slug}`,
    kind: "article",
    title: a.title,
    description: a.description,
    href: articleHref(a),
    group: getCategory(a.category)?.title ?? a.category,
    groupId: a.category,
    tags: a.tags,
    text: articlePlainText(a).slice(0, maxText),
    meta: `${a.level} · ${readingMinutes(a)} мин`,
  }));
}

export function buildToolEntries(): SearchEntry[] {
  return tools.map((t) => ({
    id: `tool/${t.id}`,
    kind: "tool",
    title: t.name,
    description: t.description,
    href: `/tools?q=${encodeURIComponent(t.name)}`,
    group: toolCategoryLabel(t.category),
    groupId: t.category,
    tags: t.capabilities,
    text: t.capabilities.join(" "),
    meta: "AI-инструмент",
  }));
}

/** Полный индекс для глобального поиска (грузится лениво при открытии поиска) */
export const searchIndex: SearchEntry[] = [...buildArticleEntries(), ...buildToolEntries()];
