import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ContourMark } from "@/components/ui/ContourMark";
import { UnchartedField } from "@/components/ui/UnchartedField";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NotFound" });
  return { title: t("title") };
}

export default async function NotFoundPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden">
      <UnchartedField className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <ContourMark className="mx-auto h-20 w-20 text-moss" pulse />
        <h1 className="mt-8 font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-5 font-display text-lg leading-relaxed text-ink-soft">
          {t("body")}
        </p>
        {t.has("whisper") && (
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
            {t("whisper")}
          </p>
        )}
        <div className="mt-8 flex justify-center">
          <Button href="/">{t("cta")}</Button>
        </div>
      </div>
    </section>
  );
}
