"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchEntries, type SearchEntry } from "@/lib/search";
import { cn, plural } from "@/lib/utils";
import { ArticleCard } from "./ArticleCard";

export interface CategoryOption {
  id: string;
  title: string;
  count: number;
}

interface BrowserProps {
  entries: SearchEntry[];
  categories: CategoryOption[];
}

/**
 * Поиск и фильтр по базе знаний. Начальное состояние берётся из ?q=&c=.
 * Пока параметры читаются, статически отрисован полный список (fallback).
 */
export function LibraryBrowser(props: BrowserProps) {
  return (
    <Suspense fallback={<Browser {...props} initialQuery="" initialCategory="all" />}>
      <BrowserFromParams {...props} />
    </Suspense>
  );
}

function BrowserFromParams(props: BrowserProps) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const c = params.get("c");
  const initialCategory = c && props.categories.some((x) => x.id === c) ? c : "all";
  return <Browser {...props} initialQuery={q} initialCategory={initialCategory} />;
}

function Browser({
  entries,
  categories,
  initialQuery,
  initialCategory,
}: BrowserProps & { initialQuery: string; initialCategory: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (category !== "all") params.set("c", category);
    else params.delete("c");
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [query, category]);

  const results = useMemo(() => {
    const pool = category === "all" ? entries : entries.filter((e) => e.groupId === category);
    if (!query.trim()) return pool.map((entry) => ({ entry, snippet: undefined as string | undefined }));
    return searchEntries(pool, query, 100);
  }, [entries, query, category]);

  return (
    <div>
      <div className="glass glass-strong sticky top-[calc(5.5rem+var(--vt-safe-top,0px))] z-30 rounded-3xl p-3 md:p-4">
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-black/25 px-4 focus-within:border-accent-2/50">
          <Search className="size-5 shrink-0 text-accent-2" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по гайдам и промптам: например, «адаптив» или «Cursor»"
            className="h-13 min-w-0 flex-1 bg-transparent py-3.5 text-base text-white outline-none placeholder:text-muted"
            aria-label="Поиск по базе знаний"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Очистить поиск" className="rounded-full p-1.5 text-muted hover:text-white">
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Категории">
          {[{ id: "all", title: "Все", count: entries.length }, ...categories].map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={category === c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-display text-[0.62rem] uppercase tracking-[0.16em] transition-all duration-300",
                category === c.id
                  ? "border-accent-2/50 bg-accent/20 text-white"
                  : "border-line text-white/60 hover:border-line-strong hover:text-white",
              )}
            >
              {c.title}
              <span className="font-sans text-[0.7rem] tracking-normal text-white/40">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {query.trim()
          ? `Найдено: ${results.length} ${plural(results.length, ["материал", "материала", "материалов"])}`
          : `${results.length} ${plural(results.length, ["материал", "материала", "материалов"])}`}
      </p>

      {results.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-10 text-center">
          <p className="text-lg text-white">Ничего не найдено</p>
          <p className="mt-2 text-sm text-muted">Попробуйте другое слово или сбросьте фильтр категории.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-6 rounded-full border border-line-strong px-5 py-2 text-sm text-white hover:border-accent-2/60"
          >
            Сбросить
          </button>
        </div>
      ) : (
        <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map(({ entry, snippet }) => (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ArticleCard
                  data={{
                    href: entry.href,
                    title: entry.title,
                    description: entry.description,
                    group: entry.group,
                    meta: entry.meta,
                    snippet,
                  }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
