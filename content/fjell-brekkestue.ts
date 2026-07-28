/**
 * Fjell Brekkestue — content for the standalone café demo (concept 02 "Nedtur").
 *
 * Bilingual { no, en } content, resolved at render via tx(). The café is
 * fictional but the copy is written to feel real and specific — a particular
 * place with particular hours, a particular menu, a particular story.
 *
 * Norwegian is the primary voice (it's a Norwegian mountain café); English is
 * a plainer tourist-facing translation.
 */

export type Locale = "no" | "en";

export type Localized = Record<Locale, string>;

export function tx(value: Localized, locale: Locale): string {
  return value[locale] ?? value.no;
}

export const business = {
  name: "Fjell Brekkestue",
  tagline: {
    no: "En varm pause på turen.",
    en: "A warm rest on the trail.",
  } as Localized,
  established: "1987",
  elevation: "1 184 moh",
} as const;

export const nav = {
  hours: { no: "Åpningstider", en: "Opening hours" } as Localized,
  menu: { no: "Meny", en: "Menu" } as Localized,
  story: { no: "Historie", en: "Story" } as Localized,
  findus: { no: "Finne oss", en: "Find us" } as Localized,
} as const;

export const hero = {
  eyebrow: {
    no: "Fjellkafe · fra 1987",
    en: "Mountain café · since 1987",
  } as Localized,
  title: "Fjell Brekkestue",
  subtitle: {
    no: "Kaffe, kakao og nystekte vafler — halvannen times gange over tregrensen. Vi holder åpent når stien er bar.",
    en: "Coffee, cocoa, and fresh waffles — a ninety-minute walk above the treeline. We're open while the trail is bare.",
  } as Localized,
  primaryCta: {
    no: "Se menyen",
    en: "See the menu",
  } as Localized,
  secondaryCta: {
    no: "Slik kommer du hit",
    en: "How to get here",
  } as Localized,
} as const;

export type HourRow = {
  days: Localized;
  hours: Localized;
  /** Whether this period is currently open (drives the "open now" badge). */
  current?: boolean;
};

export const hours: HourRow[] = [
  {
    days: { no: "Lørdag – søndag", en: "Saturday – Sunday" },
    hours: { no: "09.00 – 17.00", en: "09.00 – 17.00" },
    current: true,
  },
  {
    days: { no: "Mandag – fredag", en: "Monday – Friday" },
    hours: { no: "10.00 – 16.00", en: "10.00 – 16.00" },
  },
];

export const seasonNote: Localized = {
  no: "Stengt i vintermånedene (nov–mars) når stien er snødekt. Følg med på Instagram for åpningsdagen.",
  en: "Closed through winter (Nov–Mar) when the trail is snow-covered. Watch Instagram for opening day.",
};

export type MenuCategory = {
  id: string;
  title: Localized;
  /** Optional small note under the category title. */
  note?: Localized;
  items: MenuItem[];
};

export type MenuItem = {
  name: Localized;
  /** One-line description, optional. */
  desc?: Localized;
  price: string;
  /** Marks an item as a signature / recommendation. */
  signature?: boolean;
};

export const menu: MenuCategory[] = [
  {
    id: "drikk",
    title: { no: "Å drikke", en: "To drink" },
    note: {
      no: "Brygget fjellvann, manuelt. Ingen kaffemaskin.",
      en: "Hand-brewed with mountain water. No espresso machine.",
    },
    items: [
      {
        name: { no: "Filterkaffe", en: "Filter coffee" },
        desc: {
          no: "Dagens brygg — always mørk.",
          en: "Today's roast — always dark.",
        },
        price: "38",
        signature: true,
      },
      {
        name: { no: "Kaffe med melk", en: "Coffee with milk" },
        price: "42",
      },
      {
        name: { no: "Kakao", en: "Hot cocoa" },
        desc: { no: "Tynn, varm, med krem.", en: "Thin, hot, with cream." },
        price: "45",
      },
      {
        name: { no: "Solbærtoddy", en: "Blackcurrant toddy" },
        desc: {
          no: "Hjemmelaget — godt når det blåser.",
          en: "Homemade — good when the wind picks up.",
        },
        price: "55",
      },
    ],
  },
  {
    id: "spise",
    title: { no: "Å spise", en: "To eat" },
    note: {
      no: "Mest mulig stasjonært — vi baker på stedet.",
      en: "Mostly stationary — we bake on site.",
    },
    items: [
      {
        name: { no: "Vaffel med brunost", en: "Waffle with brown cheese" },
        desc: {
          no: "Nystekt, tykk, jernvarm.",
          en: "Fresh, thick, iron-hot.",
        },
        price: "55",
        signature: true,
      },
      {
        name: { no: "Solskinnsbrød", en: "Solskinnsbrød" },
        desc: {
          no: "Grovt brød med solskinnspesto.",
          en: "Wholegrain bread with sun-dried pesto.",
        },
        price: "65",
      },
      {
        name: { no: "Havregrøt", en: "Oat porridge" },
        desc: {
          no: "Med rømme og tyttebær.",
          en: "With sour cream and lingonberries.",
        },
        price: "75",
      },
      {
        name: { no: "Reinsdyrpike i lompe", en: "Reindeer mince in flatbread" },
        desc: {
          no: "Med rømme og syltet løk.",
          en: "With sour cream and pickled onion.",
        },
        price: "120",
        signature: true,
      },
    ],
  },
  {
    id: "snacks",
    title: { no: "Med ut", en: "To take along" },
    note: {
      no: "Til resten av turen.",
      en: "For the rest of the walk.",
    },
    items: [
      {
        name: { no: "Sjokolade (Kvikk)", en: "Chocolate (Kvikk)" },
        price: "20",
      },
      {
        name: { no: "Nøtteblanding", en: "Nut mix" },
        desc: { no: "300 g pose.", en: "300 g bag." },
        price: "45",
      },
      {
        name: { no: "Tørket frukt", en: "Dried fruit" },
        price: "40",
      },
    ],
  },
];

