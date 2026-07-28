import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * The concept picker used to live here. The Nedtur concept (02) has now been
 * built as a standalone café site at /demos/fjell-brekkestue — this route just
 * forwards there so any old links still resolve.
 */
export default async function FjellBrekkestueRedirect({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/demos/fjell-brekkestue?lang=${locale === "en" ? "en" : "no"}`);
}
