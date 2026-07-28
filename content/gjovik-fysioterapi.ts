/**
 * Gjøvik Fysioterapi — content for the physiotherapy clinic demo (demo 03).
 *
 * This file holds the *concept-picker* content (the 6 design directions shown
 * on the [locale]/gjovik-fysioterapi page). The fully-built standalone demo
 * lives in app/demos/gjovik-fysioterapi/ with its own palette + layout, just
 * like the fjell-brekkestue demo.
 *
 * The clinic is fictional but written to feel real and specific — a particular
 * practice in a particular town, with particular people and particular prices.
 * Norwegian is the primary voice; English is a plainer translation.
 *
 * The 6 directions are deliberately spread across the spectrum: clinical,
 * warm, athletic, editorial, calm, kinetic — so the client genuinely picks.
 */

export type Locale = "no" | "en";

export type Localized = Record<Locale, string>;

export function tx(value: Localized, locale: Locale): string {
  return value[locale] ?? value.no;
}

// ─── The brief (what we're designing for) ────────────────────────────────────

export const brief = {
  client: {
    name: "Gjøvik Fysioterapi",
    kind: { no: "Fiktiv fysioterapiklinikk", en: "Fictional physiotherapy clinic" } as Localized,
  },
  location: {
    place: { no: "Gjøvik, Innlandet", en: "Gjøvik, Innlandet" } as Localized,
    detail: {
      no: "Sentrum, nær sykehuset",
      en: "Town centre, near the hospital",
    } as Localized,
  },
  needs: {
    headline: {
      no: "Booking & profiler",
      en: "Booking & profiles",
    } as Localized,
    detail: {
      no: "Timebestilling, behandlerprofiler, priser",
      en: "Appointment booking, staff profiles, pricing",
    } as Localized,
  },
  feel: {
    headline: { no: "Profesjonelt & trygt", en: "Professional & trustworthy" } as Localized,
    detail: {
      no: "Tillit fra første inntrykk",
      en: "Trust from the first impression",
    } as Localized,
  },
} as const;

// ─── Concepts ────────────────────────────────────────────────────────────────

export interface Palette {
  bg: string;
  surface: string;
  accent: string;
  accentSoft: string;
  text: string;
  textSoft: string;
}

export interface TypePairing {
  /** Display font name, for the label. */
  display: string;
  /** Body font name, for the label. */
  body: string;
  /** CSS font-family stack for the display face. */
  displayStack: string;
  /** CSS font-family stack for the body face. */
  bodyStack: string;
  /** Optional Google Fonts stylesheet href for the preview (display only). */
  fontsHref?: string;
}

export interface Concept {
  /** Stable id, used by the ConceptCard to pick its hero composition. */
  id: "klinikk" | "varme" | "kraft" | "salong" | "ro" | "sving";
  /** Short internal codename shown on the card. */
  codename: string;
  /** Human name of the direction. */
  name: Localized;
  /** One-line italic tagline. */
  tagline: Localized;
  /** 2–3 sentences on the mood / who it suits. */
  mood: Localized;
  palette: Palette;
  type: TypePairing;
  /** The signature element that anchors the design. */
  signature: Localized;
  /** A logo idea for this direction. */
  logoIdea: Localized;
}

