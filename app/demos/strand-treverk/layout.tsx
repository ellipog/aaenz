import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/**
 * Strand Treverk — standalone carpentry demo (concept 02 "Verksted").
 *
 * This is a *fictional client site*. It lives OUTSIDE the [locale] segment so
 * the host aaen header/footer don't wrap it — it reads as its own complete
 * website that opens in a new tab from the portfolio card.
 *
 * Language is handled via a ?lang=no|en search param (default no), reflecting
 * that a real Norwegian coastal carpenter would be primarily Norwegian with an
 * English option. No next-intl dependency — the carpenter has its own
 * self-contained copy.
 *
 * The IBM Plex families are loaded through next/font (self-hosted, no layout
 * shift). The Verksted palette (kraft-paper ground, graphite text, one
 * burnt-orange accent) is exposed as CSS variables under [data-workshop].
 */

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-sans",
});

export const metadata: Metadata = {
  title: "Strand Treverk — snekkerarbeid fra kysten",
  description:
    "Strand Treverk. Tilpasset snekkerarbeid fra verkstedet ved sjøen — kabinett, trapper, uterom og hele hytter.",
  // The demo is self-contained; use the carpenter's own square mark, not the
  // host aaen favicon.
  icons: {
    icon: [{ url: "/demos/strand-treverk/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/demos/strand-treverk/favicon.svg"],
    apple: [{ url: "/demos/strand-treverk/favicon.svg" }],
  },
};

export const viewport: Viewport = {
  // Kraft-paper ground, so the browser chrome matches.
  themeColor: "#e8e3d6",
};

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="no"
      className={`${plexMono.variable} ${plexSans.variable}`}
    >
      <body
        data-workshop="verksted"
        style={
          {
            /* Verksted palette — kraft-paper ground, graphite ink, one
               burnt-orange accent (the red pencil mark on a plan). Set on body
               so every workshop component inherits it. */
            "--ws-bg": "#e8e3d6",
            "--ws-surface": "#d9d3c2",
            "--ws-surface-deep": "#ccc4ae",
            "--ws-text": "#26221b",
            "--ws-text-soft": "#5c574a",
            "--ws-accent": "#b8552b",
            "--ws-accent-soft": "#d18a64",
            "--ws-on-dark": "#f3eee2",
            "--ws-on-dark-soft": "#a39e8c",
            "--ws-rule": "#26221b1a",
            /* Drawing-sheet refinements: a faint graphite grid line for the
               blueprint paper, and a deeper pencil tone for marginalia. */
            "--ws-grid": "#26221b0d",
            "--ws-graphite": "#3a352b",
            backgroundColor: "var(--ws-bg)",
            color: "var(--ws-text)",
            fontFamily: "var(--font-plex-sans), system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
