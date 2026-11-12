import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/library/ArticleCard";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { articleHref, getArticlesByCategory, readingMinutes } from "@/content/articles";
import { categories, getCategory, isCategoryId } from "@/content/categories";
import { ButtonLink } from "@/components/ui/Button";
import { plural } from "@/lib/utils";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/library/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return {
    title: `${c.title} — ${c.label}`,
    description: c.description,
    alternates: { canonical: `/library/${c.id}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/library/[category]">) {
  const { category } = await params;
  if (!isCategoryId(category)) notFound();
  const c = getCategory(category)!;
  const list = getArticlesByCategory(category);

  return (
    <>
      <PageHero
        eyebrow={c.label}
        title={c.title}
        description={c.description}
        image={c.image}
        crumbs={[{ href: "/", label: "Главная" }, { href: "/library", label: "Library" }, { label: c.title }]}
      />
      <Container>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <li key={a.slug} className="relative h-full">
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <span className="pointer-events-none absolute -top-3 right-6 z-10 font-display text-[0.65rem] tracking-[0.3em] text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArticleCard
                  data={{
                    href: articleHref(a),
                    title: a.title,
                    description: a.description,
                    group: `${a.prompts.length} ${plural(a.prompts.length, ["промпт", "промпта", "промптов"])} · ${a.steps.length} ${plural(a.steps.length, ["шаг", "шага", "шагов"])}`,
                    meta: `${a.level} · ${readingMinutes(a)} мин`,
                  }}
                />
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-14 flex flex-wrap gap-3">
          <ButtonLink href="/library" variant="secondary">
            Вся библиотека
          </ButtonLink>
          <ButtonLink href="/generator" variant="ghost" arrow>
            Сгенерировать ТЗ
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
