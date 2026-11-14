import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { classifyRecall, firstSentence, recallName } from "../lib/radar/classify.ts";
import { bandsFor, granteeCode } from "../lib/radar/fcc.ts";
import { RULE_DATES, daysUntil, upcomingRules } from "../lib/radar/rules.ts";

const recalls = JSON.parse(readFileSync(new URL("../content/radar/recalls.json", import.meta.url), "utf8")).recalls;
const fcc = JSON.parse(readFileSync(new URL("../content/radar/fcc-filings.json", import.meta.url), "utf8"));

test("recalls are sorted into the right sector", () => {
  assert.equal(classifyRecall("Electric Pressure Washers"), "cleaning");
  assert.equal(classifyRecall("Rowenta Cordless Vacuum Cleaners"), "cleaning");
  assert.equal(classifyRecall("Walk-Behind Leaf Vacuums"), "tools");
  assert.equal(classifyRecall("Angle grinder"), "tools");
  assert.equal(classifyRecall("Hair trimmer"), "appliances");
  assert.equal(classifyRecall("Digital Air Fryer Ovens"), "appliances");
  assert.equal(classifyRecall("Metal Wire Bristle Grill Brushes"), null);
  assert.equal(classifyRecall("Children's toy vacuum"), null);
  assert.equal(classifyRecall("Slide Playsets"), null);
});

test("hazards keep abbreviations inside the sentence", () => {
  assert.equal(firstSentence("The saw may snag (e.g. wood) when used. Second."), "The saw may snag (e.g. wood) when used.");
  assert.equal(recallName({ brand: "Gourmia", product: "Gourmia Air Fryer" }), "Gourmia · Air Fryer");
  assert.equal(recallName({ product: "Kettle" }), "Kettle");
});

test("published recalls are complete and unique", () => {
  assert.ok(recalls.length > 100);
  assert.equal(new Set(recalls.map((recall) => recall.id)).size, recalls.length);
  for (const recall of recalls) {
    assert.match(recall.date, /^\d{4}-\d{2}-\d{2}$/, recall.id);
    assert.ok(["cleaning", "appliances", "tools"].includes(recall.sector), recall.id);
    assert.ok(recall.url.startsWith("https://"), recall.id);
    assert.ok(recall.hazard.length > 10, recall.id);
    assert.ok(!/&amp;|\*$/.test(`${recall.brand ?? ""}${recall.product}`), recall.id);
  }
});

test("FCC filings belong to tracked companies", () => {
  const names = new Set(fcc.companies.map((company) => company.name));
  for (const filing of fcc.filings) {
    assert.ok(names.has(filing.company), filing.fccId);
    assert.match(filing.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  for (const company of fcc.companies) assert.ok(company.search.length > 0, company.name);
  assert.deepEqual(bandsFor(["2402-2480", "2412-2462", "5180-5240", "13-13"]), ["Bluetooth", "Wi-Fi 2.4 GHz", "Wi-Fi 5 GHz", "NFC / 13.56 MHz"]);
  assert.equal(granteeCode("2AN2O-RRE0BES01"), "2AN2O");
  assert.equal(granteeCode("QVHHS09002"), "QVH");
});

test("rule dates are valid and count down", () => {
  assert.equal(new Set(RULE_DATES.map((rule) => rule.id)).size, RULE_DATES.length);
  const now = new Date("2026-11-10T00:00:00Z");
  assert.equal(daysUntil("2026-11-11", now), 1);
  assert.equal(upcomingRules(now)[0].id, "us-301-exclusions");
  assert.ok(upcomingRules(new Date("2027-01-11T00:00:00Z")).every((rule) => rule.date >= "2027-01-11"));
});

test("monthly radar report sums up one month", async () => {
  const { MONTHLY_ISSUES, buildMonthlyRadar, monthLabel, shiftMonth } = await import("../lib/radar/monthly.ts");
  assert.equal(monthLabel("2026-10"), "October 2026");
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  const report = buildMonthlyRadar("2026-10", { recalls, filings: fcc.filings, companies: fcc.companies, rules: RULE_DATES });
  assert.equal(report.recalls.length, recalls.filter((recall) => recall.date.startsWith("2026-10")).length);
  assert.equal(report.us + report.eu, report.recalls.length);
  assert.equal(Object.values(report.bySector).reduce((a, b) => a + b, 0), report.recalls.length);
  assert.equal(report.robotTrend.length, 10);
  assert.equal(report.robotTrend.at(-1).month, "2026-10");
  for (const rule of report.ahead) assert.ok(rule.date >= "2026-11-01" && rule.date < "2027-02-01", rule.id);
  for (const issue of MONTHLY_ISSUES) {
    assert.match(issue.month, /^\d{4}-\d{2}$/);
    assert.ok(issue.published > `${issue.month}-31`, `${issue.month} is published after the month ends`);
  }
});
