import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Allura } from "next/font/google";

/**
 * Fjell Brekkestue — standalone café demo (concept 02 "Nedtur", warm revision).
 *
 * This is a *fictional client site*. It lives OUTSIDE the [locale] segment so
 * the host aaen header/footer don't wrap it — it reads as its own complete
 * website that opens in a new tab from the portfolio card.
 *
 * Language is handled via a ?lang=no|en search param (default no), reflecting
 * that a real Norwegian mountain café would be primarily Norwegian with an
 * English option for tourists. No next-intl dependency — the café has its own
 * self-contained copy.
 *
 * The warm revision swaps the original cold-alpine grotesque (Archivo) for a
 * heritage pairing: Cormorant Garamond (high-contrast serif, all readable
 * copy) + Allura (a flowing copperplate script for the name & headings). Both
 * are loaded via next/font (self-hosted, no layout shift). The new "Arv"
 * palette — aged paper, forest ink, antique gold — is exposed as CSS variables
 * under [data-cafe] so every café component inherits it.
 */

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const allura = Allura({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-allura",
});

export const metadata: Metadata = {
  title: "Fjell Brekkestue — fjellkafe på toppen",
  description:
    "Fjell Brekkestue. En varm pause på turen — kaffe, kakao, nystekte vafler og utsikt over dalen.",
  // The demo is a standalone fictional client site, so it gets its own
  // favicon: the café's peak mark, NOT the host aaen studios mark.
  icons: {
    icon: [{ url: "/demos/fjell-brekkestue/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/demos/fjell-brekkestue/favicon.svg"],
    apple: [{ url: "/demos/fjell-brekkestue/favicon.svg" }],
  },
};

export const viewport: Viewport = {
  // Keep the café feeling like a destination, not an app.
  themeColor: "#23372e",
};

export default function CafeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className={`${cormorant.variable} ${allura.variable}`}>
      <body
        data-cafe="arv"
        style={
          {
            /* "Arv" palette — aged paper, forest ink, antique gold. The warm,
               old-world counterpart to the original cold-alpine Nedtur set.
               Set on body so every café component inherits it. */
            "--cafe-bg": "#f3ece0",
            "--cafe-surface": "#ece2cf",
            "--cafe-surface-deep": "#e0d4ba",
            "--cafe-text": "#23372e",
            "--cafe-text-soft": "#5c5546",
            "--cafe-accent": "#9a6a2f",
            "--cafe-accent-soft": "#d4a24a",
            "--cafe-on-dark": "#f5ecd6",
            "--cafe-on-dark-soft": "#e7d3a8",
            "--cafe-rule": "#23372e26",
            backgroundColor: "var(--cafe-bg)",
            color: "var(--cafe-text)",
            fontFamily: "var(--font-cormorant), Georgia, serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
