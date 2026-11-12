# VIBE TOWER

Платформа о вайб-кодинге: база знаний на русском, каталог AI-сервисов, проекты и AI-генератор технических заданий.
Автор — Артём Димоглов · [Telegram](https://t.me/Dimoglov_official).

Стек: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Motion, jsPDF.

---

## Запуск

Нужен Node.js 20.9+ (проверено на Node 24).

```bash
npm install
cp .env.example .env.local   # ключи AI — по желанию, см. ниже
npm run dev                  # разработка: http://localhost:3000
```

Продакшен-сборка:

```bash
npm run build
npm run start                # http://localhost:3000, порт меняется флагом: npm run start -- -p 3100
npm run lint                 # проверка кода
```

## Страницы

| Маршрут | Что там |
|---|---|
| `/` | Вход: «BUILD YOUR IDEAS. WITHOUT LIMITS.» |
| `/explore` | Хаб: 7 разделов платформы |
| `/library` | База знаний: поиск и фильтры по категории и уровню |
| `/library/[category]` | Статьи одной категории |
| `/library/[category]/[slug]` | Статья: текст, шаги, примеры, промпты, советы |
| `/tools` | Каталог AI-сервисов с поиском и фильтрами |
| `/generator` | AI Prompt Generator: техническое задание из идеи |
| `/showcase` | Проекты |
| `/about` | Об авторе |

Глобальный поиск по статьям, промптам и сервисам открывается кнопкой «Поиск», а также клавишами `⌘K` / `Ctrl+K` или `/`.

---

## Подключение AI (генератор ТЗ)

Генератор работает **только с настоящей моделью на сервере**. Без ключа страница `/generator` показывает экран «AI ещё не подключён» и ничего не генерирует. Подставных ответов нет.

1. Создайте файл `.env.local` в корне проекта (он уже в `.gitignore`, в git не попадёт).
2. Заполните **один** из ключей:

```bash
OPENAI_API_KEY=ваш_ключ_openai
# или
ANTHROPIC_API_KEY=ваш_ключ_anthropic
```

3. Перезапустите `npm run dev` или `npm run start`.

Необязательные переменные (полный список в `.env.example`):

- `AI_PROVIDER=openai|anthropic` — выбрать провайдера явно, если заданы оба ключа (по умолчанию OpenAI).
- `OPENAI_MODEL` (по умолчанию `gpt-4.1`) и `ANTHROPIC_MODEL` (по умолчанию `claude-sonnet-4-5`).
- `OPENAI_BASE_URL` — OpenAI-совместимый endpoint (прокси, Azure-шлюз и т. п.).
- `NEXT_PUBLIC_SITE_URL` — публичный адрес сайта для canonical, sitemap и Open Graph.

Важно:

- Ключ читается только в `app/api/generate/route.ts` и `lib/generator/*` (модули помечены `server-only`). В браузер он не попадает.
- Никогда не коммитьте `.env*` с ключами и не используйте префикс `NEXT_PUBLIC_` для ключей.
- Лимит запросов: 5 в минуту и 30 в час с одного IP (`lib/generator/rate-limit.ts`). Лимит хранится в памяти процесса. Для нескольких инстансов или serverless его стоит перенести в Redis (например, Upstash).

Возможности генератора: режимы QUICK / PROFESSIONAL; формат под Cursor, Claude Code, Codex или универсальный; уточняющие вопросы при слишком коротком описании; пометка **[Предположение]** для всего, что модель додумала; 16 разделов ТЗ; копирование целиком и по разделам; повтор; доработка по инструкции; пересборка под другой инструмент; экспорт в PDF.

---

## Как добавлять контент

Весь контент лежит в TypeScript-файлах в папке `content/`. Базы данных нет. После правки сайт пересобирается сам, а поиск и sitemap обновляются автоматически.

### Статья

Откройте файл категории в `content/articles/`:

| Категория | Файл |
|---|---|
| Основы вайб-кодинга | `vibe-coding.ts` |
| AI-инструменты | `ai-tools.ts` |
| Разработка сайтов | `development.ts` |
| Заработок | `monetization.ts` |
| Библиотека промптов | `prompts.ts` |

Добавьте объект в массив (тип `Article` описан в `content/types.ts`):

```ts
{
  slug: "moya-statya",                 // латиница, станет частью URL
  category: "development",
  title: "Заголовок",
  description: "Короткое описание для карточки и SEO",
  level: "Новичок",                    // "Новичок" | "Средний" | "Продвинутый"
  tags: ["Next.js", "деплой"],
  body: [
    { type: "p", text: "Абзац. Поддерживается **жирный** и `код`." },
    { type: "h2", text: "Подзаголовок" },
    { type: "list", items: ["Пункт 1", "Пункт 2"] },
    { type: "callout", tone: "warn", title: "Важно", text: "…" },
    { type: "code", lang: "bash", code: "npm run build" },
  ],
  steps: [{ title: "Шаг", text: "…" }],
  examples: [{ title: "Пример", text: "…" }],
  prompts: [{ title: "Промпт", text: "Текст промпта", note: "Когда использовать" }],
  tips: ["Совет"],
}
```

Чтобы добавить новую категорию, впишите её id в `CategoryId` (`content/types.ts`), опишите её в `content/categories.ts` и подключите файл со статьями в `content/articles/index.ts`.

### AI-сервис

Добавьте объект в массив `tools` в `content/tools.ts`: `id`, `name`, `category`, `description`, `capabilities`, `url` (официальный сайт), `mark` (1–2 символа для монограммы) и, если есть статья, `guide` со ссылкой на неё.

### Проект в Showcase

Добавьте объект в `content/showcase.ts`. Скриншот положите в `public/images/` (лучше `.webp`, около 1600 px по ширине) и укажите путь в поле `image`.

### Тексты об авторе и навигация

Они лежат в `content/site.ts`.

---

## Telegram Mini App

Тот же сайт открывается внутри Telegram как Mini App: вход, хаб, библиотека, генератор, каталог инструментов, проекты, страница автора и глобальный поиск. В обычном браузере вид и поведение не меняются. Официальный SDK Telegram подключается только если страница открыта как Mini App.

Как привязать адрес в [@BotFather](https://t.me/BotFather):

1. Если бота ещё нет, создайте его командой `/newbot`.
2. Укажите URL Mini App: `https://vibe-tower.onrender.com`.
   - `/mybots` → выберите бота → **Bot Settings** → **Configure Mini App** или **Menu Button** и вставьте этот URL.
   - Либо `/newapp`, если нужна прямая ссылка вида `https://t.me/<bot>/<short_name>` — в поле Web App URL тот же адрес.
3. Откройте бота в Telegram и запустите приложение. Кнопка «Назад» Telegram ведёт по разделам. Официальные сайты инструментов и контакт [https://t.me/Dimoglov_official](https://t.me/Dimoglov_official) открываются через Telegram (`openLink` / `openTelegramLink`).

Необязательная проверка `initData` на сервере: задайте `TELEGRAM_BOT_TOKEN` (токен от BotFather) в переменных окружения хостинга, например Render → Environment. Сайт полностью работает и без неё. **Токен бота нельзя коммитить**, класть в клиентский код или в переменные с префиксом `NEXT_PUBLIC_`. Файлы `.env*` уже в `.gitignore`.

## Хостинг

Сайт рассчитан на **Vercel** или любой **Node.js-хостинг** (Render, Railway, VPS с `npm run build && npm run start`). Генератору нужен серверный API-маршрут `/api/generate`, поэтому **статический хостинг вроде GitHub Pages не подходит**: генератор там работать не будет.

На Vercel: импортируйте репозиторий, добавьте `OPENAI_API_KEY` или `ANTHROPIC_API_KEY` в Project → Settings → Environment Variables и задайте `NEXT_PUBLIC_SITE_URL`. Ответ генератора может идти до 2 минут (`maxDuration = 120` в маршруте), поэтому проверьте лимит длительности функций на вашем тарифе.

---

## Структура

```
app/              страницы (App Router), API /api/generate, sitemap, robots, иконка
components/       UI: layout, home, library, tools, showcase, generator, search, ui
content/          статьи, сервисы, проекты, разделы, данные автора
lib/generator/    конфиг 16 разделов, системный промпт, провайдеры, лимиты, PDF
public/images/    фото и скриншоты (webp)
public/fonts/     PT Sans для кириллицы в PDF (OFL)
```

## Доступность и производительность

- Учитывается `prefers-reduced-motion`: анимации, параллакс и подсветка отключаются.
- Работает навигация с клавиатуры, видимый фокус и skip-link; цветовой контраст рассчитан на тёмную тему.
- Почти все страницы статически пререндерятся. Изображения отдаются в AVIF/WebP через `next/image`.

## Лицензии и источники изображений

Архитектурные фото взяты с [Pexels](https://www.pexels.com/license/) (бесплатная лицензия), авторы указаны на странице `/about`. Шрифты: Manrope и Unbounded (Google Fonts, OFL), PT Sans (OFL, `public/fonts/OFL-PTSans.txt`).
