/** Общая конфигурация генератора — используется и на клиенте, и на сервере. Секретов здесь нет. */

export const GENERATOR_SECTIONS = [
  { key: "Project Overview", label: "Описание проекта" },
  { key: "Project Goals", label: "Цели" },
  { key: "Target Audience", label: "Целевая аудитория" },
  { key: "Sitemap", label: "Структура страниц" },
  { key: "UI/UX Design", label: "Дизайн и интерфейс" },
  { key: "Functionality", label: "Функциональность" },
  { key: "User Flow", label: "Пользовательские сценарии" },
  { key: "Animations", label: "Анимации и интерактивность" },
  { key: "Frontend Requirements", label: "Требования к frontend" },
  { key: "Backend Requirements", label: "Требования к backend" },
  { key: "Database", label: "База данных" },
  { key: "Integrations", label: "Интеграции" },
  { key: "Responsive Design", label: "Адаптация под устройства" },
  { key: "Performance", label: "Производительность" },
  { key: "Security", label: "Безопасность" },
  { key: "Final Requirements", label: "Итоговые требования" },
] as const;

export const CLARIFY_HEADING = "Clarifying Questions";
export const OPEN_QUESTIONS_HEADING = "Open Questions";

export type GeneratorMode = "quick" | "pro";
export type GeneratorTarget = "cursor" | "claude-code" | "codex" | "universal";

export const MODES: { id: GeneratorMode; label: string; hint: string }[] = [
  { id: "quick", label: "QUICK MODE", hint: "Быстро, по короткому описанию" },
  { id: "pro", label: "PROFESSIONAL MODE", hint: "Подробное техническое задание" },
];

export const TARGETS: { id: GeneratorTarget; label: string }[] = [
  { id: "cursor", label: "Cursor" },
  { id: "claude-code", label: "Claude Code" },
  { id: "codex", label: "Codex" },
  { id: "universal", label: "Универсальный" },
];

export const LIMITS = {
  ideaMin: 12,
  ideaMax: 4000,
  instructionMax: 2000,
  previousMax: 40000,
} as const;

export const PLACEHOLDER =
  "Опишите, какой сайт вы хотите создать. Расскажите о своей идее, а AI превратит её в профессиональное техническое задание";

export const EXAMPLE_IDEA =
  "Хочу создать премиальный сайт для детейлинга с онлайн-записью, галереей работ, услугами и тёмным дизайном";

/** Маркер ошибки, который сервер может дописать в поток, если провайдер оборвал ответ */
export const STREAM_ERROR_MARKER = "\n\n[[VT_STREAM_ERROR]]";

export interface GenerateRequest {
  idea: string;
  mode: GeneratorMode;
  target: GeneratorTarget;
  /** Для доработки: предыдущий результат и инструкция */
  previous?: string;
  instruction?: string;
}

export interface GeneratorStatus {
  configured: boolean;
  provider: "openai" | "anthropic" | null;
}

export function isMode(v: unknown): v is GeneratorMode {
  return v === "quick" || v === "pro";
}

export function isTarget(v: unknown): v is GeneratorTarget {
  return TARGETS.some((t) => t.id === v);
}
