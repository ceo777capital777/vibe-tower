import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { HubGrid } from "@/components/home/HubGrid";
import { GeneratorTeaser } from "@/components/home/GeneratorTeaser";
import { ArticleCard } from "@/components/library/ArticleCard";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articleHref, getArticle, readingMinutes } from "@/content/articles";
import { getCategory } from "@/content/categories";
import { platformStats } from "@/content/sections";
import { tools } from "@/content/tools";

const featured = [
  ["vibe-coding", "chto-takoe-vibe-coding"],
  ["vibe-coding", "kak-formulirovat-zadachi"],
  ["development", "lendingi"],
  ["monetization", "pervyj-zakaz"],
] as const;

export default function HomePage() {
  const featuredArticles = featured
    .map(([c, s]) => getArticle(c, s))
    .filter((a) => a !== undefined);

  return (
    <>
      <Hero
        stats={[
          { value: String(platformStats.articles), label: "гайдов" },
          { value: String(platformStats.prompts), label: "промптов" },
          { value: String(platformStats.tools), label: "AI-сервисов" },
          { value: String(platformStats.sections), label: "разделов ТЗ" },
        ]}
      />

      <section id="directory" className="scroll-mt-24 py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="Директория"
            title={
              <>
                Семь разделов. <span className="text-muted">Один маршрут от идеи до запуска.</span>
              </>
            }
            description="Начните с основ вайб-кодинга, подберите инструменты, соберите сайт по гайдам и превратите навык в заказы. Всё бесплатно и без регистрации."
            action={
              <ButtonLink href="/explore" variant="secondary" arrow>
                Все разделы
              </ButtonLink>
            }
          />
          <div className="mt-14">
            <HubGrid />
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="С чего начать"
            title="Четыре материала, которые экономят недели"
            action={
              <ButtonLink href="/library" variant="secondary" arrow>
                Библиотека
              </ButtonLink>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredArticles.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.06}>
                <ArticleCard
                  data={{
                    href: articleHref(a),
                    title: a.title,
                    description: a.description,
                    group: getCategory(a.category)?.title ?? "",
                    meta: `${a.level} · ${readingMinutes(a)} мин`,
                  }}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-20">
        <Container>
          <GeneratorTeaser />
        </Container>
      </section>

      <section className="py-12 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="AI Tools"
            title="Инструменты, с которыми работают вайб-кодеры"
            description="Редакторы и агенты, ассистенты, генераторы изображений и видео — с описанием возможностей и ссылками на официальные сайты."
            action={
              <ButtonLink href="/tools" variant="secondary" arrow>
                Каталог
              </ButtonLink>
            }
          />
          <Reveal className="mt-12">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {tools.slice(0, 12).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tools?q=${encodeURIComponent(t.name)}`}
                    className="glass edge-glow group flex items-center gap-3 rounded-2xl p-3 pr-4 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <ToolLogo mark={t.mark} className="size-10 rounded-xl text-xs" />
                    <span className="truncate text-sm font-semibold text-white/85 group-hover:text-white">{t.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[32px] border border-line px-6 py-16 text-center md:px-16 md:py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_100%,rgb(40_107_255/0.28),transparent_70%)]" />
            <div className="grid-lines absolute inset-0 -z-10 opacity-70" />
            <p className="eyebrow mb-6">Бесплатно · Без регистрации</p>
            <h2 className="mx-auto max-w-4xl font-display text-[clamp(1.5rem,6vw,4.2rem)] font-medium uppercase leading-[1] tracking-[-0.03em] text-gradient">
              Поднимайтесь выше с каждым проектом
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-white/65">
              Начните с основ или сразу опишите идею — генератор соберёт ТЗ, а библиотека подскажет, как его реализовать.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/library/vibe-coding/chto-takoe-vibe-coding" size="lg" arrow>
                Начать обучение
              </ButtonLink>
              <ButtonLink href="/generator" size="lg" variant="secondary">
                Сгенерировать ТЗ <ArrowUpRight className="size-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
