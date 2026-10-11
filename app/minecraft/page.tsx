import type { Metadata } from "next";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Minecraft — Aaen Studios",
  description:
    "Armature and Tenet by Aaen Studios — a multi-loader runtime and a server-authoritative quest engine, built under the names ellipog and stellar.",
  alternates: { canonical: "/minecraft" },
};

const reveal = "reveal";

const parallax =
  "supports-[animation-timeline:view()]:[animation-timeline:view()] supports-[animation-timeline:view()]:motion-reduce:[animation:none]";

export default function Minecraft() {
  return (
    <>
      <Reveal />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -inset-[10%] z-[80] bg-[url('/grain.svg')] bg-[size:240px_240px] mix-blend-multiply opacity-55"
      />

      <header className="fixed inset-x-0 top-0 z-[60] p-[20px_28px] text-paper mix-blend-difference">
        <div className="flex items-baseline justify-between gap-4">
          <a
            className="font-serif text-[28px] leading-none tracking-[.16em] no-underline"
            href="/"
          >
            aaen
          </a>
          <nav className="mono flex gap-x-5">
            <a className="no-underline transition-opacity hover:opacity-50" href="/minecraft">
              MINECRAFT
            </a>
            <a className="no-underline transition-opacity hover:opacity-50" href="/#works">
              WORKS
            </a>
            <a
              className="no-underline transition-opacity hover:opacity-50"
              href="https://github.com/aaen-studios"
              rel="noreferrer"
              target="_blank"
            >
              GITHUB
            </a>
            <a className="no-underline transition-opacity hover:opacity-50" href="mailto:elliot@aaenz.no">
              CONTACT
            </a>
          </nav>
        </div>
      </header>

      <section
        className={`relative bg-paper px-6 pb-[120px] pt-[150px] text-center ${reveal}`}
        data-reveal
        id="minecraft"
      >
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[6px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-red"
        />
        <span className="mono block text-faint">MINECRAFT</span>
        <h1 className="m-0 mt-5 font-serif text-[clamp(36px,5vw,72px)] font-normal leading-[1.06]">
          The <em className="italic text-red">load-bearing</em> parts.
        </h1>
        <p className="mx-auto m-0 mt-6 max-w-[56ch] text-dim">
          Two systems from the same hands — a runtime everything stands on, and an engine that
          decides what counts as done.
        </p>
        <div className="relative mx-auto mt-14 max-w-[1100px] text-left">
          <div className="relative -mx-6 overflow-hidden">
            <img
              alt=""
              className={`h-[320px] w-full object-cover [filter:grayscale(1)_contrast(1.1)] supports-[animation-timeline:view()]:animate-para-c ${parallax}`}
              src="/assets/gen-clouds-engraving.jpg"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-paper))]"
            />
            <span className="mono absolute bottom-4 left-1/2 -translate-x-1/2 text-paper mix-blend-difference">
              A CAUSEWAY · TWO MONUMENTS
            </span>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-[linear-gradient(var(--color-red),transparent_70%)] max-md:hidden"
          />

          <div className="relative z-[1] -mt-10">
            <span className="flex items-center gap-3">
              <span className="mono text-faint">01 · RUNTIME</span>
              <span className="jp grid h-[44px] w-[44px] -rotate-3 place-items-center border border-red text-[20px] text-red">
                基
              </span>
            </span>
            <p className="mt-1 font-serif text-[clamp(72px,15vw,210px)] font-light leading-[.9] text-ink">
              armature
            </p>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-snug text-dim">
              A loader seam with strict contracts — ordered events, typed networking, teams
              resolved by precedence.
            </p>
            <p className="m-0 mt-4 max-w-[56ch] text-dim">
              A single renderer seam carries every draw call, so interface is proven in unit
              tests that run in milliseconds — never eyeballed in screenshots. Configuration
              is read strictly: presence and type checked, mistakes answered with
              did-you-mean, every fault reported to file and line. Parties resolve by
              precedence, so servers behave the same no matter which social mods are
              installed. Standalone by design — nothing in it belongs to any one consumer.
            </p>
            <p className="mono mt-5 text-[11px] text-faint">
              VERSION-LOCKED WITH TENET · FABRIC + NEOFORGE · JAVA 21 · MIT
            </p>
            <p className="mono mt-4 text-[12px] text-faint">
              <a
                className="no-underline transition-colors hover:text-red"
                href="https://github.com/ellipog/armature"
                rel="noreferrer"
                target="_blank"
              >
                GITHUB ↗
              </a>{" "}
              ·{" "}
              <a
                className="no-underline transition-colors hover:text-red"
                href="https://ellipog.dev/docs/armature"
                rel="noreferrer"
                target="_blank"
              >
                DOCS ↗
              </a>
            </p>
          </div>

          <div className="relative z-[1] mt-20 text-right max-md:text-left">
            <span className="flex items-center justify-end gap-3 max-md:justify-start">
              <span className="mono text-faint">02 · ENGINE</span>
              <span className="jp grid h-[44px] w-[44px] rotate-2 place-items-center border border-red text-[20px] text-red">
                律
              </span>
            </span>
            <p className="mt-1 font-serif text-[clamp(72px,15vw,210px)] font-light leading-[.9] text-ink">
              tenet
            </p>
            <p className="ml-auto mt-4 max-w-[52ch] text-[14px] leading-snug text-dim max-md:ml-0">
              A declarative quest engine — validated to file and line, the server as sole
              arbiter.
            </p>
            <p className="m-0 ml-auto mt-4 max-w-[56ch] text-dim max-md:ml-0">
              Quest lines are plain JSON — one folder per group, one file per quest —
              reloaded live without restarting the server. Eighteen task types ask, ten
              reward types pay, six condition types gate — and open registries let addon
              mods teach it new verbs. The in-game editor batches a chapter into a single
              undoable act, and deleted nodes linger as tombstones until restored. Progress
              counts per party — pooled, per-member or owner-only — with the server deciding
              what counts throughout.
            </p>
            <p className="mono mt-5 text-[11px] text-faint">
              REQUIRES ARMATURE · JSON AUTHORING · IN-GAME EDITOR · MIT
            </p>
            <p className="mono mt-4 text-[12px] text-faint">
              <a
                className="no-underline transition-colors hover:text-red"
                href="https://github.com/ellipog/tenet"
                rel="noreferrer"
                target="_blank"
              >
                GITHUB ↗
              </a>{" "}
              ·{" "}
              <a
                className="no-underline transition-colors hover:text-red"
                href="https://ellipog.dev/docs/tenet"
                rel="noreferrer"
                target="_blank"
              >
                DOCS ↗
              </a>
            </p>
          </div>
        </div>
        <p className="mono mt-16 text-faint">
          <a className="transition-colors hover:text-red" href="/">
            ← AAENZ.NO
          </a>{" "}
          ·{" "}
          <a
            className="transition-colors hover:text-red"
            href="https://ellipog.dev"
            rel="noreferrer"
            target="_blank"
          >
            ELLIPOG.DEV ↗
          </a>{" "}
          ·{" "}
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
    </>
  );
}
