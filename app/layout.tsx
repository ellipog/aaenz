import type { Metadata, Viewport } from "next";
import Plate from "@/components/ascii/plate";
import Cursor from "@/components/cursor";
import SiteSchema from "@/components/site-schema";
import "./globals.css";

const title = "aaen studios — open source tools and products";
const description =
  "Aaen Studios is an independent software studio — Stellar, a suite of Minecraft mods for Fabric and NeoForge, plus kern and galdr, open source desktop tools, and yomion, a local-first Japanese-learning app.";

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

// Runs before first paint: `js` arms the reveal animation, so readers without scripting see every band.
const HEAD_SCRIPT = `document.documentElement.classList.add('js')`;

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
        {/* the current: a faint stream under every page, carried along by the scroll (a little taller than
            the window, so the part of a row it is carried by never shows an edge) */}
        <Plate
          cell={18}
          cellSm={14}
          className="pointer-events-none fixed inset-x-0 -inset-y-6 -z-10"
          fps={24}
          interactive={false}
          kind="current"
          reveal="none"
        />
        {children}
        {/*
         * The broadcast: a vignette and film grain over everything, so the whole page
         * reads as one transmission rather than a stack of panels. One still layer, no
         * blend mode: the grain is white at the strength of each speck (what screening
         * its grey over the page came to), so the compositor never re-blends the page.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90]"
          style={{
            backgroundImage: "url('/grain.svg'), radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,.55))",
            backgroundSize: "240px 240px, auto",
          }}
        />
        {/* the cursor, drawn in characters above the broadcast */}
        <Cursor />
      </body>
    </html>
  );
}
