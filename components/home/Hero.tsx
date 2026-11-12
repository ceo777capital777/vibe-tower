"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const ease = [0.22, 1, 0.36, 1] as const;

export interface HeroStat {
  value: string;
  label: string;
}

export function Hero({ stats }: { stats: HeroStat[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Панорама */}
      <motion.div data-parallax="" className="absolute inset-0 -z-20" style={{ y: bgY, scale: bgScale }}>
        <Image
          src="/images/hero.webp"
          alt="Ночная панорама небоскрёбов делового центра"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_40%]"
        />
      </motion.div>

      {/* Глубина и холодный свет */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#1d4fd8] opacity-25 mix-blend-color" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_9_13/0.55)_0%,rgb(7_9_13/0.2)_35%,rgb(7_9_13/0.75)_75%,#07090d_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(7_9_13/0.85)_0%,rgb(7_9_13/0.35)_55%,transparent_100%)]" />
        <div className="absolute -top-1/4 right-[8%] h-[80vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgb(40_107_255/0.28),transparent)] blur-2xl" />
        <div className="grid-lines absolute inset-0 opacity-50" />
        {/* Луч шпиля */}
        <div className="absolute bottom-0 right-[22%] top-0 hidden w-px overflow-hidden bg-[linear-gradient(180deg,transparent,rgb(99_164_255/0.25),transparent)] md:block">
          <div className="animate-beam h-1/3 w-px bg-[linear-gradient(180deg,transparent,#9cc4ff,transparent)]" />
        </div>
      </div>

      {/* Вертикальная подпись */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 xl:block">
        <p className="font-display text-[0.62rem] uppercase tracking-[0.5em] text-white/35 [writing-mode:vertical-rl]">
          VIBE TOWER · Vibe coding platform
        </p>
      </div>

      <motion.div data-parallax="" style={{ y: contentY, opacity: fade }} className="flex flex-1 items-end pb-10 pt-32 md:items-center md:pb-0">
        <Container>
          <motion.p
            className="eyebrow mb-7 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            <span className="h-px w-10 bg-accent-2/70" />
            VIBE TOWER
          </motion.p>

          <h1 className="font-display text-[clamp(2.35rem,6.2vw,6.6rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em]">
            {["BUILD YOUR IDEAS.", "WITHOUT LIMITS."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={i === 0 ? "block text-white" : "text-gradient block"}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, ease, delay: 0.3 + i * 0.14 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.7 }}
          >
            Всё необходимое для создания сайтов с помощью искусственного интеллекта
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.85 }}
          >
            <ButtonLink href="/explore" size="lg" arrow>
              Explore platform
            </ButtonLink>
            <ButtonLink href="/generator" size="lg" variant="secondary">
              AI Prompt Generator
            </ButtonLink>
          </motion.div>
        </Container>
      </motion.div>

      {/* Панель показателей */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 1.05 }}
        className="relative pb-8 md:pb-10"
      >
        <Container className="flex items-end justify-between gap-6">
          <dl className="glass grid flex-1 grid-cols-2 divide-line overflow-hidden rounded-3xl sm:grid-cols-4 sm:divide-x md:max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1 px-5 py-4 md:px-6 md:py-5">
                <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">{s.label}</dt>
                <dd className="font-display text-2xl font-medium text-white md:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#directory"
            aria-label="Прокрутить к разделам"
            className="hidden size-14 shrink-0 place-items-center rounded-full border border-line-strong text-white/70 transition hover:border-accent-2/60 hover:text-white md:grid"
          >
            <ChevronDown className="size-5 animate-float" />
          </a>
        </Container>
      </motion.div>
    </section>
  );
}
