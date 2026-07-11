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
const homeSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const reportsSource = await readFile(new URL("../app/reports/page.tsx", import.meta.url), "utf8");
const expoSource = await readFile(new URL("../app/world-clean-expo/page.tsx", import.meta.url), "utf8");
const contactSource = await readFile(new URL("../app/contact/page.tsx", import.meta.url), "utf8");
const blogConversionSource = await readFile(
  new URL("../lib/blogConversion.ts", import.meta.url),
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

test("primary business CTAs preserve specific inquiry context", () => {
  assert.match(homeSource, /inquiryIntent="exhibitor_interest"/);
  assert.match(homeSource, /inquiryIntent="visitor_interest"/);
  assert.match(expoSource, /inquiryIntent="exhibitor_interest"/);
  assert.match(expoSource, /inquiryIntent="visitor_interest"/);
  assert.match(contactSource, /inquiryType=\{item\.value\}/);
  assert.match(reportsSource, /reportId="next-decade-cleaning-growth"/);
  assert.match(blogCtaSource, /inquiryIntent=\{cta\.inquiryIntent\}/);
  assert.match(blogConversionSource, /inquiryIntent: "article_product_research"/);
  assert.match(blogConversionSource, /inquiryIntent: "visitor_interest"/);
});

test("conversion panels explain audience input and next step", () => {
  assert.match(leadFormsSource, /For relevant business requests/);
  assert.match(leadFormsSource, /company, market and business objective/);
  assert.match(contactSource, /routes it to the relevant team/);
});
