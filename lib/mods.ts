/*
 * Stellar, the developer suite, in one place: the parts other mods and packs
 * are built on. /minecraft gives each part its own band, and the home page only
 * points at the suite. Keep the copy general and leave out counts, since they
 * change with every release.
 */

export type Mod = {
  /** One red kanji that means the thing. */
  glyph: string;
  name: string;
  /** What it is, in micro-type. */
  role: string;
  /** The line that decodes under the name. */
  line: string;
  desc: string;
  specs: [label: string, value: string][];
  links: [label: string, href: string][];
};

export const suite: Mod[] = [
  {
    glyph: "基",
    name: "armature",
    role: "RUNTIME",
    line: "One layer everything stands on.",
    desc: "A shared library mod with the common building blocks: a loader seam, strict JSON, events, networking, energy, teams and a client interface toolkit. Nothing in it belongs to any one mod, so anything can stand on it.",
    specs: [
      ["LOADERS", "FABRIC ＋ NEOFORGE"],
      ["RUNTIME", "JAVA 25"],
      ["LICENCE", "MIT"],
    ],
    links: [
      ["DOCS", "https://ellipog.dev/docs/armature"],
      ["GITHUB", "https://github.com/ellipog/armature"],
      ["CURSEFORGE", "https://www.curseforge.com/minecraft/mc-mods/armature-lib"],
    ],
  },
  {
    glyph: "律",
    name: "tenet",
    role: "ENGINE",
    line: "The server decides what counts.",
    desc: "A questing engine that ships no questlines of its own. Packs write their quests in plain files, players explore them on an open canvas, and the server alone decides what is done.",
    specs: [
      ["REQUIRES", "ARMATURE"],
      ["LOADERS", "FABRIC ＋ NEOFORGE"],
      ["RUNTIME", "JAVA 25"],
      ["LICENCE", "MIT"],
    ],
    links: [
      ["DOCS", "https://ellipog.dev/docs/tenet"],
      ["GITHUB", "https://github.com/ellipog/tenet"],
      ["CURSEFORGE", "https://www.curseforge.com/minecraft/mc-mods/tenet"],
    ],
  },
];

export const elsewhere: [label: string, href: string][] = [
  ["ELLIPOG.DEV", "https://ellipog.dev"],
  ["MODRINTH", "https://modrinth.com/user/Ellipog"],
  ["CURSEFORGE", "https://www.curseforge.com/members/ellipog/projects"],
];
