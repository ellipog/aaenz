import type { Metadata, Viewport } from "next";
import SiteSchema from "@/components/site-schema";
import "./globals.css";

const title = "aaen studios — open source tools and products";
const description =
  "aaen studios is an independent software studio by Elliot Strand Aaen — maker of kern and galdr, open source desktop tools, and yomion, a local-first Japanese-learning app.";

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
   * The tab icon: the studio's own mark, one file per ground, resolved before first paint.
   *
   * `logo-mark-light.png` is the mark drawn in LIGHT ink, so it is the one for a DARK ground. The name
   * describes the ink rather than the background, and that is the one trap here — the pair reads backwards
   * from how it is used. The dark-ink `logo-mark.png` is the one for a light ground, and until now it was
   * referenced nowhere: the page only ever uses the light-ink file, on its ink bands.
   *
   * The light-ground file is listed last, deliberately. A consumer that ignores `media` — anything before
   * Safari 15, and some crawlers — takes the last icon it can use, so the dark-ink mark becomes the
   * accidental default. The failure is then a mark on the wrong ground rather than no mark at all.
   *
   * The query reads the OS preference, and so does the browser's chrome — but not this page, which is
   * paper only. So the tab's ground is the browser's own and the stylesheet cannot know which it is.
   * `themeColor` below is the one case this gets wrong: a phone toolbar is #101010 whatever the OS says,
   * so a light-mode phone shows dark ink on a dark bar. Dropping `themeColor`, or exporting a plated icon
   * for that one case, are the two ways out; neither is worth doing speculatively.
   *
   * This replaces `public/favicon.svg` — the same drawing hand-built at a heavier stroke, with a paper
   * plate behind it. That file is the safer one on chrome of an unknown colour, and removing it is
   * deliberate: the mark is already in this repository twice, and a third redrawn copy is one more thing
   * to keep in step whenever the mark changes.
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
  themeColor: "#101010",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
         * The class below arms the reveal animation in `globals.css`. Without scripting —
         * crawlers, readers with JS off — it never lands, and every band stays visible.
         */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Hina+Mincho&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteSchema />
        {children}
      </body>
    </html>
  );
}
