import { Resend } from "resend";

/**
 * Lazily-initialized Resend client.
 * Requires RESEND_API_KEY in the environment (see `.env.local.example`).
 */
let client: Resend | null = null;

export function getResend(): Resend {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env.local — see .env.local.example."
    );
  }
  client = new Resend(key);
  return client;
}

export const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL ?? "elliot@aaenz.no";

export const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ??
  "aaenz.no <onboarding@resend.dev>";