export const concepts: Concept[] = [
  {
    id: "klinikk",
    codename: "klinikk",
    name: { no: "Klinisk", en: "Clinical" },
    tagline: {
      no: "Kald kompentanse, null støy.",
      en: "Cool competence, zero noise.",
    },
    mood: {
      no: "Hvitt, blått, rutenett. Det leses som sykehus, men pent — en klinkke man stoler på før man leser et ord. Perfekt for pasienter som vil ha faglig tyngde.",
      en: "White, blue, grid. It reads as hospital, but handsome — a clinic you trust before reading a word. Perfect for patients who want clinical authority.",
    },
    palette: {
      bg: "#ffffff",
      surface: "#f4f7f9",
      accent: "#1a6b8f",
      accentSoft: "#5fa3c0",
      text: "#0f2233",
      textSoft: "#4a5b6b",
    },
    type: {
      display: "Inter",
      body: "Inter",
      displayStack: "'Inter', system-ui, sans-serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
    },
    signature: {
      no: "Et rutenett av ledige timer — store, trykkbare, klinisk presise.",
      en: "A grid of available slots — large, clickable, clinically precise.",
    },
    logoIdea: {
      no: "Ordklassens navn i en tykk vekt, med en tynn horisontal strek under — som en journalhode.",
      en: "The clinic name in a heavy weight, with a thin rule beneath — like a chart header.",
    },
  },
  {
    id: "varme",
    codename: "varme",
    name: { no: "Varme", en: "Warmth" },
    tagline: {
      no: "Omsorg, ikke venteværelse.",
      en: "Care, not a waiting room.",
    },
    mood: {
      no: "Krem, terrakotta, myke skråkanter. Det føles som en praksis drevet av mennesker, ikke en institusjon. Godt for en klinikk der relasjonen er poenget.",
      en: "Cream, terracotta, soft corners. It feels like a practice run by people, not an institution. Good for a clinic where the relationship is the point.",
    },
    palette: {
      bg: "#faf6f0",
      surface: "#f1e9dc",
      accent: "#c47a52",
      accentSoft: "#dba787",
      text: "#3a2e25",
      textSoft: "#6b5b4d",
    },
    type: {
      display: "Fraunces",
      body: "Inter",
      displayStack: "'Fraunces', Georgia, serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap",
    },
    signature: {
      no: "En håndtegnet kroppslineatur — ryggraden, skuldra, kneet — tegnet i én strek.",
      en: "A hand-drawn body line — the spine, the shoulder, the knee — drawn in one stroke.",
    },
    logoIdea: {
      no: "Navnet i en myk serif, med en buet strek over 'ø' som et smil eller en bue.",
      en: "The name in a soft serif, with a curved stroke over the 'ø' like a smile or an arch.",
    },
  },
  {
    id: "kraft",
    codename: "kraft",
    name: { no: "Kraft", en: "Power" },
    tagline: {
      no: "Bevegelse, ytelse, resultater.",
      en: "Movement, performance, results.",
    },
    mood: {
      no: "Mørk, elektrisk, kondensert. Det leses som et prestasjonslaboratorium, ikke et sykehus. Sniker mot idrettsutøvere og de som vil tilbake i trening.",
      en: "Dark, electric, condensed. It reads as a performance lab, not a hospital. Leans toward athletes and those who want to get back to training.",
    },
    palette: {
      bg: "#0e1116",
      surface: "#1a1f27",
      accent: "#d6ff3a",
      accentSoft: "#a8c92e",
      text: "#f0f2f5",
      textSoft: "#9aa3af",
    },
    type: {
      display: "Archivo",
      body: "Inter",
      displayStack: "'Archivo', system-ui, sans-serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap",
    },
    signature: {
      no: "Fartsstreker — en pil som går fra 'skadet' til 'tilbake', med et tall på.",
      en: "Velocity lines — an arrow running from 'injured' to 'back', with a number on it.",
    },
    logoIdea: {
      no: "Blokkbokstaver i kondensert vekt, en elektrisk strek gjennom navnet som et kraftmerke.",
      en: "Block letters in a condensed weight, an electric slash through the name like a power mark.",
    },
  },
  {
    id: "salong",
    codename: "salong",
    name: { no: "Salong", en: "Salon" },
    tagline: {
      no: "Privat, redigert, dyr.",
      en: "Private, editorial, premium.",
    },
    mood: {
      no: "Monokrom med én messing-accent, serif, mye luft. Det føles som en privatklinikk med høy timepris — rolig, selvsikkert, eksklusivt.",
      en: "Monochrome with one brass accent, serif, lots of air. It feels like a private clinic with a high hourly rate — calm, confident, exclusive.",
    },
    palette: {
      bg: "#f7f4ef",
      surface: "#ede7dc",
      accent: "#8b6b3d",
      accentSoft: "#b89968",
      text: "#1f1c18",
      textSoft: "#5c544a",
    },
    type: {
      display: "Playfair Display",
      body: "Inter",
      displayStack: "'Playfair Display', Georgia, serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap",
    },
    signature: {
      no: "Tynne redigeringslinjer — mellom priser, mellom avsnitt — som et magasin med bare én spalte.",
      en: "Thin editorial rules — between prices, between paragraphs — like a single-column magazine.",
    },
    logoIdea: {
      no: "Navnet i en klassisk serif, sentrert, med et lite 'EST.' og årstall i sporing under.",
      en: "The name in a classic serif, centred, with a small 'EST.' and year in tracking beneath.",
    },
  },
  {
    id: "ro",
    codename: "ro",
    name: { no: "Ro", en: "Calm" },
    tagline: {
      no: "Pusterom, gjenoppretting, velvære.",
      en: "Breathing room, recovery, wellness.",
    },
    mood: {
      no: "Salviegrønt, dempet, runde former. Det føles mer som et spa enn en klinikk — for en praksis som snakker om hele mennesket, ikke bare skaden.",
      en: "Sage green, muted, rounded forms. It feels more spa than clinic — for a practice that speaks to the whole person, not just the injury.",
    },
    palette: {
      bg: "#f3f5f1",
      surface: "#e6ebe3",
      accent: "#5b7a5e",
      accentSoft: "#8faa92",
      text: "#2a352c",
      textSoft: "#5e6b60",
    },
    type: {
      display: "Cormorant",
      body: "Inter",
      displayStack: "'Cormorant', Georgia, serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap",
    },
    signature: {
      no: "En pustende sirkel — en myk puls som utvider seg og trekker seg sammen, som et langt pust.",
      en: "A breathing circle — a soft pulse that expands and contracts, like a long breath.",
    },
    logoIdea: {
      no: "En enkel ring med en åpen bue — som en solnedgang eller et pust — over et rolig navn.",
      en: "A simple ring with an open arc — like a sunset or a breath — over a calm wordmark.",
    },
  },
  {
    id: "sving",
    codename: "sving",
    name: { no: "Sving", en: "Motion" },
    tagline: {
      no: "Selvsikker, moderne, i bevegelse.",
      en: "Confident, modern, in motion.",
    },
    mood: {
      no: "Lys, selvsikker, med én farge som dytter. Det føles som en klinikk for folk som forventer en moderne opplevelse — rask booking, tydelig pris, lite tull.",
      en: "Bright, confident, with one colour pushing forward. It feels like a clinic for people who expect a modern experience — quick booking, clear price, little fuss.",
    },
    palette: {
      bg: "#ffffff",
      surface: "#f0eaff",
      accent: "#6c4ee0",
      accentSoft: "#9b85f0",
      text: "#14121f",
      textSoft: "#4a4660",
    },
    type: {
      display: "Space Grotesk",
      body: "Inter",
      displayStack: "'Space Grotesk', system-ui, sans-serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
    },
    signature: {
      no: "En kurvet bevegelsesbane — en bue som svinger gjennom siden og knytter booking til pris.",
      en: "A curved motion path — an arc swinging through the page, linking booking to price.",
    },
    logoIdea: {
      no: "Navnet i en geometrisk grotesk, med en buet strek under som en sving eller en pil.",
      en: "The name in a geometric grotesque, with a curved stroke beneath like a swing or an arrow.",
    },
  },
];

