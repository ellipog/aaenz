const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "elliot@aaenz.no";

const ticker = ["KERN", "GALDR", "ARMATURE", "TENET", "YOMION", "SEND WORD"];

/*
 * The close: a next-episode card, a ticker of every work carried along a wave,
 * then the credit line.
 */
export default function SiteFooter({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  const run = ticker.map((name) => `〜〜〜 ${name} `).join("");

  return (
    <footer className="relative bg-void">
      <div className="mx-auto max-w-[1240px] px-5 pb-14 pt-20 sm:px-7">
        <p className="mono text-faint">NEXT EPISODE</p>
        <p className="mincho mt-4 text-[clamp(40px,6vw,84px)] leading-[1]">
          Whatever ships <span className="text-red">next</span>.
        </p>
        <p className="mono mt-4 pl-[2.4em] text-dim">BUILT HERE, KEPT HERE.</p>
      </div>

      <div aria-hidden="true" className="overflow-hidden py-3">
        <p className="mono m-0 flex w-max animate-marquee whitespace-nowrap text-faint">
          <span>{run.repeat(4)}</span>
          <span>{run.repeat(4)}</span>
        </p>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-10 gap-y-4 px-5 py-8 sm:px-7">
        <div className="flex flex-col gap-y-1.5">
          <span className="mono text-faint">AAEN STUDIOS ・ © MMXXVI</span>
          <span className="mono text-dim">ELLIOT STRAND AAEN — FOUNDER &amp; LEAD ENGINEER</span>
        </div>
        <nav className="mono flex flex-wrap gap-x-6 gap-y-2">
          <a className="text-dim no-underline transition-colors hover:text-red" href="/minecraft">
            MINECRAFT
          </a>
          <a className="text-dim no-underline transition-colors hover:text-red" href={`${base}#works`}>
            WORKS
          </a>
          <a
            className="text-dim no-underline transition-colors hover:text-red"
            href="https://kern.aaenz.no"
            rel="noreferrer"
            target="_blank"
          >
            KERN
          </a>
          <a
            className="text-dim no-underline transition-colors hover:text-red"
            href="https://github.com/aaen-studios/galdr"
            rel="noreferrer"
            target="_blank"
          >
            GALDR
          </a>
          <a
            className="text-dim no-underline transition-colors hover:text-red"
            href="https://yomion.com"
            rel="noreferrer"
            target="_blank"
          >
            YOMION
          </a>
          <a
            className="text-dim no-underline transition-colors hover:text-red"
            href="https://github.com/aaen-studios"
            rel="noreferrer"
            target="_blank"
          >
            GITHUB
          </a>
          <a className="text-dim no-underline transition-colors hover:text-red" href={`mailto:${contactEmail}`}>
            CONTACT
          </a>
        </nav>
      </div>
    </footer>
  );
}
