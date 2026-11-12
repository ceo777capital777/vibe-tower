import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SearchDialog } from "@/components/search/SearchDialog";
import { SpotlightTracker } from "@/components/ui/SpotlightTracker";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "VIBE TOWER — Build your ideas. Without limits.",
    template: "%s — VIBE TOWER",
  },
  description: site.description,
  applicationName: "VIBE TOWER",
  authors: [{ name: site.author.name, url: site.author.telegram }],
  keywords: ["вайб-кодинг", "vibe coding", "AI", "создание сайтов", "Cursor", "Claude", "ChatGPT", "Codex", "промпты", "ТЗ"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "VIBE TOWER",
    title: "VIBE TOWER — Build your ideas. Without limits.",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "VIBE TOWER" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIBE TOWER — Build your ideas. Without limits.",
    description: site.description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable} antialiased`}>
      <body className="min-h-screen overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2"
        >
          Перейти к содержимому
        </a>
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SearchDialog />
        </MotionProvider>
        <SpotlightTracker />
      </body>
    </html>
  );
}
