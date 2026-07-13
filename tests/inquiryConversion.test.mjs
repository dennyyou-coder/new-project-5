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

test("Sourcing links all six live product opportunity pages", () => {
  const expectedRoutes = [
    "/sourcing/pool-robots",
    "/sourcing/lawn-robots",
    "/sourcing/floor-washers",
    "/sourcing/robotic-vacuums",
    "/sourcing/commercial-cleaning",
    "/sourcing/vacuum-cleaners"
  ];

  assert.match(sourcingSource, /productOpportunities\.map/);
  assert.match(sourcingSource, /<Link className="sourcing-v3-product-card" href=\{item\.href\}/);
  for (const route of expectedRoutes) {
    assert.match(sourcingSource, new RegExp(route.replaceAll("/", "\\/")));
  }
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
  assert.match(contactSource, /site-refresh\/about\/about-hero-denny\.webp/);
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
    "You&apos;ve Been In The Industry For 20 Years",
    "The Industry Already Changed.",
    "Categories Worth Watching Before You Source",
    "From Market Insight To Product Execution",
    "Why Denny Can Help You Make Better Sourcing Decisions",
    "Denny&apos;s Industry Journey",
    "The Difference Is Insight."
  ];

  for (const message of requiredMessages) {
    assert.match(sourcingSource, new RegExp(message.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(sourcingSource, /ctaLocation="sourcing_hero"/);
  assert.match(sourcingSource, /ctaLocation="sourcing_delivery"/);
  assert.match(sourcingSource, /ctaLocation="sourcing_final"/);
  assert.match(sourcingSource, /productOpportunities\.map/);
});

test("Sourcing hub styles remain isolated from product landing pages", () => {
  assert.match(sourcingSource, /className="sourcing-v3-page"/);
  assert.match(globalStyles, /\.sourcing-v3-page/);
  assert.doesNotMatch(sourcingSource, /className="[^"]*sourcing-lawn-page/);
  assert.doesNotMatch(sourcingSource, /className="[^"]*sourcing-opportunity-page/);
});

test("shared Tally transport supports a tracked inline sourcing form", () => {
  assert.match(leadFormsSource, /export function TallyInlineEmbed/);
  assert.match(leadFormsSource, /buildTallyUrl/);
  assert.match(leadFormsSource, /Tally\.FormSubmitted/);
  assert.match(leadFormsSource, /event\.origin !== "https:\/\/tally\.so"/);
  assert.match(leadFormsSource, /inquiryIntent/);
});

test("Sourcing detail polish keeps the offer early and the story compact", () => {
  assert.match(sourcingSource, /Start A Sourcing Inquiry/);
  assert.match(sourcingSource, /View Category →/);
  assert.match(sourcingSource, /productOpportunities\.map/);
  assert.match(sourcingSource, /deliveryPillars\.map/);
  assert.match(sourcingSource, /dennyJourney\.map/);
  assert.doesNotMatch(sourcingSource, /sourcing-opportunity-risk-layout/);
});

test("early sourcing sections use the shared icon system for scanning", () => {
  assert.match(sourcingSource, /type IconName/);
  assert.match(sourcingSource, /InlineIcon name=\{item\.icon\}/);
});

test("Sourcing visual hierarchy stays within the blue and white brand system", () => {
  assert.match(globalStyles, /\.sourcing-v3-page\s*\{/);
  assert.match(globalStyles, /\.sourcing-v3-button\s*\{/);
  assert.match(globalStyles, /\.sourcing-v3-hero\s*\{/);
  assert.doesNotMatch(sourcingSource, /style=\{\{/);
});

test("all primary Sourcing conversion paths use visible blue buttons", () => {
  assert.doesNotMatch(sourcingSource, /TallyInlineEmbed/);
  assert.equal((sourcingSource.match(/className="sourcing-v3-button"/g) || []).length, 3);
  assert.match(globalStyles, /\.sourcing-v3-button\s*\{[^}]*background:/s);
});

test("Sourcing does not repeat the two hero intent choices below the fold", () => {
  assert.doesNotMatch(sourcingSource, /sourcing-opportunity-intents/);
  assert.doesNotMatch(sourcingSource, /sourcing_intent_opportunity/);
  assert.doesNotMatch(sourcingSource, /sourcing_intent_specific_product/);
  assert.doesNotMatch(globalStyles, /\.sourcing-opportunity-intent-grid/);
});

test("Sourcing uses alternating sales bands and visual storytelling", () => {
  assert.match(sourcingSource, /section-editorial sourcing-v3-section sourcing-v3-reality/);
  assert.match(sourcingSource, /section-editorial sourcing-v3-section sourcing-v3-opportunity/);
  assert.match(sourcingSource, /section-authority sourcing-v3-section sourcing-v3-deliver/);
  assert.match(sourcingSource, /section-authority sourcing-v3-section sourcing-v3-denny-proof-section/);
});

test("Sourcing grounds key sales sections with unified visual evidence", () => {
  assert.match(sourcingSource, /images\/sourcing\/pool-robots\.png/);
  assert.match(sourcingSource, /images\/sourcing\/lawn-robots\.png/);
  assert.match(sourcingSource, /images\/industry\/sourcing-supplier-meeting-2026\.jpg/);
  assert.match(sourcingSource, /images\/industry\/about-denny-speaking-forum-2025\.jpg/);
});
