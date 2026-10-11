import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minecraft — Aaen Studios",
  description:
    "Armature and Tenet by Aaen Studios — a multi-loader runtime and a server-authoritative quest engine, built under the names ellipog and stellar.",
  alternates: { canonical: "/minecraft" },
};

export default function Minecraft() {
  return (
    <div className="bg-paper text-ink">
      <header className="mx-auto max-w-[1100px] px-6 pb-4 pt-[150px] text-center">
        <span className="mono block text-faint">MINECRAFT</span>
        <h1 className="m-0 mt-5 font-serif text-[clamp(44px,7vw,96px)] font-normal leading-[1.0]">
          Foundations, <em className="italic text-red">not addons</em>.
        </h1>
        <p className="mx-auto m-0 mt-6 max-w-[58ch] text-dim">
          Two systems — a runtime everything stands on, and an engine that decides what counts
          as done.
        </p>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 pb-[130px]">
        <div className="relative mt-12 overflow-hidden">
          <img
            alt=""
            className="h-[300px] w-full object-cover [filter:grayscale(1)_contrast(1.1)]"
            src="/assets/gen-colossus-clouds.jpg"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-paper))]"
          />
          <span className="mono absolute bottom-4 left-1/2 -translate-x-1/2 text-paper mix-blend-difference">
            THE FACELESS GIANT · ABOVE THE CLOUDS
          </span>
        </div>

        <section className="relative z-[1] -mt-8">
          <span className="flex items-center gap-3">
            <span className="mono text-faint">01 · RUNTIME</span>
            <span className="jp grid h-[44px] w-[44px] -rotate-3 place-items-center border border-red text-[20px] text-red">
              基
            </span>
          </span>
          <h2 className="m-0 mt-1 font-serif text-[clamp(64px,14vw,200px)] font-light leading-[.9]">
            armature
          </h2>
          <p className="m-0 mt-5 max-w-[60ch] text-dim">
            A loader seam with strict contracts — ordered events, typed networking, teams
            resolved by precedence — plus a game-free interface toolkit proven in milliseconds,
            not screenshots.
          </p>
          <p className="mono mt-5 text-[12px] text-faint">
            SEAM · EVENTS · NETWORK · TEAMS · TOOLKIT
          </p>
          <p className="mono mt-6 text-[12px]">
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
        </section>

        <div className="relative mt-24 overflow-hidden">
          <img
            alt=""
            className="h-[300px] w-full object-cover [filter:grayscale(1)_contrast(1.1)]"
            src="/assets/gen-field-fall.jpg"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-paper))]"
          />
          <span className="mono absolute bottom-4 left-1/2 -translate-x-1/2 text-paper mix-blend-difference">
            THE FIELD · AFTER THE FALL
          </span>
        </div>

        <section className="relative z-[1] -mt-8 text-right">
          <span className="flex items-center justify-end gap-3">
            <span className="mono text-faint">02 · ENGINE</span>
            <span className="jp grid h-[44px] w-[44px] rotate-2 place-items-center border border-red text-[20px] text-red">
              律
            </span>
          </span>
          <h2 className="m-0 mt-1 font-serif text-[clamp(64px,14vw,200px)] font-light leading-[.9]">
            tenet
          </h2>
          <p className="ml-auto m-0 mt-5 max-w-[60ch] text-dim">
            A declarative quest engine — validated to file and line, edited in place with undo,
            progress shared across parties with the server as sole arbiter.
          </p>
          <p className="mono mt-5 text-[12px] text-faint">
            DECLARE · VALIDATE · EDIT · SHARE
          </p>
          <p className="mono mt-6 text-[12px]">
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
        </section>

        <p className="mono mt-24 text-center text-faint">
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
          </a>{" "}
          ·{" "}
          <a className="transition-colors hover:text-red" href="/">
            ← AAENZ.NO
          </a>
        </p>
        <p className="mono mt-4 text-center text-faint">OPEN SOURCE · MIT</p>
      </main>
    </div>
  );
}
