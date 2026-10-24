import Plate from "@/components/ascii/plate";
import { HORIZON, LIES, SHORE, STREAK } from "@/components/ascii/shore-shape";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "elliot@aaenz.no";

/*
 * The close is the shore after everything: a sky of stars with a red streak
 * down it, two colossi hung over a red sea, and a white strand where one of us
 * lies at the end of a line of footprints. The plate draws the characters; the
 * light under them — the crimson haze, the sea's glow, the white of the sand —
 * is laid here from the same horizon and waterline, so the page ends in white.
 * The footer is written on the sand in black, its links lying in two drifts
 * like tide lines. On a phone the beach runs on below the picture and the
 * links are written there.
 */
export default function SiteFooter({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  const links: [glyph: string, label: string, href: string][] = [
    ["天", "↑ TOP", "#top"],
    ["作", "WORKS", `${base}#works`],
    ["核", "KERN", "https://kern.aaenz.no"],
    ["詠", "GALDR", "https://github.com/aaen-studios/galdr"],
    ["読", "YOMION", "https://yomion.com"],
    ["星", "MINECRAFT", "/minecraft"],
    ["典", "ELLIPOG.DEV", "https://ellipog.dev"],
    ["源", "GITHUB", "https://github.com/aaen-studios"],
    ["文", "CONTACT", `mailto:${contactEmail}`],
    ["家", "AAENZ.NO", "/"],
  ];
  const out = (href: string) => (href.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {});
  const hz = HORIZON * 100;
  const sh = SHORE * 100;
  const sand = (f: number) => `${(sh + (100 - sh) * f).toFixed(2)}%`;
  const light = [
    `radial-gradient(ellipse 34% 9% at 61% ${hz}%, rgba(236,231,219,.13), transparent 70%)`,
    `linear-gradient(to bottom, transparent ${hz - 22}%, rgba(227,39,29,.05) ${hz - 10}%, rgba(227,39,29,.15) ${hz - 0.6}%, rgba(227,39,29,.32) ${hz + 0.2}%, rgba(227,39,29,.2) ${sh - 0.8}%, #c9c2b6 ${sh + 0.6}%, var(--color-bone) ${sh + 10}%)`,
    // under it all the night closes over the page's current
    "linear-gradient(to bottom, transparent, var(--color-void) 9%)",
  ].join(", ");
  // the streak's bloom, a soft wedge behind the characters, and the figure on the sand
  const bloom = (k: "wide" | "tall") => {
    const [x0, y0, x1, y1] = STREAK[k].map((v) => v * 100);
    return `${x0 - 1.8},${y0} ${x0 + 1.8},${y0} ${x1},${y1}`;
  };
  const lies = (k: "wide" | "tall") => ({ left: `${LIES[k][0] * 100}%`, top: sand(LIES[k][1]) });

  const credits = (
    <>
      <span className="mono text-void/50">AAEN STUDIOS ・ © MMXXVI</span>
      <span className="mono text-balance text-void/75">ELLIOT STRAND AAEN — FOUNDER &amp; LEAD ENGINEER</span>
    </>
  );

  return (
    <footer className="relative overflow-hidden">
      <div className="relative h-[min(176vw,860px)] lg:h-[clamp(640px,54vw,calc(100svh-24px))]" data-shore>
        <div aria-hidden className="absolute inset-0" style={{ backgroundImage: light }} />
        {(["wide", "tall"] as const).map((k) => (
          <svg
            aria-hidden
            className={`absolute inset-0 h-full w-full blur-[18px] [mask-image:linear-gradient(to_bottom,transparent_4%,#000_18%)] ${k === "wide" ? "hidden lg:block" : "lg:hidden"}`}
            key={k}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <polygon fill="rgba(227,39,29,.42)" points={bloom(k)} />
          </svg>
        ))}
        <Plate
          cell={10}
          cellSm={7}
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_7%,#000_86%,transparent)] lg:[mask-image:linear-gradient(to_bottom,transparent,#000_7%)]"
          fps={30}
          kind="shore"
          label="A shore drawn in characters: a night sky of stars with a red streak falling down it, two colossi with their arms outstretched hanging over a red sea, a glint on the horizon, and a white beach where a small red figure lies at the end of a line of footprints"
        />

        {(["wide", "tall"] as const).map((k) => (
          <span
            aria-hidden
            className={`mincho pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 -rotate-90 text-[clamp(20px,1.9vw,30px)] leading-none text-red ${k === "wide" ? "hidden lg:block" : "lg:hidden"}`}
            key={k}
            style={lies(k)}
          >
            大
          </span>
        ))}

        <p
          className="mincho pointer-events-none absolute left-[5%] m-0 text-[clamp(38px,10.5vw,60px)] leading-[.95] text-void lg:text-[clamp(52px,4.8vw,92px)]"
          style={{ top: sand(0.31) }}
        >
          Whatever
          <br />
          <span className="pl-[1.2em]">
            ships <span className="text-red">next</span>.
          </span>
        </p>

        <ul className="absolute right-[3.5%] m-0 hidden h-[15%] w-[53%] list-none p-0 lg:block" style={{ top: sand(0.3) }}>
          {links.map(([glyph, label, href], i) => {
            const row = i < 5 ? 0 : 1;
            const c = i % 5;
            const left = c * 19 + row * 8;
            const top = row * 55 + 12 + 12 * Math.sin(c * 0.9 + row * 1.8 + 0.3);
            return (
              <li className="absolute" key={label} style={{ left: `${left}%`, top: `${top.toFixed(1)}%` }}>
                <a className="group flex items-baseline gap-2 whitespace-nowrap py-1 no-underline" href={href} {...out(href)}>
                  <span className="mincho text-[13px] text-red">{glyph}</span>
                  <span className="mono text-void transition-colors group-hover:text-red">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="absolute inset-x-[5%] bottom-[3.5%] hidden items-baseline justify-between lg:flex">{credits}</div>
      </div>

      <div className="bg-bone px-5 pb-10 sm:px-7 lg:hidden" data-ground="light">
        <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-4 p-0">
          {links.map(([glyph, label, href]) => (
            <li key={label}>
              <a className="mono text-void no-underline transition-colors hover:text-red" href={href} {...out(href)}>
                <span className="mincho mr-1.5 text-[12px] text-red">{glyph}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">{credits}</div>
      </div>
    </footer>
  );
}
