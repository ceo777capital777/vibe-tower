import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Gauge, Lightbulb, ListChecks, Terminal, Wand2 } from "lucide-react";
import type { Article } from "@/content/types";
import { articleHref, getAdjacent, getArticlesByCategory, readingMinutes } from "@/content/articles";
import { getCategory } from "@/content/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InlineText } from "@/components/ui/InlineText";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleCard } from "./ArticleCard";
import { ArticleToc, type TocItem } from "./ArticleToc";
import { BlockRenderer, headingId } from "./BlockRenderer";
import { PromptCard } from "./PromptCard";
import { plural } from "@/lib/utils";

function SectionTitle({ id, icon: Icon, children }: { id: string; icon: typeof BookOpen; children: string }) {
  return (
    <h2 id={id} className="mb-8 flex scroll-mt-28 items-center gap-3 font-display text-xl font-medium uppercase tracking-[0.04em] text-white md:text-2xl">
      <Icon className="size-5 text-accent-2" aria-hidden />
      {children}
    </h2>
  );
}

export function ArticleLayout({ article }: { article: Article }) {
  const category = getCategory(article.category)!;
  const { prev, next } = getAdjacent(article);
  const related = getArticlesByCategory(article.category).filter((a) => a.slug !== article.slug).slice(0, 3);
  const minutes = readingMinutes(article);

  const h2s = article.body.filter((b) => b.type === "h2");
  const toc: TocItem[] = [
    { id: "overview", label: "Основной текст" },
    ...h2s.map((b, i) => ({ id: headingId(i), label: b.type === "h2" ? b.text : "", sub: true })),
    ...(article.steps.length ? [{ id: "steps", label: "Пошаговая инструкция" }] : []),
    ...(article.examples.length ? [{ id: "examples", label: "Примеры" }] : []),
    ...(article.prompts.length ? [{ id: "prompts", label: "Готовые промпты" }] : []),
    ...(article.tips.length ? [{ id: "tips", label: "Рекомендации" }] : []),
  ];

  return (
    <article>
      <header className="relative isolate overflow-hidden pb-12 pt-32 md:pb-16 md:pt-40">
        <div className="absolute inset-0 -z-10">
          <Image src={category.image} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_9_13/0.6),#07090d_92%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(50%_70%_at_85%_10%,rgb(40_107_255/0.2),transparent)]" />
        </div>
        <Container>
          <Reveal y={8}>
            <Breadcrumbs
              items={[
                { href: "/library", label: "Library" },
                { href: `/library/${category.id}`, label: category.title },
                { label: article.title },
              ]}
            />
          </Reveal>
          <Reveal className="mt-10 max-w-4xl">
            <p className="eyebrow mb-5">{category.title}</p>
            <h1 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.06] tracking-[-0.025em] text-gradient">
              {article.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/72">{article.description}</p>
            <ul className="mt-8 flex flex-wrap gap-2 text-xs text-white/70">
              {[
                { icon: Gauge, label: article.level },
                { icon: Clock, label: `${minutes} мин чтения` },
                { icon: ListChecks, label: `${article.steps.length} ${plural(article.steps.length, ["шаг", "шага", "шагов"])}` },
                { icon: Terminal, label: `${article.prompts.length} ${plural(article.prompts.length, ["промпт", "промпта", "промптов"])}` },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-2">
                  <Icon className="size-3.5 text-accent-2" aria-hidden /> {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </header>

      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <div className="min-w-0 max-w-[780px]">
          <section id="overview" className="scroll-mt-28">
            <BlockRenderer blocks={article.body} />
          </section>

          {article.steps.length > 0 && (
            <section className="mt-20">
              <SectionTitle id="steps" icon={ListChecks}>Пошаговая инструкция</SectionTitle>
              <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-[1.375rem] before:top-6 before:w-px before:bg-[linear-gradient(180deg,rgb(99_164_255/0.6),rgb(99_164_255/0.05))]">
                {article.steps.map((s, i) => (
                  <li key={s.title} className="relative flex gap-5">
                    <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-accent-2/40 bg-ink-2 font-display text-xs text-accent-2 shadow-[0_0_24px_-6px_rgb(40_107_255/0.8)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="glass flex-1 rounded-2xl p-5">
                      <h3 className="font-bold text-white">{s.title}</h3>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-white/70">
                        <InlineText text={s.text} />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {article.examples.length > 0 && (
            <section className="mt-20">
              <SectionTitle id="examples" icon={BookOpen}>Примеры</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                {article.examples.map((e) => (
                  <div key={e.title} className="glass rounded-2xl p-6">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-accent-2">Пример</p>
                    <h3 className="mt-2 font-bold text-white">{e.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-white/72">
                      <InlineText text={e.text} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {article.prompts.length > 0 && (
            <section className="mt-20">
              <SectionTitle id="prompts" icon={Terminal}>Готовые промпты</SectionTitle>
              <p className="-mt-4 mb-6 text-sm text-muted">
                Замените значения в квадратных скобках на свои и отправьте в Cursor, Claude Code, Codex или чат-ассистент.
              </p>
              <div className="space-y-5">
                {article.prompts.map((p, i) => (
                  <PromptCard key={p.title} prompt={p} index={i} />
                ))}
              </div>
            </section>
          )}

          {article.tips.length > 0 && (
            <section className="mt-20">
              <SectionTitle id="tips" icon={Lightbulb}>Рекомендации</SectionTitle>
              <ul className="glass divide-y divide-line rounded-3xl">
                {article.tips.map((t) => (
                  <li key={t} className="flex gap-4 px-6 py-4 text-[0.98rem] leading-relaxed text-white/80">
                    <Lightbulb className="mt-1 size-4 shrink-0 text-accent-2" aria-hidden />
                    <span>
                      <InlineText text={t} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav aria-label="Соседние статьи" className="mt-20 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={articleHref(prev)} className="glass edge-glow group rounded-2xl p-5 transition hover:-translate-y-0.5">
                <span className="flex items-center gap-2 text-xs text-muted">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" /> Предыдущая
                </span>
                <span className="mt-2 block font-semibold text-white">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={articleHref(next)} className="glass edge-glow group rounded-2xl p-5 text-right transition hover:-translate-y-0.5">
                <span className="flex items-center justify-end gap-2 text-xs text-muted">
                  Следующая <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-2 block font-semibold text-white">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <ArticleToc items={toc} />
            <div className="glass rounded-2xl p-5">
              <Wand2 className="size-5 text-accent-2" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-white">Готовы к своему проекту?</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">Опишите идею — генератор соберёт полное ТЗ.</p>
              <ButtonLink href="/generator" className="mt-4 w-full" arrow>
                Generator
              </ButtonLink>
            </div>
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <Container className="mt-24">
          <p className="eyebrow mb-6">Ещё в разделе {category.title}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard
                key={a.slug}
                data={{
                  href: articleHref(a),
                  title: a.title,
                  description: a.description,
                  group: category.title,
                  meta: `${a.level} · ${readingMinutes(a)} мин`,
                }}
              />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
