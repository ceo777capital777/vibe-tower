import type { Metadata } from "next";
import { ToolsCatalog } from "@/components/tools/ToolsCatalog";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { tools } from "@/content/tools";

export const metadata: Metadata = {
  title: "AI Tools — каталог AI-инструментов для создания сайтов",
  description:
    "Cursor, Claude, ChatGPT, Codex, v0, Lovable, Midjourney, FLUX, Runway, Figma и другие AI-сервисы: возможности, категории и ссылки на официальные сайты.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="AI tools catalog"
        title="AI Tools"
        description={`${tools.length} сервисов для разработки, дизайна, изображений, видео и продуктивности. Возможности и тарифы меняются быстро — проверяйте детали на официальных сайтах.`}
        image="/images/tower-blue.webp"
        crumbs={[{ href: "/", label: "Главная" }, { label: "AI Tools" }]}
      />
      <Container>
        <Reveal>
          <ToolsCatalog tools={tools} />
        </Reveal>
      </Container>
    </>
  );
}
