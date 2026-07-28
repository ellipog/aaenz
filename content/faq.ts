import type { Localized } from "./types";

/**
 * FAQ — common small-business concerns. Bokmål, plain language, du-form.
 */
export interface FaqItem {
  q: Localized;
  a: Localized;
}

export const faqItems: FaqItem[] = [
  {
    q: { no: "Hvor lang tid tar det?", en: "How long does it take?" },
    a: {
      no: "Enkel nettside er ofte live i løpet av 1–2 uker. Vi starter alltid med å kartlegge terrenget – da vet vi raskt hva som faktisk skal bygges.",
      en: "A simple site is often live within 1–2 weeks. We always start by surveying the terrain — so we know quickly what actually needs building.",
    },
  },
  {
    q: { no: "Hva koster det egentlig?", en: "What does it actually cost?" },
    a: {
      no: "Vi jobber med abonnement – 449 kr/mnd for enkle sider. Alt er inkludert: domene, hosting, SSL og vedlikehold. Ingen oppstartskostnad, ingen overraskelser på fakturaen.",
      en: "We work with subscriptions — 449 kr/mo for simple sites. Everything is included: domain, hosting, SSL, and maintenance. No setup fee, no surprise invoices.",
    },
  },
  {
    q: {
      no: "Eier jeg nettsiden min, eller er jeg bundet til dere?",
      en: "Do I own my website, or am I locked in?",
    },
    a: {
      no: "Du eier nettsiden. Ingen lock-in – du kan flytte den når som helst. Vi tror på å bygge på grunn vi har gått, ikke på avtaler som holder folk fast.",
      en: "You own the site. No lock-in — you can move it anytime. We believe in building on ground we've walked, not contracts that keep people stuck.",
    },
  },
  {
    q: {
      no: "Hva om jeg vil endre noe selv?",
      en: "What if I want to change something myself?",
    },
    a: {
      no: "Inkluderte endringer er en del av hver måned. Vil du ha mer kontroll, setter vi opp et publiseringssystem du kan bruke selv – uten å ødelegge designet.",
      en: "Included edits are part of the plan each month. If you want more control, we set up a CMS you can use yourself — without breaking the design.",
    },
  },
  {
    q: {
      no: "Blir siden synlig på Google?",
      en: "Will the site show up on Google?",
    },
    a: {
      no: "Ja. Hver side får et skikkelig SEO-grunnlag: meta, sitemap, rask lastetid og mobiltilpasning. Vi kan ikke love førsteplass, men vi bygger fundamentet riktig.",
      en: "Yes. Every site gets a proper SEO foundation: meta, sitemap, fast load times, and mobile-first. We can't promise rank 1, but we build the foundation right.",
    },
  },
  {
    q: {
      no: "Hva skjer hvis jeg sier opp?",
      en: "What happens if I cancel?",
    },
    a: {
      no: "Du får med deg alt – domene, innhold og kode. Vi hjelper med overføringen, så det ikke blir et tap. Ingen vanskelige avslutninger.",
      en: "You take everything with you — domain, content, and code. We help with the transfer so it's not a loss. No awkward exits.",
    },
  },
];
