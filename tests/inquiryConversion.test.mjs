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

test("defines six unique tracked sourcing categories", () => {
  assert.equal(SOURCING_CATEGORIES.length, 6);
  assert.equal(new Set(SOURCING_CATEGORIES.map((item) => item.value)).size, 6);
  for (const item of SOURCING_CATEGORIES) {
    assert.match(item.ctaLocation, /^sourcing_category_/);
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
  assert.match(contactSource, /sourcing-supplier-meeting-2026\.jpg/);
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

test("Sourcing presents a concise, accurate inquiry journey", () => {
  assert.match(sourcingSource, /Cleaning Product Sourcing/);
  assert.match(sourcingSource, /Submit Your Brief/);
  assert.match(sourcingSource, /Initial Review/);
  assert.match(sourcingSource, /Direction & Connections/);
  assert.match(sourcingSource, /Next-Step Cooperation/);
  assert.match(sourcingSource, /Discuss \{item\.title\} →/);
  assert.match(sourcingSource, /href="\/about"/);

  assert.doesNotMatch(sourcingSource, /View Category →/);
  assert.doesNotMatch(sourcingSource, /dennyJourney/);
  assert.doesNotMatch(sourcingSource, /dennyPhotos/);
  assert.doesNotMatch(sourcingSource, /9,000\+ Industry Professionals/);
  assert.doesNotMatch(sourcingSource, /Helped Build Multiple Best-Selling/);
});

test("Sourcing V4 owns the contrasting process and final CTA styles", () => {
  assert.doesNotMatch(sourcingSource, /className="sourcing-v3-cta sourcing-v4-final"/);
  assert.match(sourcingSource, /className="sourcing-v4-final"/);
  assert.match(globalStyles, /\.sourcing-v4-process \.sourcing-v4-heading h2\s*\{[^}]*color:\s*#fff/s);
  assert.match(globalStyles, /\.sourcing-v4-final\s*\{[^}]*background:/s);
  assert.match(globalStyles, /\.sourcing-v4-final[^}]*color:\s*#fff/s);
});
