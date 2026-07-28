import type { Localized, LocalizedList } from "./types";

/**
 * Subscription tiers + one-time services for website-building.
 * Single file — adjust prices and deliverables here and they update everywhere.
 *
 * Market research (juli 2026) — Norwegian "nettside som abonnement" aktører:
 *   Smartbyrå 299, Webaro/Nettify 399, Uniweb Basis 472–559, Uniweb Standard 759,
 *   Webvia Enkel 690, Webvia Bedrift 990, Nettify Levert 800, Raskweb 990–1190.
 *   Tradisjonelle byrå: 20 000–50 000 kr engangs + fra 490 kr/mnd drift.
 *   .no-domene koster ~85–200 kr/år (Norid via registrar).
 *   Logo/visuell identitet: 5 000–15 000 kr (mellomklasse).
 *   Profilmanual: 4 900–15 000 kr.
 *
 * Vår posisjon: 0 kr oppstart (konkurrenter tar 6 999–19 990 kr),
 * alt inkludert, skreddersydd (ikke selvbygger).
 *
 * Currency is NOK, monthly, ex. VAT unless noted.
 */

// ─── Abonnement (månedlig) ───────────────────────────────────────────────────

export interface PricingTier {
  slug: "start" | "vekst" | "tilpasset";
  name: Localized;
  /** Price display string (already localized with currency). */
  price: Localized;
  /** Period label shown next to the price, e.g. "/ mnd" or "tilbud". */
  period: Localized;
  /** One-line summary of who it's for. */
  summary: Localized;
  /** What's included. */
  features: LocalizedList;
  /** Whether this tier is highlighted as recommended. */
  featured?: boolean;
  /** CTA label (localized). */
  cta: Localized;
}

export const pricingTiers: PricingTier[] = [
  {
    slug: "start",
    name: { no: "Start", en: "Start" },
    price: { no: "449 kr", en: "$45" },
    period: { no: "/ mnd", en: "/ mo" },
    summary: {
      no: "For deg som trenger en enkel, profesjonell nettside – raskt.",
      en: "For those who need a simple, professional website — fast.",
    },
    features: {
      no: [
        "1–3 sider, mobiltilpasset",
        "Ett .no-domene inkludert",
        "Hosting og SSL inkludert",
        "Inntil 3 tekstendringer per måned",
        "Live på uker, ikke måneder",
        "Norsk support",
      ],
      en: [
        "1–3 pages, mobile-friendly",
        "Hosting & SSL included",
        "Up to 3 text edits per month",
        "Live in weeks, not months",
        "Norwegian support",
      ],
    },
    cta: {
      no: "Start med Start",
      en: "Start with Start",
    },
  },
  {
    slug: "vekst",
    name: { no: "Vekst", en: "Vekst" },
    price: { no: "790 kr", en: "$79" },
    period: { no: "/ mnd", en: "/ mo" },
    summary: {
      no: "For bedrifter som vil vokse med blogg, skjema og søk.",
      en: "For businesses that want to grow with a blog, forms, and search.",
    },
    features: {
      no: [
        "Opptil ~8 sider",
        "Ett .no-domene inkludert",
        "Hosting og SSL inkludert",
        "Kontaktskjema med e-post",
        "Inntil 8 endringer per måned",
        "SEO-grunnlag (meta, sitemap, fart)",
        "Blogg / nyheter",
        "Enkel analyse og rapportering",
        "Alt i Start-tieren",
      ],
      en: [
        "Up to ~8 pages",
        "Hosting & SSL included",
        "Contact form with email",
        "Up to 8 edits per month",
        "SEO foundation (meta, sitemap, speed)",
        "Blog / news",
        "Basic analytics & reporting",
        "Everything in Start",
      ],
    },
    featured: true,
    cta: {
      no: "Velg Vekst",
      en: "Choose Vekst",
    },
  },
  {
    slug: "tilpasset",
    name: { no: "Tilpasset", en: "Tilpasset" },
    price: { no: "Tilbud", en: "Quote" },
    period: { no: "etter en prat", en: "after a talk" },
    summary: {
      no: "For prosjekter som trenger mer – e-handel, integrasjoner eller dedikert støtte.",
      en: "For projects that need more — e-commerce, integrations, or dedicated support.",
    },
    features: {
      no: [
        "Egendefinert funksjonalitet",
        "Integrasjoner (betaling, booking, CRM)",
        "E-handel mulig",
        "Dedikert støtte",
        "Vi skisserer terrenget sammen først",
      ],
      en: [
        "Custom functionality",
        "Integrations (payments, booking, CRM)",
        "E-commerce available",
        "Dedicated support",
        "We scope the terrain together first",
      ],
    },
    cta: {
      no: "Be om tilbud",
      en: "Request a quote",
    },
  },
];

// ─── Engangstjenester (one-time) ─────────────────────────────────────────────

export interface OneTimeService {
  slug: string;
  name: Localized;
  /** Price display (one-time). */
  price: Localized;
  /** "engangssum" label. */
  period: Localized;
  summary: Localized;
  features: LocalizedList;
  cta: Localized;
}

/**
 * Engangstjenester — legges til ved oppstart eller når som helst.
 * Ikke gjentakende. Priser eks. mva.
 */
export const oneTimeServices: OneTimeService[] = [
  {
    slug: "logo-og-identitet",
    name: { no: "Logo & visuell identitet", en: "Logo & visual identity" },
    price: { no: "4 900 kr", en: "$490" },
    period: { no: "engangssum", en: "one-time" },
    summary: {
      no: "En logo og et farge-/typesystem som gjør bedriften gjenkjennelig.",
      en: "A logo and colour/type system that makes your business recognisable.",
    },
    features: {
      no: [
        "2–6 konseptforslag",
        "Logo i alle formater (SVG, PNG, farger/sort/hvitt)",
        "Fargepalett og typografi",
        "Enkel retningslinje for bruk",
      ],
      en: [
        "2–6 concept proposals",
        "Logo in all formats (SVG, PNG, colour/black/white)",
        "Colour palette & typography",
        "Basic usage guidelines",
      ],
    },
    cta: { no: "Be om tilbud", en: "Request a quote" },
  },
  {
    slug: "profilmanual",
    name: { no: "Profilmanual", en: "Brand manual" },
    price: { no: "9 900 kr", en: "$990" },
    period: { no: "engangssum", en: "one-time" },
    summary: {
      no: "Hele merkevaren samlet i ett dokument – trygt å delegere videre.",
      en: "Your entire brand gathered in one document — safe to hand off.",
    },
    features: {
      no: [
        "Logo & visuell identitet (inkludert)",
        "Stemmeguide (tone of voice)",
        "Bildestil og ikonbruk",
        "Mal for sosiale medier",
        "Full profilmanual (PDF)",
      ],
      en: [
        "Logo & visual identity (included)",
        "Voice & tone guide",
        "Image style & icon use",
        "Social media templates",
        "Full brand manual (PDF)",
      ],
    },
    cta: { no: "Be om tilbud", en: "Request a quote" },
  },
];

// ─── Trust-linje under pricing ──────────────────────────────────────────────

export const pricingTrust: LocalizedList = {
  no: [
    "Ingen oppstartskostnad",
    "Ingen lock-in – du eier siden din",
    "Andre domentyper (.com, .net) mot tillegg",
    "Oppsigelse når som helst",
    "Priser eks. mva",
  ],
  en: [
    "No setup fee",
    "No lock-in — you own your site",
    "Other domain types (.com, .net) available as add-on",
    "Cancel anytime",
    "Prices ex. VAT",
  ],
};
