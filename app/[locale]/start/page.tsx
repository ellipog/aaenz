import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Wizard } from "@/components/wizard/Wizard";
import { ContourField } from "@/components/ui/ContourField";
import { ContourMark } from "@/components/ui/ContourMark";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tier?: string; service?: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Wizard" });
  return { title: t("pageTitle"), description: t("pageDescription") };
}

const validTiers = ["start", "vekst", "tilpasset", "unsure"];
const validServices = ["logo-og-identitet", "profilmanual"];

export default async function StartPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { tier, service } = await searchParams;
  const initialTier = tier && validTiers.includes(tier) ? tier : undefined;
  const initialService =
    service && validServices.includes(service) ? service : undefined;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Subtle contour field backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden>
        <ContourField
          levels={8}
          showPeaks={false}
          className="h-full w-full"
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col px-5 py-10 sm:px-8 sm:py-14">
        {/* Top — lockup + back */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-moss"
          >
            <ContourMark className="h-7 w-7 text-moss" />
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              aaen studios
            </span>
          </Link>
          <Link
            href="/#priser"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone transition-colors hover:text-moss"
          >
            ← {locale === "no" ? "Tilbake" : "Back"}
          </Link>
        </div>

        {/* Wizard — full desktop width, framed stage */}
        <div className="flex flex-1 flex-col rounded-sm border border-stone-soft/60 bg-paper/90 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <Wizard initialTier={initialTier} initialService={initialService} />
        </div>
      </div>
    </section>
  );
}
