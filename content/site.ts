export const site = {
  name: "VIBE TOWER",
  tagline: "BUILD YOUR IDEAS. WITHOUT LIMITS.",
  description:
    "Бесплатная база знаний по вайб-кодингу, каталог AI-инструментов и генератор профессиональных ТЗ для создания сайтов с помощью искусственного интеллекта.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: {
    name: "Артём Димоглов",
    latin: "ARTEM DIMOGLOV",
    telegram: "https://t.me/Dimoglov_official",
    telegramHandle: "@Dimoglov_official",
    github: "https://github.com/ceo777capital777",
  },
};

export interface NavItem {
  href: string;
  label: string;
  hint: string;
}

export const mainNav: NavItem[] = [
  { href: "/explore", label: "Explore", hint: "Все разделы" },
  { href: "/library", label: "Library", hint: "База знаний" },
  { href: "/tools", label: "AI Tools", hint: "Каталог сервисов" },
  { href: "/generator", label: "Generator", hint: "AI-генератор ТЗ" },
  { href: "/showcase", label: "Showcase", hint: "Проекты" },
  { href: "/about", label: "About", hint: "Об авторе" },
];