// ════════════════════════════════════════════════════════════════════════════
// STANDALONE DEMO CONTENT
//
// The full Gjøvik Fysioterapi clinic site, built in the chosen Kraft direction
// (concept 03). Dark, electric-lime, condensed Archivo display — a performance
// lab, not a hospital. Bilingual { no, en }.
// ════════════════════════════════════════════════════════════════════════════

export const clinic = {
  name: "Gjøvik Fysioterapi",
  tagline: {
    no: "Tilbake i aksjon.",
    en: "Back in action.",
  } as Localized,
  established: "2014",
  addressLine: {
    no: "Storgata 12, 2815 Gjøvik",
    en: "Storgata 12, 2815 Gjøvik",
  } as Localized,
} as const;

export const nav = {
  booking: { no: "Bestill time", en: "Book" } as Localized,
  treatments: { no: "Behandling", en: "Treatment" } as Localized,
  staff: { no: "Behandlere", en: "Therapists" } as Localized,
  pricing: { no: "Priser", en: "Pricing" } as Localized,
  story: { no: "Klinikken", en: "The clinic" } as Localized,
  contact: { no: "Kontakt", en: "Contact" } as Localized,
} as const;

export const hero = {
  eyebrow: {
    no: "Fysioterapi · Gjøvik · siden 2014",
    en: "Physiotherapy · Gjøvik · since 2014",
  } as Localized,
  cutWord: {
    no: "tilbake",
    en: "back",
  } as Localized,
  subtitle: {
    no: "Vi fikser skaden, ikke unnskyldningen. Manuell terapi, trening og oppfølging — book i dag, kom i morgen.",
    en: "We fix the injury, not the excuse. Manual therapy, training, and follow-up — book today, come tomorrow.",
  } as Localized,
  primaryCta: {
    no: "Bestill time",
    en: "Book a slot",
  } as Localized,
  secondaryCta: {
    no: "Se prisene",
    en: "See pricing",
  } as Localized,
  stat1: { value: "48t", label: { no: "timer uke", en: "slots/week" } as Localized } as const,
  stat2: { value: "1–2", label: { no: "dager til time", en: "days to appointment" } as Localized } as const,
  stat3: { value: "92%", label: { no: "færre smertedager", en: "fewer pain days" } as Localized } as const,
  photo: "/demos/gjovik-fysioterapi/hero.jpg",
} as const;

// ─── Treatments ──────────────────────────────────────────────────────────────

export type Treatment = {
  id: string;
  name: Localized;
  /** Short punchy descriptor. */
  punch: Localized;
  /** One paragraph of what it is. */
  desc: Localized;
  /** Minutes. */
  duration: number;
  /** Price in NOK. */
  price: number;
  /** Whether it's the flagship/signature treatment. */
  flagship?: boolean;
};

