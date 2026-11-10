import { createHmac, timingSafeEqual } from "node:crypto";

// Signed, expiring tokens for email links (unsubscribe), so a link only works
// for the address it was sent to.

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
  now = Date.now(),
  maxAgeMs = CONFIRM_MAX_AGE_MS
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
  if (now - payload.issuedAt > maxAgeMs || payload.issuedAt > now + 60_000) return { ok: false, reason: "expired" };
  return { ok: true, payload };
}
