/**
 * Strand Treverk — content for the standalone carpentry demo (concept 02 "Verksted").
 *
 * This is a *fictional client site*. It mirrors how /demos/fjell-brekkestue is
 * built: a self-contained site that lives OUTSIDE the [locale] segment so the
 * host aaen header/footer don't wrap it. Language is handled via a ?lang=no|en
 * search param (default no). No next-intl dependency.
 *
 * The "Verksted" (workshop) direction: the site reads like a carpenter's
 * working drawing — kraft-paper ground, graphite text, IBM Plex Mono captions,
 * dimension-line annotations drawn straight into the layout, and one
 * burnt-orange accent (like a red pencil mark on a plan).
 *
 * Norwegian is the primary voice (it's a Norwegian carpenter); English is a
 * plainer second language. The carpenter and projects are fictional.
 */

export type Locale = "no" | "en";

export type Localized = Record<Locale, string>;

export function tx(value: Localized, locale: Locale): string {
  return value[locale] ?? value.no;
}

export const business = {
  name: "Strand Treverk",
  tagline: {
    no: "Snekkerarbeid fra kysten.",
    en: "Carpentry from the coast.",
  } as Localized,
  established: "2004",
  place: { no: "Stavern", en: "Stavern" },
} as const;

export const nav = {
  services: { no: "Tjenester", en: "Services" } as Localized,
  work: { no: "Prosjekter", en: "Work" } as Localized,
  process: { no: "Prosessen", en: "Process" } as Localized,
  about: { no: "Om meg", en: "About" } as Localized,
  contact: { no: "Kontakt", en: "Contact" } as Localized,
} as const;

/**
 * Sections tracked by the left-edge scroll ruler. Each gets a "measurement"
 * label like a drawing's revision index. Keys must match section `id`s on the
 * page; `ruler` is the short mono tag shown on the rule.
 */
export const rulerSections = [
  { id: "top", ruler: { no: "00 HERO", en: "00 HERO" } as Localized },
  { id: "tjenester", ruler: { no: "01 TJENESTER", en: "01 SERVICES" } as Localized },
  { id: "materialer", ruler: { no: "02 MATERIALER", en: "02 MATERIALS" } as Localized },
  { id: "prosjekter", ruler: { no: "03 PROSJEKTER", en: "03 WORK" } as Localized },
  { id: "prosessen", ruler: { no: "04 PROSESSEN", en: "04 PROCESS" } as Localized },
  { id: "om-meg", ruler: { no: "05 OM MEG", en: "05 ABOUT" } as Localized },
  { id: "kontakt", ruler: { no: "06 KONTAKT", en: "06 CONTACT" } as Localized },
] as const;

export const hero = {
  eyebrow: {
    no: "Snekker · fra 2004",
    en: "Carpenter · since 2004",
  } as Localized,
  title: "Strand Treverk",
  // The dimension annotated onto the hero photo (the signature element).
  cutWord: {
    no: "håndverk",
    en: "craft",
  } as Localized,
  // The technical title-block sidebar — reads like a drawing sheet's title
  // block: what it is, at what scale, drawn by whom, dated.
  titleBlock: {
    sheet: { no: "ARK 01 · PORTFØLJE", en: "SHEET 01 · PORTFOLIO" } as Localized,
    scale: { no: "Skala 1:50", en: "Scale 1:50" } as Localized,
    drawn: { no: "Tegnet av E. Strand", en: "Drawn by E. Strand" } as Localized,
    checked: { no: "Kontrollert: –", en: "Checked: –" } as Localized,
    date: "2024",
  } as const,
  subtitle: {
    no: "Tilpasset snekkerarbeid fra verkstedet ved sjøen. Kabinett, trapper, uterom og hele hytter — tegnet, bygget og montert av én person.",
    en: "Bespoke carpentry from the workshop by the sea. Cabinets, staircases, outdoor spaces and whole cabins — drawn, built, and fitted by one pair of hands.",
  } as Localized,
  primaryCta: {
    no: "Se prosjektene",
    en: "See the work",
  } as Localized,
  secondaryCta: {
    no: "Be om tilbud",
    en: "Request a quote",
  } as Localized,
  // Stats shown as dimension callouts under the hero (the workshop signature).
  stats: [
    {
      value: "20",
      label: { no: "år med treverk", en: "years in timber" } as Localized,
    },
    {
      value: "180+",
      label: { no: "prosjekter levert", en: "projects delivered" } as Localized,
    },
    {
      value: "1",
      label: { no: "snekker, alt hånd", en: "carpenter, all by hand" } as Localized,
    },
  ] as const,
  photo: "/demos/strand-treverk/hero-workshop.jpg",
} as const;

