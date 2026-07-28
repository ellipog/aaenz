import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, getResend } from "@/lib/resend";
import {
  pageOptions,
  contentOptions,
  timelineOptions,
  tierOptions,
} from "@/lib/wizard-options";

export const runtime = "nodejs";

/** Look up a human-readable label for a wizard option value. */
function labelFor(
  options: { value: string; label: { no: string; en: string } }[],
  value: string | undefined,
): string | null {
  if (!value) return null;
  const opt = options.find((o) => o.value === value);
  return opt ? opt.label.no : value;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  // Honeypot tripped — pretend it worked.
  if (parsed.success && parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return NextResponse.json(
      { error: "validation", errors },
      { status: 422 },
    );
  }

  const d = parsed.data;
  const isWizard = d.source === "wizard";
  const tierLabel = labelFor(tierOptions, d.tier);

  // ─── Build the email body ───────────────────────────────────────────────
  // Only include non-empty fields. Skipped steps never appear.
  const lines: string[] = [];
  const sections: { label: string; value: string }[] = [];

  // Header (always present)
  lines.push(`${d.name} <${d.email}>`);
  if (d.business) lines.push(`Bedrift: ${d.business}`);

  // Tier / service context
  if (tierLabel) sections.push({ label: "Pakke", value: tierLabel });
  if (d.service) sections.push({ label: "Tjeneste", value: d.service });

  // Wizard detail sections (only if filled)
  if (d.businessName) {
    sections.push({ label: "Bedriftsnavn", value: d.businessName });
  }
  if (d.businessDesc) {
    sections.push({ label: "Hva de driver med", value: d.businessDesc });
  }
  if (d.pages && d.pages.length > 0) {
    const pageLabels = d.pages
      .map((v) => labelFor(pageOptions, v) ?? v)
      .join(", ");
    sections.push({ label: "Sider", value: pageLabels });
  }
  const contentLabel = labelFor(contentOptions, d.contentStatus);
  if (contentLabel) {
    sections.push({ label: "Innhold", value: contentLabel });
  }
  const timelineLabel = labelFor(timelineOptions, d.timeline);
  if (timelineLabel) {
    sections.push({ label: "Tidslinje", value: timelineLabel });
  }
  if (d.message) {
    sections.push({ label: "Melding", value: d.message });
  }

  const subject = isWizard
    ? `Ny prosjektførespørsel frå ${d.name}`
    : `Ny førespørsel fra ${d.name}`;

  // Plain text
  const textSections = sections
    .filter((s) => s.value && s.value.trim())
    .map((s) => `${s.label}: ${s.value}`)
    .join("\n");
  const text = [lines.join("\n"), textSections].filter(Boolean).join("\n\n");

  // HTML — styled, brand-aligned
  const htmlSections = sections
    .filter((s) => s.value && s.value.trim())
    .map(
      (s) =>
        `<p style="margin:4px 0;color:#5A6647;"><strong style="color:#2A3327;">${escapeHtml(
          s.label,
        )}:</strong> ${escapeHtml(s.value)}</p>`,
    )
    .join("");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#2A3327;">
      <h2 style="color:#3A5A3E;font-weight:500;">${escapeHtml(d.name)}</h2>
      <p style="color:#5A6647;"><a href="mailto:${escapeHtml(d.email)}" style="color:#3A5A3E;">${escapeHtml(d.email)}</a></p>
      ${d.business ? `<p style="color:#5A6647;">Bedrift: ${escapeHtml(d.business)}</p>` : ""}
      ${isWizard ? `<p style="color:#8A8772;font-size:12px;font-family:ui-monospace,monospace;text-transform:uppercase;letter-spacing:0.1em;">Fra veiviser</p>` : ""}
      <hr style="border:none;border-top:1px solid #B8B3A0;margin:16px 0;" />
      ${htmlSections}
    </div>
  `;

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: d.email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
