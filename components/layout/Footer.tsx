import Link from "next/link";
import { Send } from "lucide-react";
import { categories } from "@/content/categories";
import { mainNav, site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(99_164_255/0.5),transparent)]" />
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Бесплатная платформа о вайб-кодинге: гайды, промпты, AI-инструменты и генератор технических заданий.
          </p>
          <ExternalLink
            href={site.author.telegram}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-white/85 transition hover:border-accent-2/60 hover:text-white"
          >
            <Send className="size-4 text-accent-2" aria-hidden /> {site.author.telegramHandle}
          </ExternalLink>
        </div>

        <FooterCol title="Платформа" links={mainNav.map((n) => ({ href: n.href, label: n.hint }))} />
        <FooterCol
          title="Библиотека"
          links={categories.map((c) => ({ href: `/library/${c.id}`, label: c.label }))}
        />
        <FooterCol
          title="Начать"
          links={[
            { href: "/library/vibe-coding/chto-takoe-vibe-coding", label: "Что такое вайб-кодинг" },
            { href: "/library/vibe-coding/kak-formulirovat-zadachi", label: "Как ставить задачи AI" },
            { href: "/generator", label: "Сгенерировать ТЗ" },
            { href: "/library/monetization/pervyj-zakaz", label: "Первый заказ" },
          ]}
        />
      </Container>
      <Container className="flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 VIBE TOWER · {site.author.latin}
        </p>
        <p className="font-display uppercase tracking-[0.24em] text-white/40">Build your ideas. Without limits.</p>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-5 text-white/50">{title}</p>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
