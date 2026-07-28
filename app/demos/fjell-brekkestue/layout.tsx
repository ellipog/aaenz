import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

/**
 * Fjell Brekkestue — standalone café demo (concept 02 "Nedtur").
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
 * The Archivo family is loaded through next/font (self-hosted, no layout shift).
 * The Nedtur palette is exposed as CSS variables under [data-cafe].
 */

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
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
  themeColor: "#1c2422",
};

export default function CafeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className={archivo.variable}>
      <body
        data-cafe="nedtur"
        style={
          {
            /* Nedtur palette — cold alpine ground, one burning signal-orange.
               Set on body so every café component inherits it. */
            "--cafe-bg": "#f4f5f3",
            "--cafe-surface": "#e9eceb",
            "--cafe-surface-deep": "#dcdfe0",
            "--cafe-text": "#1c2422",
            "--cafe-text-soft": "#5a6360",
            "--cafe-accent": "#e8552b",
            "--cafe-accent-soft": "#f08a63",
            "--cafe-on-dark": "#f4f5f3",
            "--cafe-on-dark-soft": "#b6bcb9",
            "--cafe-rule": "#1c24221a",
            backgroundColor: "var(--cafe-bg)",
            color: "var(--cafe-text)",
            fontFamily: "var(--font-archivo), system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
