import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const expectedAssets = [
  "public/images/site-refresh/home/category-robot-vacuums.webp",
  "public/images/site-refresh/home/category-floor-washers.webp",
  "public/images/site-refresh/home/category-pool-robots.webp",
  "public/images/site-refresh/home/category-robotic-lawn-mowers.webp",
  "public/images/site-refresh/home/category-commercial-cleaning.webp",
  "public/images/site-refresh/home/category-emerging-cleaning.webp",
  "public/images/site-refresh/home/path-market-intelligence.webp",
  "public/images/site-refresh/home/path-product-sourcing.webp",
  "public/images/site-refresh/home/path-world-clean-expo.webp",
  "public/images/site-refresh/home/trust-denny-industry.webp",
  "public/images/site-refresh/home/trust-supplier-network.webp",
  "public/images/site-refresh/home/trust-expo-access.webp",
  "public/images/site-refresh/about/about-hero-denny.webp",
  "public/images/site-refresh/about/about-industry-analysis.webp",
  "public/images/site-refresh/about/about-product-supplier-work.webp",
  "public/images/site-refresh/about/about-expo-connections.webp",
  "public/images/site-refresh/about/about-network-forum.webp",
  "public/images/site-refresh/about/about-team-execution.webp",
  "public/images/site-refresh/system/market-intelligence.webp",
  "public/images/site-refresh/system/product-engineering.webp",
  "public/images/site-refresh/system/expo-concept.webp",
  "public/images/site-refresh/system/business-roundtable.webp",
  "public/images/site-refresh/system/product-selection.webp",
  "public/images/site-refresh/system/smart-factory.webp",
  "public/images/site-refresh/system/report-analysis.webp",
  "public/images/site-refresh/system/business-advisory.webp"
  ,"public/images/site-refresh/real/city-architecture.webp"
  ,"public/images/site-refresh/real/modern-factory.webp"
  ,"public/images/site-refresh/real/business-office.webp"
  ,"public/images/site-refresh/real/exhibition-hall.webp"
  ,"public/images/site-refresh/real/product-detail.webp"
];

test("phase one production images all exist", () => {
  for (const asset of expectedAssets) {
    assert.equal(fs.existsSync(path.join(root, asset)), true, asset);
  }
});

test("homepage uses the local visual system and preserves article covers", () => {
  const source = read("app/page.tsx");
  assert.match(source, /\/images\/site-refresh\/home\/category-robot-vacuums\.webp/);
  assert.match(source, /\/images\/site-refresh\/real\/city-architecture\.webp/);
  assert.match(source, /\/images\/site-refresh\/home\/trust-denny-industry\.webp/);
  assert.match(source, /imageFor\(article, index\)/);
  assert.doesNotMatch(source, /https?:\/\//);
});

test("About uses the local visual system", () => {
  const source = read("app/about/page.tsx");
  assert.match(source, /\/images\/site-refresh\/about\/about-hero-denny\.webp/);
  assert.match(source, /\/images\/industry\/sourcing-supplier-meeting-2026\.jpg/);
  assert.doesNotMatch(source, /https?:\/\//);
});

test("phase two mixes real photography with restrained generated visuals", () => {
  const files = [
    "app/page.tsx",
    "app/about/page.tsx",
    "app/reports/page.tsx",
    "app/world-clean-expo/page.tsx"
  ].map(read).join("\n");
  assert.match(files, /\/images\/site-refresh\/real\/city-architecture\.webp/);
  assert.match(files, /\/images\/site-refresh\/real\/modern-factory\.webp/);
  assert.match(files, /\/images\/site-refresh\/real\/business-office\.webp/);
  assert.match(files, /\/images\/site-refresh\/real\/exhibition-hall\.webp/);
  assert.match(files, /\/images\/site-refresh\/real\/product-detail\.webp/);
});

test("Denny remains visible in the four trust-critical pages", () => {
  const about = read("app/about/page.tsx");
  const sourcing = read("app/sourcing/page.tsx");
  const contact = read("app/contact/page.tsx");
  const expo = read("app/world-clean-expo/page.tsx");
  assert.match(about, /about-hero-denny\.webp/);
  assert.match(about, /sourcing-supplier-meeting-2026\.jpg/);
  assert.match(sourcing, /about-hero-denny\.webp/);
  assert.match(sourcing, /sourcing-supplier-meeting-2026\.jpg/);
  assert.match(contact, /about-hero-denny\.webp/);
  assert.match(expo, /about-denny-speaking-forum-2025\.jpg/);
});

test("phase two alignment rules cover equal-height cards and media crops", () => {
  const css = read("app/globals.css");
  assert.match(css, /Phase 2 visual alignment/);
  assert.match(css, /align-items:\s*stretch/);
  assert.match(css, /object-fit:\s*cover/);
  assert.match(css, /object-position:\s*center/);
});
