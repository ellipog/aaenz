import type { Metadata } from "next";
import { Fragment } from "react";
import Plate from "@/components/ascii/plate";
import Decode from "@/components/decode";
import Downloads from "@/components/downloads";
import Leaders from "@/components/leaders";
import Reveal from "@/components/reveal";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { elsewhere, suite, type Mod } from "@/lib/mods";

export const metadata: Metadata = {
  title: "Minecraft — Aaen Studios",
  description:
    "Stellar by Aaen Studios, released as ellipog: Armature, a shared library mod, and Tenet, a server-authoritative questing engine, for Fabric and NeoForge.",
  alternates: { canonical: "/minecraft" },
};

const link = "text-bone transition-colors hover:text-red";

/* Armature's stratum, top to bottom. `at` matches the band centres in the strata plate. */
const strata = [
  { at: "16%", jp: "草", name: "YOUR MODS", note: "Tenet, and whatever else stands here." },
  { at: "40%", jp: "基", name: "ARMATURE", note: "One seam. Strict contracts.", core: true },
  { at: "63%", jp: "土", name: "FABRIC ・ NEOFORGE", note: "Either loader, the same behaviour." },
  { at: "86%", jp: "盤", name: "MINECRAFT ・ JAVA 25", note: "The bedrock." },
];

const legend: [string, string][] = [
  ["章", "START"],
  ["任", "TASK"],
  ["条", "CONDITION"],
  ["報", "REWARD"],
  ["墓", "TOMBSTONE"],
];

/* What each part draws under its name. A part without one goes straight to its specs. */
const beneath: Record<string, React.ReactNode> = {
  armature: (
    <div className="relative mt-16 grid grid-cols-[48px_minmax(0,1fr)] sm:grid-cols-[230px_minmax(0,1fr)]">
      <div className="relative">
        {strata.map((s) => (
          <div className="absolute inset-x-0 -translate-y-1/2" key={s.name} style={{ top: s.at }}>
            <span className={`mono block ${s.core ? "text-red" : "text-bone"}`}>
              <span className={`mincho mr-2 text-[13px] ${s.core ? "text-red" : "text-faint"}`}>{s.jp}</span>
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
  ),
  tenet: (
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
  ),
};

function Links({ links }: { links: Mod["links"] }) {
  return (
    <p className="mono m-0 text-faint">
      {links.map(([label, href], i) => (
        <span key={label}>
          {i > 0 ? " 〜 " : null}
          <a className={link} href={href} rel="noreferrer" target="_blank">
            {label} ↗
          </a>
        </span>
      ))}
    </p>
  );
}

/* One part of the suite. Parts alternate sides down the page. */
function Part({ m, right }: { m: Mod; right: boolean }) {
  return (
    <section className="reveal relative px-5 py-28 sm:px-7" data-reveal id={m.name}>
      <div className="mx-auto max-w-[1240px]">
        <p className={`mono m-0 mt-14 text-faint ${right ? "text-right" : ""}`}>
          <span className="mincho mr-2 text-[13px] text-red">{m.glyph}</span>
          {m.role}
        </p>
        <h2 className={`mincho m-0 mt-4 text-[clamp(64px,10vw,156px)] leading-[.86] ${right ? "text-right" : ""}`}>
          {m.name}
        </h2>
        <div className={`mt-6 ${right ? "md:mr-[38%] md:text-right" : "md:ml-[38%]"}`}>
          <p className="mincho m-0 text-[clamp(20px,2.2vw,28px)] font-normal leading-snug">
            <Decode text={m.line} />
          </p>
          <p className={`m-0 mt-4 max-w-[54ch] text-dim ${right ? "md:ml-auto" : ""}`}>{m.desc}</p>
        </div>

        {beneath[m.name]}

        <div className={`mt-20 flex flex-wrap items-end justify-between gap-10 ${right ? "flex-row-reverse" : ""}`}>
          <Leaders className="mt-0" rows={m.specs} />
          <Links links={m.links} />
        </div>
      </div>
    </section>
  );
}

export default function Minecraft() {
  return (
    <>
      <Reveal />
      <SiteHeader home={false} />

      {/* a block world in cross-section, every block its kanji */}
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
            <p className="mono m-0 text-faint">MINECRAFT</p>
            <h1 className="mincho m-0 mt-6 text-[clamp(42px,6vw,88px)] leading-[.95]">
              The <span className="whitespace-nowrap text-red">load-bearing</span>
              <br />
              <span className="pl-[1.2em]">parts.</span>
            </h1>
            <p className="m-0 mt-5 max-w-[44ch] pl-[2.4em] text-dim max-sm:pl-0">
              Stellar, released as ellipog: the parts other mods and packs are built on.
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
            <p className="mincho m-0 mt-3 text-[clamp(34px,4.6vw,60px)] leading-none">ellipog</p>
            <div className="mt-5 pl-[2.4em]">
              <Links links={elsewhere} />
            </div>
          </div>
          <div className="md:mr-[6%]">
            <Downloads />
          </div>
        </div>
      </section>

      {/* stellar, the suite: a constellation the parts hang from */}
      <section className="reveal relative mt-16 h-[78vh] min-h-[480px] max-md:h-[64vh]" data-reveal id="stellar">
        <Plate
          cell={16}
          cellSm={11}
          className="fade-y absolute inset-0"
          kind="stars"
          label="A constellation of star kanji joined by flowing lines, light running from star to star, one star red"
          reveal="center"
        />
        <div className="pointer-events-none absolute bottom-[8%] left-0 px-5 sm:px-7 md:left-[3%]">
          <div className="bg-[radial-gradient(ellipse_closest-side,rgba(5,5,5,.9)_58%,rgba(5,5,5,0))] px-8 py-12 sm:px-14">
            <p className="mono m-0 text-faint">
              <span className="mincho mr-2 text-[13px] text-red">星</span>THE DEVELOPER SUITE
            </p>
            <h2 className="mincho m-0 mt-3 text-[clamp(72px,12vw,180px)] leading-[.86]">stellar</h2>
            <p className="mono pointer-events-auto m-0 mt-5 pl-[2.4em] text-faint">
              {suite.map((m, i) => (
                <span key={m.name}>
                  {i > 0 ? " 〜 " : null}
                  <a className={link} href={`#${m.name}`}>
                    {m.name.toUpperCase()} ↓
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {suite.map((m, i) => (
        <Fragment key={m.name}>
          {/* between two parts, the road: a sea of cloud crossed by causeways */}
          {i > 0 ? (
            <section aria-hidden="true" className="relative h-[60vh] min-h-[380px] overflow-hidden">
              <Plate
                cell={13}
                cellSm={9}
                className="fade-y absolute inset-0"
                kind="clouds"
                label="Processions of small figures walking causeways of light across a sea of cloud"
              />
            </section>
          ) : null}
          <Part m={m} right={i % 2 === 1} />
        </Fragment>
      ))}

      <SiteFooter home={false} />
    </>
  );
}
