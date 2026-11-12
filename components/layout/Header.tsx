"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { mainNav } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { openSearch } from "@/components/search/SearchDialog";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Закрываем мобильное меню при переходе (сброс состояния во время рендера, без эффекта)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto mt-3 flex h-16 w-[calc(100%-1.5rem)] max-w-[1320px] items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6",
          scrolled || menuOpen
            ? "glass glass-strong shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)]"
            : "border border-transparent",
        )}
      >
        <Logo />

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative isolate rounded-full px-4 py-2 font-display text-[0.66rem] uppercase tracking-[0.18em] transition-colors duration-300",
                      active ? "text-white" : "text-white/55 hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full border border-accent-2/30 bg-accent/15"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openSearch}
            className="group flex h-10 items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] pl-3.5 pr-2 text-sm text-muted transition hover:border-accent-2/50 hover:text-white"
            aria-label="Открыть поиск"
          >
            <Search className="size-4" aria-hidden />
            <span className="hidden sm:inline">Поиск</span>
            <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-sans text-[0.65rem] text-white/50 sm:inline">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-line-strong bg-white/[0.03] text-white lg:hidden"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Мобильная навигация"
            className="glass glass-strong fixed inset-x-3 top-[5.25rem] rounded-3xl p-3 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {mainNav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-4 transition-colors",
                      isActive(pathname, item.href) ? "bg-accent/15 text-white" : "text-white/80 hover:bg-white/[0.04]",
                    )}
                  >
                    <span className="font-display text-sm uppercase tracking-[0.18em]">{item.label}</span>
                    <span className="text-xs text-muted">{item.hint}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
