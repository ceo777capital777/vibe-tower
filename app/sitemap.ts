import type { MetadataRoute } from "next";
import { articleHref, articles } from "@/content/articles";
import { categories } from "@/content/categories";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/explore", "/library", "/tools", "/generator", "/showcase", "/about"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: `${site.url}/library/${c.id}`, priority: 0.7 })),
    ...articles.map((a) => ({ url: `${site.url}${articleHref(a)}`, priority: 0.6 })),
  ];
}
