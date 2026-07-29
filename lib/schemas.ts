import { z } from "zod";

/**
 * Contact / wizard submission schema.
 *
 * Required: name, email, message (min length).
 * Optional: business, projectType (legacy), tier, service, businessName,
 *           businessDesc, pages[], contentStatus, timeline, source.
 *
 * The wizard sends the richer fields; the plain contact form sends the basic
 * ones. The API includes only non-empty fields in the email.
 */
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  business: z.string().max(100).optional().or(z.literal("")),
  // Legacy field from the plain contact form's project-type dropdown.
  projectType: z
    .enum(["start", "vekst", "custom", "unsure"])
    .optional()
    .default("unsure"),
  // Wizard fields (all optional — steps can be skipped).
  tier: z.string().max(50).optional().or(z.literal("")),
  service: z.string().max(50).optional().or(z.literal("")),
  businessName: z.string().max(200).optional().or(z.literal("")),
  businessDesc: z.string().max(2000).optional().or(z.literal("")),
  pages: z.array(z.string().max(50)).optional().default([]),
  contentStatus: z.string().max(50).optional().or(z.literal("")),
  timeline: z.string().max(50).optional().or(z.literal("")),
  source: z.string().max(50).optional().or(z.literal("")),
  // Wizard leaves message optional (no required UI), so accept empty/missing.
  // The plain contact form still enforces min length client-side via HTML
  // required + minLength attributes; the looser server rule causes no regression.
  message: z.string().max(2000).optional().or(z.literal("")),
  locale: z.enum(["no", "en"]).optional().default("no"),
  /** Honeypot — must be empty. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
