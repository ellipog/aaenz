import type { Metadata } from "next";
import { preload } from "react-dom";
import Plate from "@/components/ascii/plate";
import Decode from "@/components/decode";
import Downloads from "@/components/downloads";
import Leaders from "@/components/leaders";
import { Sync } from "@/components/readout";
import Reveal from "@/components/reveal";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WordPanel from "@/components/word-panel";
import { elsewhere, suite } from "@/lib/mods";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "elliot@aaenz.no";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* The two tools, each drawn as its own current: kern a vortex round its core, galdr a river made clean. */
const works = [
  {
    glyph: "核",
    name: "kern",
    desc: "A desktop server manager. Register any project as a server instance, extend it with plugins, and command the whole fleet from one clean room.",
    href: "https://kern.aaenz.no",
    host: "KERN.AAENZ.NO",
    kind: "vortex",
    options: { x: 0.68 },
    label: "A fleet of server instances in orbit round one core, on winding spiral currents",
    place: "md:left-[5%]",
  },
  {
    glyph: "詠",
    name: "galdr",
    desc: "A rune-encrusted GUI around FFmpeg. Raw media in, enchanted media out — convert, compress, transcribe and cut without memorising a single incantation.",
    href: "https://github.com/aaen-studios/galdr",
    host: "GITHUB.COM/AAEN-STUDIOS/GALDR",
    kind: "river",
    options: { gate: 0.3 },
    label: "A churning stream of media passing through an incantation and running out in clean even waves",
    place: "md:right-[5%] md:text-right",
  },
] as const;

