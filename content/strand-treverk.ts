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

// ============================================================================
// CONCEPT-PICKER DATA
// Used by the /strand-treverk concept-picker page (app/[locale]/strand-treverk)
// and its ConceptCard. This is the six design directions the client picks from
// before the standalone site (above) is built. Kept in this same module so both
// the picker and the built site share one source of truth for the brand.
// ============================================================================

export const brief = {
  client: {
    name: "Strand Treverk",
    kind: { no: "Fiktiv kystsnekker", en: "Fictional coastal carpenter" } as Localized,
  },
  location: {
    place: { no: "Sør for Larvik", en: "South of Larvik" } as Localized,
    detail: {
      no: "Skjærgården, verksted ved sjøen",
      en: "The skerries, workshop by the sea",
    } as Localized,
  },
  needs: {
    headline: { no: "Portefølje & kontaktskjema", en: "Portfolio & contact form" } as Localized,
    detail: {
      no: "Vise prosjektene, ta imot forespørsler",
      en: "Show the projects, take enquiries",
    } as Localized,
  },
  feel: {
    headline: { no: "Håndverk, ikke brosjyre", en: "Craft, not a brochure" } as Localized,
    detail: {
      no: "Treet og sjøen skal kjennes i sidens første sekund",
      en: "Timber and sea should be felt in the first second of the site",
    } as Localized,
  },
} as const;

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
  id: "drage" | "verksted" | "tre" | "havn" | "joiner" | "skogsjø";
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
    id: "drage",
    codename: "drage",
    name: { no: "Drifttomt", en: "Driftwood" },
    tagline: {
      no: "Salt, vind og tid har gjort treverket vakkert.",
      en: "Salt, wind and time made the wood beautiful.",
    },
    mood: {
      no: "Lyn, rolig, kystnær. Som en sommerhytte åpnet for første gang på sesongen — solblekt, mykt, uten å prøve for hardt.",
      en: "Light, calm, coastal. Like a summer cabin opened for the first time in the season — sun-bleached, soft, not trying too hard.",
    },
    palette: {
      bg: "#f2ede3",
      surface: "#e4dccb",
      accent: "#5b8a8a",
      accentSoft: "#8fb3b0",
      text: "#2e2a23",
      textSoft: "#6b6456",
    },
    type: {
      display: "Lora",
      body: "Inter",
      displayStack: "'Lora', Georgia, serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
    },
    signature: {
      no: "Bjelker i horisont, med én flytende tidevannslinje gjennom layouten.",
      en: "Horizontal planks, with one floating tide line running through the layout.",
    },
    logoIdea: {
      no: "«Strand» i et mykt antikva, «Treverk» i lys kapitél under.",
      en: "“Strand” in a soft old-style serif, “Treverk” in light caps below.",
    },
  },
  {
    id: "verksted",
    codename: "verksted",
    name: { no: "Verkstedet", en: "Workshop" },
    tagline: {
      no: "Snekkerens eget språk: millimeter og blyant.",
      en: "The carpenter's own language: millimetres and pencil.",
    },
    mood: {
      no: "Teknisk, nøktern, presis. Kraftpapir og grafittpenn. Siden leses som et arbeidsdokument — ikke salg, men håndverk dokumentert.",
      en: "Technical, plain, precise. Kraft paper and a graphite pencil. The site reads like a working document — not sales, but craft documented.",
    },
    palette: {
      bg: "#e8e3d6",
      surface: "#d9d3c2",
      accent: "#b8552b",
      accentSoft: "#d18a64",
      text: "#26221b",
      textSoft: "#5c574a",
    },
    type: {
      display: "IBM Plex Mono",
      body: "IBM Plex Sans",
      displayStack: "'IBM Plex Mono', ui-monospace, monospace",
      bodyStack: "'IBM Plex Sans', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
    },
    signature: {
      no: "Mållinjer og dimensjoner tegnet rett inn i layouten, som på en arbeidstegning.",
      en: "Dimension lines and callouts drawn straight into the layout, like on a working drawing.",
    },
    logoIdea: {
      no: "Monospasert stempel, som merket med sort blyant på en trestubb.",
      en: "Monospace stamp, like a mark made in soft pencil on an offcut.",
    },
  },
  {
    id: "tre",
    codename: "tre",
    name: { no: "Treet", en: "Timber" },
    tagline: {
      no: "Treet selv er hovedpersonen. Alt annet trekker seg tilbake.",
      en: "The wood itself is the main character. Everything else steps back.",
    },
    mood: {
      no: "Varm, rund, hjemmefra. Amber og harpiks i ettermiddagslyset.",
      en: "Warm, round, like home. Amber and resin in afternoon light.",
    },
    palette: {
      bg: "#f3e9d8",
      surface: "#e6d6bd",
      accent: "#b5701f",
      accentSoft: "#d29a52",
      text: "#332619",
      textSoft: "#7a6650",
    },
    type: {
      display: "Spectral",
      body: "Inter",
      displayStack: "'Spectral', Georgia, serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
    },
    signature: {
      no: "Årringer i ende-korn som et tilbakevendende motiv.",
      en: "End-grain growth rings as a recurring motif.",
    },
    logoIdea: {
      no: "Et lesbart navn skåret inn i en årring-sirkel.",
      en: "A legible name set inside a growth-ring circle.",
    },
  },
  {
    id: "havn",
    codename: "havn",
    name: { no: "Båtplass", en: "Boatyard" },
    tagline: {
      no: "Bygget som en sjøhytte: tjære, salt og en god knute.",
      en: "Built like a boatshed: tar, salt, and a well-tied knot.",
    },
    mood: {
      no: "Mørk, fysisk, sjømannsrapport. Lukten av kreosot og vått tau.",
      en: "Dark, physical, nautical. The smell of creosote and wet rope.",
    },
    palette: {
      bg: "#1f2624",
      surface: "#2c3532",
      accent: "#c89b3c",
      accentSoft: "#e0bd6e",
      text: "#ede7d8",
      textSoft: "#a39e8c",
    },
    type: {
      display: "Oswald",
      body: "Source Sans 3",
      displayStack: "'Oswald', 'Arial Narrow', sans-serif",
      bodyStack: "'Source Sans 3', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap",
    },
    signature: {
      no: "Tauarbeid og messing-øyer som fester layout-linjene gjennom sidene.",
      en: "Rope work and brass eyes that tie the layout lines together across the site.",
    },
    logoIdea: {
      no: "Kondensert skrift med en tjære-strek under, som en merkemast.",
      en: "Condensed lettering with a tar-line beneath, like a marker post.",
    },
  },
  {
    id: "joiner",
    codename: "joinér",
    name: { no: "Joinér", en: "Joiner" },
    tagline: {
      no: "For prosjektene som fortjener et galleri, ikke en brosjyre.",
      en: "For the work that deserves a gallery, not a brochure.",
    },
    mood: {
      no: "Eksklusiv, stille, nøyaktig. Som et museumsmonter med ett objekt.",
      en: "Exclusive, quiet, exact. Like a museum case holding a single object.",
    },
    palette: {
      bg: "#171311",
      surface: "#241e1a",
      accent: "#b08d43",
      accentSoft: "#cdb070",
      text: "#ece3d2",
      textSoft: "#9d937f",
    },
    type: {
      display: "Bodoni Moda",
      body: "Jost",
      displayStack: "'Bodoni Moda', 'Didot', serif",
      bodyStack: "'Jost', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,700;1,6..96,400&family=Jost:wght@300;400;500;600&display=swap",
    },
    signature: {
      no: "Svanshals-skjøter (dovetail) tegnet som et stille teknisk utsmykning.",
      en: "Dovetail joints drawn as a quiet technical flourish.",
    },
    logoIdea: {
      no: "En stram didone-skrift, én tynn messinglinje under — bare navnet.",
      en: "A tight didone, one thin brass line beneath — the name alone.",
    },
  },
  {
    id: "skogsjø",
    codename: "skog & sjø",
    name: { no: "Skog & Sjø", en: "Forest & Fjord" },
    tagline: {
      no: "Hvor tregrensen møter saltvannet.",
      en: "Where the treeline meets saltwater.",
    },
    mood: {
      no: "Nordisk, rolig, nytt. Som et kart over en kyststi en tåkete morgen.",
      en: "Nordic, calm, new. Like a map of a coastal path on a foggy morning.",
    },
    palette: {
      bg: "#eef0ea",
      surface: "#dde2d7",
      accent: "#1f5f63",
      accentSoft: "#5a9b95",
      text: "#1f2a26",
      textSoft: "#56625c",
    },
    type: {
      display: "Bricolage Grotesque",
      body: "Inter",
      displayStack: "'Bricolage Grotesque', 'Arial', sans-serif",
      bodyStack: "'Inter', system-ui, sans-serif",
      fontsHref:
        "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@300;400;500;600;700&display=swap",
    },
    signature: {
      no: "Topografiske kystlinjer lagvis med treverks-åre.",
      en: "Topographic shoreline contours layered with wood grain.",
    },
    logoIdea: {
      no: "Samtidig grotesk, &-tegnet tegnet som en årebue.",
      en: "Contemporary grotesque, the ampersand drawn as a grain arc.",
    },
  },
];

