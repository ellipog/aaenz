import type { Locale } from "@/i18n/routing";

/**
 * Bilingual content pattern (mirrors work-portfolio/src/content/projects.ts).
 * Every user-facing content object carries { no, en } fields and is resolved
 * against the active locale at render time via `tx()`.
 */
export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

/** Resolve a Localized value for the active locale. */
export function tx(value: Localized, locale: Locale): string {
  return value[locale] ?? value.no;
}

export function txList(values: LocalizedList, locale: Locale): string[] {
  return values[locale] ?? values.no;
}