export const treatments: Treatment[] = [
  {
    id: "manuell",
    name: { no: "Manuell terapi", en: "Manual therapy" },
    punch: {
      no: "Finn vrien, løs den.",
      en: "Find the twist, release it.",
    },
    desc: {
      no: "En time med hendene på kroppen — ledd, muskler, nerver. Vi finner årsaken, ikke bare smerten. For nakke, rygg, skulder og kjele.",
      en: "An hour of hands-on work — joints, muscles, nerves. We find the cause, not just the pain. For neck, back, shoulder, and jaw.",
    },
    duration: 60,
    price: 850,
    flagship: true,
  },
  {
    id: "idrett",
    name: { no: "Idrettsskade", en: "Sports injury" },
    punch: {
      no: "Tilbake til trening, raskere.",
      en: "Back to training, faster.",
    },
    desc: {
      no: "Diagnose, rehab-program og oppfølging for løpere, fotballspillere og styrkeløftere. Vi bygger deg opp igjen steg for steg — med mål når du er klar, ikke før.",
      en: "Diagnosis, rehab program, and follow-up for runners, footballers, and lifters. We rebuild you step by step — with a goal of when you're ready, not before.",
    },
    duration: 60,
    price: 950,
  },
  {
    id: "undersokelse",
    name: { no: "Førstegangsundersøkelse", en: "First-time assessment" },
    punch: {
      no: "Vi starter her.",
      en: "We start here.",
    },
    desc: {
      no: "En time kartlegging — hva skjedde, hvor gjør det vondt, hva er målet. Du går derfra med en plan, ikke en gjetning.",
      en: "An hour of mapping — what happened, where it hurts, what the goal is. You leave with a plan, not a guess.",
    },
    duration: 60,
    price: 750,
  },
  {
    id: "trening",
    name: { no: "Treningsterapi", en: "Training therapy" },
    punch: {
      no: "Styrke som varer.",
      en: "Strength that lasts.",
    },
    desc: {
      no: "En time i styrkerommet med en behandler. Bygg muskelen som mangler, hold den skaden borte. For deg som vil videre etter skaden er leget.",
      en: "An hour in the strength room with a therapist. Build the muscle that's missing, keep the injury away. For when you want to move past the healed injury.",
    },
    duration: 45,
    price: 700,
  },
];

// ─── Staff ───────────────────────────────────────────────────────────────────

export type Therapist = {
  id: string;
  name: string;
  role: Localized;
  specialty: Localized;
  /** Years of practice. */
  years: number;
  quote: Localized;
  photo: string;
};

export const therapists: Therapist[] = [
  {
    id: "eli",
    name: "Eli Sandberg",
    role: { no: "Klinikkleder, fysioterapeut", en: "Clinic lead, physiotherapist" },
    specialty: {
      no: "Manuell terapi · nakke & kjeve",
      en: "Manual therapy · neck & jaw",
    },
    years: 14,
    quote: {
      no: "Kroppen din vil bevege seg. Jobben min er å fjerne det som holder den tilbake.",
      en: "Your body wants to move. My job is to remove what's holding it back.",
    },
    photo: "/demos/gjovik-fysioterapi/therapist-1.jpg",
  },
  {
    id: "magnus",
    name: "Magnus Holt",
    role: { no: "Fysioterapeut, idrettsfokus", en: "Physiotherapist, sports focus" },
    specialty: {
      no: "Idrettsskader · kne & ankel",
      en: "Sports injuries · knee & ankle",
    },
    years: 9,
    quote: {
      no: "Jeg har vært skadet selv. Jeg vet hvor tregt det føles — og hvor fort det kan snu.",
      en: "I've been injured myself. I know how slow it feels — and how fast it can turn.",
    },
    photo: "/demos/gjovik-fysioterapi/therapist-2.jpg",
  },
  {
    id: "sofia",
    name: "Sofia Lund",
    role: { no: "Fysioterapeut, trening", en: "Physiotherapist, training" },
    specialty: {
      no: "Treningsterapi · rygg & hofte",
      en: "Training therapy · back & hip",
    },
    years: 6,
    quote: {
      no: "Styrke er den beste smertebehandlingen jeg kjenner.",
      en: "Strength is the best pain treatment I know.",
    },
    photo: "/demos/gjovik-fysioterapi/therapist-3.jpg",
  },
];

// ─── Pricing ─────────────────────────────────────────────────────────────────

export type PriceRow = {
  label: Localized;
  note?: Localized;
  price: string;
};

export const priceRows: PriceRow[] = [
  {
    label: { no: "Førstegangsundersøkelse (60 min)", en: "First assessment (60 min)" },
    note: { no: "Påkrevd første gang", en: "Required first visit" },
    price: "750 kr",
  },
  {
    label: { no: "Manuell terapi (60 min)", en: "Manual therapy (60 min)" },
    price: "850 kr",
  },
  {
    label: { no: "Idrettsskade (60 min)", en: "Sports injury (60 min)" },
    price: "950 kr",
  },
  {
    label: { no: "Treningsterapi (45 min)", en: "Training therapy (45 min)" },
    price: "700 kr",
  },
  {
    label: { no: "Oppfølgingstime (30 min)", en: "Follow-up (30 min)" },
    price: "500 kr",
  },
];

