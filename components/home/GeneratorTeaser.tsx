import Image from "next/image";
import { Wand2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Reveal } from "@/components/ui/Reveal";
import { EXAMPLE_IDEA, GENERATOR_SECTIONS, TARGETS } from "@/lib/generator/config";

export function GeneratorTeaser() {
  return (
    <Reveal>
      <GlassPanel className="relative overflow-hidden rounded-[32px]">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/tower-blue.webp" alt="" fill sizes="100vw" className="object-cover object-[50%_30%] opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,#07090d_10%,rgb(7_9_13/0.85)_50%,rgb(7_9_13/0.55))]" />
        </div>
        <div className="grid gap-10 p-7 md:p-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:p-16">
          <div>
            <p className="eyebrow mb-5">AI Prompt Generator</p>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,3rem)] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-white">
              Идея на входе.
              <br />
              <span className="text-gradient">ТЗ на выходе.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
              Опишите сайт своими словами — генератор задаст уточняющие вопросы, если данных мало, и соберёт
              профессиональное техническое задание из {GENERATOR_SECTIONS.length} разделов с готовым промптом для{" "}
              {TARGETS.slice(0, 3).map((t) => t.label).join(", ")}.
            </p>
            <div className="mt-8">
              <ButtonLink href="/generator" size="lg" arrow>
                Generate prompt
              </ButtonLink>
            </div>
          </div>

          <div className="glass glass-strong rounded-3xl p-5 md:p-6" aria-hidden>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Wand2 className="size-4 text-accent-2" /> Пример запроса
            </div>
            <p className="mt-3 rounded-2xl border border-line bg-black/30 p-4 text-sm leading-relaxed text-white/85">
              {EXAMPLE_IDEA}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {GENERATOR_SECTIONS.map((s, i) => (
                <span
                  key={s.key}
                  className="rounded-full border border-line px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.08em] text-white/55"
                  style={{ opacity: 1 - i * 0.035 }}
                >
                  {s.key}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>
    </Reveal>
  );
}
