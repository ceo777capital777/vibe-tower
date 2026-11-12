import type { Metadata } from "next";
import Image from "next/image";
import { Send } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { platformStats } from "@/content/sections";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About — об авторе VIBE TOWER",
  description: "Артём Димоглов — разработчик сайтов и Telegram-ботов. Зачем создана VIBE TOWER и как со мной связаться.",
  alternates: { canonical: "/about" },
};

const blocks = [
  {
    eyebrow: "Кто я",
    title: "Делаю сайты и Telegram-ботов",
    text: [
      "Меня зовут Артём Димоглов. Я создаю сайты и Telegram-ботов для клиентов — от лендингов и сайтов компаний до ботов, которые принимают заявки и передают их владельцу бизнеса.",
      "В работе я опираюсь на AI: он пишет код, а я отвечаю за идею, структуру, дизайн, проверку и результат, который получает клиент.",
    ],
  },
  {
    eyebrow: "Почему вайб-кодинг",
    title: "Идея важнее синтаксиса",
    text: [
      "Вайб-кодинг меняет главное: путь от идеи до работающего сайта становится короче в разы. То, что раньше требовало команды и недель, теперь можно собрать за вечер — если умеешь ясно ставить задачи и проверять результат.",
      "Мне интересна именно эта сторона: как превращать размытую мысль в точное техническое задание, а задание — в продукт, за который не стыдно перед клиентом.",
    ],
  },
  {
    eyebrow: "Зачем VIBE TOWER",
    title: "Одно место для всего, что нужно",
    text: [
      "Знания о вайб-кодинге разбросаны по чатам, роликам и чужим заметкам. VIBE TOWER собирает их в одну систему: основы, инструменты, гайды по разработке, монетизацию и проверенные промпты.",
      "Всё бесплатно и без регистрации. А AI Prompt Generator помогает сделать самый важный первый шаг — превратить идею в профессиональное ТЗ.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-[calc(8rem+var(--vt-safe-top,0px))] pb-16 md:pt-[calc(10rem+var(--vt-safe-top,0px))]">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/lowangle.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_9_13/0.5),#07090d_90%)]" />
          <div className="grid-lines absolute inset-0 opacity-60" />
        </div>
        <Container>
          <Reveal y={8}>
            <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "About" }]} />
          </Reveal>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            <Reveal>
              <p className="eyebrow mb-5">About the author</p>
              <h1 className="font-display text-[clamp(2.4rem,6.4vw,5.4rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em]">
                <span className="block text-white">Artem</span>
                <span className="text-gradient block">Dimoglov</span>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/72">
                Разработчик сайтов и Telegram-ботов. Автор VIBE TOWER — платформы о том, как создавать сайты с помощью
                искусственного интеллекта.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={site.author.telegram} external size="lg" arrow>
                  Написать в Telegram
                </ButtonLink>
                <ButtonLink href="/showcase" size="lg" variant="secondary">
                  Мои проекты
                </ButtonLink>
              </div>
            </Reveal>

            {/* Визуальный портрет: типографическая монограмма в стеклянной «башне» */}
            <Reveal delay={0.15}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
                <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(60%_50%_at_50%_30%,rgb(40_107_255/0.35),transparent)] blur-2xl" />
                <GlassPanel strong className="relative h-full overflow-hidden rounded-[40px]">
                  <Image src="/images/tower-blue.webp" alt="" fill sizes="448px" className="object-cover opacity-30 mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgb(7_9_13/0.85))]" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="font-display text-[clamp(6rem,16vw,10rem)] font-semibold leading-none tracking-[-0.06em] text-gradient">
                      AD
                    </span>
                  </div>
                  <div className="absolute inset-x-6 bottom-6 flex items-end justify-between border-t border-line pt-4">
                    <span className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-white/60">{site.author.latin}</span>
                    <span className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-accent-2">VIBE TOWER</span>
                  </div>
                </GlassPanel>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Container className="space-y-5">
        {blocks.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.04}>
            <GlassPanel className="grid gap-6 p-7 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:p-12">
              <div>
                <p className="eyebrow mb-4">{b.eyebrow}</p>
                <h2 className="font-display text-2xl font-medium leading-tight text-white md:text-3xl">{b.title}</h2>
              </div>
              <div className="space-y-4 text-[1.02rem] leading-relaxed text-white/72">
                {b.text.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </GlassPanel>
          </Reveal>
        ))}

        <Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { v: platformStats.articles, l: "бесплатных гайдов" },
              { v: platformStats.prompts, l: "готовых промптов" },
              { v: platformStats.tools, l: "AI-инструментов в каталоге" },
            ].map((s) => (
              <GlassPanel key={s.l} className="p-7">
                <p className="font-display text-4xl font-medium text-white">{s.v}</p>
                <p className="mt-2 text-sm text-muted">{s.l}</p>
              </GlassPanel>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <GlassPanel glow className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-12">
            <div>
              <p className="eyebrow mb-3">Связь</p>
              <p className="text-2xl font-semibold text-white">{site.author.telegramHandle}</p>
              <p className="mt-2 max-w-md text-sm text-muted">Заказать сайт или бота, предложить материал для платформы или просто задать вопрос.</p>
            </div>
            <ExternalLink
              href={site.author.telegram}
              className="inline-flex h-14 items-center gap-3 rounded-full bg-accent px-7 font-display text-[0.74rem] uppercase tracking-[0.14em] text-white transition hover:bg-[#3a78ff]"
            >
              <Send className="size-4" aria-hidden /> Telegram
            </ExternalLink>
          </GlassPanel>
        </Reveal>

        <p className="pt-6 text-xs leading-relaxed text-white/35">
          Фотографии на сайте — Pexels (Irina Iriser, Alexey Chudin, Vitaliy Mitrofanenko, Peter Xie, Viacheslav Novoseltsev, Luis
          Quintero), бесплатная лицензия Pexels.
        </p>
      </Container>
    </>
  );
}
