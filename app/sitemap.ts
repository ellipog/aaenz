import type { MetadataRoute } from "next";

/*
 * One page, one entry. `/type-lab` is deliberately absent: it is a local specimen
 * bench with its own noindex, and it must not be advertised, published or linked.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 1,
      url: "https://aaenz.no/",
    },
  ];
}