export const priceNotes = {
  refund: {
    no: "Fysioterapi hos autorisert behandler gir vanligvis delvis refusjon fra Helfo. Vi registrerer alt for deg.",
    en: "Physiotherapy with an authorised therapist usually gives partial refund from Helfo. We register everything for you.",
  } as Localized,
  vat: {
    no: "Alle priser eks. mva der det gjelder. Betaling med kort, Vipps eller faktura.",
    en: "All prices ex. VAT where applicable. Pay by card, Vipps, or invoice.",
  } as Localized,
} as const;

// ─── Booking slots (for the mock booking flow) ───────────────────────────────

export type BookingDay = {
  /** ISO-ish date label, display only. */
  day: Localized;
  date: string;
  slots: string[];
};

export const bookingDays: BookingDay[] = [
  {
    day: { no: "I dag", en: "Today" },
    date: "29.07",
    slots: ["14:00", "15:30", "17:00"],
  },
  {
    day: { no: "I morgen", en: "Tomorrow" },
    date: "30.07",
    slots: ["09:00", "10:30", "13:00", "15:00"],
  },
  {
    day: { no: "Torsdag", en: "Thursday" },
    date: "31.07",
    slots: ["09:30", "11:00", "14:30", "16:00", "17:30"],
  },
];

// ─── Story / the clinic ──────────────────────────────────────────────────────

export const story = {
  eyebrow: { no: "Klinikken", en: "The clinic" } as Localized,
  title: {
    no: "Et verksted for kroppen.",
    en: "A workshop for the body.",
  } as Localized,
  body: [
    {
      no: "Gjøvik Fysioterapi åpnet i 2014 over bakeriet i Storgata. Tre behandlere, ett mål: få folk tilbake i bevegelse så raskt som mulig — uten oppsalg og uten unnskyldninger.",
      en: "Gjøvik Fysioterapi opened in 2014 above the bakery on Storgata. Three therapists, one goal: get people back in motion as fast as possible — no upselling, no excuses.",
    },
    {
      no: "I dag er vi seks mennesker i et eget lokale med styrkerom, behandlingsrom og en gang sykkel. Vi jobber med idrettslagene i bygda, med sykehuset nedi gata, og med alle som trenger en hånd på kroppen sin.",
      en: "Today we're six people in our own space with a strength room, treatment rooms, and a row of bikes. We work with the town's sports clubs, with the hospital down the street, and with anyone who needs a hand on their body.",
    },
  ] as const,
  stats: [
    { value: "2014", label: { no: "etablert", en: "established" } as Localized },
    { value: "6", label: { no: "behandlere", en: "therapists" } as Localized },
    { value: "4", label: { no: "behandlingsrom", en: "treatment rooms" } as Localized },
  ] as const,
  photo: "/demos/gjovik-fysioterapi/facility.jpg",
} as const;

// ─── Treatment photo (for the treatments section) ────────────────────────────

export const treatmentPhoto = "/demos/gjovik-fysioterapi/treatment.jpg";

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contact = {
  eyebrow: { no: "Kontakt", en: "Contact" } as Localized,
  title: {
    no: "Ring, skriv, eller bare kom innom.",
    en: "Call, write, or just drop in.",
  } as Localized,
  intro: {
    no: "Vi svarer på meldinger samme dagen. Trenger du en time raskt — ring på morgenen, da fyller vi opp ledige avbestillinger.",
    en: "We reply to messages the same day. Need a slot fast — call in the morning, that's when we fill cancellations.",
  } as Localized,
  details: {
    phone: "+47 611 00 00",
    email: "hei@gjovikfysio.no",
    address: {
      no: "Storgata 12, 2815 Gjøvik",
      en: "Storgata 12, 2815 Gjøvik",
    },
    hours: [
      {
        days: { no: "Man–fre", en: "Mon–Fri" },
        time: "07.30 – 18.00",
      },
      {
        days: { no: "Lørdag", en: "Saturday" },
        time: "09.00 – 14.00",
      },
    ],
  },
} as const;

// ─── Footer ──────────────────────────────────────────────────────────────────

export const footer = {
  colophon: {
    no: "Gjøvik Fysioterapi drives av Eli Sandberg og teamet siden 2014. Fiktiv klinikk — en demo.",
    en: "Gjøvik Fysioterapi has been run by Eli Sandberg and the team since 2014. A fictional clinic — a demo.",
  } as Localized,
  backToAaen: {
    no: "Bygget av aaen studios",
    en: "Built by aaen studios",
  } as Localized,
  langSwitch: {
    no: "English",
    en: "Norsk",
  } as Localized,
} as const;

export function langSwitchTarget(current: Locale): Locale {
  return current === "no" ? "en" : "no";
}

// ════════════════════════════════════════════════════════════════════════════
// EXPANDED MULTI-PAGE CONTENT
// ════════════════════════════════════════════════════════════════════════════

// ─── Extra photos ────────────────────────────────────────────────────────────

export const photos = {
  movement: "/demos/gjovik-fysioterapi/movement.jpg",
  running: "/demos/gjovik-fysioterapi/running.jpg",
  manual: "/demos/gjovik-fysioterapi/manual.jpg",
  facilityWide: "/demos/gjovik-fysioterapi/facility-wide.jpg",
} as const;