export type Service = {
  id: string;
  title: Localized;
  desc: Localized;
  /** A short "spec" line, like a callout on a drawing. */
  spec: Localized;
};

export const services: Service[] = [
  {
    id: "interior",
    title: { no: "Interiør & Joiné", en: "Interior & Joinery" },
    desc: {
      no: "Kjøkken, innebygde skap, trapper og panel. Alt tilpasset rommet — ikke katalogen.",
      en: "Kitchens, built-ins, staircases and panelling. Everything fitted to the room — not the catalogue.",
    },
    spec: { no: "eik · ask · furu", en: "oak · ash · pine" },
  },
  {
    id: "outdoor",
    title: { no: "Ute & Treverk", en: "Outdoor & Timber" },
    desc: {
      no: "Dekk, brygge, trapper og uteområder bygget for salt luft og kystvær.",
      en: "Decks, piers, stairs and outdoor spaces built for salt air and coastal weather.",
    },
    spec: { no: "trykkimpregnert · sibirsk lerk", en: "pressure-treated · siberian larch" },
  },
  {
    id: "cabin",
    title: { no: "Hytte & Struktur", en: "Cabin & Structure" },
    desc: {
      no: "Hele hytter, tilbygg og bærevegger. Fra grunnmur til never — jeg bygger skallet også.",
      en: "Whole cabins, extensions and load-bearing frames. From foundation to ridge — I build the shell too.",
    },
    spec: { no: "tomt · plan · montert", en: "plot · plan · assembled" },
  },
  {
    id: "repair",
    title: { no: "Reparasjon & Vedlikehold", en: "Repair & Maintenance" },
    desc: {
      no: "Gamle vinduer, råteskader og ting andre har gitt opp. Ofte det mest lønnsomme.",
      en: "Old windows, rot damage, and the things others gave up on. Often the most worthwhile.",
    },
    spec: { no: "vedlikehold · restaurering", en: "maintenance · restoration" },
  },
];

export type Project = {
  id: string;
  title: Localized;
  category: Localized;
  /** Where it is — adds specificity. */
  place: Localized;
  year: string;
  /** Short description for the card. */
  blurb: Localized;
  /** A dimension-like spec line. */
  spec: Localized;
  photo: string;
  /** "signature" highlights the lead project. */
  signature?: boolean;
  /**
   * Case-study spec sheet — shown in the sticky sidebar of the reader.
   * All optional so projects can carry as much or as little detail as fits.
   */
  specs?: {
    species: Localized;
    finish: Localized;
    joinery: Localized;
    dimensions: Localized;
    duration: Localized;
  };
  /** Scroll-driven annotations layered over the photo (dimension notes). */
  annotations?: {
    /** Value shown in the callout box. */
    value: string;
    /** Short mono label under the value. */
    label: Localized;
    /** Position over the photo, as % from left/top. */
    left: string;
    top: string;
  }[];
};

