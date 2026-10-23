import type { Metadata, Viewport } from "next";
import Plate from "@/components/ascii/plate";
import SiteSchema from "@/components/site-schema";
import "./globals.css";

const title = "aaen studios — open source tools and products";
const description =
  "Aaen Studios is an independent software studio — Armature and Tenet for Minecraft on Fabric and NeoForge, plus kern and galdr, open source desktop tools, and yomion, a local-first Japanese-learning app.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aaenz.no"),
  title,
  description,
  applicationName: "aaen studios",
  openGraph: {
    type: "website",
    siteName: "aaen studios",
    locale: "en",
    url: "https://aaenz.no/",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },

  /*
   * The tab icon: the studio's own mark, one file per ground, chosen by the OS preference.
   *
   * `logo-mark-light.png` is the mark in LIGHT ink, so it is the one for a DARK ground — the names
   * describe the ink, not the background, which reads backwards from how they are used. The dark-ink
   * `logo-mark.png` serves a light ground and is listed last on purpose: a consumer that ignores `media`
   * takes the last icon it can use, so the worst case is a mark on the wrong ground, never no mark.
   *
   * The page itself is void-black in every mode, but the tab's ground is the browser's own. `themeColor`
   * below is the one case this gets wrong: a phone toolbar is #050505 whatever the OS says, so a
   * light-mode phone shows dark ink on a dark bar. Neither fix (drop `themeColor`, or a plated icon) is
   * worth doing speculatively.
   */
  icons: {
    icon: [
      {
        url: "/assets/logo-mark.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/assets/logo-mark-light.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

/*
 * Runs before first paint. `js` arms the reveal animation; `go` means the cold open
 * is skipped — already seen this session, motion reduced, a deep link, or not the
 * home page — so the hero decodes at once instead of waiting for the hand-over.
 */
const HEAD_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('aaen-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches||location.hash||location.pathname!=='/')d.classList.add('go')}catch(e){d.classList.add('go')}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * Without scripting — crawlers, readers with JS off — neither class lands: every
         * band stays visible and the cold open never shows.
         */}
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;900&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteSchema />
        {/* the current: a faint stream under every page, carried along by the scroll */}
        <Plate cell={18} cellSm={14} className="pointer-events-none fixed inset-0 -z-10" fps={24} interactive={false} kind="current" reveal="none" />
        {children}
        {/*
         * The broadcast: a vignette and film grain over everything, so the whole page
         * reads as one transmission rather than a stack of panels.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90] bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,.55))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -inset-[10%] z-[91] bg-[url('/grain.svg')] bg-[size:240px_240px] opacity-70 mix-blend-screen"
        />
      </body>
    </html>
  );
}
