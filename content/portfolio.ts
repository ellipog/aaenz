import type { Localized } from "./types";

/**
 * Demo sites for fictional businesses — shown alongside real products
 * on the homepage portfolio section. Each is clearly labeled as a demo until
 * real client work replaces it. Add new demos here and they appear on the site.
 *
 * (Replace the demoUrl fields when the demo sites are built; they're blank for now.)
 */
export interface DemoSite {
  slug: string;
  business: Localized;
  /** Sector label shown as a tag. */
  sector: Localized;
  blurb: Localized;
  /** Leave empty until the demo is built. */
  demoUrl?: string;
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
      no: "Fiktiv fjellkafé som trengte meny, åpningstider og et bilde av utsikten – live på én uke.",
      en: "Fictional mountain café that needed a menu, opening hours, and a photo of the view — live in a week.",
    },
    // demoUrl: "https://demo.aaenz.no/fjell-brekkestue",
    // screenshot: "/demos/fjell-brekkestue.png",
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
    // demoUrl: "https://demo.aaenz.no/strand-treverk",
    // screenshot: "/demos/strand-treverk.png",
  },
  {
    slug: "gjøvik-fysioterapi",
    business: {
      no: "Gjøvik Fysioterapi",
      en: "Gjøvik Physiotherapy",
    },
    sector: { no: "Helse", en: "Health" },
    blurb: {
      no: "Fiktiv klinikk som trengte timebestilling, behandlerprofiler og tydelig prisinformasjon.",
      en: "Fictional clinic that needed appointment booking, staff profiles, and clear pricing.",
    },
    // demoUrl: "https://demo.aaenz.no/gjøvik-fysioterapi",
    // screenshot: "/demos/gjøvik-fysioterapi.png",
  },
];
