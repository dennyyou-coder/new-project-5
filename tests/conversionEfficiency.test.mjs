import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const leadFormsSource = await readFile(
  new URL("../components/LeadForms.tsx", import.meta.url),
  "utf8"
);
const blogCtaSource = await readFile(
  new URL("../components/BlogConversionCta.tsx", import.meta.url),
  "utf8"
);

test("shared Tally buttons own the complete conversion funnel", () => {
  assert.match(leadFormsSource, /IntersectionObserver/);
  assert.match(leadFormsSource, /"cta_view"/);
  assert.match(leadFormsSource, /"cta_click"/);
  assert.match(leadFormsSource, /conversion_value: 1/);
  assert.match(leadFormsSource, /submittedRef/);
  assert.match(leadFormsSource, /buildContactFallbackUrl/);
  assert.match(leadFormsSource, /Use the Contact page instead/);
});

test("Blog CTA delegates view and click tracking to the shared button", () => {
  assert.doesNotMatch(blogCtaSource, /useEffect/);
  assert.doesNotMatch(blogCtaSource, /onClickTrack/);
  assert.match(blogCtaSource, /eventContext=\{context\}/);
});
