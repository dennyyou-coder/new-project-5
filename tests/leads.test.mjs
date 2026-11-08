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
