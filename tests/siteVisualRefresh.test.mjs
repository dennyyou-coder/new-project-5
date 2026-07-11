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
  "public/images/site-refresh/about/about-team-execution.webp"
];

test("phase one production images all exist", () => {
  for (const asset of expectedAssets) {
    assert.equal(fs.existsSync(path.join(root, asset)), true, asset);
  }
});

test("homepage uses the local visual system and preserves article covers", () => {
  const source = read("app/page.tsx");
  assert.match(source, /\/images\/site-refresh\/home\/category-robot-vacuums\.webp/);
  assert.match(source, /\/images\/site-refresh\/home\/path-market-intelligence\.webp/);
  assert.match(source, /\/images\/site-refresh\/home\/trust-denny-industry\.webp/);
  assert.match(source, /imageFor\(article, index\)/);
  assert.doesNotMatch(source, /https?:\/\//);
});

test("About uses the local visual system", () => {
  const source = read("app/about/page.tsx");
  assert.match(source, /\/images\/site-refresh\/about\/about-hero-denny\.webp/);
  assert.match(source, /\/images\/site-refresh\/about\/about-team-execution\.webp/);
  assert.doesNotMatch(source, /https?:\/\//);
});