export const projects: Project[] = [
  {
    id: "stavern-cabin",
    title: { no: "Hytte ved sjøen", en: "Cabin by the sea" },
    category: { no: "Hytte & Struktur", en: "Cabin & Structure" },
    place: { no: "Stavern", en: "Stavern" },
    year: "2023",
    blurb: {
      no: "Hel hytte i sibirsk lerk, bygget på svaberg med utsikt til skjærgården.",
      en: "A whole cabin in siberian larch, built on coastal rock with a view of the skerries.",
    },
    spec: { no: "92 m² · lerk · 2023", en: "92 m² · larch · 2023" },
    photo: "/demos/strand-treverk/project-cabin.jpg",
    signature: true,
    specs: {
      species: { no: "Sibirsk lerk", en: "Siberian larch" },
      finish: { no: "Rå, ubehandlet — patinerer i sjøluft", en: "Raw, untreated — weathers in sea air" },
      joinery: { no: "Fjørledd + tappskjøter", en: "Splined + mortise-and-tenon" },
      dimensions: { no: "92 m² grunnflate · 4,2 m takhøyde", en: "92 m² footprint · 4.2 m ceiling" },
      duration: { no: "11 måneder (høst–høst)", en: "11 months (autumn–autumn)" },
    },
    annotations: [
      {
        value: "4,2 m",
        label: { no: "tak til bjelke", en: "ridge to beam" },
        left: "72%",
        top: "30%",
      },
      {
        value: "92 m²",
        label: { no: "grunnflate", en: "footprint" },
        left: "32%",
        top: "68%",
      },
    ],
  },
  {
    id: "hummer-kitchen",
    title: { no: "Kjøkken i eik", en: "Oak kitchen" },
    category: { no: "Interiør & Joiné", en: "Interior & Joinery" },
    place: { no: "Helgeroa", en: "Helgeroa" },
    year: "2024",
    blurb: {
      no: "Innebygd kjøkken i massiv eik med smijerns-detaljer og skjult hvitevare.",
      en: "Built-in kitchen in solid oak with iron details and integrated appliances.",
    },
    spec: { no: "massiv eik · 14 løpmetre", en: "solid oak · 14 linear metres" },
    photo: "/demos/strand-treverk/project-kitchen.jpg",
    signature: true,
    specs: {
      species: { no: "Massiv eik (FSC)", en: "Solid oak (FSC)" },
      finish: { no: "Leddbeiset, to strøk olje", en: "Joint-stained, two coats of oil" },
      joinery: { no: "Svanshals (dovetail) + tapp", en: "Dovetail + mortise-and-tenon" },
      dimensions: { no: "14 løpmetre · 38 mm arbeidsplate", en: "14 linear m · 38 mm worktop" },
      duration: { no: "9 uker i verkstedet", en: "9 weeks in the workshop" },
    },
    annotations: [
      {
        value: "14 lm",
        label: { no: "løpmetre skap", en: "linear metres" },
        left: "26%",
        top: "55%",
      },
      {
        value: "38 mm",
        label: { no: "arbeidsplate", en: "worktop" },
        left: "68%",
        top: "44%",
      },
    ],
  },
  {
    id: "lofoten-stair",
    title: { no: "Trapp i ask", en: "Ash staircase" },
    category: { no: "Interiør & Joiné", en: "Interior & Joinery" },
    place: { no: "Nevlunghavn", en: "Nevlunghavn" },
    year: "2024",
    blurb: {
      no: "Svingtrapp i ask med sveisede stålrekkverk, bygget mot en hyllevegg.",
      en: "A curved ash staircase with welded steel railings, built against a shelving wall.",
    },
    spec: { no: "ask · 17 trinn", en: "ash · 17 treads" },
    photo: "/demos/strand-treverk/project-stair.jpg",
    signature: true,
    specs: {
      species: { no: "Ask (lamellert for bue)", en: "Ash (veneered for the curve)" },
      finish: { no: "Såpebehandlet — lyser med tiden", en: "Soap-finished — lightens with age" },
      joinery: { no: "Limt tapp + stålklemmer", en: "Glued tenon + steel brackets" },
      dimensions: { no: "17 trinn · 3,6 m stigehøyde", en: "17 treads · 3.6 m rise" },
      duration: { no: "6 uker + 3 dager montering", en: "6 weeks + 3 days assembly" },
    },
    annotations: [
      {
        value: "17",
        label: { no: "trinn totalt", en: "treads total" },
        left: "58%",
        top: "40%",
      },
      {
        value: "3,6 m",
        label: { no: "stigehøyde", en: "total rise" },
        left: "30%",
        top: "62%",
      },
    ],
  },
];

export const detail = {
  eyebrow: { no: "Materialer", en: "Materials" } as Localized,
  title: {
    no: "Treet gjør jobben. Jeg bare lytter.",
    en: "The wood does the work. I just listen.",
  } as Localized,
  body: {
    no: "Jeg jobber mest med furu, eik, ask og lerk — trevirke som trives på kysten. Hver planke får ligge og akklimatisere seg i verkstedet før jeg setter sag i den. Det tar tid, men det er grunnen til at ting ikke spenner seg etter et år.",
    en: "I work mostly with pine, oak, ash and larch — timbers that thrive on the coast. Every plank sits and acclimatises in the workshop before I put a saw to it. It takes time, but it's why nothing warps after a year.",
  } as Localized,
  photo: "/demos/strand-treverk/detail-grain.jpg",
} as const;

export const process = {
  eyebrow: { no: "Prosessen", en: "Process" } as Localized,
  title: {
    no: "Fire streker på papiret, fire måneder i verkstedet.",
    en: "Four lines on paper, four months in the shop.",
  } as Localized,
  steps: [
    {
      no: "Oppmåling og skisser på stedet. Jeg tegner for hånd, i blyant — du ser hva du får før vi starter.",
      en: "Measuring and sketches on site. I draw by hand, in pencil — you see what you're getting before we start.",
    },
    {
      no: "Tilbud med materialvalg, tidsramme og pris. Ingen overraskelser halvveis.",
      en: "A quote with material choices, timeline, and price. No surprises halfway through.",
    },
    {
      no: "Bygging i verkstedet. Du får bilder underveis — dette er den synlige delen av håndverket.",
      en: "Building in the workshop. You get photos along the way — this is the visible part of the craft.",
    },
    {
      no: "Montering og sluttføring hos deg. Jeg rydder, pussen, og går gjennom alt sammen med deg.",
      en: "Assembly and finishing on site. I clean up, do the final pass, and walk through everything with you.",
    },
  ] as const,
} as const;

