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

test("email link tokens are signed and expire", async () => {
  const { createConfirmToken, readConfirmToken, CONFIRM_MAX_AGE_MS } = await import("../lib/leadConfirm.ts");
  const now = Date.UTC(2026, 10, 9);
  const token = createConfirmToken("a@b.co", {}, "secret", now);
  const ok = readConfirmToken(token, "secret", now + 1000);
  assert.ok(ok.ok);
  assert.equal(ok.payload.email, "a@b.co");
  assert.deepEqual(readConfirmToken(token, "other-secret", now), { ok: false, reason: "invalid" });
  const forged = Buffer.from(JSON.stringify({ email: "x@y.co", attributes: {}, issuedAt: now })).toString("base64url");
  assert.equal(readConfirmToken(`${forged}.${token.split(".")[1]}`, "secret", now).ok, false);
  assert.deepEqual(readConfirmToken(token, "secret", now + CONFIRM_MAX_AGE_MS + 1), { ok: false, reason: "expired" });
  const year = 365 * 24 * 60 * 60 * 1000;
  assert.ok(readConfirmToken(token, "secret", now + CONFIRM_MAX_AGE_MS + 1, year).ok);
});

test("welcome email carries content and a one-click unsubscribe, escaped", async () => {
  const { welcomeEmailHtml } = await import("../lib/welcomeEmail.ts");
  const html = welcomeEmailHtml({
    analysis: [{ title: "A <b>story</b>", url: "https://worldcleanbiz.com/blog/a", summary: "Why & how" }],
    news: [{ title: "News one", url: "https://worldcleanbiz.com/news/n" }],
    unsubscribeUrl: "https://worldcleanbiz.com/unsubscribed?token=a&b"
  });
  assert.match(html, /A &lt;b&gt;story&lt;\/b&gt;/);
  assert.match(html, /Why &amp; how/);
  assert.match(html, /unsubscribed\?token=a&amp;b/);
  assert.match(html, /Unsubscribe in one click/);
  assert.doesNotMatch(html, /Get your report/);
});

test("unsubscribe works by POST only, so mail scanners cannot unsubscribe readers", async () => {
  const { readFile } = await import("node:fs/promises");
  const page = await readFile(new URL("../app/unsubscribed/page.tsx", import.meta.url), "utf8");
  assert.match(page, /method="post" action="\/api\/leads\/unsubscribe"/);
  const api = await readFile(new URL("../app/api/leads/unsubscribe/route.ts", import.meta.url), "utf8");
  assert.match(api, /export async function POST/);
  assert.doesNotMatch(api, /export async function GET/);
  const lead = await readFile(new URL("../app/api/leads/route.ts", import.meta.url), "utf8");
  assert.match(lead, /List-Unsubscribe-Post/);
});