// ─── Injury / body areas (for the Behandlinger page) ─────────────────────────

export type InjuryArea = {
  id: string;
  name: Localized;
  /** What typically goes wrong here. */
  common: Localized;
  /** How we approach it. */
  approach: Localized;
};

export const injuryAreas: InjuryArea[] = [
  {
    id: "nakke",
    name: { no: "Nakke & kjeve", en: "Neck & jaw" },
    common: {
      no: "Spenningshodepine, nakkesleng, kjeveklemping (bruxisme).",
      en: "Tension headaches, whiplash, jaw clenching (bruxism).",
    },
    approach: {
      no: "Manuell mobilisering av nakke og kjeveledd, avspenningstrening, arbeidsstilling.",
      en: "Manual mobilisation of the neck and jaw joint, relaxation training, work posture.",
    },
  },
  {
    id: "skulder",
    name: { no: "Skulder", en: "Shoulder" },
    common: {
      no: "Impingement, frossen skulder, rotatorcuff, ustabilitet.",
      en: "Impingement, frozen shoulder, rotator cuff, instability.",
    },
    approach: {
      no: "Bevegelseskartlegging, manuell terapi, progressiv skulderstyrke.",
      en: "Movement mapping, manual therapy, progressive shoulder strength.",
    },
  },
  {
    id: "rygg",
    name: { no: "Rygg", en: "Back" },
    common: {
      no: "Lendepine, isjias, diskus, stivhet ved stillesitting.",
      en: "Lower back pain, sciatica, disc issues, stiffness from sitting.",
    },
    approach: {
      no: "Diagnose av årsak, kjernemuskulatur, bevegelsesvaner, smerteforståelse.",
      en: "Diagnosing the cause, core musculature, movement habits, pain understanding.",
    },
  },
  {
    id: "hofte",
    name: { no: "Hofte & lyske", en: "Hip & groin" },
    common: {
      no: "Løperhofte, lyskesmerter, hipslidgikt, begrenset mobilitet.",
      en: "Runner's hip, groin pain, hip osteoarthritis, restricted mobility.",
    },
    approach: {
      no: "Mobilitetstest, belastningsstyring, gradvis tilbake til aktivitet.",
      en: "Mobility testing, load management, graded return to activity.",
    },
  },
  {
    id: "kne",
    name: { no: "Kne", en: "Knee" },
    common: {
      no: "Løperkne, menisk, korsbånd, hopp- og landingsplager.",
      en: "Runner's knee, meniscus, cruciate ligament, jump and landing issues.",
    },
    approach: {
      no: "Belastningsanalyse, knestabilitet, teknikk ved løping og hopp.",
      en: "Load analysis, knee stability, technique in running and jumping.",
    },
  },
  {
    id: "ankel",
    name: { no: "Ankel & fot", en: "Ankle & foot" },
    common: {
      no: "Overtråkk, ilihjeløp, plantarfasciitt, ustabilitet.",
      en: "Sprains, shin splints, plantar fasciitis, instability.",
    },
    approach: {
      no: "Balansetrening, fotstyrke, gradvis belastningsøkning.",
      en: "Balance training, foot strength, graded load increase.",
    },
  },
];

// ─── Detailed treatment approach (how a course of care works) ────────────────

export const approach = {
  eyebrow: { no: "Slik jobber vi", en: "How we work" } as Localized,
  title: {
    no: "Fire steg, ikke fireten.",
    en: "Four steps, not fourteen.",
  } as Localized,
  steps: [
    {
      n: "01",
      title: { no: "Kartlegg", en: "Map" } as Localized,
      body: {
        no: "Vi lytter, tester og finner årsaken — ikke bare hvor det gjør vondt, men hvorfor.",
        en: "We listen, test, and find the cause — not just where it hurts, but why.",
      } as Localized,
    },
    {
      n: "02",
      title: { no: "Behandle", en: "Treat" } as Localized,
      body: {
        no: "Manuell terapi, målrettede teknikker. Du skal merke en endring samme timen.",
        en: "Manual therapy, targeted techniques. You should feel a change in the same session.",
      } as Localized,
    },
    {
      n: "03",
      title: { no: "Bygge", en: "Build" } as Localized,
      body: {
        no: "Et treningsprogram tilpasset deg — styrken som forhindrer at det kommer tilbake.",
        en: "A training program tailored to you — the strength that stops it coming back.",
      } as Localized,
    },
    {
      n: "04",
      title: { no: "Tilbake", en: "Return" } as Localized,
      body: {
        no: "Tydelige mål for når du er klar. Vi følger deg til du er i bevegelse igjen.",
        en: "Clear goals for when you're ready. We follow you until you're in motion again.",
      } as Localized,
    },
  ] as const,
} as const;

