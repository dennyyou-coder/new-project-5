import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expoSource = await readFile(
  new URL("../app/world-clean-expo/page.tsx", import.meta.url),
  "utf8"
);
const globalStyles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8"
);

test("Expo gives exhibitors and visitors distinct tracked conversion paths", () => {
  assert.match(expoSource, /I Want To Exhibit/);
  assert.match(expoSource, /I Want To Visit/);
  assert.match(expoSource, /inquiryIntent="exhibitor_interest"/);
  assert.match(expoSource, /inquiryIntent="visitor_interest"/);
  assert.match(expoSource, /"wce_hero_exhibitor"/);
  assert.match(expoSource, /"wce_hero_visitor"/);
});

test("Expo explains commercial outcomes for both sides of the market", () => {
  assert.match(expoSource, /For Exhibitors/);
  assert.match(expoSource, /For Buyers &amp; Visitors/);
  assert.match(expoSource, /Meet Potential Buyers/);
  assert.match(expoSource, /Discover New Products Earlier/);
  assert.match(expoSource, /Business Matching/);
});

test("Expo presents real product categories with visual evidence", () => {
  assert.match(expoSource, /PRODUCT CATEGORIES/);
  assert.match(expoSource, /Robotic Vacuums/);
  assert.match(expoSource, /Floor Washers/);
  assert.match(expoSource, /Pool Cleaning Robots/);
  assert.match(expoSource, /Commercial Cleaning/);
  assert.match(expoSource, /expo-category-grid/);
  assert.match(globalStyles, /\.expo-category-card/);
});

test("Expo no longer behaves like one generic newsletter signup", () => {
  assert.doesNotMatch(expoSource, /Get The Updates That Matter Before The Show/);
  assert.doesNotMatch(expoSource, /Built For Cleaning Industry Professionals/);
  assert.doesNotMatch(expoSource, /Get World Clean Expo Updates/);
  assert.match(expoSource, /Tell Us How You Want To Take Part/);
});

test("Expo preserves the current event information without invented scale claims", () => {
  assert.match(expoSource, /November 2026/);
  assert.match(expoSource, /Suzhou International Expo Center/);
  assert.match(expoSource, /China/);
  assert.doesNotMatch(expoSource, /\d+[,+]\s*(Exhibitors|Buyers|Visitors)/);
});
