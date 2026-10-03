import type { MetadataRoute } from "next";

/*
 * There is no robots.txt in `public/`; this route is it. Nothing is fenced off —
 * the only page that should never be indexed carries its own noindex — and the
 * sitemap is declared so crawlers find the homepage without guessing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://aaenz.no/sitemap.xml",
  };
}
