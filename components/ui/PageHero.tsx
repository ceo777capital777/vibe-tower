import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Reveal } from "./Reveal";

/** Шапка внутренней страницы: архитектурное фото, глубина, крупный заголовок */
export function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/fog-towers.webp",
  crumbs,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-32 md:pb-20 md:pt-40">
      <div className="absolute inset-0 -z-10">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_9_13/0.55)_0%,rgb(7_9_13/0.8)_55%,#07090d_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,rgb(40_107_255/0.22),transparent_70%)]" />
        <div className="grid-lines absolute inset-0 opacity-60" />
      </div>
      <Container>
        {crumbs && (
          <Reveal y={8} className="mb-8">
            <Breadcrumbs items={crumbs} />
          </Reveal>
        )}
        <Reveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="max-w-4xl font-display text-[clamp(2.2rem,6vw,4.75rem)] font-medium uppercase leading-[0.98] tracking-[-0.03em] text-gradient">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{description}</p>
          )}
        </Reveal>
        {children && <Reveal delay={0.1} className="mt-10">{children}</Reveal>}
      </Container>
    </section>
  );
}
