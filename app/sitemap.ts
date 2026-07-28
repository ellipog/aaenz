import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://aaenz.no";
// Fixed build time so lastmod is stable per deploy (not regenerated to "now"
// on every build, which makes it meaningless to crawlers).
const LAST_MOD = new Date("2024-07-01");

const routes = [
  { path: "", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/om-oss", changeFrequency: "yearly" as const, priority: 0.6 },
  { path: "/start", changeFrequency: "yearly" as const, priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      entries.push({
        url: `${BASE}${prefix}${route.path}`,
        lastModified: LAST_MOD,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            no: `${BASE}${route.path}`,
            en: `${BASE}/en${route.path}`,
            "x-default": `${BASE}${route.path}`,
          },
        },
      });
    }
  }

  return entries;
}
