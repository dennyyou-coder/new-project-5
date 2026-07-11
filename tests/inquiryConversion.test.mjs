import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CONTACT_INQUIRIES,
  SOURCING_CATEGORIES
} from "../lib/inquiryConversion.ts";

const sourcingSource = await readFile(new URL("../app/sourcing/page.tsx", import.meta.url), "utf8");
const contactSource = await readFile(new URL("../app/contact/page.tsx", import.meta.url), "utf8");
const definitionSource = await readFile(new URL("../lib/inquiryConversion.ts", import.meta.url), "utf8");
const globalStyles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const leadFormsSource = await readFile(new URL("../components/LeadForms.tsx", import.meta.url), "utf8");

test("defines six unique tracked sourcing categories", () => {
  assert.equal(SOURCING_CATEGORIES.length, 6);
  assert.deepEqual(
    SOURCING_CATEGORIES.map((item) => item.title),
    [
      "Robotic Cleaning Products",
      "Floor Care Equipment",
      "Vacuum Cleaners",
      "Commercial Cleaning Equipment",
      "Outdoor Cleaning Products",
      "New & Emerging Products"
    ]
  );
  assert.equal(new Set(SOURCING_CATEGORIES.map((item) => item.value)).size, 6);
  for (const item of SOURCING_CATEGORIES) {
    assert.match(item.ctaLocation, /^sourcing_opportunity_/);
    assert.equal("href" in item, false);
  }
});

