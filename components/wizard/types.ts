import type { Locale } from "@/i18n/routing";

/**
 * Shared wizard state — collected across steps, submitted at the end.
 * Every field except `name`, `email` is optional (steps can be skipped).
 */
export type WizardData = {
  // Step 1 — business
  businessName: string;
  businessDesc: string;
  // Step 2 — pages (multi)
  pages: string[];
  // Step 3 — content status (single)
  contentStatus: string;
  // Step 4 — timeline (single)
  timeline: string;
  // Step 5 — contact
  name: string;
  email: string;
  tier: string;
  message: string;
};

export const emptyWizardData: WizardData = {
  businessName: "",
  businessDesc: "",
  pages: [],
  contentStatus: "",
  timeline: "",
  name: "",
  email: "",
  tier: "unsure",
  message: "",
};

export type StepProps = {
  data: WizardData;
  update: (patch: Partial<WizardData>) => void;
  locale: Locale;
};
