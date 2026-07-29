import type { Localized } from "./types";

/**
 * Demo sites for fictional businesses - shown alongside real products
 * on the homepage portfolio section. Each is clearly labeled as a demo until
 * real client work replaces it. Add new demos here and they appear on the site.
 *
 * Lifecycle per demo (consistent across all three):
 *   1. pickerPath set  -> card links "View design concept" to the picker page
 *      at /[locale]/<slug> (in-app, same tab, locale-aware).
 *   2. demoUrl set     -> direction chosen & standalone site built at
 *      /demos/<slug> (?lang=, own layout, new tab). The picker page is then
 *      replaced by a redirect to /demos (see fjell-brekkestue).
 */
export interface DemoSite {
  slug: string;
  business: Localized;
  /** Sector label shown as a tag. */
  sector: Localized;
  blurb: Localized;
  /**
   * Which aaen package this demo illustrates: a live showroom for a tier.
   * Shown as a tag next to the sector so visitors see the fit at a glance.
   * Mirrors the slugs in content/pricing.ts.
   */
  package?: "start" | "vekst" | "tilpasset";
  /** Leave empty until the demo is built. */
  demoUrl?: string;
  /**
   * Path to an in-app concept-picker page (locale-aware, same tab), shown while
   * the demo is still a work-in-progress. Resolved against the viewer's locale
   * by the Portfolio card. Mutually exclusive with a set demoUrl in practice.
   */
  pickerPath?: string;
  /** Optional screenshot path in /public, e.g. "/demos/brekkestue.png". */
  screenshot?: string;
}

export const demoSites: DemoSite[] = [
  {
    slug: "fjell-brekkestue",
    business: {
      no: "Fjell Brekkestue",
      en: "Fjell Brekkestue (mountain café)",
    },
    sector: { no: "Kafé & restaurant", en: "Café & restaurant" },
    blurb: {
      no: "Fiktiv fjellkafé som trengte meny, åpningstider og et bilde av utsikten - live på én uke.",
      en: "Fictional mountain café that needed a menu, opening hours, and a photo of the view - live in a week.",
    },
    package: "start",
    // In-app demo route (bilingual via ?lang=, appended by Portfolio based on
    // the viewer's locale). Opens in a new tab as a standalone client site.
    demoUrl: "/demos/fjell-brekkestue",
  },
  {
    slug: "strand-treverk",
    business: {
      no: "Strand Treverk",
      en: "Strand Treverk (carpentry)",
    },
    sector: { no: "Håndverk", en: "Trades" },
    blurb: {
      no: "Fiktiv snekker som ville vise prosjektporteføljen og ta imot forespørsler via kontaktskjema.",
      en: "Fictional carpenter wanting to show their project portfolio and take enquiries via a contact form.",
    },
    package: "vekst",
    // Standalone demo site (concept 02 "Verksted") — bilingual via ?lang=,
    // opens in a new tab. The [locale] route redirects here.
    demoUrl: "/demos/strand-treverk",
  },
  {
    slug: "gjovik-fysioterapi",
    business: {
      no: "Gjøvik Fysioterapi",
      en: "Gjøvik Physiotherapy",
    },
    sector: { no: "Helse", en: "Health" },
    blurb: {
      no: "Fiktiv klinikk som trengte timebestilling, behandlerprofiler og tydelig prisinformasjon.",
      en: "Fictional clinic that needed appointment booking, staff profiles, and clear pricing.",
    },
    package: "tilpasset",
    // Standalone demo built in the Kraft direction (03). Bilingual via ?lang=,
    // own dark layout + palette, opens in a new tab as a complete clinic site.
    // The [locale] route redirects here now that the demo is live.
    demoUrl: "/demos/gjovik-fysioterapi",
  },
];
