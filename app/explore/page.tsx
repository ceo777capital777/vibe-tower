import type { Metadata } from "next";
import Link from "next/link";
import { HubGrid } from "@/components/home/HubGrid";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { articleHref, getArticlesByCategory } from "@/content/articles";
import { categories } from "@/content/categories";

export const metadata: Metadata = {
  title: "Explore — все разделы платформы",
  description:
    "Навигация по VIBE TOWER: вайб-кодинг, AI-инструменты, разработка, монетизация, библиотека промптов, проекты и AI-генератор ТЗ.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  return (
    <>
      <PageHero
        eyebrow="Explore platform"
        title="Директория башни"
        description="Семь разделов платформы — от основ вайб-кодинга до генератора технических заданий. Выберите, с чего начать."
        image="/images/skyline-dusk.webp"
        crumbs={[{ href: "/", label: "Главная" }, { label: "Explore" }]}
      />
      <Container>
        <HubGrid />

        <section className="mt-24">
          <Reveal>
            <p className="eyebrow mb-4">Оглавление библиотеки</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium uppercase tracking-[-0.02em]">
              Все материалы по разделам
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 0.05}>
                <div className="border-t border-line pt-6">
                  <Link href={`/library/${c.id}`} className="group flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-sm uppercase tracking-[0.18em] text-white group-hover:text-accent-2">
                      {c.title}
                    </h3>
                    <span className="text-xs text-muted">{getArticlesByCategory(c.id).length}</span>
                  </Link>
                  <ul className="mt-5 space-y-3">
                    {getArticlesByCategory(c.id).map((a) => (
                      <li key={a.slug}>
                        <Link href={articleHref(a)} className="text-sm text-white/65 transition-colors hover:text-white">
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
