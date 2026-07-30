import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Process } from "@/components/sections/Process";
import { Portfolio } from "@/components/sections/Portfolio";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Ridgeline } from "@/components/ui/Ridgeline";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustStrip />
      <Process />
      <Portfolio />
      <Pricing />
      <Faq />
      <Ridgeline seed={11} bg="var(--color-paper)" fill="var(--color-moss-deep)" tone="paper" className="-mb-px" />
      <ContactCTA />
    </>
  );
}
