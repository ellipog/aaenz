import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * The concept picker used to live here. The Kraft direction (03) has now been
 * built as a standalone clinic site at /demos/gjovik-fysioterapi — this route
 * just forwards there so any old links still resolve.
 */
export default async function GjovikFysioterapiRedirect({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/demos/gjovik-fysioterapi?lang=${locale === "en" ? "en" : "no"}`);
}
