import assert from "node:assert/strict";
import test from "node:test";
import { calculateRoi, cleanRoiInputs, ROI_DEFAULTS } from "../lib/tools/roi.ts";
import { calculateLanded, cleanLandedInputs, LANDED_DEFAULTS } from "../lib/tools/landedCost.ts";
import { checklistFor, CERT_MARKETS, CERT_PRODUCTS, CERT_REQUIREMENTS } from "../lib/tools/certifications.ts";
import { complianceEmail, landedEmail, roiEmail, toolEmailHtml } from "../lib/tools/email.ts";

const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 0.01, `${message}: ${actual} vs ${expected}`);

test("robot payback follows the documented formula", () => {
  const result = calculateRoi(ROI_DEFAULTS);
  // 2,000 m² / 250 m²/h = 8 h; 60% of that minus 0.5 h supervision = 4.3 h a day.
  close(result.manualHoursPerDay, 8, "manual hours");
  close(result.hoursSavedPerDay, 4.3, "hours saved");
  close(result.labourSavedPerYear, 4.3 * 312 * 22, "labour saved");
  close(result.netSavingPerYear, 4.3 * 312 * 22 - 3000, "net saving");
  close(result.paybackMonths, (35000 / (4.3 * 312 * 22 - 3000)) * 12, "payback");
  assert.equal(calculateRoi({ ...ROI_DEFAULTS, coverage: 0 }).paybackMonths, null);
  const cleaned = cleanRoiInputs({ area: "-5", coverage: 500, life: "abc" });
  assert.equal(cleaned.area, 50);
  assert.equal(cleaned.coverage, 100);
  assert.equal(cleaned.life, ROI_DEFAULTS.life);
});

test("US landed cost stacks both Section 301 duties on Chinese vacuums", () => {
  const result = calculateLanded(LANDED_DEFAULTS);
  const goods = 180 * 1000;
  close(result.customsValue, goods, "FOB basis");
  // 25% + 12.5% + MPF (capped) + HMF 0.125%.
  const expected = goods * 0.375 + Math.min(670.86, goods * 0.003464) + goods * 0.00125;
  close(result.dutiesAndFees, expected, "duties and fees");
  close(result.landedTotal, goods + 4500 + goods * 0.003 + expected + 1500, "landed total");
  assert.equal(result.vat, 0);
  const vietnam = calculateLanded({ ...LANDED_DEFAULTS, origin: "vn" });
  assert.ok(!vietnam.lines.some((line) => line.label.startsWith("Section 301 China")));
  close(vietnam.lines.find((line) => line.label.includes("forced-labor")).amount, goods * 0.125, "Vietnam forced-labor duty");
  const mower = calculateLanded({ ...LANDED_DEFAULTS, product: "mower" });
  close(mower.lines.find((line) => line.label.startsWith("Section 301 China")).amount, goods * 0.075, "mower List 4A");
});

test("EU and UK duty use the CIF value and VAT includes duty", () => {
  const eu = calculateLanded({ ...LANDED_DEFAULTS, destination: "eu", euCountry: "de" });
  const cif = 180000 + 4500 + 180000 * 0.003;
  close(eu.customsValue, cif, "CIF");
  close(eu.dutiesAndFees, cif * 0.022, "EU vacuum duty");
  close(eu.vat, (cif + cif * 0.022) * 0.19, "German VAT");
  const uk = calculateLanded({ ...LANDED_DEFAULTS, destination: "uk", product: "pool" });
  close(uk.dutiesAndFees, 0, "UK pool robot duty");
  close(uk.vat, cif * 0.2, "UK VAT");
  const mower = calculateLanded({ ...LANDED_DEFAULTS, destination: "eu", product: "mower", antiDumping: 50 });
  close(mower.dutiesAndFees, cif * 0.5, "modelled anti-dumping duty");
  const notChina = calculateLanded({ ...LANDED_DEFAULTS, destination: "eu", product: "mower", origin: "vn", antiDumping: 50 });
  close(notChina.dutiesAndFees, 0, "anti-dumping only for China");
  assert.equal(cleanLandedInputs({ destination: "mars", units: 0 }).destination, "us");
  assert.equal(cleanLandedInputs({ units: 0 }).units, 1);
});

test("every product and market gets a sensible checklist", () => {
  assert.equal(new Set(CERT_REQUIREMENTS.map((item) => item.id)).size, CERT_REQUIREMENTS.length);
  for (const product of CERT_PRODUCTS) {
    for (const market of CERT_MARKETS) {
      for (const connected of [true, false]) {
        const items = checklistFor(market.value, { product: product.value, connected });
        assert.ok(items.some((item) => item.level === "required"), `${product.value} ${market.value}`);
        assert.ok(items.some((item) => item.id === "un383"));
        for (const item of items) if (item.date) assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
      }
    }
  }
  const euRobot = checklistFor("eu", { product: "robot-vacuum", connected: true }).map((item) => item.id);
  assert.ok(euRobot.includes("eu-red-cyber") && !euRobot.includes("eu-ce-lvd"));
  const euStick = checklistFor("eu", { product: "cordless", connected: false }).map((item) => item.id);
  assert.ok(euStick.includes("eu-ce-lvd") && !euStick.includes("eu-red-cyber"));
  assert.ok(checklistFor("us", { product: "robot-mower", connected: true }).some((item) => item.id === "us-fcc-covered"));
  assert.ok(checklistFor("eu", { product: "robot-mower", connected: true }).some((item) => item.id === "eu-machinery"));
});

test("result emails recompute from inputs and escape nothing unsafe", () => {
  const landed = landedEmail({ product: "<script>", units: 10, unitPrice: 100 });
  assert.ok(!landed.body.includes("<script>"));
  assert.match(landed.subject, /Robot vacuum/);
  const compliance = complianceEmail({ product: "robot-mower", market: "eu", connected: true });
  assert.match(compliance.body, /Machinery/);
  const roi = roiEmail({ ...ROI_DEFAULTS, currency: "EUR" });
  assert.match(roi.body, /€35,000/);
  const html = toolEmailHtml("cleaning-robot-roi", roi, { origin: "https://worldcleanbiz.com" });
  assert.match(html, /tools\/cleaning-robot-roi-calculator/);
  assert.match(html, /won't email you again/);
});
