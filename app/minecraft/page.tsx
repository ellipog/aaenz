import type { Metadata } from "next";
import Plate from "@/components/ascii/plate";
import Decode from "@/components/decode";
import Downloads from "@/components/downloads";
import Episode from "@/components/episode";
import Leaders from "@/components/leaders";
import Reveal from "@/components/reveal";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Minecraft — Aaen Studios",
  description:
    "Armature and Tenet by Aaen Studios — a multi-loader runtime and a server-authoritative quest engine, built under the names ellipog and stellar.",
  alternates: { canonical: "/minecraft" },
};

const link = "text-bone transition-colors hover:text-red";

/* Where a row sits on its wave: 0 hard left, 1 furthest in. Lists on this page drift. */
const drift = (i: number, phase = 0) => (Math.sin(i * 0.95 + phase) + 1) / 2;

/* Armature's stratum, top to bottom. `at` matches the band centres in the strata plate. */
const strata = [
  { at: "16%", n: "03", name: "YOUR MODS", note: "Tenet, and whatever else stands here." },
  { at: "40%", n: "02", name: "ARMATURE", note: "One seam. Strict contracts.", core: true },
  { at: "63%", n: "01", name: "FABRIC ・ NEOFORGE", note: "Either loader, the same behaviour." },
  { at: "86%", n: "00", name: "MINECRAFT ・ JAVA 21", note: "The bedrock." },
];

/* Its contracts, as the articles of a short code. */
const articles = [
  { en: "Ordered events", text: "Events arrive in an order a mod can rely on." },
  { en: "Typed networking", text: "Every message across the wire has a declared shape." },
  {
    en: "One renderer seam",
    text: "Every draw call passes one seam, so interface is proven in unit tests that run in milliseconds — never eyeballed in screenshots.",
  },
  {
    en: "Strict config",
    text: "Presence and type are checked on read; a mistake is answered with did-you-mean.",
  },
  { en: "File and line", text: "Every fault is reported to the file and line it came from." },
  {
    en: "Precedence",
    text: "Parties resolve by precedence, so a server behaves the same whichever social mods are installed.",
  },
  { en: "Standalone", text: "Nothing in it belongs to any one consumer." },
];

const legend: [string, string][] = [
  ["章", "START"],
  ["任", "TASK"],
  ["条", "CONDITION"],
  ["報", "REWARD"],
  ["墓", "TOMBSTONE"],
];

const laws = [
  { en: "Plain JSON", text: "One folder per group, one file per quest." },
  { en: "Live reload", text: "Quest lines reload while the server runs — no restart." },
  { en: "In-game editor", text: "The editor batches a chapter into a single undoable act." },
  { en: "Tombstones", text: "Deleted nodes linger as tombstones until restored." },
  { en: "Sole arbiter", text: "The server decides what counts, throughout — validated to file and line." },
];

/* How a party's progress counts. Each member stands on a wave; the lit part is progress. */
const parties: { en: string; text: string; rows: [string, number][] }[] = [
  { en: "Pooled", text: "Everyone fills one line.", rows: [["人人人", 9]] },
  {
    en: "Per-member",
    text: "Each member keeps their own.",
    rows: [
      ["人", 8],
      ["人", 4],
      ["人", 6],
    ],
  },
  {
    en: "Owner-only",
    text: "Only the owner's progress counts.",
    rows: [
      ["人 ◂", 7],
      ["人", 0],
      ["人", 0],
    ],
  },
];

function Links({ github, docs }: { github: string; docs: string }) {
  return (
    <p className="mono m-0 text-faint">
      <a className={link} href={github} rel="noreferrer" target="_blank">
        GITHUB ↗
      </a>{" "}
      〜{" "}
      <a className={link} href={docs} rel="noreferrer" target="_blank">
        DOCS ↗
      </a>
    </p>
  );
}

