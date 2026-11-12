import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/library/ArticleLayout";
import { articleHref, articles, getArticle } from "@/content/articles";
import { getCategory } from "@/content/categories";
import { site } from "@/content/site";

export function generateStaticParams() {
  return articles.map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/library/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const a = getArticle(category, slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    keywords: a.tags,
    alternates: { canonical: articleHref(a) },
    openGraph: {
      type: "article",
      title: `${a.title} — VIBE TOWER`,
      description: a.description,
      section: getCategory(a.category)?.title,
      authors: [site.author.name],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/library/[category]/[slug]">) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    inLanguage: "ru",
    author: { "@type": "Person", name: site.author.name, url: site.author.telegram },
    publisher: { "@type": "Organization", name: "VIBE TOWER" },
    isAccessibleForFree: true,
    keywords: article.tags.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ArticleLayout article={article} />
    </>
  );
}
