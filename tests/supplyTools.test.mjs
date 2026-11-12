import assert from "node:assert/strict";
import test from "node:test";
import { bestFloor, calculateContainer, cleanContainerInputs, CONTAINER_DEFAULTS } from "../lib/tools/container.ts";
import { calculatePricing, cleanPricingInputs, DEFAULT_US_DUTY, PRICING_DEFAULTS } from "../lib/tools/pricing.ts";
import { calculateBattery, cleanBatteryInputs, BATTERY_DEFAULTS } from "../lib/tools/battery.ts";
import { batteryEmail, containerEmail, pricingEmail, toolEmail } from "../lib/tools/email.ts";
import { WCB_TOOLS } from "../lib/tools/catalog.ts";

const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 0.01, `${message}: ${actual} vs ${expected}`);

test("floor packing finds mixed layouts and never overfills", () => {
  // 10 × 3 floor with 3 × 2 boxes: turned, five fit in one row.
  assert.equal(bestFloor(10, 3, 3, 2), 5);
  assert.equal(bestFloor(6, 4, 2, 3), 4);
  // A mixed layout beats both straight grids: 7 × 5 floor, 3 × 2 boxes.
  assert.equal(bestFloor(7, 5, 3, 2), 5);
  for (const [L, W, a, b] of [[579, 235, 52, 52], [1193, 235, 60, 45], [579, 235, 33, 71]]) {
    assert.ok(bestFloor(L, W, a, b) * a * b <= L * W, "never more area than the floor");
  }
});

test("container counts respect space, weight and the order", () => {
  const result = calculateContainer(CONTAINER_DEFAULTS);
  const hq = result.fits.find((fit) => fit.key === "40hq");
  // 52 × 52 × 30 cm upright: 22 along 1,193 cm, 4 across 235 cm, 8 layers in 264 cm.
  assert.equal(hq.bySpace, 22 * 4 * 8);
  assert.equal(hq.limit, "space");
  close(result.cartonCbm, 0.08112, "carton cbm");
  assert.equal(hq.containersForOrder, Math.ceil(3000 / hq.cartons));
  const heavy = calculateContainer({ ...CONTAINER_DEFAULTS, cartonWeight: 100 });
  const heavy20 = heavy.fits.find((fit) => fit.key === "20gp");
  assert.equal(heavy20.limit, "weight");
  assert.equal(heavy20.cartons, Math.floor(28200 / 100));
  const tall = { ...CONTAINER_DEFAULTS, cartonLength: 120, cartonWidth: 40, cartonHeight: 250 };
  assert.ok(calculateContainer({ ...tall, allowTipping: true }).fits[0].cartons > calculateContainer(tall).fits[0].cartons);
  const cleaned = cleanContainerInputs({ cartonLength: "-1", unitsPerCarton: 2.6, allowTipping: "true" });
  assert.equal(cleaned.cartonLength, 5);
  assert.equal(cleaned.unitsPerCarton, 3);
  assert.equal(cleaned.allowTipping, true);
});

test("price ladder adds back up and runs both ways", () => {
  for (const channel of ["amazon", "retail", "distributor"]) {
    for (const market of ["us", "eu", "uk"]) {
      const inputs = cleanPricingInputs({ ...PRICING_DEFAULTS, channel, market, vat: market === "us" ? 0 : 20 });
      const back = calculatePricing(inputs);
      const sum = back.retailPrice + back.ladder.reduce((total, step) => total + step.amount, 0);
      close(sum, back.fobPrice, `${channel} ${market} ladder`);
      const forward = calculatePricing({ ...inputs, mode: "toRetail", fobPrice: back.fobPrice });
      close(forward.retailPrice, inputs.retailPrice, `${channel} ${market} round trip`);
    }
  }
  assert.equal(DEFAULT_US_DUTY, 37.5);
  // Amazon US: 399 − 15% referral − $14 − 10% ads, less 5% returns, keep 80%, then duty on FOB.
  const amazon = calculatePricing(PRICING_DEFAULTS);
  const revenue = (399 - 59.85 - 14 - 39.9) * 0.95;
  close(amazon.brandRevenue, revenue, "brand revenue");
  close(amazon.fobPrice, (revenue * 0.8 - 6 - 4) / 1.375, "FOB");
  assert.equal(calculatePricing({ ...PRICING_DEFAULTS, referralFee: 60, advertising: 50 }).impossible, true);
  assert.equal(cleanPricingInputs({ market: "us", vat: 20 }).vat, 0);
});

test("battery rules follow the 20 Wh and 100 Wh limits", () => {
  const stick = calculateBattery(BATTERY_DEFAULTS);
  assert.equal(stick.wh, 63);
  assert.equal(stick.small, true);
  assert.equal(stick.un, "UN3481");
  assert.equal(stick.passengerAir.verdict, "ok");
  assert.equal(stick.sea.verdict, "ok");
  const spares = calculateBattery({ ...BATTERY_DEFAULTS, packing: "alone" });
  assert.equal(spares.un, "UN3480");
  assert.equal(spares.passengerAir.verdict, "forbidden");
  assert.match(spares.cargoAir.headline, /Section IB/);
  const big = calculateBattery({ ...BATTERY_DEFAULTS, voltage: 36, capacity: 5000, packing: "with" });
  assert.equal(big.wh, 180);
  assert.equal(big.small, false);
  assert.equal(big.passengerAir.verdict, "restricted");
  assert.equal(big.sea.verdict, "restricted");
  assert.match(big.handCarry, /160 Wh/);
  const heavy = calculateBattery({ ...BATTERY_DEFAULTS, batteriesPerPackage: 20, batteryWeight: 0.4 });
  assert.equal(heavy.passengerAir.verdict, "restricted");
  assert.match(heavy.passengerAir.headline, /5 kg/);
  assert.equal(cleanBatteryInputs({ packing: "boat", voltage: "x" }).packing, BATTERY_DEFAULTS.packing);
});

test("new tools are registered and email their results", () => {
  for (const id of ["container-loading", "retail-to-fob", "battery-shipping"]) {
    const tool = WCB_TOOLS.find((item) => item.id === id);
    assert.ok(tool && !tool.home, id);
    const email = toolEmail(id, {});
    assert.ok(email.subject.length > 10 && !email.body.includes("<script>"), id);
  }
  assert.equal(WCB_TOOLS.filter((tool) => tool.home).length, 3);
  assert.match(containerEmail({ cartonLength: 40 }).body, /40HQ/);
  assert.match(pricingEmail({ market: "eu" }).body, /€/);
  assert.match(batteryEmail({ packing: "alone" }).body, /UN3480/);
});
