import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://aaenz.no";

const routes = [
  { path: "", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/om-oss", changeFrequency: "yearly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      entries.push({
        url: `${BASE}${prefix}${route.path}`,
        lastModified: new Date(),
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
