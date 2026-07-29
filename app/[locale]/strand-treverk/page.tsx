import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * The concept picker used to live here. The Verksted direction (02) has now
 * been built as a standalone carpentry site at /demos/strand-treverk — this
 * route just forwards there so any old links still resolve.
 */
export default async function StrandTreverkRedirect({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/demos/strand-treverk?lang=${locale === "en" ? "en" : "no"}`);
}
