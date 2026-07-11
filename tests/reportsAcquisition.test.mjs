import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const reportsSource = await readFile(
  new URL("../app/reports/page.tsx", import.meta.url),
  "utf8"
);
const leadFormsSource = await readFile(
  new URL("../components/LeadForms.tsx", import.meta.url),
  "utf8"
);
const tallyFormsSource = await readFile(
  new URL("../lib/tallyForms.ts", import.meta.url),
  "utf8"
);

test("Reports presents a clear free-report library instead of a single-report landing page", () => {
  assert.match(reportsSource, /Free Cleaning Industry Reports/);
  assert.match(reportsSource, /Choose the reports relevant to your market/);
  assert.match(reportsSource, /id="free-reports"/);
  assert.match(reportsSource, /The Next Decade of Cleaning Growth/);
  assert.match(reportsSource, /Free PDF/);
  assert.doesNotMatch(reportsSource, /Buy Now|Purchase Report|Pricing|\$\d+/i);
});

test("Reports preserves the expandable multi-report selection flow", () => {
  assert.match(tallyFormsSource, /defineForm\("ZjeGvz", "reports"\)/);
  assert.match(reportsSource, /reportId="next-decade-cleaning-growth"/);
  assert.match(reportsSource, /reportId: "pool-robot-channels-service-costs"/);
  assert.match(reportsSource, /reportId: "robotic-lawn-mower-supply-chains"/);
  assert.match(reportsSource, /reportId: "commercial-cleaning-robot-roi"/);
  assert.match(reportsSource, /reportId: "china-cleaning-supplier-pack"/);
});

test("Reports uses report-specific CTA language and tracked report identities", () => {
  assert.match(reportsSource, /Get This Report/);
  assert.match(reportsSource, /Notify Me When Available/);
  assert.match(reportsSource, /ctaLocation="reports_card_current"/);
  assert.match(reportsSource, /reportId="next-decade-cleaning-growth"/);
  assert.match(leadFormsSource, /Select Free Reports/);
});

test("Reports removes the ambiguous single-report preview module", () => {
  assert.doesNotMatch(reportsSource, /Report Preview/);
  assert.doesNotMatch(reportsSource, /Preview The Report/);
  assert.doesNotMatch(reportsSource, /previewPages/);
  assert.doesNotMatch(reportsSource, /reports-v2-preview/);
});

test("Reports includes the approved cover and downloadable report assets", async () => {
  assert.match(
    reportsSource,
    /wcb-cleaning-industry-growth-map-cover\.png/
  );
  await access(
    new URL(
      "../public/images/reports/wcb-cleaning-industry-growth-map-cover.png",
      import.meta.url
    )
  );
  await access(
    new URL(
      "../public/reports/wcb-cleaning-industry-growth-map-english-report.pdf",
      import.meta.url
    )
  );
});

test("Reports clearly explains email delivery and future intelligence updates", () => {
  assert.match(leadFormsSource, /choose the reports you want/);
  assert.match(reportsSource, /World[\s\S]*Clean Biz industry intelligence updates/i);
});