export const story = {
  eyebrow: { no: "Om meg", en: "About" } as Localized,
  title: {
    no: "Lærte faget av en gammel båtbygger.",
    en: "I learned the trade from an old boatbuilder.",
  } as Localized,
  body: [
    {
      no: "Jeg begynte i lære hos Tore på Nevlunghavn i 2001. Han bygde robåter — ikke for penger, men fordi ingen andre husket hvordan. Fra ham lærte jeg at treverk har en retning, en vilje, og at jobben er å spenne med, ikke imot.",
      en: "I started apprenticing with Tore in Nevlunghavn in 2001. He built boats — not for money, but because no one else remembered how. From him I learned that timber has a direction, a will, and that the job is to work with it, not against it.",
    },
    {
      no: "I 2004 startet jeg for meg selv. Verkstedet ligger nede ved sjøen, dels fordi det var der Tore hadde sitt, og dels fordi saltet i luften minner meg på å gjøre ting som holder. Jeg jobber alene — én kunde om gangen, ett prosjekt om gangen.",
      en: "In 2004 I went out on my own. The workshop sits down by the water, partly because that's where Tore had his, and partly because the salt in the air reminds me to build things that last. I work alone — one client at a time, one project at a time.",
    },
  ] as const,
  person: {
    name: "Eivind Strand",
    role: { no: "Snekker, innehaver", en: "Carpenter, owner" },
    quote: {
      no: "Jeg tar på meg maks fire store prosjekter i året. Det er grunnen til at de holder.",
      en: "I take on four big projects a year, at most. That's why they last.",
    },
  },
  photo: "/demos/strand-treverk/portrait.jpg",
} as const;

export const contact = {
  eyebrow: { no: "Kontakt", en: "Contact" } as Localized,
  title: {
    no: "Har du et prosjekt i tankene?",
    en: "Got a project in mind?",
  } as Localized,
  intro: {
    no: "Send en kort beskrivelse så ringer jeg deg tilbake innen to virkedager. Jeg tar oppdrag langs hele kysten fra Larvik til Risør.",
    en: "Send a short description and I'll call you back within two working days. I take work along the whole coast from Larvik to Risør.",
  } as Localized,
  form: {
    nameLabel: { no: "Navn", en: "Name" } as Localized,
    namePlaceholder: { no: "Ditt navn", en: "Your name" } as Localized,
    emailLabel: { no: "E-post", en: "Email" } as Localized,
    emailPlaceholder: { no: "deg@epost.no", en: "you@email.com" } as Localized,
    projectTypeLabel: { no: "Prosjekttype", en: "Project type" } as Localized,
    projectTypes: [
      { value: "interior", label: { no: "Interiør & joiné", en: "Interior & joinery" } as Localized },
      { value: "outdoor", label: { no: "Ute & treverk", en: "Outdoor & timber" } as Localized },
      { value: "cabin", label: { no: "Hytte & struktur", en: "Cabin & structure" } as Localized },
      { value: "repair", label: { no: "Reparasjon", en: "Repair" } as Localized },
      { value: "other", label: { no: "Annet", en: "Other" } as Localized },
    ] as const,
    messageLabel: { no: "Beskrivelse", en: "Description" } as Localized,
    messagePlaceholder: {
      no: "Fortell kort om prosjektet — hva, hvor, og gjerne når du gjerne skulle ha det ferdig.",
      en: "Tell me briefly about the project — what, where, and ideally when you'd like it finished.",
    } as Localized,
    submit: { no: "Send forespørsel", en: "Send enquiry" } as Localized,
    submitting: { no: "Sender…", en: "Sending…" } as Localized,
    success: {
      no: "Takk! Jeg ringer deg tilbake innen to virkedager.",
      en: "Thanks! I'll call you back within two working days.",
    } as Localized,
    error: {
      no: "Noe gikk galt. Prøv igjen, eller ring meg direkte.",
      en: "Something went wrong. Try again, or call me directly.",
    } as Localized,
  },
  details: {
    email: "post@strandtreverk.no",
    phone: "+47 900 00 001",
    address: { no: "Strandveien 4, 3290 Stavern", en: "Strandveien 4, 3290 Stavern" },
    hours: {
      no: "Mandag–fredag 07–16. Verkstedet er på Svenner-veien, ned mot sjøen.",
      en: "Monday–Friday 07–16. The workshop is on Svenner-veien, down by the water.",
    } as Localized,
  },
} as const;

export const footer = {
  colophon: {
    no: "Strand Treverk drives av Eivind Strand fra verkstedet ved sjøen i Stavern. Fiktiv snekker — en demo.",
    en: "Strand Treverk is run by Eivind Strand from the workshop by the sea in Stavern. A fictional carpenter — a demo.",
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

