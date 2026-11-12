import type { ShowcaseProject } from "./types";

/** Чтобы добавить проект — допишите объект. Изображение положите в public/images. */
export const showcase: ShowcaseProject[] = [
  {
    id: "axon",
    name: "AXON",
    tagline: "AI-агенты и автоматизация",
    description:
      "Сайт студии, которая внедряет AI-агентов: чат-боты поддержки, продажи и CRM, интеграции на n8n, аналитика в Telegram. Тёмная технологичная эстетика и интерактивная сцена из частиц.",
    image: "/images/showcase-axon.webp",
    stack: ["HTML", "CSS", "JavaScript", "Three.js", "GitHub Pages"],
    features: [
      "Кольцо из частиц на WebGL с симуляцией жидкости, реагирует на курсор",
      "Фильтр услуг по категориям с анимированным счётчиком",
      "Заголовки с эффектом расшифровки текста",
      "Поддержка prefers-reduced-motion",
    ],
    url: "https://ceo777capital777.github.io/axon/",
    kind: "own",
    year: "2026",
  },
  {
    id: "nocta",
    name: "NOCTA",
    tagline: "Креативное агентство",
    description:
      "Сайт креативного агентства: маркетинг, брендинг и digital-продукты. Глубокий фиолетовый, крупная гротескная типографика и объёмная светящаяся сфера на первом экране.",
    image: "/images/showcase-nocta.webp",
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    features: [
      "Акцентная типографика с курсивным выделением",
      "Бегущая строка с клиентами",
      "Адаптивная сетка услуг и кейсов",
      "Подключение собственного домена",
    ],
    url: "https://ceo777capital777.github.io/nocta/",
    kind: "own",
    year: "2026",
  },
  {
    id: "lumen",
    name: "LUMEN",
    tagline: "Жалюзи и рулонные шторы",
    description:
      "Сайт производителя жалюзи и рулонных штор. Тёплая палитра, элегантная антиква и стеклянная карточка с палитрой цветов — интерьерная, «домашняя» премиальность.",
    image: "/images/showcase-lumen.webp",
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    features: [
      "Каталог с выбором цвета",
      "Расчёт стоимости как главный сценарий",
      "Стеклянные панели поверх фотографии",
      "Мягкие анимации появления",
    ],
    url: "https://ceo777capital777.github.io/lumen/",
    kind: "own",
    year: "2026",
  },
  {
    id: "volt",
    name: "VOLT",
    tagline: "Спортивный клуб",
    description:
      "Сайт клуба силы и драйва: тренировки, тренеры, расписание и цены. Монохромная энергичная эстетика с гигантской типографикой и орбитальной анимацией.",
    image: "/images/showcase-volt.webp",
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    features: [
      "Гигантский заголовок с эффектом размытия при появлении",
      "Анимированные цифры статистики",
      "Расписание и тарифы",
      "CTA на пробную тренировку",
    ],
    url: "https://ceo777capital777.github.io/sport/",
    kind: "own",
    year: "2026",
  },
  {
    id: "lead-bot",
    name: "Lead Bot",
    tagline: "Telegram-бот для заявок",
    description:
      "Telegram-бот для приёма заявок на веб-разработку: анкета из шести шагов — имя, тип проекта, описание, бюджет, сроки и контакт. Готовая заявка сразу уходит администратору.",
    stack: ["Python", "aiogram 3", "SQLite", "systemd"],
    features: [
      "Пошаговая анкета на FSM с кнопками вариантов",
      "Сводка перед отправкой и отмена на любом шаге",
      "Заявки сохраняются в SQLite, команда /leads для администратора",
      "Токен и ID администратора — в переменных окружения",
    ],
    kind: "own",
    year: "2026",
  },
  {
    id: "vibe-tower",
    name: "VIBE TOWER",
    tagline: "Эта платформа",
    description:
      "Информационная платформа о вайб-кодинге: база знаний, каталог AI-инструментов и генератор технических заданий на серверном AI.",
    image: "/images/hero.webp",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "OpenAI / Anthropic API"],
    features: [
      "Типизированный контент — статьи и инструменты добавляются без правок вёрстки",
      "Глобальный поиск по базе знаний",
      "Потоковая генерация ТЗ с копированием по разделам и экспортом в PDF",
    ],
    kind: "own",
    year: "2026",
  },
];