// ─── Full team bios (for the Behandlere page) ────────────────────────────────

export type TherapistBio = {
  id: string;
  name: string;
  role: Localized;
  specialty: Localized;
  years: number;
  quote: Localized;
  bio: Localized;
  /** Credentials/education lines. */
  creds: Localized[];
  photo: string;
};

export const team: TherapistBio[] = [
  {
    id: "eli",
    name: "Eli Sandberg",
    role: { no: "Klinikkleder, fysioterapeut", en: "Clinic lead, physiotherapist" },
    specialty: {
      no: "Manuell terapi · nakke & kjeve",
      en: "Manual therapy · neck & jaw",
    },
    years: 14,
    quote: {
      no: "Kroppen din vil bevege seg. Jobben min er å fjerne det som holder den tilbake.",
      en: "Your body wants to move. My job is to remove what's holding it back.",
    },
    bio: {
      no: "Eli grunnla klinikken i 2014 etter år på sykehuset. Hun spesialiserte seg på nakke og kjeve fordi det er der folk sliter mest — og hvor riktig behandling gir raskest resultat. I dag leder hun teamet og behandler fortsatt to dager i uken.",
      en: "Eli founded the clinic in 2014 after years at the hospital. She specialised in neck and jaw because that's where people struggle most — and where the right treatment gives the fastest result. Today she leads the team and still treats patients two days a week.",
    },
    creds: [
      { no: "Master i fysioterapi, NTNU", en: "MSc Physiotherapy, NTNU" },
      { no: "Videreutdanning manuell terapi (OMT)", en: "Postgrad manual therapy (OMT)" },
      { no: "Kjeve- og nakkespesialisering", en: "Jaw and neck specialisation" },
    ],
    photo: "/demos/gjovik-fysioterapi/therapist-1.jpg",
  },
  {
    id: "magnus",
    name: "Magnus Holt",
    role: { no: "Fysioterapeut, idrettsfokus", en: "Physiotherapist, sports focus" },
    specialty: {
      no: "Idrettsskader · kne & ankel",
      en: "Sports injuries · knee & ankle",
    },
    years: 9,
    quote: {
      no: "Jeg har vært skadet selv. Jeg vet hvor tregt det føles — og hvor fort det kan snu.",
      en: "I've been injured myself. I know how slow it feels — and how fast it can turn.",
    },
    bio: {
      no: "Magnus kom til klinikken fra et idrettslag i Oslo. Han har selv vært gjennom to korsbåndsoperasjoner og vet hvordan rehabvirksomheten bør føles — og hvor fort den kan gå når den gjøres riktig. Han jobber med byens fotball- og håndballag.",
      en: "Magnus came to the clinic from a sports club in Oslo. He's been through two cruciate ligament surgeries himself and knows how rehab should feel — and how fast it can go when done right. He works with the city's football and handball teams.",
    },
    creds: [
      { no: "Bachelor i fysioterapi, HINN", en: "BSc Physiotherapy, HINN" },
      { no: "Sertifisert løpeanalyse", en: "Certified running analysis" },
      { no: "Idrettsmedisin (vol. I–II)", en: "Sports medicine (vol. I–II)" },
    ],
    photo: "/demos/gjovik-fysioterapi/therapist-2.jpg",
  },
  {
    id: "sofia",
    name: "Sofia Lund",
    role: { no: "Fysioterapeut, trening", en: "Physiotherapist, training" },
    specialty: {
      no: "Treningsterapi · rygg & hofte",
      en: "Training therapy · back & hip",
    },
    years: 6,
    quote: {
      no: "Styrke er den beste smertebehandlingen jeg kjenner.",
      en: "Strength is the best pain treatment I know.",
    },
    bio: {
      no: "Sofia tror på styrke fremfor bare massasje. Hun bygger treningsprogrammer for folk som vil ta eierskap i sin egen rehab — enten det er en løper som skal tilbake, eller noen som aldri har løftet før. Hun leder styrkerommet på klinikken.",
      en: "Sofia believes in strength over just massage. She builds training programs for people who want to own their rehab — whether a runner returning, or someone who has never lifted before. She runs the clinic's strength room.",
    },
    creds: [
      { no: "Bachelor i fysioterapi, HINN", en: "BSc Physiotherapy, HINN" },
      { no: "Styrke- og kondisjonsinstruktør", en: "Strength & conditioning instructor" },
      { no: "Klinisk treningsterapi (MedBridge)", en: "Clinical training therapy (MedBridge)" },
    ],
    photo: "/demos/gjovik-fysioterapi/therapist-3.jpg",
  },
];

// ─── Knowledge articles (for the Kunnskap page) ──────────────────────────────

export type Article = {
  slug: string;
  title: Localized;
  /** Reading time in minutes. */
  readMins: number;
  category: Localized;
  excerpt: Localized;
  photo: string;
};