export default function Home() {
  // the hero samples this before it can draw, so fetch it with the page rather than after the scripts
  preload("/assets/gen-winged-beams-plate.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <Reveal />
      <SiteHeader />

      {/* the studio, awakening: aaen cut out of wings of light */}
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-void" id="top">
        <Plate
          cell={14}
          cellSm={7}
          className="absolute inset-0"
          kind="hero"
          label="The word aaen cut out of a figure's wings of light, all drawn in kanji"
        />
        <h1 className="sr-only">aaen studios</h1>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-void to-transparent"
        />
        <div className="pointer-events-none absolute inset-x-0 top-[63%] px-5 text-center">
          <p className="inline-block bg-[radial-gradient(ellipse_closest-side,rgba(5,5,5,.9)_55%,rgba(5,5,5,0))] px-12 py-5 font-mono text-[clamp(12px,1.2vw,15px)] uppercase tracking-[.6em] text-bone">
            Software studio
          </p>
        </div>
        <div className="mono pointer-events-none absolute bottom-6 right-5 text-right sm:right-7 max-sm:hidden">
          <span className="block text-bone">
            SYNC <Sync />
          </span>
          <span className="mt-1 block text-faint">© MMXXVI AAEN STUDIOS</span>
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-[86px] left-1/2 h-[46px] w-px animate-cue bg-gradient-to-b from-bone/90 to-transparent max-sm:hidden"
        />
      </section>

      {/* the statement as a title card */}
      <section className="reveal relative px-5 pb-28 pt-28 sm:px-7" data-reveal id="statement">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="sr-only">Built to be stood on. Foundations for play, tools for work.</h2>
          <div aria-hidden="true" className="mt-16">
            <p className="mincho m-0 text-[clamp(56px,11vw,170px)] leading-[.95]">
              <Decode text="Built to be" />
            </p>
            <p className="mincho m-0 text-right text-[clamp(56px,11vw,170px)] leading-[.95] text-red">
              <Decode delay={350} text="stood on." />
            </p>
          </div>
          <div className="mt-20 grid gap-12 md:grid-cols-2">
            <div>
              <p className="mincho m-0 text-[clamp(24px,2.6vw,34px)] font-normal leading-snug">
                Foundations for play,
                <br />
                tools for work.
              </p>
            </div>
            <div>
              <p className="m-0 max-w-[52ch] text-dim">
                aaen studios is an independent software studio. Stellar is its foundation for
                Minecraft, kern and galdr its tools — all designed, built and kept in-house.
              </p>
              <Leaders
                rows={[
                  ["FOUNDATION", "STELLAR"],
                  ["TOOLS", "KERN ・ GALDR"],
                  ["POLICY", "OPEN SOURCE"],
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* the barrier: open source, offline by default */}
      <section className="reveal relative px-5 py-28 sm:px-7" data-reveal id="barrier">
        <div className="mx-auto max-w-[1240px]">
          <div className="mt-14 grid items-center gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="relative">
              <Plate
                cell={10}
                cellSm={7}
                className="fade-soft aspect-square w-full"
                kind="octagon"
                label="Concentric octagonal barrier walls around one small red figure"
                reveal="center"
              />
            </div>
            <div>
              <p className="mono m-0 text-faint">THE BARRIER</p>
              <h2 className="mincho m-0 mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06]">
                Open source, and <span className="text-red">offline</span> by default.
              </h2>
              <p className="m-0 mt-6 max-w-[52ch] text-dim">
                kern and galdr are open source — read the code, open issues, fork them. Both are
                native desktop apps for Windows, macOS and Linux.
              </p>
              <Leaders
                rows={[
                  ["OPEN SOURCE", "APPROVED"],
                  ["LOCAL-FIRST", "APPROVED"],
                  ["WIN ・ MAC ・ LINUX", "APPROVED"],
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* the two desktop tools, a vortex and a river running into each other */}
      <section className="reveal relative pt-28" data-reveal id="works">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-7">
          <h2 className="mincho m-0 mt-14 text-[clamp(36px,5vw,72px)] leading-[1.04]">
            Two tools,
            <br />
            <span className="text-red">shipped and kept</span>.
          </h2>
        </div>
        {works.map((w, i) => (
          <div className={`relative h-[86vh] min-h-[560px] ${i === 0 ? "mt-2" : "-mt-[16vh]"}`} key={w.name}>
            <Plate
              cell={13}
              cellSm={9}
              className="fade-y absolute inset-0"
              kind={w.kind}
              label={w.label}
              options={w.options}
            />
            <a
              className={`group absolute inset-x-5 bottom-[8%] block max-w-[520px] bg-[radial-gradient(ellipse_closest-side,rgba(5,5,5,.92)_58%,rgba(5,5,5,0))] px-8 py-12 no-underline sm:inset-x-7 md:inset-x-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-14 md:py-16 ${w.place}`}
              href={w.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="mono text-faint">
                <span className="mincho mr-2 text-[13px] text-red">{w.glyph}</span>0{i + 1} 〜 OPEN SOURCE 〜 DESKTOP
              </span>
              {/* room under the name for a descender: the g of galdr */}
              <span className="mincho mt-3 block pb-[.2em] text-[clamp(64px,8vw,128px)] leading-[.9] transition-colors group-hover:text-red">
                {w.name}
              </span>
              <span className="mt-4 block text-dim">{w.desc}</span>
              <span className="mono mt-5 block text-bone transition-colors group-hover:text-red">{w.host} ↗</span>
            </a>
          </div>
        ))}
        <p className="mono m-0 -mt-6 pb-4 text-center">
          <a
            className="text-dim transition-colors hover:text-red"
            href="https://github.com/aaen-studios"
            rel="noreferrer"
            target="_blank"
          >
            GITHUB.COM/AAEN-STUDIOS ↗
          </a>
        </p>
      </section>

      {/* a cross of light over the city */}
      <section className="relative h-[88vh] min-h-[540px] overflow-hidden" id="light">
        <Plate
          cell={13}
          cellSm={9}
          className="fade-y absolute inset-0"
          kind="rays"
          label="A cross of light over a city whose buildings are drawn in kanji"
        />
        <div className="pointer-events-none absolute inset-x-5 top-[22%] sm:inset-x-auto sm:right-[6%] sm:top-[30%]">
          <div className="bg-[radial-gradient(ellipse_closest-side,rgba(5,5,5,.94)_62%,rgba(5,5,5,0))] px-10 py-12 sm:max-w-[520px]">
            <h2 className="mincho m-0 text-[clamp(26px,3.4vw,46px)] leading-tight">
              One studio,
              <br />
              <span className="text-red">two crafts</span>.
            </h2>
            <p className="m-0 mt-4 text-dim">Designed, built and shipped in-house.</p>
            <p className="mono m-0 mt-4 text-red">DESKTOP ＋ MINECRAFT</p>
          </div>
        </div>
      </section>

      {/* the Minecraft work, one suite floating over a block world; every mod lives on /minecraft */}
      <section className="reveal relative pt-28" data-reveal id="minecraft">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-7">
          <p className="mono m-0 mt-14 text-faint">MINECRAFT</p>
          <h2 className="mincho m-0 mt-5 text-[clamp(52px,8vw,124px)] leading-[.95]">
            The <span className="whitespace-nowrap text-red">load-bearing</span>
            <br />
            <span className="pl-[1.2em]">parts.</span>
          </h2>
          <p className="m-0 mt-5 max-w-[50ch] pl-[3em] text-dim max-sm:pl-0">
            Mods for Minecraft, released as ellipog, under one suite that other mods and packs are built on.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="relative h-[74vh] min-h-[460px] max-md:h-[58vh]">
            <Plate
              cell={14}
              cellSm={10}
              className="fade-y absolute inset-0"
              kind="world"
              label="A block world in cross-section, every block drawn as its kanji, one red figure walking the surface"
              ripple={false}
            />
            <p className="mono pointer-events-none absolute bottom-[10%] left-5 m-0 text-bone sm:left-7 max-md:hidden">
              CLICK TO MINE <span className="animate-blink text-red">■</span>
            </p>
          </div>
          <a
            className="group block max-w-[480px] px-5 pt-4 no-underline sm:px-7 md:absolute md:right-[4%] md:top-[6%] md:bg-[radial-gradient(ellipse_closest-side,rgba(5,5,5,.92)_60%,rgba(5,5,5,0))] md:px-14 md:py-14 md:text-right"
            href="/minecraft#stellar"
          >
            <span className="mono text-faint">
              <span className="mincho mr-2 text-[13px] text-red">星</span>THE DEVELOPER SUITE
            </span>
            <span className="mincho mt-3 block text-[clamp(60px,7vw,112px)] leading-[.9] transition-colors group-hover:text-red">
              stellar
            </span>
            <span className="mt-4 block text-dim">
              Libraries and engines for people who make mods and packs, on Fabric and NeoForge.
            </span>
            <span className="mono mt-4 block text-faint">JAVA 25 〜 OPEN SOURCE 〜 MIT</span>
            <span className="mono mt-2 block text-bone transition-colors group-hover:text-red">
              {suite.map((m) => m.name.toUpperCase()).join(" 〜 ")} →
            </span>
          </a>
        </div>

        <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-8 px-5 py-16 sm:px-7">
          <Downloads />
          <p className="mono m-0 text-faint">
            {elsewhere.map(([label, href], i) => (
              <span key={label}>
                {i > 0 ? " 〜 " : null}
                <a className="transition-colors hover:text-red" href={href} rel="noreferrer" target="_blank">
                  {label} ↗
                </a>
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* yomion, a globe of language */}
      <section className="reveal relative px-5 py-28 sm:px-7" data-reveal id="yomion">
        <div className="mx-auto max-w-[1240px]">
          <div className="mt-14 grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Plate
              cell={13}
              cellSm={8}
              className="aspect-[16/10] w-full"
              kind="orb"
              label="A turning globe of kanji ringed by orbiting kana, one red star on the ring"
              reveal="center"
            />
            <div>
              <p className="mono m-0 text-faint">ALSO</p>
              <h2 className="mincho m-0 mt-5 text-[clamp(56px,7vw,112px)] leading-none">yomion</h2>
              <p className="mincho m-0 mt-5 text-[20px] font-normal">
                <Decode text="読む、覚える、手元で。" />
              </p>
              <p className="m-0 mt-5 max-w-[46ch] text-dim">
                A local-first Japanese-learning app — a quiet web experiment.
              </p>
              <a
                className="mono mt-7 inline-block text-bone no-underline transition-colors hover:text-red"
                href="https://yomion.com"
                rel="noreferrer"
                target="_blank"
              >
                YOMION.COM ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* the messenger: send word */}
      <section className="relative min-h-[100svh] overflow-hidden" id="word">
        <Plate
          cell={14}
          cellSm={10}
          className="absolute inset-0"
          kind="stream"
          label="Words in kanji streaming away from one small red figure on a curling current"
          options={{ x: 0.74 }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.96)_0%,rgba(5,5,5,.86)_38%,rgba(5,5,5,.2)_62%,transparent_80%)] max-md:bg-[linear-gradient(180deg,rgba(5,5,5,.2),rgba(5,5,5,.88)_30%,rgba(5,5,5,.88)_75%,rgba(5,5,5,.3))]"
        />
        <div className="relative z-[1] flex min-h-[100svh] items-center px-5 py-28 sm:px-7 md:pl-[8%]">
          <div className="max-w-[640px]">
            <div>
              <WordPanel />
            </div>
            <a
              className="mono mt-8 block text-bone no-underline transition-colors hover:text-red"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail.toUpperCase()}
            </a>
            <p className="m-0 mt-5 max-w-[44ch] text-dim">
              Open for projects, collaborations and commissions — or just a good word about
              anything.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
