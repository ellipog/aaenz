import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort per-instance throttle. Serverless may run several instances,
// so this is a courtesy limit — Resend's own free quota is the real ceiling.
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
};

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (throttled(ip)) {
    return Response.json(
      { error: "Slow down — too many words at once. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "That wasn’t valid JSON. Try again." }, { status: 400 });
  }

  // Honeypot: bots fill it, humans never see it. Pretend success either way.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const fields: Record<string, string> = {};
  if (name.length < 2 || name.length > 80) fields.name = "Give a name, 2–80 characters.";
  if (!EMAIL_RE.test(email) || email.length > 254) fields.email = "That email doesn’t look right.";
  if (message.length < 10 || message.length > 5000)
    fields.message = "Write a little more — 10 to 5,000 characters.";

  if (Object.keys(fields).length > 0) {
    return Response.json({ error: "A field needs attention.", fields }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  // Verified sender on the free tier — a yomion.com address, delivering to me.
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("contact route: missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL");
    return Response.json(
      { error: "Email isn’t wired up right now — write directly instead." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  const safe = { name: escapeHtml(name), email: escapeHtml(email), message: escapeHtml(message) };

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `[aaenz.no] word from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p>From: <strong>${safe.name}</strong> &lt;${safe.email}&gt;</p><p>${safe.message.replace(/\n/g, "<br />")}</p>`,
  });

  if (error) {
    console.error("contact route: resend rejected send:", error);
    return Response.json(
      { error: "The word didn’t go through — write directly instead." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
