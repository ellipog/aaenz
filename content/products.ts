import type { Localized } from "./types";

/**
 * Aaen Studios' own products — shown on the homepage as capability proof.
 * Source: work-portfolio/src/content/projects.ts + live sites.
 */
export interface Product {
  slug: string;
  name: string;
  tagline: Localized;
  /** One short line of what it is, for the card body. */
  blurb: Localized;
  /** Tech chips (displayed as-is, no localization). */
  tech: string[];
  liveUrl: string;
  /** Optional status badge: "live" | "beta" | "open-source". */
  status: "live" | "beta" | "open-source";
}

export const products: Product[] = [
  {
    slug: "yomion",
    name: "yomion",
    tagline: {
      no: "Spillbasert plattform for å lære japansk.",
      en: "Gamified platform for learning Japanese.",
    },
    blurb: {
      no: "Skrivetrener, flashcards med to SRS-motorer (FSRS + SM-2), kanji-studier og AI-scenariosamtaler – alt i ett produkt med betalt abonnement.",
      en: "Typing trainer, flashcards with dual SRS engines (FSRS + SM-2), kanji study, and AI scenario chat — all in one product with paid subscriptions.",
    },
    tech: ["Next.js", "React", "Supabase", "Stripe", "TypeScript"],
    liveUrl: "https://yomion.com",
    status: "live",
  },
  {
    slug: "galdr",
    name: "galdr",
    tagline: {
      no: "Runetemat medieverktøy rundt FFmpeg.",
      en: "Rune-themed media toolkit wrapping FFmpeg.",
    },
    blurb: {
      no: "Skrivebordsapp for å konvertere, transkribere og redigere media – uten å røre en terminal. Leveres som én signert installasjonsfil med auto-oppdatering.",
      en: "Desktop app for converting, transcribing, and editing media — without touching a terminal. Ships as a single signed installer with auto-update.",
    },
    tech: ["Tauri 2", "Rust", "React", "FFmpeg", "whisper.cpp"],
    liveUrl: "https://galdr.aaenz.no",
    status: "open-source",
  },
  {
    slug: "kern",
    name: "kern",
    tagline: {
      no: "Serverhåndtering på tvers av plattformer med pluginsystem.",
      en: "Cross-platform desktop server manager with a plugin system.",
    },
    blurb: {
      no: "Gjør hver mappe til en overvåket instans med live terminal, sanntids telemetri og et ekte pluginsystem. Ingen halvdokumenterte API-er – bare rene verktøy.",
      en: "Turns any folder into a monitored instance with a live terminal, real-time telemetry, and a genuine plugin system. No half-documented APIs — just clean tools.",
    },
    tech: ["Tauri 2", "Rust", "React", "TypeScript"],
    liveUrl: "https://kern.aaenz.no",
    status: "open-source",
  },
];
