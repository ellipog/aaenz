import type { Locale } from "@/i18n/routing";

/**
 * Wizard options — centralized so adding/changing a tile is one edit.
 * Each option has a stable `value` (sent to the API), bilingual labels,
 * and an inline SVG icon (contour-line style, no emoji).
 */

export type Localized = Record<Locale, string>;

type IconKind =
  | "home"
  | "info"
  | "services"
  | "mail"
  | "tag"
  | "article"
  | "grid"
  | "cart"
  | "calendar"
  | "dots"
  | "check"
  | "image"
  | "pen"
  | "compass"
  | "bolt"
  | "clock"
  | "leaf"
  | "rocket"
  | "leaf2";

export type WizardOption = {
  value: string;
  label: Localized;
  icon: IconKind;
};

/** Inline SVG icon renderer keyed by kind. Keeps icons with their options. */
export function WizardIcon({
  kind,
  className,
}: {
  kind: IconKind;
  className?: string;
}) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    className,
  };
  switch (kind) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11l8-6 8 6v9H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 11v5M12 8v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "services":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="6" r="1.2" fill="currentColor" />
          <circle cx="16" cy="12" r="1.2" fill="currentColor" />
          <circle cx="10" cy="18" r="1.2" fill="currentColor" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M3 12l9-9 9 9-9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        </svg>
      );
    case "article":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 9h10M7 13h10M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <path d="M4 5h2l2 11h10l2-7H7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="9" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 9h16M8 3v4M16 3v4M8 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "dots":
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="18" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 18l5-5 4 4 2-2 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "pen":
      return (
        <svg {...common}>
          <path d="M16 4l4 4-11 11H5v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 9l-2 5-4 1 2-5z" fill="currentColor" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 3L5 13h6l-2 8 8-10h-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 15c2-3 4-5 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M12 3c4 3 5 7 5 11l-2 2-3-1-3 1-2-2c0-4 1-8 5-11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 16l-2 3M15 16l2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "leaf2":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Page/feature options (multi-select) ────────────────────────────────────

export const pageOptions: WizardOption[] = [
  { value: "hjem", label: { no: "Hjem / forside", en: "Home" }, icon: "home" },
  { value: "om", label: { no: "Om oss", en: "About" }, icon: "info" },
  { value: "tjenester", label: { no: "Tjenester", en: "Services" }, icon: "services" },
  { value: "kontakt", label: { no: "Kontakt", en: "Contact" }, icon: "mail" },
  { value: "priser", label: { no: "Priser", en: "Pricing" }, icon: "tag" },
  { value: "blogg", label: { no: "Blogg / nyheter", en: "Blog / news" }, icon: "article" },
  { value: "portefolje", label: { no: "Portefølje", en: "Portfolio" }, icon: "grid" },
  { value: "butikk", label: { no: "Nettbutikk", en: "Online shop" }, icon: "cart" },
  { value: "booking", label: { no: "Booking / time", en: "Booking" }, icon: "calendar" },
  { value: "annet", label: { no: "Annet", en: "Other" }, icon: "dots" },
];

// ─── Content status (single-select) ─────────────────────────────────────────

export const contentOptions: WizardOption[] = [
  {
    value: "alt_klart",
    label: { no: "Alt er klart", en: "Everything's ready" },
    icon: "check",
  },
  {
    value: "tekst_ikke_bilder",
    label: { no: "Tekst, ikke bilder", en: "Text, no images" },
    icon: "pen",
  },
  {
    value: "trenger_logo",
    label: { no: "Trenger logo", en: "Need a logo" },
    icon: "compass",
  },
  {
    value: "bilder_ikke_tekst",
    label: { no: "Bilder, ikke tekst", en: "Images, no text" },
    icon: "image",
  },
  {
    value: "hjelp_med_alt",
    label: { no: "Hjelp med alt", en: "Help with everything" },
    icon: "bolt",
  },
];

// ─── Timeline (single-select) ───────────────────────────────────────────────

export const timelineOptions: WizardOption[] = [
  {
    value: "asap",
    label: { no: "Så fort som mulig", en: "As soon as possible" },
    icon: "bolt",
  },
  {
    value: "1_mnd",
    label: { no: "Innen 1 måned", en: "Within 1 month" },
    icon: "clock",
  },
  {
    value: "3_mnd",
    label: { no: "Innen 3 måneder", en: "Within 3 months" },
    icon: "calendar",
  },
  {
    value: "fleksibel",
    label: { no: "Fleksibel", en: "Flexible" },
    icon: "leaf2",
  },
];

// ─── Tier (single-select, shown on contact step) ────────────────────────────

export const tierOptions: WizardOption[] = [
  { value: "start", label: { no: "Start", en: "Start" }, icon: "rocket" },
  { value: "vekst", label: { no: "Vekst", en: "Vekst" }, icon: "leaf" },
  { value: "tilpasset", label: { no: "Tilpasset", en: "Tilpasset" }, icon: "compass" },
  { value: "unsure", label: { no: "Vet ikke", en: "Not sure" }, icon: "dots" },
];
