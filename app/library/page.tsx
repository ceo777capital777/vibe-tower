import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LibraryBrowser } from "@/components/library/LibraryBrowser";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { articles, getArticlesByCategory, promptCount } from "@/content/articles";
import { categories } from "@/content/categories";
import { buildArticleEntries } from "@/lib/search-index";
import { plural } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Library — бесплатная база знаний по вайб-кодингу",
  description:
    "Гайды по вайб-кодингу, AI-инструментам, разработке сайтов и монетизации, библиотека готовых промптов. Бесплатно и без регистрации.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  const entries = buildArticleEntries(2500);
  const options = categories.map((c) => ({ id: c.id, title: c.title, count: getArticlesByCategory(c.id).length }));

  return (
    <>
      <PageHero
        eyebrow="Free knowledge base"
        title="Library"
        description={`${articles.length} подробных гайдов и ${promptCount} готовых промптов о создании сайтов с AI. Ищите по всей базе или выбирайте раздел.`}
        image="/images/high-floor.webp"
        crumbs={[{ href: "/", label: "Главная" }, { label: "Library" }]}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => {
            const Icon = c.icon;
            const n = getArticlesByCategory(c.id).length;
            return (
              <Link
                key={c.id}
                href={`/library/${c.id}`}
                className="glass edge-glow group flex items-center gap-3 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Icon className="size-5 shrink-0 text-accent-2" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[0.66rem] uppercase tracking-[0.16em] text-white">
                    {c.title}
                  </span>
                  <span className="text-xs text-muted">
                    {n} {plural(n, ["материал", "материала", "материалов"])}
                  </span>
                </span>
                <ArrowUpRight className="size-4 text-white/30 transition group-hover:text-white" />
              </Link>
            );
          })}
        </div>
      </PageHero>
      <Container>
        <Reveal>
          <LibraryBrowser entries={entries} categories={options} />
        </Reveal>
      </Container>
    </>
  );
}