export default function Minecraft() {
  return (
    <>
      <Reveal />
      <SiteHeader home={false} />

      {/* 第六話 — a block world in cross-section, every block its kanji */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden" id="top">
        <Plate
          cell={16}
          cellSm={11}
          className="absolute inset-0"
          fps={24}
          kind="world"
          label="A block world in cross-section, every block drawn as its kanji, one red figure walking the surface"
          ripple={false}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent"
        />
        <div className="pointer-events-none absolute inset-x-0 top-[84px] px-5 sm:px-7 md:left-[4%] md:top-[11%]">
          <div className="max-w-[860px] bg-[radial-gradient(ellipse_closest-side,rgba(5,5,5,.94)_64%,rgba(5,5,5,0))] px-6 py-10 sm:px-12 sm:py-14">
            <p className="mincho m-0 text-[14px] tracking-[.3em] text-red">第六話</p>
            <p className="mono m-0 mt-1 text-faint">EPISODE:06 〜 MINECRAFT</p>
            <h1 className="mincho m-0 mt-6 text-[clamp(42px,6vw,88px)] leading-[.95]">
              The <span className="whitespace-nowrap text-red">load-bearing</span>
              <br />
              <span className="pl-[1.2em]">parts.</span>
            </h1>
            <p className="m-0 mt-5 max-w-[44ch] pl-[2.4em] text-dim max-sm:pl-0">
              A runtime everything stands on, and an engine that decides what counts as done — two
              systems from the same hands.
            </p>
          </div>
        </div>
        <p className="mono pointer-events-none absolute bottom-8 left-1/2 m-0 -translate-x-1/2 whitespace-nowrap text-bone">
          CLICK TO MINE <span className="animate-blink text-red">■</span>
        </p>
      </section>

      {/* who made them, and how many have taken them */}
      <section className="px-5 pb-10 pt-16 sm:px-7">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-x-16 gap-y-10">
          <div>
            <p className="mono m-0 text-faint">RELEASED AS</p>
            <p className="mincho m-0 mt-3 text-[clamp(34px,4.6vw,60px)] leading-none">
              ellipog <span className="text-red">〜</span> stellar
            </p>
            <p className="mono m-0 mt-5 pl-[2.4em] text-faint">
              <a className={link} href="#armature">
                ARMATURE ↓
              </a>{" "}
              〜{" "}
              <a className={link} href="#tenet">
                TENET ↓
              </a>
            </p>
          </div>
          <div className="md:mr-[6%]">
            <Downloads />
          </div>
        </div>
      </section>

      {/* 06.01 — armature, the stratum */}
      <section className="reveal relative px-5 py-28 sm:px-7" data-reveal id="armature">
        <div className="mx-auto max-w-[1240px]">
          <Episode code="06.01" n="基" tone="text-red" />
          <p className="mono m-0 mt-14 text-faint">01 〜 RUNTIME</p>
          <h2 className="mincho m-0 mt-4 text-[clamp(64px,10vw,156px)] leading-[.86]">armature</h2>
          <div className="mt-6 md:ml-[38%]">
            <p className="mincho m-0 text-[clamp(20px,2.2vw,28px)] font-normal leading-snug">
              <Decode text="One layer everything stands on." />
            </p>
            <p className="m-0 mt-4 max-w-[54ch] text-dim">
              A loader seam with strict contracts — ordered events, typed networking, teams resolved by
              precedence. Standalone by design.
            </p>
          </div>

          <div className="relative mt-16 grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[230px_minmax(0,1fr)]">
            <div className="relative">
              {strata.map((s) => (
                <div className="absolute inset-x-0 -translate-y-1/2" key={s.n} style={{ top: s.at }}>
                  <span className={`mono block ${s.core ? "text-red" : "text-bone"}`}>
                    <span className="mr-2 text-faint">{s.n}</span>
                    <span className="max-sm:hidden">{s.name}</span>
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-faint max-sm:hidden">{s.note}</span>
                </div>
              ))}
            </div>
            <Plate
              cell={14}
              cellSm={10}
              className="h-[clamp(300px,34vw,440px)] w-full [mask-image:linear-gradient(90deg,#000_70%,transparent)]"
              kind="strata"
              label="Four flowing bands of kanji: mods on top, Armature in red, the loaders, the bedrock"
            />
          </div>
          <p className="mono m-0 mt-4 text-faint sm:pl-[230px]">
            STRATA 〜 03 TO 00
          </p>

          <div className="mt-28">
            <p className="mincho m-0 text-[clamp(30px,3.6vw,48px)]">The contracts</p>
            <p className="mono m-0 mt-2 pl-[2.4em] text-faint">SEVEN ARTICLES</p>
          </div>
          <ol className="m-0 mt-12 list-none space-y-12 p-0">
            {articles.map((a, i) => (
              <li
                className="flex max-w-[720px] items-baseline gap-6 sm:gap-8 md:ml-[calc(var(--o)*34%)]"
                key={a.en}
                style={{ "--o": drift(i) } as React.CSSProperties}
              >
                <span className="mono w-[2.4em] shrink-0 text-red">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="mincho block text-[clamp(26px,2.8vw,38px)] leading-tight">{a.en}</span>
                  <span className="mt-1 block text-dim">{a.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-20 flex flex-wrap items-end justify-between gap-10">
            <Leaders
              className="mt-0"
              rows={[
                ["VERSION", "LOCKED WITH TENET"],
                ["LOADERS", "FABRIC ＋ NEOFORGE"],
                ["RUNTIME", "JAVA 21"],
                ["LICENCE", "MIT"],
              ]}
            />
            <Links docs="https://ellipog.dev/docs/armature" github="https://github.com/ellipog/armature" />
          </div>
        </div>
      </section>

      {/* the road between: every quest line is a causeway */}
      <section className="relative h-[66vh] min-h-[420px] overflow-hidden">
        <Plate
          cell={13}
          cellSm={9}
          className="fade-y absolute inset-0"
          kind="clouds"
          label="Processions of small figures walking causeways of light across a sea of cloud"
        />
        <p className="mono pointer-events-none absolute bottom-[14%] left-1/2 m-0 -translate-x-1/2 whitespace-nowrap text-bone">
          EVERY QUEST LINE IS A ROAD
        </p>
      </section>

      {/* 06.02 — tenet, the law of what counts as done */}
      <section className="reveal relative px-5 py-28 sm:px-7" data-reveal id="tenet">
        <div className="mx-auto max-w-[1240px]">
          <Episode code="06.02" n="律" tone="text-red" />
          <p className="mono m-0 mt-14 text-right text-faint">02 〜 ENGINE</p>
          <h2 className="mincho m-0 mt-4 text-right text-[clamp(64px,10vw,156px)] leading-[.86]">tenet</h2>
          <div className="mt-6 md:mr-[38%] md:text-right">
            <p className="mincho m-0 text-[clamp(20px,2.2vw,28px)] font-normal leading-snug">
              <Decode text="The server decides what counts." />
            </p>
            <p className="m-0 mt-4 max-w-[54ch] text-dim md:ml-auto">
              A declarative quest engine — validated to file and line, the server as sole arbiter. Built
              on Armature.
            </p>
          </div>

          <div className="mt-16">
            <Plate
              cell={14}
              cellSm={10}
              className="fade-soft aspect-[21/9] w-full max-sm:aspect-square"
              kind="quests"
              label="A quest graph of bracketed kanji joined by flowing curves, completion sweeping through it"
              reveal="none"
            />
            <ul className="mono m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0 text-faint">
              {legend.map(([jp, en]) => (
                <li key={en}>
                  <span className="mincho text-[12px] text-bone">【{jp}】</span> {en}
                </li>
              ))}
              <li>
                <span className="text-red">■</span> IN PROGRESS
              </li>
            </ul>
          </div>

          <p className="mincho m-0 mt-28 max-w-[22ch] text-[clamp(30px,4.2vw,58px)] font-normal leading-[1.25]">
            <span className="font-mono font-bold">18</span> <span className="text-red">tasks</span> ask,{" "}
            <span className="font-mono font-bold">10</span> <span className="text-red">rewards</span> pay,{" "}
            <span className="font-mono font-bold">6</span> <span className="text-red">conditions</span> gate.
          </p>
          <p className="m-0 mt-3 max-w-[52ch] pl-[3.4em] text-dim max-sm:pl-0">
            And open registries, so addon mods can teach it new verbs.
          </p>

          <ul className="m-0 mt-24 list-none space-y-10 p-0">
            {laws.map((l, i) => (
              <li
                className="max-w-[560px] md:ml-[calc(var(--o)*44%)]"
                key={l.en}
                style={{ "--o": drift(i, 2.2) } as React.CSSProperties}
              >
                <span className="mincho block text-[clamp(24px,2.4vw,32px)] leading-tight">
                  <span className="text-red">〜</span> {l.en}
                </span>
                <span className="mt-1 block pl-[1.6em] text-dim">{l.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-28">
            <p className="mincho m-0 text-[clamp(30px,3.6vw,48px)]">Parties</p>
            <p className="mono m-0 mt-2 pl-[2.4em] text-faint">PROGRESS COUNTS PER PARTY 〜 THREE RULES</p>
          </div>
          <div className="mt-12 grid gap-14 md:grid-cols-3 md:gap-10">
            {parties.map((p, i) => (
              <div className={i === 1 ? "md:mt-20" : i === 2 ? "md:mt-40" : ""} key={p.en}>
                <p className="mincho m-0 text-[clamp(30px,3vw,42px)] leading-none text-red">{p.en}</p>
                <div aria-hidden="true" className="mt-6 space-y-1.5">
                  {p.rows.map(([who, lit], k) => (
                    <p className="flex items-center gap-3 leading-none" key={k}>
                      <span className={`mincho w-[3.2em] shrink-0 text-[13px] ${who.includes("◂") ? "text-red" : "text-bone"}`}>
                        {who}
                      </span>
                      <span className="whitespace-nowrap text-[15px] tracking-[-.12em]">
                        <span className="text-bone">{"〜".repeat(lit)}</span>
                        <span className="text-faint/50">{"〜".repeat(12 - lit)}</span>
                      </span>
                    </p>
                  ))}
                </div>
                <p className="m-0 mt-5 text-dim">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 flex flex-wrap items-end justify-between gap-10">
            <Leaders
              className="mt-0"
              rows={[
                ["REQUIRES", "ARMATURE"],
                ["AUTHORING", "JSON"],
                ["EDITOR", "IN-GAME"],
                ["LICENCE", "MIT"],
              ]}
            />
            <Links docs="https://ellipog.dev/docs/tenet" github="https://github.com/ellipog/tenet" />
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 pt-10 sm:px-7">
        <p className="mono mx-auto m-0 max-w-[1240px] text-faint">
          <a className={link} href="/">
            ← AAENZ.NO
          </a>{" "}
          〜{" "}
          <a className="transition-colors hover:text-red" href="https://ellipog.dev" rel="noreferrer" target="_blank">
            ELLIPOG.DEV ↗
          </a>{" "}
          〜{" "}
          <a
            className="transition-colors hover:text-red"
            href="https://modrinth.com/user/Ellipog"
            rel="noreferrer"
            target="_blank"
          >
            MODRINTH ↗
          </a>
        </p>
      </section>

      <SiteFooter home={false} />
    </>
  );
}