export const articles: Article[] = [
  {
    slug: "løpeturen-etter-skaden",
    title: {
      no: "Når kan du løpe igjen etter en skade?",
      en: "When can you run again after an injury?",
    },
    readMins: 5,
    category: { no: "Løping", en: "Running" },
    excerpt: {
      no: "Det finnes et bedre spørsmål enn 'når'. Her er hvordan vi vurderer om kroppen er klar til å ta imot belastningen.",
      en: "There's a better question than 'when'. Here's how we judge whether your body is ready to take the load.",
    },
    photo: "/demos/gjovik-fysioterapi/running.jpg",
  },
  {
    slug: "styrke-for-smerte",
    title: {
      no: "Hvorfor styrke er bedre enn massasje for ryggen",
      en: "Why strength beats massage for your back",
    },
    readMins: 4,
    category: { no: "Rygg", en: "Back" },
    excerpt: {
      no: "Massasje føles bra i timen. Styrke føles bra i tiåret etterpå. Slik tenker vi om ryggbehandling.",
      en: "Massage feels good in the session. Strength feels good for the decade after. Here's how we think about back care.",
    },
    photo: "/demos/gjovik-fysioterapi/movement.jpg",
  },
  {
    slug: "skulder-impingement",
    title: {
      no: "Skulderimpingement: hva det er og hva som hjelper",
      en: "Shoulder impingement: what it is and what helps",
    },
    readMins: 6,
    category: { no: "Skulder", en: "Shoulder" },
    excerpt: {
      no: "Smerten når du løfter armen over skulderen er sjelden selve problemet. Her er årsaken — og øvelsene som virker.",
      en: "The pain when you lift your arm above the shoulder is rarely the actual problem. Here's the cause — and the exercises that work.",
    },
    photo: "/demos/gjovik-fysioterapi/manual.jpg",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export type FaqItem = {
  q: Localized;
  a: Localized;
};

export const faq: FaqItem[] = [
  {
    q: { no: "Trenger jeg en henvisning?", en: "Do I need a referral?" },
    a: {
      no: "Nei. Du kan bestille time direkte. Har du rett til fysioterapi via fastlegen, registrerer vi det automatisk.",
      en: "No. You can book directly. If you're entitled to physiotherapy through your GP, we register it automatically.",
    },
  },
  {
    q: { no: "Får jeg refusjon fra Helfo?", en: "Will I get a Helfo refund?" },
    a: {
      no: "Ved kroniske plikter og autorisert behandler får de fleste delvis refusjon. Vi hjelper deg med papirene — du trenger ikke å tenke på det.",
      en: "For chronic conditions with an authorised therapist, most people get partial refund. We handle the paperwork — you don't need to think about it.",
    },
  },
  {
    q: {
      no: "Hva bør jeg ha på meg?",
      en: "What should I wear?",
    },
    a: {
      no: "Treningstøy du kan bevege deg i. Vi tester bevegelse, ikke bare palperer — så løse klær er bedre enn stramme.",
      en: "Workout clothes you can move in. We test movement, not just palpate — so loose is better than tight.",
    },
  },
  {
    q: {
      no: "Hvor lang tid tar en time?",
      en: "How long is a session?",
    },
    a: {
      no: "Førstegangsundersøkelse og standard timer er 60 minutter. Oppfølging kan være 30 eller 45. Vi tar aldri inn flere samtidig — din tid er din.",
      en: "First assessments and standard sessions are 60 minutes. Follow-ups can be 30 or 45. We never double-book — your time is yours.",
    },
  },
  {
    q: {
      no: "Kan jeg komme samme uke?",
      en: "Can I come this week?",
    },
    a: {
      no: "Som regel ja. Har du akutte plager, ring morgenen — vi fyller avbestillinger først. Ellers book på nett, ofte har vi tid innen 1–2 dager.",
      en: "Usually yes. For acute issues, call in the morning — we fill cancellations first. Otherwise book online, we often have a slot within 1–2 days.",
    },
  },
];

// ─── Page meta (eyebrows + titles for the sub-pages) ─────────────────────────

export const pageMeta = {
  behandlinger: {
    eyebrow: { no: "Behandlinger", en: "Treatments" } as Localized,
    title: {
      no: "Alt vi gjør, ett sted.",
      en: "Everything we do, in one place.",
    } as Localized,
  },
  behandlere: {
    eyebrow: { no: "Behandlerne", en: "The therapists" } as Localized,
    title: {
      no: "Menneskene som fikser deg.",
      en: "The people who'll fix you.",
    } as Localized,
  },
  kunnskap: {
    eyebrow: { no: "Kunnskap", en: "Knowledge" } as Localized,
    title: {
      no: "Vit det selv. Ikke vent på oss.",
      en: "Know it yourself. Don't wait for us.",
    } as Localized,
  },
  kontakt: {
    eyebrow: { no: "Kontakt", en: "Contact" } as Localized,
    title: {
      no: "Vi er her. Kom nærmere.",
      en: "We're here. Come closer.",
    } as Localized,
  },
} as const;


