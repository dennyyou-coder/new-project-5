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

test("Reports presents the approved current report as a free email lead magnet", () => {
  assert.match(reportsSource, /The Next Decade of Cleaning Growth/);
  assert.match(reportsSource, /Get the full WCB report by email/);
  assert.match(reportsSource, /Free PDF/);
  assert.doesNotMatch(reportsSource, /Buy Now|Purchase Report|Pricing|\$\d+/i);
});

test("Reports preserves the expandable multi-report selection flow", () => {
  assert.match(tallyFormsSource, /defineForm\("ZjeGvz", "reports"\)/);
  assert.match(leadFormsSource, /reportId="next-decade-cleaning-growth"/);
  assert.match(reportsSource, /Upcoming Intelligence Briefs/);
  assert.match(reportsSource, /Future briefs will go deeper/);
});

test("Reports uses one clear CTA family and tracked report identity", () => {
  assert.match(leadFormsSource, /Get The Report/);
  assert.match(reportsSource, /ctaLocation="reports_inline"/);
  assert.match(reportsSource, /reportId="next-decade-cleaning-growth"/);
  assert.doesNotMatch(reportsSource, /Get Free Reports/);
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
  assert.match(leadFormsSource, /receive the PDF link/);
  assert.match(reportsSource, /future cleaning[\s\S]*industry intelligence updates/i);
});
