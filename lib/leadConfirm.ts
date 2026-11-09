import { createHmac, timingSafeEqual } from "node:crypto";

// Double opt-in without a Brevo template: the site emails a signed link, and
// the subscriber is added to the newsletter list only after they confirm it.

export const CONFIRM_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type ConfirmPayload = { email: string; attributes: Record<string, string>; issuedAt: number };

const b64url = (input: Buffer | string) => Buffer.from(input).toString("base64url");
const sign = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("base64url");

export function createConfirmToken(email: string, attributes: Record<string, string>, secret: string, now = Date.now()) {
  const body = b64url(JSON.stringify({ email, attributes, issuedAt: now } satisfies ConfirmPayload));
  return `${body}.${sign(body, secret)}`;
}

export function readConfirmToken(
  token: string,
  secret: string,
  now = Date.now()
): { ok: true; payload: ConfirmPayload } | { ok: false; reason: "invalid" | "expired" } {
  const [body, signature] = String(token || "").split(".");
  if (!body || !signature) return { ok: false, reason: "invalid" };
  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "invalid" };
  let payload: ConfirmPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (typeof payload.email !== "string" || typeof payload.issuedAt !== "number") return { ok: false, reason: "invalid" };
  if (now - payload.issuedAt > CONFIRM_MAX_AGE_MS || payload.issuedAt > now + 60_000) return { ok: false, reason: "expired" };
  return { ok: true, payload };
}

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);

export function confirmEmailHtml(confirmUrl: string) {
  const url = escapeHtml(confirmUrl);
  return `<!doctype html><html><body style="margin:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#101828">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;padding:32px">
<tr><td style="font-size:13px;font-weight:bold;letter-spacing:.06em;color:#2447d6;text-transform:uppercase">World Clean Biz</td></tr>
<tr><td style="padding-top:12px;font-size:22px;font-weight:bold;line-height:1.3">Confirm your subscription</td></tr>
<tr><td style="padding-top:12px;font-size:15px;line-height:1.6;color:#344054">Please confirm that you want the WCB weekly brief: five stories that matter in the cleaning industry and one WCB analysis, every Friday.</td></tr>
<tr><td style="padding-top:24px"><a href="${url}" style="display:inline-block;background:#2447d6;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 22px;border-radius:8px">Confirm subscription</a></td></tr>
<tr><td style="padding-top:24px;font-size:12px;line-height:1.6;color:#667085">If you did not sign up on worldcleanbiz.com, ignore this email and you will not be subscribed. The link works for 7 days.</td></tr>
</table></td></tr></table></body></html>`;
}
