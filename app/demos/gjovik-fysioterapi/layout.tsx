import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

/**
 * Gjøvik Fysioterapi — standalone physiotherapy clinic demo.
 *
 * Built in the "Lindrig" direction: a calm, spa-like healing aesthetic.
 * Warm bone ground, sage/moss greens, Fraunces display + Inter body. Reads
 * as reassurance and stillness — relief, not adrenaline.
 *
 * Lives OUTSIDE the [locale] segment (own header/footer) like the other
 * demos. Language via ?lang=no|en (default no). Palette exposed as CSS
 * variables under [data-physio="lindrig"].
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gjøvik Fysioterapi — ro i kroppen",
  description:
    "Gjøvik Fysioterapi. Manuell terapi, bevegelse og oppfølging — i et rom bygget for å roe ned.",
  // The demo is self-contained; use the clinic's own leaf mark, not the
  // host aaen favicon.
  icons: {
    icon: [{ url: "/demos/gjovik-fysioterapi/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/demos/gjovik-fysioterapi/favicon.svg"],
    apple: [{ url: "/demos/gjovik-fysioterapi/favicon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E9",
};

export default function PhysioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="no"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body
        data-physio="lindrig"
        style={
          {
            /* Lindrig palette — warm bone ground, sage/moss greens, one clay
               pop. Set on body so every clinic component inherits it. */
            "--physio-bg": "#F6F1E9",
            "--physio-paper": "#FBF8F2",
            "--physio-mist": "#E7E0D5",
            "--physio-surface": "#FBF8F2",
            "--physio-surface-deep": "#EFE8DB",
            "--physio-sage": "#A9BEA0",
            "--physio-sage-deep": "#6E8468",
            "--physio-accent": "#6E8468",
            "--physio-accent-soft": "#A9BEA0",
            "--physio-moss": "#37443A",
            "--physio-clay": "#C28762",
            "--physio-text": "#3B3631",
            "--physio-text-soft": "#7A7066",
            "--physio-rule": "#E0D8CB",
            "--physio-on-accent": "#FBF8F2",
            "--physio-glow": "rgba(169,190,160,0.35)",
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
