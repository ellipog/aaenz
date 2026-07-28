import { defineRouting } from "next-intl/routing";

/**
 * Norwegian is the default and lives at the root (`/`).
 * English lives at `/en/...`.
 * `as-needed` keeps the default locale unprefixed.
 *
 * `localeDetection: false` disables next-intl's built-in detection
 * (Accept-Language header + persistent NEXT_LOCALE cookie). We run our own
 * geolocation-based detection in proxy.ts instead, using a session cookie
 * so it only fires once per browser session. See proxy.ts.
 */
export const routing = defineRouting({
  locales: ["no", "en"],
  defaultLocale: "no",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Countries whose visitors get Norwegian by default.
 * Nordic countries + Svalbard/Jan Mayen.
 */
export const NORDIC_COUNTRY_CODES = new Set([
  "NO", // Norway
  "SJ", // Svalbard & Jan Mayen (Norwegian territory)
  "SE", // Sweden
  "DK", // Denmark
  "FI", // Finland
  "IS", // Iceland
  "FO", // Faroe Islands
  "GL", // Greenland
  "AX", // Åland Islands
]);

/**
 * Map a request country code to the preferred locale.
 *
 * - Known Nordic country → "no"
 * - Known non-Nordic country → "en"
 * - No country data (local dev / non-Vercel hosting) → "no" (fallback)
 */
export function localeForCountry(country: string | null | undefined): "no" | "en" {
  if (!country) return "no"; // No geo data → fall back to Norwegian.
  if (NORDIC_COUNTRY_CODES.has(country.toUpperCase())) return "no";
  return "en";
}
