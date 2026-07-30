import { useLocale, useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContourMark } from "@/components/ui/ContourMark";
import { ContactForm } from "@/components/contact/ContactForm";
import { WizardTrigger } from "@/components/wizard/WizardTrigger";
import { CONTACT_EMAIL } from "@/lib/site";

export function ContactCTA() {
  const t = useTranslations("ContactCTA");
  const locale = useLocale() as "no" | "en";

  return (
    <section id="kontakt" className="relative overflow-hidden bg-moss-deep text-paper">
      {/* faint contour grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#9EC09E 1px, transparent 1px), linear-gradient(90deg, #9EC09E 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2">
        {/* Left — pitch */}
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-px w-8 bg-paper/60" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70">
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md font-display text-lg leading-relaxed text-paper/80">
            {t("lede")}
          </p>

          {/* Wizard shortcut */}
          <div className="mt-6">
            <WizardTrigger
              variant="secondary"
              className="!bg-paper !text-ink"
            >
              {locale === "no" ? "Start med veiviseren →" : "Start with the wizard →"}
            </WizardTrigger>
          </div>

          {/* Direct contact alternative */}
          <div className="mt-10 rounded-sm border border-paper/20 p-6">
            <ContourMark className="h-10 w-10 text-paper" />
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/60">
              {locale === "no" ? "Foretrekker du å skrive direkte?" : "Prefer to write directly?"}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-1 inline-block font-display text-xl text-paper underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        {/* Right — the form */}
        <div className="rounded-sm border border-paper/20 bg-paper p-6 text-ink sm:p-8">
          <ContactForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
