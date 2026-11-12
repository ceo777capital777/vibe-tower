"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BookOpen, CornerDownLeft, Search, Wrench, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";
import { cn } from "@/lib/utils";

export const OPEN_SEARCH_EVENT = "vt:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

const suggestions = ["Cursor", "лендинг", "первый заказ", "анимации", "ошибки", "оплата"];

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // Открытие по событию и по ⌘K / Ctrl+K / «/»
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest("input, textarea, [contenteditable]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Ленивая загрузка индекса, блокировка прокрутки, фокус
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    if (!index) {
      import("@/lib/search-index").then((m) => setIndex(m.searchIndex));
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
      returnFocus.current?.focus?.();
    };
  }, [open, index]);

  const hits = useMemo(() => (index ? searchEntries(index, query, 12) : []), [index, query]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      if (hits[active]) go(hits[active].entry.href);
      else if (query.trim()) go(`/library?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onKeyDown={onKeyDown}
        >
          <button
            aria-label="Закрыть поиск"
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Поиск по VIBE TOWER"
            className="glass glass-strong relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(99_164_255/0.12)]"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search className="size-5 text-accent-2" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="Поиск по статьям, промптам и инструментам"
                className="h-16 flex-1 bg-transparent text-base text-white outline-none placeholder:text-muted"
                aria-label="Поисковый запрос"
              />
              <button onClick={close} className="rounded-full p-2 text-muted hover:text-white" aria-label="Закрыть">
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[56vh] overflow-y-auto p-2">
              {!query.trim() && (
                <div className="p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Популярное</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateQuery(s)}
                        className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-white/80 transition hover:border-accent-2/60 hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && !index && <p className="p-6 text-sm text-muted">Загружаем индекс…</p>}

              {query.trim() && index && hits.length === 0 && (
                <div className="p-6 text-sm text-muted">
                  Ничего не нашлось по запросу «{query}». Попробуйте другое слово или откройте{" "}
                  <button className="text-accent-2 underline" onClick={() => go("/library")}>
                    всю библиотеку
                  </button>
                  .
                </div>
              )}

              <ul>
                {hits.map((h, i) => (
                  <li key={h.entry.id}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(h.entry.href)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors",
                        i === active ? "bg-accent/12 ring-1 ring-accent-2/25" : "hover:bg-white/[0.03]",
                      )}
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-accent-2">
                        {h.entry.kind === "article" ? <BookOpen className="size-4" /> : <Wrench className="size-4" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-accent-2/80">
                          {h.entry.group}
                        </span>
                        <span className="mt-0.5 block truncate font-semibold text-white">{h.entry.title}</span>
                        <span className="mt-0.5 line-clamp-2 block text-sm text-muted">
                          {h.snippet ?? h.entry.description}
                        </span>
                      </span>
                      {i === active && <CornerDownLeft className="mt-3 size-4 shrink-0 text-muted" aria-hidden />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-muted">
              <span className="hidden sm:inline">↑ ↓ — выбор · Enter — открыть · Esc — закрыть</span>
              <button
                onClick={() => go(query.trim() ? `/library?q=${encodeURIComponent(query.trim())}` : "/library")}
                className="ml-auto inline-flex items-center gap-1.5 text-white/80 hover:text-white"
              >
                Вся библиотека <ArrowRight className="size-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
