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

/** One calm recovery arc card (Lindrig dashboard). */
export type RecoveryArc = {
  /** 0–100 fill for the ring. 0 means "full ring, show ringText instead". */
  pct: number;
  /** Shown inside the ring when pct is 0 (e.g. "1–2"). */
  ringText?: string;
  headline: Localized;
  body: Localized;
};

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

// ════════════════════════════════════════════════════════════════════════════
// THE DASHBOARD — live-feeling performance-lab telemetry.
//
// Mock data shown in the MetricsDashboard widget. It's a demo, so the numbers
// are static (the *animation* of them is what sells the performance-lab feel),
// but they're written to feel plausible for a real clinic.
// ════════════════════════════════════════════════════════════════════════════

export const dashboard = {
  eyebrow: { no: "Live", en: "Live" } as Localized,
  title: {
    no: "Klinikken, akkurat nå.",
    en: "The clinic, right now.",
  } as Localized,
  intro: {
    no: "Dette er hvordan en travel praksis ser ut fra innsiden — kapasitet, ventetid, og hvor raskt folk kommer seg tilbake.",
    en: "This is what a busy practice looks like from the inside — capacity, wait time, and how fast people get back to action.",
  } as Localized,

  /** The three calm recovery arcs (replaces the old telemetry panels). */
  arcs: [
    {
      pct: 92,
      ringText: undefined,
      headline: { no: "Færre smertedager", en: "Fewer pain days" },
      body: {
        no: "etter åtte uker med oppfølging, rapportert av pasientene våre.",
        en: "after eight weeks of follow-up, reported by our patients.",
      },
    },
    {
      // Non-numeric headline shown inside the ring instead of a %.
      pct: 0,
      ringText: "1–2",
      headline: { no: "Dager til time", en: "Days to appointment" },
      body: {
        no: "vi holder ventetiden kort, slik at du slipper å leve med smerten.",
        en: "we keep wait times short, so you don't live with the pain.",
      },
    },
    {
      pct: 85,
      ringText: undefined,
      headline: { no: "Følger opp hele veien", en: "Followed all the way" },
      body: {
        no: "av pasientene fullfører programmet — ingen står alene i rehaben.",
        en: "of patients finish the programme — no one rehabs alone.",
      },
    },
  ] satisfies RecoveryArc[],

  // Recovery / mobility — ties to the "tilbake i aksjon" tagline.
  recovery: {
    label: { no: "Tilbake til aktivitet", en: "Back to activity" } as Localized,
    /** Median weeks from first visit to return-to-sport/work. */
    medianWeeks: 7,
    /** Mobility progress per body area, 0–100. */
    areas: [
      { area: { no: "Kne", en: "Knee" } as Localized, pct: 86 },
      { area: { no: "Skulder", en: "Shoulder" } as Localized, pct: 72 },
      { area: { no: "Rygg", en: "Back" } as Localized, pct: 64 },
      { area: { no: "Hofte", en: "Hip" } as Localized, pct: 91 },
    ] as { area: Localized; pct: number }[],
  },

  // Live clinic operations — real-time-feeling capacity.
  ops: {
    label: { no: "Drift i dag", en: "Operations today" } as Localized,
    onShift: 4, // therapists in today
    slotsLeft: 11, // open slots today
    avgWaitMins: 38, // average wait for next available
    treatmentsThisWeek: 146,
  },

  // Outcome / performance stats — social proof as data.
  outcomes: {
    label: { no: "Resultater", en: "Outcomes" } as Localized,
    satisfaction: 97, // % would recommend
    avgSessions: 5.4, // avg sessions to discharge
    successRate: 94, // % return to full activity
  },

  // Personal assessment — interactive Q flow feeding a result.
  assessment: {
    label: { no: "Din sjekk", en: "Your check" } as Localized,
    intro: {
      no: "Tre spørsmål — se et estimat av hvor lang tid tilbake du er.",
      en: "Three questions — see an estimate of how far back you are.",
    } as Localized,
    /** Each question maps answers to a 0–3 recovery-score contribution. */
    questions: [
      {
        id: "pain",
        q: { no: "Hvor vondt har du i hvile?", en: "How much pain at rest?" } as Localized,
        options: [
          { label: { no: "Ingen", en: "None" } as Localized, score: 3 },
          { label: { no: "Litt", en: "A little" } as Localized, score: 2 },
          { label: { no: "Mye", en: "A lot" } as Localized, score: 1 },
          { label: { no: "Uutholdelig", en: "Unbearable" } as Localized, score: 0 },
        ],
      },
      {
        id: "movement",
        q: { no: "Kan du bevege deg som før?", en: "Can you move like before?" } as Localized,
        options: [
          { label: { no: "Ja, fullt", en: "Yes, fully" } as Localized, score: 3 },
          { label: { no: "Stort sett", en: "Mostly" } as Localized, score: 2 },
          { label: { no: "Knapt", en: "Barely" } as Localized, score: 1 },
          { label: { no: "Nei", en: "No" } as Localized, score: 0 },
        ],
      },
      {
        id: "activity",
        q: { no: "Er du tilbake i aktivitet?", en: "Back to your activity?" } as Localized,
        options: [
          { label: { no: "Ja", en: "Yes" } as Localized, score: 3 },
          { label: { no: "Delvis", en: "Partly" } as Localized, score: 2 },
          { label: { no: "Ikke ennå", en: "Not yet" } as Localized, score: 1 },
          { label: { no: "Nei", en: "No" } as Localized, score: 0 },
        ],
      },
    ] as {
      id: string;
      q: Localized;
      options: { label: Localized; score: number }[];
    }[],
    /** Result bands keyed by total score (0–9). */
    results: [
      {
        min: 8,
        weeksEstimate: "2–4",
        verdict: {
          no: "Du er nesten i mål — finjustering holder.",
          en: "You're nearly there — fine-tuning is enough.",
        } as Localized,
      },
      {
        min: 5,
        weeksEstimate: "4–8",
        verdict: {
          no: "På god vei. Målrettet trening gjør resten.",
          en: "Well on your way. Targeted training does the rest.",
        } as Localized,
      },
      {
        min: 2,
        weeksEstimate: "8–12",
        verdict: {
          no: "Tid å bygge grunnmur. Vi begynner rolig.",
          en: "Time to build the foundation. We start gentle.",
        } as Localized,
      },
      {
        min: 0,
        weeksEstimate: "12+",
        verdict: {
          no: "Start her. Første time kartlegger alt.",
          en: "Start here. The first session maps everything.",
        } as Localized,
      },
    ] as { min: number; weeksEstimate: string; verdict: Localized }[],
  },
} as const;


