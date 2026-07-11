import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [received, privacy, terms, quality, footer, styles] = await Promise.all([
  read("app/inquiry-received/page.tsx"),
  read("app/privacy/page.tsx"),
  read("app/terms/page.tsx"),
  read("app/quality-compliance/page.tsx"),
  read("components/Footer.tsx"),
  read("app/globals.css")
]);

test("inquiry received page closes the loop without claiming a submission", () => {
  assert.match(received, /Your Inquiry Is In The Right Place/);
  assert.match(received, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/s);
  assert.match(received, /Review/);
  assert.match(received, /Route/);
  assert.match(received, /Respond/);
  assert.doesNotMatch(received, /form_success/);
});

test("privacy policy explains actual data handling and contact path", () => {
  assert.match(privacy, /Privacy Policy/);
  assert.match(privacy, /Google\s+Analytics/);
  assert.match(privacy, /Tally/);
  assert.match(privacy, /does not sell your personal information/i);
  assert.match(privacy, /href="\/contact"/);
});

test("terms define content and commercial boundaries", () => {
  assert.match(terms, /Terms of Use/);
  assert.match(terms, /not\s+investment, legal, tax, certification/i);
  assert.match(terms, /confirmed in writing/i);
  assert.match(terms, /href="\/contact"/);
});

test("quality page explains the five-stage responsibility model", () => {
  for (const stage of ["Define", "Evaluate", "Confirm", "Monitor", "Document"]) {
    assert.match(quality, new RegExp(stage));
  }
  assert.match(quality, /Quality Starts With Clear Requirements/);
  assert.match(quality, /Buyer Responsibility/);
  assert.match(quality, /ctaLocation="quality_compliance_cta"/);
  assert.match(quality, /href="\/sourcing"|form="sourcing"/);
});

test("footer exposes trust pages but not the process-only success route", () => {
  assert.match(footer, />Trust</);
  assert.match(footer, /href="\/quality-compliance"/);
  assert.match(footer, /href="\/privacy"/);
  assert.match(footer, /href="\/terms"/);
  assert.doesNotMatch(footer, /inquiry-received/);
});

test("trust page presentation remains scoped and responsive", () => {
  assert.match(styles, /\.trust-page/);
  assert.match(styles, /\.trust-process-grid/);
  assert.match(styles, /\.trust-content/);
  assert.match(styles, /@media[^}]+\.trust-/s);
});
