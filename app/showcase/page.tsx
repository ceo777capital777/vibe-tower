import type { Metadata } from "next";
import { ShowcaseCard } from "@/components/showcase/ShowcaseCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { showcase } from "@/content/showcase";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Showcase — проекты, созданные с AI",
  description: "Реальные проекты Артёма Димоглова: сайты и Telegram-бот, задачи, решения, технологии и ссылки.",
  alternates: { canonical: "/showcase" },
};

export default function ShowcasePage() {
  return (
    <>
      <PageHero
        eyebrow="Showcase"
        title="Проекты"
        description="Сайты и боты, собранные с помощью AI: что было задачей, как устроено решение и на каких технологиях."
        image="/images/skyline-dusk.webp"
        crumbs={[{ href: "/", label: "Главная" }, { label: "Showcase" }]}
      />
      <Container className="space-y-6 md:space-y-8">
        {showcase.map((p, i) => (
          <Reveal key={p.id}>
            <ShowcaseCard project={p} reverse={i % 2 === 1} />
          </Reveal>
        ))}
        <Reveal>
          <div className="glass flex flex-col items-start justify-between gap-6 rounded-[32px] p-8 md:flex-row md:items-center md:p-10">
            <div>
              <p className="eyebrow mb-3">Ваш проект</p>
              <p className="max-w-xl text-lg text-white/80">
                Нужен сайт или Telegram-бот такого уровня? Напишите — обсудим задачу.
              </p>
            </div>
            <ButtonLink href={site.author.telegram} external arrow>
              Telegram
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