export const view = {
  eyebrow: { no: "Utsikten", en: "The view" } as Localized,
  title: {
    no: "Du ser hele dalen herfra.",
    en: "You can see the whole valley from here.",
  } as Localized,
  body: {
    no: "Terrassen vender vest. Når været holder, ser du tre fjellrekker i rekke — og solen går ned rett bak den fjerneste. Vi har tepper og ponchoer til utlån når det er kjølig.",
    en: "The deck faces west. When the weather holds, three ridgelines stack up one behind another — and the sun drops straight behind the farthest. We lend blankets and ponchos when it's cool.",
  } as Localized,
  stats: [
    { value: "1 184", label: { no: "moh", en: "metres" } as Localized },
    {
      value: "3",
      label: { no: "fjellrekker synlig", en: "ridgelines visible" } as Localized,
    },
    { value: "90", label: { no: "min fra parkering", en: "min from parking" } as Localized },
  ] as const,
  photo: "/demos/fjell-brekkestue/view-panorama.jpg",
} as const;

export const story = {
  eyebrow: { no: "Historie", en: "Story" } as Localized,
  title: {
    no: "Begynnelsen var en kjele.",
    en: "It started with a kettle.",
  } as Localized,
  body: [
    {
      no: "I 1987 satte Ingrid Brekke en kaffekjele på en primus oppe ved skaret. Det var bare en teltduk og en bensinbrygger, men vandrere stoppet opp, og det ble en vane. Over tjue år vokste det til det vesle trehuset som står der i dag.",
      en: "In 1987, Ingrid Brekke put a coffee kettle on a primus stove up at the pass. Just a tarpaulin and a gas burner, but walkers stopped, and it became a habit. Over twenty years it grew into the small timber lodge that stands there today.",
    },
    {
      no: "Ingrid drev stedet alene frem til 2011. Nå er det barnebarnet Sigrid som brygger kaffen og baker vaflene — samme oppskrift, samme jern, samme utsikt. Ingrid kommer fortsatt opp hver lørdag i sesongen.",
      en: "Ingrid ran the place alone until 2011. Now her granddaughter Sigrid brews the coffee and bakes the waffles — same recipe, same iron, same view. Ingrid still comes up every Saturday in season.",
    },
  ] as const,
  people: [
    {
      name: "Sigrid Brekke",
      role: { no: "Daglig leder, barnebarn", en: "Manager, granddaughter" },
      quote: {
        no: "Vi har ingen kaffemaskin. Vi brygger for hånd — som bestemor.",
        en: "We don't have a coffee machine. We brew by hand — like grandma did.",
      },
    },
    {
      name: "Ingrid Brekke",
      role: { no: "Grunnlegger, 1987", en: "Founder, 1987" },
      quote: {
        no: "Fjellet bestemmer alt. Vi bare stiller opp.",
        en: "The mountain decides everything. We just show up.",
      },
    },
  ] as const,
  photo: "/demos/fjell-brekkestue/interior.jpg",
} as const;

export const findus = {
  eyebrow: { no: "Finne oss", en: "Find us" } as Localized,
  title: {
    no: "Halvannen time opp. Ingen vei.",
    en: "Ninety minutes up. No road.",
  } as Localized,
  intro: {
    no: "Det er ingen bilvei frem til døren. Parkering ved Skagsli turparkering (felt 4–6), følg deretter den merkede stien (rød T) oppover. Turen tar cirka 90 minutter opp, 60 ned. Stien er bar fra mai til oktober.",
    en: "There's no road to the door. Park at Skagsli trail parking (bays 4–6), then follow the marked trail (red T) upward. It's about 90 minutes up, 60 down. The trail is bare from May through October.",
  } as const,
  steps: [
    {
      title: { no: "Parkering", en: "Parking" } as Localized,
      body: {
        no: "Skagsli turparkering, felt 4–6. Gratis, men begrenset — kom tidlig i helgene.",
        en: "Skagsli trail parking, bays 4–6. Free, but limited — come early on weekends.",
      } as Localized,
    },
    {
      title: { no: "Stien", en: "The trail" } as Localized,
      body: {
        no: "Rødt T-merke fra parkeringen. Steady stigning, noen bløte partier etter regn. Tegning og GPX på ut.no.",
        en: "Red T-mark from the parking. Steady climb, some boggy parts after rain. Map and GPX on ut.no.",
      } as Localized,
    },
    {
      title: { no: "Ankomst", en: "Arrival" } as Localized,
      body: {
        no: "Du ser huset på skaret etter cirka 90 min. Røyken fra pipa betyr at vi har fyrt — og at vi er åpne.",
        en: "You'll see the lodge at the pass after about 90 min. Smoke from the chimney means we've lit the stove — and that we're open.",
      } as Localized,
    },
  ] as const,
  contact: {
    email: "hei@fjellbrekkestue.no",
    phone: "+47 900 00 000",
    instagram: "@fjellbrekkestue",
    addressLine: {
      no: "Skaret, over tregrensen",
      en: "The pass, above the treeline",
    },
  },
  photo: "/demos/fjell-brekkestue/trail.jpg",
} as const;

export const footer = {
  colophon: {
    no: "Fjell Brekkestue drives av familien Brekke siden 1987. Fiktiv kafé — en demo.",
    en: "Fjell Brekkestue has been run by the Brekke family since 1987. A fictional café — a demo.",
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
