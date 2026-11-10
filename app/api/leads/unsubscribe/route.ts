import { readConfirmToken } from "@/lib/leadConfirm";

export const runtime = "nodejs";

const num = (value: string | undefined) => (value && /^\d+$/.test(value) ? Number(value) : undefined);
const UNSUBSCRIBE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

async function unsubscribe(request: Request, token: string) {
  const key = process.env.BREVO_API_KEY;
  const list = num(process.env.BREVO_LIST_NEWSLETTER);
  const secret = process.env.LEAD_CONFIRM_SECRET || key;
  const done = (status: string) => Response.redirect(new URL(`/unsubscribed?status=${status}`, request.url), 303);
  if (!key || !list || !secret) return done("error");
  const result = readConfirmToken(token, secret, Date.now(), UNSUBSCRIBE_MAX_AGE_MS);
  if (!result.ok) return done("invalid");
  const response = await fetch(`https://api.brevo.com/v3/contacts/lists/${list}/contacts/remove`, {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ emails: [result.payload.email] })
  });
  // 400 means the contact is no longer on the list: already unsubscribed.
  if (!response.ok && response.status !== 400) {
    console.error("unsubscribe failed", response.status, (await response.text().catch(() => "")).slice(0, 300));
    return done("error");
  }
  return done("ok");
}

/** One-click unsubscribe: the List-Unsubscribe header (RFC 8058) and the button on /unsubscribed both POST here. */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const form = await request.formData().catch(() => null);
  return unsubscribe(request, String(form?.get("token") ?? url.searchParams.get("token") ?? ""));
}
