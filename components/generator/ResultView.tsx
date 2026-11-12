"use client";

import { motion } from "motion/react";
import { CircleHelp, Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Markdown } from "@/components/ui/Markdown";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import {
  CLARIFY_HEADING,
  GENERATOR_SECTIONS,
  LIMITS,
  OPEN_QUESTIONS_HEADING,
  TARGETS,
  type GeneratorTarget,
} from "@/lib/generator/config";
import { parseGenerated, sectionToMarkdown, type ParsedSection } from "@/lib/generator/parse";
import { cn } from "@/lib/utils";

const labelFor = (key?: string) => GENERATOR_SECTIONS.find((s) => s.key === key)?.label;

function sectionId(i: number) {
  return `tz-${i + 1}`;
}

export function ResultView({
  output,
  streaming,
  resultTarget,
  currentTarget,
  onRegenerate,
  onRefine,
  onAnswer,
  onRetarget,
  onPdf,
  pdfBusy,
}: {
  output: string;
  streaming: boolean;
  resultTarget: GeneratorTarget;
  currentTarget: GeneratorTarget;
  onRegenerate: () => void;
  onRefine: (instruction: string) => void;
  onAnswer: (answers: string) => void;
  onRetarget: () => void;
  onPdf: (sections: ParsedSection[]) => void;
  pdfBusy: boolean;
}) {
  const parsed = useMemo(() => parseGenerated(output), [output]);
  const [refine, setRefine] = useState("");
  const [answers, setAnswers] = useState("");

  const specSections = parsed.sections.filter((s) => s.key !== CLARIFY_HEADING);
  const clarify = parsed.sections.find((s) => s.key === CLARIFY_HEADING);
  const targetLabel = TARGETS.find((t) => t.id === resultTarget)?.label;
  const newTargetLabel = TARGETS.find((t) => t.id === currentTarget)?.label;

  // Модель задала уточняющие вопросы вместо ТЗ
  if (parsed.needsClarification && clarify && !streaming) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[28px] p-6 md:p-10">
        <div className="flex items-center gap-3">
          <CircleHelp className="size-6 text-accent-2" aria-hidden />
          <h2 className="font-display text-lg uppercase tracking-[0.06em] text-white">Нужно уточнить детали</h2>
        </div>
        <p className="mt-3 text-sm text-muted">
          Описания пока недостаточно для качественного ТЗ. Ответьте на вопросы — можно коротко и не на все.
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-black/25 p-5">
          <Markdown source={clarify.body} />
        </div>
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (answers.trim()) onAnswer(answers.trim());
          }}
        >
          <label htmlFor="answers" className="text-sm font-semibold text-white">
            Ваши ответы
          </label>
          <textarea
            id="answers"
            value={answers}
            onChange={(e) => setAnswers(e.target.value.slice(0, LIMITS.instructionMax))}
            rows={5}
            placeholder="1. … 2. … 3. …"
            className="mt-2 w-full resize-y rounded-2xl border border-line bg-black/30 p-4 text-[0.95rem] leading-relaxed text-white outline-none transition focus:border-accent-2/60"
          />
          <Button type="submit" className="mt-4" arrow disabled={!answers.trim()}>
            Сгенерировать ТЗ
          </Button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Навигация по разделам */}
      <aside className="hidden lg:block">
        <nav aria-label="Разделы ТЗ" className="sticky top-28">
          <p className="eyebrow mb-4 text-white/45">Разделы</p>
          <ol className="space-y-0.5">
            {GENERATOR_SECTIONS.map((s) => {
              const idx = specSections.findIndex((p) => p.key === s.key);
              const ready = idx >= 0;
              return (
                <li key={s.key}>
                  <a
                    href={ready ? `#${sectionId(idx)}` : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.8rem] transition-colors",
                      ready ? "text-white/75 hover:bg-white/[0.04] hover:text-white" : "pointer-events-none text-white/25",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full transition-colors duration-500",
                        ready ? "bg-accent-2 shadow-[0_0_8px_rgb(99_164_255)]" : "bg-white/15",
                      )}
                    />
                    {s.key}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <div className="min-w-0">
        {/* Панель действий */}
        <div className="glass glass-strong sticky top-[5.5rem] z-20 mb-5 flex flex-wrap items-center gap-2 rounded-2xl p-2.5">
          <span className="mr-auto flex items-center gap-2 px-2 text-xs text-muted">
            {streaming ? (
              <>
                <Loader2 className="size-4 animate-spin text-accent-2" aria-hidden /> Генерация…
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-accent-2" aria-hidden /> Формат: {targetLabel}
              </>
            )}
          </span>
          <CopyButton text={output} label="Копировать всё" />
          <button
            type="button"
            onClick={onRegenerate}
            disabled={streaming}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-3.5 text-xs font-semibold text-white/80 transition hover:border-accent-2/50 hover:text-white disabled:opacity-40"
          >
            <RefreshCw className="size-3.5" aria-hidden /> Повторить
          </button>
          <button
            type="button"
            onClick={() => onPdf(specSections)}
            disabled={streaming || pdfBusy || specSections.length === 0}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-3.5 text-xs font-semibold text-white/80 transition hover:border-accent-2/50 hover:text-white disabled:opacity-40"
          >
            {pdfBusy ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Download className="size-3.5" aria-hidden />} PDF
          </button>
        </div>

        {currentTarget !== resultTarget && !streaming && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent-2/30 bg-accent/10 px-5 py-3.5 text-sm text-white/85">
            <span>
              Выбран другой инструмент: <strong>{newTargetLabel}</strong>. Пересобрать ТЗ под него?
            </span>
            <button onClick={onRetarget} className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#3a78ff]">
              Пересобрать под {newTargetLabel}
            </button>
          </div>
        )}

        {parsed.preamble && (
          <div className="glass mb-4 rounded-2xl p-5">
            <Markdown source={parsed.preamble} />
          </div>
        )}

        <div className="space-y-4">
          {specSections.map((s, i) => {
            const isQuestions = s.key === OPEN_QUESTIONS_HEADING;
            return (
              <motion.section
                key={`${s.title}-${i}`}
                id={sectionId(i)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={cn("glass scroll-mt-40 rounded-3xl", isQuestions && "border-accent-2/30")}
              >
                <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 md:px-7">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-accent-2/80">
                      {isQuestions ? "Вопросы для уточнения" : labelFor(s.key) ?? `Раздел ${i + 1}`}
                    </p>
                    <h3 className="mt-1 font-display text-base font-medium uppercase tracking-[0.04em] text-white md:text-lg">
                      {s.title}
                    </h3>
                  </div>
                  {!(streaming && i === specSections.length - 1) && (
                    <CopyButton text={sectionToMarkdown(s)} compact label={`Копировать раздел ${s.title}`} />
                  )}
                </header>
                <div className="px-5 py-5 md:px-7 md:py-6">
                  {s.body ? <Markdown source={s.body} /> : <div className="skeleton h-4 w-2/3 rounded" />}
                </div>
              </motion.section>
            );
          })}

          {streaming && specSections.length === 0 && (
            <div className="glass space-y-3 rounded-3xl p-7" aria-label="Генерация">
              <div className="skeleton h-5 w-1/3 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
            </div>
          )}

          {!streaming && specSections.length === 0 && output.trim() && (
            <div className="glass rounded-3xl p-6">
              <Markdown source={output} />
            </div>
          )}
        </div>

        {/* Доработка */}
        {!streaming && specSections.length > 0 && (
          <form
            className="glass edge-glow mt-6 rounded-3xl p-5 md:p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (refine.trim()) {
                onRefine(refine.trim());
                setRefine("");
              }
            }}
          >
            <label htmlFor="refine" className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="size-4 text-accent-2" aria-hidden /> Улучшить результат
            </label>
            <p className="mt-1 text-xs text-muted">
              Например: «добавь личный кабинет клиента», «сделай стиль светлее», «ответы на открытые вопросы: …».
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="refine"
                value={refine}
                onChange={(e) => setRefine(e.target.value.slice(0, LIMITS.instructionMax))}
                placeholder="Что изменить или добавить?"
                className="h-12 min-w-0 flex-1 rounded-full border border-line bg-black/30 px-5 text-sm text-white outline-none transition placeholder:text-muted focus:border-accent-2/60"
              />
              <Button type="submit" disabled={!refine.trim()} arrow>
                Улучшить
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
