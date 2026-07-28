/**
 * Site-wide constants. Single source of truth for the contact email.
 *
 * The contact email is read from NEXT_PUBLIC_CONTACT_EMAIL so it is available
 * on BOTH the server and the client (footer, CTA, contact form error copy).
 * Change it in `.env.local` — no code edits needed.
 *
 * `CONTACT_TO_EMAIL` (server-only, in lib/resend.ts) is what the API route
 * delivers to. Keep the two in sync via .env.local.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "elliot@aaenz.no";
