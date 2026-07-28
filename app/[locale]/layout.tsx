import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
});

/** Static-render both locales at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const title = `${t("siteName")} - ${t("tagline")}`;
  const description = t("tagline");

  return {
    metadataBase: new URL("https://aaenz.no"),
    title: {
      default: title,
      template: `%s · ${t("siteName")}`,
    },
    description,
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/brand/favicon-light.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      url: "https://aaenz.no",
      siteName: t("siteName"),
      title,
      description,
      locale: locale === "no" ? "nb_NO" : "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: locale === "en" ? "/en" : "/",
      languages: {
        no: "/",
        en: "/en",
        "x-default": "/",
      },
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "aaen studios",
    description: locale === "no"
      ? "Norsk byrå som bygger nettsider for bedrifter - små som store."
      : "A Norwegian studio building websites for businesses - small and large.",
    url: "https://aaenz.no",
    email: "elliot@aaenz.no",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Elliot Strand Aaen",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gjøvik",
      addressCountry: "NO",
    },
    areaServed: { "@type": "Country", name: "Norway" },
    sameAs: [
      "https://www.linkedin.com/company/aaen-studios/",
      "https://github.com/Ellipog",
    ],
  };

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-moss focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.14em] focus:text-paper"
          >
            {locale === "no" ? "Hopp til innhold" : "Skip to content"}
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
