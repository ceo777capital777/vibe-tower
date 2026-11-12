import type { Metadata } from "next";
import { GeneratorClient } from "@/components/generator/GeneratorClient";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "AI Prompt Generator — техническое задание для сайта из идеи",
  description:
    "Опишите сайт своими словами — AI превратит идею в профессиональное ТЗ и промпт для Cursor, Claude Code или Codex. Режимы QUICK и PROFESSIONAL, экспорт в PDF.",
  alternates: { canonical: "/generator" },
};

export default function GeneratorPage() {
  return (
    <>
      <PageHero
        eyebrow="Идея → техническое задание"
        title="AI Prompt Generator"
        description="Опишите сайт, который хотите создать. AI определит тип проекта, страницы, функции и визуальное направление и соберёт профессиональное техническое задание с готовым промптом для AI-разработки."
        image="/images/tower-blue.webp"
        crumbs={[{ href: "/", label: "Главная" }, { label: "Generator" }]}
      />
      <Container>
        <GeneratorClient />
      </Container>
    </>
  );
}
