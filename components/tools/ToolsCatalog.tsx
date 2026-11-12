"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Tool, ToolCategory } from "@/content/types";
import { toolCategories } from "@/content/tools";
import { cn, normalize, plural } from "@/lib/utils";
import { ToolCard } from "./ToolCard";

type CategoryFilter = ToolCategory | "all";

/** Каталог с поиском и фильтрами; начальное состояние берётся из ?q=&c= */
export function ToolsCatalog({ tools }: { tools: Tool[] }) {
  return (
    <Suspense fallback={<Catalog tools={tools} initialQuery="" initialCategory="all" />}>
      <CatalogFromParams tools={tools} />
    </Suspense>
  );
}

function CatalogFromParams({ tools }: { tools: Tool[] }) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const c = params.get("c");
  const initialCategory: CategoryFilter = toolCategories.find((x) => x.id === c)?.id ?? "all";
  return <Catalog tools={tools} initialQuery={q} initialCategory={initialCategory} />;
}

function Catalog({
  tools,
  initialQuery,
  initialCategory,
}: {
  tools: Tool[];
  initialQuery: string;
  initialCategory: CategoryFilter;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("c", category);
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [query, category]);

  const filtered = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return tools.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (!terms.length) return true;
      const hay = normalize([t.name, t.description, ...t.capabilities].join(" "));
      return terms.every((term) => hay.includes(term));
    });
  }, [tools, query, category]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of tools) m.set(t.category, (m.get(t.category) ?? 0) + 1);
    return m;
  }, [tools]);

  return (
    <div>
      <div className="glass glass-strong sticky top-[5.5rem] z-30 rounded-3xl p-3 md:p-4">
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-black/25 px-4 focus-within:border-accent-2/50">
          <Search className="size-5 shrink-0 text-accent-2" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти инструмент или возможность: «видео», «агент», «вектор»"
            className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-white outline-none placeholder:text-muted"
            aria-label="Поиск по каталогу"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Очистить поиск" className="rounded-full p-1.5 text-muted hover:text-white">
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Категории инструментов">
          {[{ id: "all" as const, label: "Все" }, ...toolCategories].map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={category === c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.8rem] font-semibold transition-all duration-300",
                category === c.id
                  ? "border-accent-2/50 bg-accent/20 text-white"
                  : "border-line text-white/60 hover:border-line-strong hover:text-white",
              )}
            >
              {c.label}
              <span className="text-[0.7rem] font-normal text-white/40">
                {c.id === "all" ? tools.length : counts.get(c.id) ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {filtered.length} {plural(filtered.length, ["инструмент", "инструмента", "инструментов"])}
      </p>

      {filtered.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-10 text-center">
          <p className="text-lg text-white">Ничего не найдено</p>
          <p className="mt-2 text-sm text-muted">Измените запрос или выберите другую категорию.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-6 rounded-full border border-line-strong px-5 py-2 text-sm text-white hover:border-accent-2/60"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => (
              <motion.li
                key={t.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ToolCard tool={t} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
