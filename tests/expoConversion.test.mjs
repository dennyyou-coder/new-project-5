import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expoSource = await readFile(
  new URL("../app/wcb-expo/page.tsx", import.meta.url),
  "utf8"
);
const legacyRouteSource = await readFile(
  new URL("../app/world-clean-expo/page.tsx", import.meta.url),
  "utf8"
);
const globalStyles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8"
);

test("WCB Expo makes visitor planning primary while retaining exhibitor interest", () => {
  assert.match(expoSource, /Plan Your Visit/);
  assert.match(expoSource, /Request Exhibitor Information/);
  assert.match(expoSource, /inquiryIntent="exhibitor_interest"/);
  assert.match(expoSource, /inquiryIntent="visitor_interest"/);
  assert.match(expoSource, /ctaLocation="wcb_expo_hero_visit"/);
  assert.match(expoSource, /ctaLocation="wcb_expo_exhibitor_interest"/);
  assert.match(expoSource, /id="visitor-interest"/);
  assert.match(expoSource, /id="exhibitor-interest"/);
});

test("WCB Expo uses the confirmed event identity and canonical route", () => {
  assert.match(expoSource, /2026 WCB International Cleaning Appliance Expo/);
  assert.match(expoSource, /2026 WCB 国际清洁电器博览会/);
  assert.match(expoSource, /18–20 November 2026/);
  assert.match(expoSource, /Suzhou Shishan Convention Center/);
  assert.match(expoSource, /Suzhou, China/);
  assert.match(expoSource, /canonical: "\/wcb-expo"/);
  assert.match(legacyRouteSource, /permanentRedirect\("\/wcb-expo"\)/);
});

test("WCB Expo presents seven buyer categories with visual evidence", () => {
  for (const category of [
    "Robot Vacuums",
    "Floor Washers",
    "Vacuum Cleaners",
    "Pool Robots",
    "Lawn Robots",
    "Commercial Cleaning",
    "Components & Accessories"
  ]) {
    assert.match(expoSource, new RegExp(category));
  }
  assert.match(expoSource, /wcb-expo-category-grid/);
  assert.match(globalStyles, /\.wcb-expo-category-card/);
});

test("WCB Expo explains the supply chain and event programs", () => {
  for (const participant of ["Global Brands & Buyers", "Complete-Machine Manufacturers", "OEM / ODM Partners", "Components & Materials"]) {
    assert.match(expoSource, new RegExp(participant));
  }
  for (const program of ["Industry Forums", "Procurement Matchmaking", "New Product Launches"]) {
    assert.match(expoSource, new RegExp(program));
  }
});

test("WCB Expo limits proof to organizer records from two prior supply-chain events", () => {
  assert.match(expoSource, /November 2025/);
  assert.match(expoSource, /March 2026/);
  assert.match(expoSource, /100\+/);
  assert.match(expoSource, /1,000\+/);
  assert.match(expoSource, /organizer records/);
  assert.doesNotMatch(expoSource, /90\+/);
  assert.doesNotMatch(expoSource, /Asia(?:'|’)?s leading/i);
  assert.doesNotMatch(expoSource, /it(?:'|’)s free/i);
});