test("Sourcing has no dead child links or nested main", () => {
  assert.doesNotMatch(sourcingSource, /href: "\/sourcing\//);
  assert.doesNotMatch(sourcingSource, /<main/);
  assert.match(sourcingSource, /productCategory=\{item\.value\}/);
  assert.match(sourcingSource, /trackClick/);
});

test("Contact renders one four-intent tracked choice set", () => {
  assert.match(contactSource, /CONTACT_INQUIRIES\.map/);
  assert.match(contactSource, /inquiryType=\{item\.value\}/);
  assert.doesNotMatch(contactSource, /inquiryRoutes/);
  assert.doesNotMatch(contactSource, /target="_blank"/);
  assert.doesNotMatch(contactSource, /ContactForm/);
});

test("both pages include canonical and social metadata", () => {
  for (const source of [sourcingSource, contactSource]) {
    assert.match(source, /alternates:/);
    assert.match(source, /canonical:/);
    assert.match(source, /openGraph:/);
    assert.match(source, /twitter:/);
  }
});

test("Contact explains the inquiry path with visual trust evidence", () => {
  assert.match(definitionSource, /title: "Sourcing"/);
  assert.match(contactSource, /What To Include In Your Inquiry/);
  assert.match(contactSource, /site-refresh\/system\/business-advisory\.webp/);
  assert.match(contactSource, /Inside the cleaning industry since 2006/);
  assert.doesNotMatch(contactSource, /Follow-Up Depends On Fit/);
  assert.doesNotMatch(contactSource, /Send The Right Context First/);
  assert.doesNotMatch(contactSource, /contact-help-card-primary/);
});

test("defines one tracked route for each Contact intent", () => {
  assert.deepEqual(
    CONTACT_INQUIRIES.map(({ value, form }) => [value, form]),
    [
      ["sourcing", "sourcing"],
      ["expo", "expo"],
      ["media", "contact"],
      ["general", "contact"]
    ]
  );
  assert.equal(
    new Set(CONTACT_INQUIRIES.map((item) => item.ctaLocation)).size,
    4
  );
});

test("Sourcing presents the approved opportunity-led funnel", () => {
  const requiredMessages = [
    "Don’t Just Source Another Product",
    "Free Product Opportunity Shortlist",
    "World Clean Biz Industry Estimate",
    "Access Is No Longer The Advantage",
    "Outdated Before Launch",
    "Faster Sourcing Is Not Enough",
    "How Denny Sees Opportunities Earlier",
    "One Partner From Opportunity Discovery To Delivery",
    "Denny Reviews. The Team Executes.",
    "What New Cleaning Products Are Growing Fast?"
  ];

  for (const message of requiredMessages) {
    assert.match(sourcingSource, new RegExp(message.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(sourcingSource, /inquiryIntent="opportunity_discovery"/);
  assert.match(sourcingSource, /inquiryIntent="specific_product"/);
  assert.match(sourcingSource, /ctaLocation="sourcing_footer"/);
  assert.match(sourcingSource, /SOURCING_CATEGORIES\.map/);
  assert.match(sourcingSource, /productCategory=\{item\.value\}/);
  assert.match(sourcingSource, /Initial Response Within 8 Hours/);
  assert.match(sourcingSource, /1–2 Business Days/);
  assert.doesNotMatch(sourcingSource, /A Better Brief Creates A Better Search/);
  assert.doesNotMatch(sourcingSource, /sourcing-v3-cta/);
});

test("Sourcing opportunity styles are isolated from legacy sourcing sections", () => {
  assert.match(sourcingSource, /className="sourcing-opportunity-page"/);
  assert.match(globalStyles, /\.sourcing-opportunity-page/);
  assert.match(globalStyles, /\.sourcing-opportunity-process[^}]*background:/s);
  assert.doesNotMatch(sourcingSource, /className="[^"]*sourcing-v4/);
});

test("shared Tally transport supports a tracked inline sourcing form", () => {
  assert.match(leadFormsSource, /export function TallyInlineEmbed/);
  assert.match(leadFormsSource, /buildTallyUrl/);
  assert.match(leadFormsSource, /Tally\.FormSubmitted/);
  assert.match(leadFormsSource, /event\.origin !== "https:\/\/tally\.so"/);
  assert.match(leadFormsSource, /inquiryIntent/);
});

test("Sourcing detail polish keeps the offer early and the story compact", () => {
  assert.match(sourcingSource, /Receive 2–3 product directions, images, basic specifications and indicative pricing/);
  assert.match(sourcingSource, /Approx\. USD 40B\+/);
  assert.match(sourcingSource, /Toward USD 140B/);
  assert.match(sourcingSource, /title: "Discover"/);
  assert.match(sourcingSource, /title: "Develop"/);
  assert.match(sourcingSource, /title: "Deliver"/);
  assert.match(sourcingSource, /1–2 business days/);
  assert.match(sourcingSource, /Currently supporting cross-border sellers and international brands/);
  assert.doesNotMatch(sourcingSource, /sourcing-opportunity-risk-layout/);
  assert.match(globalStyles, /\.sourcing-opportunity-faq summary::after/);
});

test("early sourcing sections use the shared icon system for scanning", () => {
  assert.match(sourcingSource, /className="sourcing-opportunity-driver-icon"/);
  assert.match(sourcingSource, /className="sourcing-opportunity-shift-icon"/);
  assert.match(sourcingSource, /className="sourcing-opportunity-risk-icon"/);
  assert.match(sourcingSource, /InlineIcon name=\{item\.icon\}/);
});

test("Sourcing visual hierarchy stays within the blue and white brand system", () => {
  assert.doesNotMatch(globalStyles, /--so-opportunity:/);
  assert.doesNotMatch(globalStyles, /--so-warning:/);
  assert.match(globalStyles, /\.sourcing-opportunity-driver-icon[^}]*color:\s*var\(--so-blue\)/s);
  assert.match(globalStyles, /\.sourcing-opportunity-risk-icon[^}]*color:\s*#8eb3ff/s);
  assert.match(globalStyles, /\.sourcing-opportunity-process\s*\{[^}]*background:\s*#eef5ff/s);
  assert.match(globalStyles, /\.sourcing-opportunity-process \.sourcing-opportunity-heading h2\s*\{[^}]*color:\s*var\(--so-ink\)/s);
});

test("all primary Sourcing conversion paths use visible blue buttons", () => {
  assert.doesNotMatch(sourcingSource, /TallyInlineEmbed/);
  assert.doesNotMatch(sourcingSource, /sourcing-opportunity-text-button/);
  assert.match(sourcingSource, /sourcing-opportunity-button-secondary/);
  assert.match(sourcingSource, /sourcing-opportunity-category-cta/);
  assert.match(sourcingSource, /sourcing-opportunity-final-cta/);
});

test("Sourcing does not repeat the two hero intent choices below the fold", () => {
  assert.doesNotMatch(sourcingSource, /sourcing-opportunity-intents/);
  assert.doesNotMatch(sourcingSource, /sourcing_intent_opportunity/);
  assert.doesNotMatch(sourcingSource, /sourcing_intent_specific_product/);
  assert.doesNotMatch(globalStyles, /\.sourcing-opportunity-intent-grid/);
});

test("Sourcing uses alternating sales bands and visual storytelling", () => {
  assert.match(sourcingSource, /sourcing-opportunity-stage-image/);
  assert.match(sourcingSource, /sourcing-opportunity-model-image/);
  assert.match(sourcingSource, /One Quotation/);
  assert.match(sourcingSource, /Managed Delivery/);
  assert.match(sourcingSource, /Supplier Search/);
  assert.doesNotMatch(sourcingSource, /<span>WCB<\/span><i \/><i \/><i \/>/);
  assert.match(globalStyles, /\.sourcing-opportunity-shortlist\s*\{[^}]*background:\s*linear-gradient\([^}]*#071f47/s);
  assert.match(globalStyles, /\.sourcing-opportunity-process\s*\{[^}]*background:\s*#eef5ff/s);
  assert.match(globalStyles, /\.sourcing-opportunity-models\s*\{[^}]*background:\s*#fff/s);
  assert.match(globalStyles, /\.sourcing-opportunity-team\s*\{[^}]*background:\s*#eaf2ff/s);
});

test("Sourcing grounds key sales sections with unified visual evidence", () => {
  assert.match(sourcingSource, /sourcing-opportunity-market-visual/);
  assert.match(sourcingSource, /sourcing-opportunity-shortlist-preview/);
  assert.match(sourcingSource, /sourcing-opportunity-stage-image/);
  assert.match(sourcingSource, /sourcing-opportunity-model-image/);
  assert.match(sourcingSource, /site-refresh\/system\/product-selection\.webp/);
  assert.match(sourcingSource, /site-refresh\/system\/product-engineering\.webp/);
  assert.match(sourcingSource, /site-refresh\/system\/business-roundtable\.webp/);
});
