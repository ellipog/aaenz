import { Clock } from "@/components/readout";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "elliot@aaenz.no";

/* The bar across the top of every page: wordmark, nav, a live clock. */
export default function SiteHeader({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  const items = [
    { en: "WORKS", href: `${base}#works` },
    { en: "MINECRAFT", href: "/minecraft" },
    { en: "GITHUB", href: "https://github.com/aaen-studios", external: true },
    { en: "CONTACT", href: home ? "#word" : `mailto:${contactEmail}` },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] bg-gradient-to-b from-void via-void/80 to-transparent px-5 pb-8 pt-4 sm:px-7">
      <div className="pointer-events-auto flex items-center justify-between gap-4">
        <a className="flex items-baseline gap-3 no-underline" href={home ? "#top" : "/"}>
          <span className="mincho text-[22px] leading-none tracking-[.08em]">aaen</span>
          <span className="mono hidden text-faint sm:inline">STUDIO</span>
        </a>
        <nav className="mono flex gap-x-4 sm:gap-x-6">
          {items.map((item) => (
            <a
              className="no-underline transition-colors hover:text-red"
              href={item.href}
              key={item.en}
              rel={item.external ? "noreferrer" : undefined}
              target={item.external ? "_blank" : undefined}
            >
              {item.en}
            </a>
          ))}
        </nav>
        <span className="mono hidden text-dim lg:inline">
          <Clock />
        </span>
      </div>
    </header>
  );
}
