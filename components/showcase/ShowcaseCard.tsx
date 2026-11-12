import Image from "next/image";
import { ArrowUpRight, Bot } from "lucide-react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import type { ShowcaseProject } from "@/content/types";
import { cn } from "@/lib/utils";

const kindLabel: Record<ShowcaseProject["kind"], string> = {
  own: "Проект автора",
  client: "Клиентский проект",
  demo: "Демо-пример",
};

export function ShowcaseCard({ project, reverse = false }: { project: ShowcaseProject; reverse?: boolean }) {
  return (
    <article className="glass edge-glow group grid overflow-hidden rounded-[32px] lg:grid-cols-[1.25fr_1fr]">
      <div className={cn("relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[420px]", reverse && "lg:order-2")}>
        {project.image ? (
          <Image
            src={project.image}
            alt={`Скриншот проекта ${project.name}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-left-top transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(60%_60%_at_50%_40%,rgb(40_107_255/0.3),transparent),linear-gradient(180deg,#10151e,#07090d)]">
            <div className="grid-lines absolute inset-0" />
            <div className="relative flex flex-col items-center gap-4">
              <span className="grid size-20 place-items-center rounded-3xl border border-accent-2/40 bg-accent/10 text-accent-2 shadow-[0_0_60px_-10px_rgb(40_107_255/0.8)]">
                <Bot className="size-9" aria-hidden />
              </span>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-white/70">{project.name}</span>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(7_9_13/0.6))]" />
      </div>

      <div className="flex flex-col p-7 md:p-10">
        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em]">
          <span className="text-accent-2">{kindLabel[project.kind]}</span>
          {project.year && <span className="text-white/35">· {project.year}</span>}
        </div>
        <h2 className="mt-4 font-display text-3xl font-medium uppercase tracking-[-0.01em] text-white md:text-4xl">{project.name}</h2>
        <p className="mt-1 text-sm text-white/55">{project.tagline}</p>
        <p className="mt-5 text-[0.98rem] leading-relaxed text-white/75">{project.description}</p>

        <h3 className="mt-7 text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Особенности реализации</h3>
        <ul className="mt-3 space-y-2">
          {project.features.map((f) => (
            <li key={f} className="flex gap-3 text-sm leading-relaxed text-white/75">
              <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent-2" aria-hidden />
              {f}
            </li>
          ))}
        </ul>

        <ul className="mt-7 flex flex-wrap gap-1.5" aria-label="Технологии">
          {project.stack.map((s) => (
            <li key={s} className="rounded-full border border-line px-3 py-1 text-xs text-white/65">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          {project.url ? (
            <ExternalLink
              href={project.url}
              className="inline-flex items-center gap-2 font-display text-[0.7rem] uppercase tracking-[0.2em] text-white transition-colors hover:text-accent-2"
            >
              Открыть проект <ArrowUpRight className="size-4" aria-hidden />
            </ExternalLink>
          ) : (
            <span className="text-xs text-white/40">Ссылка недоступна публично</span>
          )}
        </div>
      </div>
    </article>
  );
}
