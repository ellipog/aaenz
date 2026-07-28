import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";

/**
 * Gjøvik Fysioterapi — standalone physiotherapy clinic demo.
 *
 * Built in the chosen Kraft direction (concept 03): dark, electric-lime,
 * condensed display — a performance lab, not a hospital.
 *
 * Like the fjell-brekkestue demo, this lives OUTSIDE the [locale] segment so
 * the host aaen header/footer don't wrap it — it reads as its own complete
 * website. Language is handled via a ?lang=no|en search param (default no).
 *
 * Archivo (display, condensed/heavy) + Inter (body) are loaded through
 * next/font (self-hosted, no layout shift). The Kraft palette is exposed as
 * CSS variables under [data-physio].
 */

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gjøvik Fysioterapi — tilbake i aksjon",
  description:
    "Gjøvik Fysioterapi. Manuell terapi, idrettsskader og treningsterapi. Book i dag, kom i morgen.",
};

export const viewport: Viewport = {
  themeColor: "#0e1116",
};

export default function PhysioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className={`${archivo.variable} ${inter.variable}`}>
      <body
        data-physio="kraft"
        style={
          {
            /* Kraft palette — dark performance-lab ground, one electric lime.
               Set on body so every clinic component inherits it. */
            "--physio-bg": "#0e1116",
            "--physio-surface": "#1a1f27",
            "--physio-surface-deep": "#15191f",
            "--physio-text": "#f0f2f5",
            "--physio-text-soft": "#9aa3af",
            "--physio-accent": "#d6ff3a",
            "--physio-accent-soft": "#a8c92e",
            "--physio-on-accent": "#0e1116",
            "--physio-rule": "#f0f2f51a",
            backgroundColor: "var(--physio-bg)",
            color: "var(--physio-text)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
