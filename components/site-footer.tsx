import Plate from "@/components/ascii/plate";
import { SPHERES, SPHERE_R, TREE_H, TREE_TOP, TREE_W, TREE_X } from "@/components/ascii/tree-shape";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "elliot@aaenz.no";

/*
 * The close is a picture: the Tree of Life, drawn in characters, with the
 * footer written onto it. Each link hangs beside the sphere whose meaning it
 * fits — the foundation leads to the Minecraft work, wisdom to the language
 * app, mercy to the inbox — and the crown leads back to the top. The picture's
 * height is a custom property, so the links land on spheres the plate draws
 * from the same numbers. On a phone the tree stands alone and the links fall in
 * below it.
 */
export default function SiteFooter({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  // one per sphere, crown to kingdom
  const links: [label: string, href: string][] = [
    ["↑ TOP", "#top"],
    ["YOMION", "https://yomion.com"],
    ["GITHUB", "https://github.com/aaen-studios"],
    ["CONTACT", `mailto:${contactEmail}`],
    ["KERN", "https://kern.aaenz.no"],
    ["WORKS", `${base}#works`],
    ["GALDR", "https://github.com/aaen-studios/galdr"],
    ["ELLIPOG.DEV", "https://ellipog.dev"],
    ["MINECRAFT", "/minecraft"],
    ["AAENZ.NO", "/"],
  ];
  const out = (href: string) => (href.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {});
  const r = TREE_H * SPHERE_R;

  return (
    <footer className="relative overflow-hidden">
      <p className="mincho m-0 px-5 pt-20 text-[clamp(44px,8vw,96px)] leading-[.95] sm:px-7 xl:hidden">
        Whatever
        <br />
        <span className="pl-[1.2em]">
          ships <span className="text-red">next</span>.
        </span>
      </p>

      <div className="relative mt-4 aspect-[1/1.2] w-full [--h:min(calc(100svh-110px),60vw)] md:mt-0 md:aspect-auto md:h-[var(--h)]">
        <Plate
          cell={14}
          cellSm={9}
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_4%,#000_93%,transparent)]"
          fps={30}
          kind="tree"
          label="The Tree of Life drawn in characters, ten spheres and their paths over a dark sea; red lightning runs down it and a cross of light erupts from the horizon"
        />

        <p className="mincho pointer-events-none absolute bottom-[24%] left-[5%] m-0 hidden text-[clamp(56px,6.2vw,112px)] leading-[.95] xl:block">
          Whatever
          <br />
          <span className="pl-[1.2em]">
            ships <span className="text-red">next</span>.
          </span>
        </p>

        <ul className="m-0 hidden list-none p-0 md:block">
          {SPHERES.map((s, i) => {
            const [label, href] = links[i];
            const left = s.u === 0;
            const side = left ? -1 : 1;
            const x = `calc(${TREE_X * 100}% + var(--h) * ${(TREE_H * TREE_W * (s.u - 0.5) + side * r * 1.7).toFixed(4)})`;
            const y = `calc(var(--h) * ${(TREE_TOP + TREE_H * s.v).toFixed(4)})`;
            return (
              <li
                className={`absolute -translate-y-1/2 ${left ? "-translate-x-full text-right" : ""}`}
                key={label}
                style={{ left: x, top: y }}
              >
                <a
                  className="group block whitespace-nowrap bg-[radial-gradient(ellipse_closest-side,rgba(5,5,5,.92)_55%,rgba(5,5,5,0))] px-5 py-2 no-underline"
                  href={href}
                  {...out(href)}
                >
                  <span className="mono block text-bone transition-colors group-hover:text-red">{label}</span>
                  <span className="mono block text-[10px] text-faint">{s.means}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 pb-10 sm:px-7">
        <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-4 p-0 md:hidden">
          {SPHERES.map((s, i) => {
            const [label, href] = links[i];
            return (
              <li key={label}>
                <a className="mono text-dim no-underline transition-colors hover:text-red" href={href} {...out(href)}>
                  <span className="mincho mr-1.5 text-[12px] text-red">{s.glyph}</span>
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 flex flex-col gap-x-10 gap-y-1.5 md:mt-2 md:flex-row md:items-baseline md:justify-between">
          <span className="mono text-faint">AAEN STUDIOS ・ © MMXXVI</span>
          <span className="mono text-dim">ELLIOT STRAND AAEN — FOUNDER &amp; LEAD ENGINEER</span>
        </div>
      </div>
    </footer>
  );
}
