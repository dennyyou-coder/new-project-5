import assert from "node:assert/strict";
import test from "node:test";
import { brevoAttributes, directListFor, leadKindForForm, looksAutomated, validateLead, wantsNewsletter } from "../lib/leads.ts";

test("subscribe needs a valid email and consent", () => {
  assert.equal(validateLead({ kind: "subscribe", email: "bad", consent: true }).ok, false);
  assert.equal(validateLead({ kind: "subscribe", email: "a@b.co", consent: false }).ok, false);
  const ok = validateLead({ kind: "subscribe", email: " A@B.co ", consent: true, interests: ["robot-vacuums", "nonsense"], role: "buyer" });
  assert.ok(ok.ok);
  assert.equal(ok.lead.email, "a@b.co");
  assert.deepEqual(ok.lead.interests, ["robot-vacuums"]);
});

test("inquiry and expo require their few fields", () => {
  assert.equal(validateLead({ kind: "inquiry", email: "a@b.co", name: "A", company: "C" }).field, "need");
  assert.ok(validateLead({ kind: "inquiry", email: "a@b.co", name: "A", company: "C", need: "supplier" }).ok);
  assert.equal(validateLead({ kind: "expo", email: "a@b.co", name: "A", company: "C" }).field, "expoRole");
  assert.ok(validateLead({ kind: "expo", email: "a@b.co", name: "A", company: "C", expoRole: "exhibitor" }).ok);
});

test("lists and attributes follow the form", () => {
  const lists = { newsletter: 1, inquiry: 2, expoVisitor: 3, expoExhibitor: 4 };
  const expo = validateLead({ kind: "expo", email: "a@b.co", name: "A", company: "C", expoRole: "exhibitor" }).lead;
  assert.equal(directListFor(expo, lists), 4);
  assert.equal(wantsNewsletter(expo), false);
  assert.equal(brevoAttributes(expo).LEAD_TYPE, "expo-exhibitor");
  const inquiry = validateLead({ kind: "inquiry", email: "a@b.co", name: "A", company: "C", need: "supplier", subscribe: true, consent: true }).lead;
  assert.equal(directListFor(inquiry, lists), 2);
  assert.equal(wantsNewsletter(inquiry), true);
  const sub = validateLead({ kind: "subscribe", email: "a@b.co", consent: true, reportId: "q3" }).lead;
  assert.equal(directListFor(sub, lists), undefined);
  assert.equal(brevoAttributes(sub).LEAD_TYPE, "report");
});

test("old Tally form keys map to the three new forms", () => {
  assert.equal(leadKindForForm("newsletter").kind, "subscribe");
  assert.equal(leadKindForForm("reports").kind, "subscribe");
  assert.deepEqual(leadKindForForm("wceExhibitor"), { kind: "expo", expoRole: "exhibitor" });
  assert.deepEqual(leadKindForForm("sourcing"), { kind: "inquiry", need: "supplier" });
});

test("honeypot and instant submissions are treated as automated", () => {
  assert.equal(looksAutomated({ website: "x" }), true);
  assert.equal(looksAutomated({ startedAt: 1000 }, 1500), true);
  assert.equal(looksAutomated({ startedAt: 1000 }, 9000), false);
});

test("newsletter confirmation tokens are signed and expire after 7 days", async () => {
  const { createConfirmToken, readConfirmToken, CONFIRM_MAX_AGE_MS, confirmEmailHtml } = await import("../lib/leadConfirm.ts");
  const now = Date.UTC(2026, 10, 9);
  const token = createConfirmToken("a@b.co", { SOURCE_PAGE: "/news" }, "secret", now);
  const ok = readConfirmToken(token, "secret", now + 1000);
  assert.ok(ok.ok);
  assert.equal(ok.payload.email, "a@b.co");
  assert.deepEqual(ok.payload.attributes, { SOURCE_PAGE: "/news" });
  assert.deepEqual(readConfirmToken(token, "other-secret", now), { ok: false, reason: "invalid" });
  const [body] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ email: "x@y.co", attributes: {}, issuedAt: now })).toString("base64url");
  assert.equal(readConfirmToken(`${forged}.${token.split(".")[1]}`, "secret", now).ok, false);
  assert.equal(readConfirmToken(`${body}`, "secret", now).ok, false);
  assert.deepEqual(readConfirmToken(token, "secret", now + CONFIRM_MAX_AGE_MS + 1), { ok: false, reason: "expired" });
  assert.match(confirmEmailHtml("https://worldcleanbiz.com/subscribe/confirm?token=a&b"), /token=a&amp;b/);
});

test("confirmation link lands on a page that confirms with a POST button, not on GET", async () => {
  const { readFile } = await import("node:fs/promises");
  const page = await readFile(new URL("../app/subscribe/confirm/page.tsx", import.meta.url), "utf8");
  assert.match(page, /method="post" action="\/api\/leads\/confirm"/);
  const api = await readFile(new URL("../app/api/leads/confirm/route.ts", import.meta.url), "utf8");
  assert.match(api, /export async function POST/);
  assert.doesNotMatch(api, /export async function GET/);
});
