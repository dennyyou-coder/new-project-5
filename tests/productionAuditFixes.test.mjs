import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

const tallyFormsSource = await source("../lib/tallyForms.ts");
const homeSource = await source("../app/page.tsx");
const reportsSource = await source("../app/reports/page.tsx");
const sourcingSource = await source("../app/sourcing/page.tsx");
const opportunityCardSource = await source(
  "../components/SourcingOpportunityCard.tsx"
);
const productPageSource = await source("../components/SourcingProductPage.tsx");
const stylesSource = await source("../app/globals.css");

test("public newsletter and exhibitor forms do not depend on missing build variables", () => {
  assert.match(tallyFormsSource, /newsletter: defineForm\("xX1xZJ"/);
  assert.match(tallyFormsSource, /wceExhibitor: defineForm\("XxklMV"/);
  assert.doesNotMatch(
    tallyFormsSource,
    /NEXT_PUBLIC_TALLY_(?:NEWSLETTER|WCE_EXHIBITOR)_FORM_ID/
  );
});

test("homepage and reports publish self-referencing canonicals", () => {
  assert.match(homeSource, /alternates:\s*\{ canonical: "\/" \}/);
  assert.match(
    reportsSource,
    /alternates:\s*\{ canonical: "\/reports" \}/
  );
});

test("all Sourcing opportunity cards use the tracked link component", () => {
  assert.match(sourcingSource, /import \{ SourcingOpportunityCard \}/);
  assert.match(
    sourcingSource,
    /<SourcingOpportunityCard item=\{item\} key=\{item\.value\} \/>/
  );
  assert.match(opportunityCardSource, /trackLeadEvent\("cta_view"/);
  assert.match(opportunityCardSource, /trackLeadEvent\("cta_click"/);
  assert.match(opportunityCardSource, /ctaLocation: item\.ctaLocation/);
  assert.match(opportunityCardSource, /productCategory: item\.value/);
  assert.match(
    opportunityCardSource,
    /inquiryIntent: "category_exploration"/
  );
});

test("market estimate keeps the approved figures and states its editorial basis", () => {
  assert.match(sourcingSource, /Approx\. USD 40B\+/);
  assert.match(sourcingSource, /Toward USD 140B/);
  assert.match(sourcingSource, /directional editorial estimate/);
  assert.match(sourcingSource, /2026 reference view/);
  assert.match(sourcingSource, /not audited market data/);
});

test("Lawn Robots related intelligence uses article images and aligned actions", () => {
  assert.match(productPageSource, /article\.coverImage/);
  assert.match(productPageSource, /sourcing-lawn-related-image/);
  assert.match(productPageSource, /Read the analysis →/);
  assert.match(
    stylesSource,
    /\.sourcing-lawn-page \.sourcing-lawn-related-image/
  );
});
