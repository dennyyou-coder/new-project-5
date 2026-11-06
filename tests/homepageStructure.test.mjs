import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const home = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const header = await readFile(new URL("../components/Header.tsx", import.meta.url), "utf8");
const footer = await readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8");

test("home retains the confirmed event facts and separate visitor/exhibitor forms", () => {
  for (const text of ["18–20 November 2026", "Suzhou Shishan Convention Center", 'form="wceExhibitor"', 'form="wceVisitor"', 'ctaLocation="home_wce_exhibitor"', 'ctaLocation="home_wce_visitor"']) {
    assert.ok(home.includes(text), text);
  }
});

test("all established discovery routes remain reachable from the shared navigation", () => {
  for (const route of ["/news", "/blog", "/guides", "/reports", "/brands", "/products", "/sourcing", "/wcb-expo", "/about", "/contact", "/blog/series/building-worlds-no-1-cleaning-show-from-scratch"]) {
    assert.ok((header + footer).includes(`"${route}"`), route);
  }
  assert.ok(header.includes('href="/"'));
});

test("home retains a single main heading and search guides stay outside editorial selection", () => {
  assert.equal((home.match(/<h1/g) || []).length, 1);
  assert.match(home, /getEditorialInsights\(articles\)/);
});

test("home B layout: search, data-driven counts, sections in order, no expo crowd hero", () => {
  assert.match(home, /The global cleaning industry, in one place\./);
  assert.match(home, /<HomeSearch entries=\{searchEntries\} \/>/);
  for (const count of ["news.length", "brands.length", "featuredProductModels.length", "guides.length"]) {
    assert.ok(home.includes(`value: ${count}`), count);
  }
  const order = [
    "Across the industry this week",
    "Browse by category",
    "New products",
    "Inside the supply chain",
    "Companies",
    "Guides for professionals",
    "The whole industry, in your inbox"
  ].map((heading) => home.indexOf(`>${heading}</h2>`));
  assert.ok(order.every((index) => index > 0), "all sections present");
  assert.deepEqual([...order].sort((a, b) => a - b), order, "sections in order");
  assert.doesNotMatch(home, /home-expo-networking-2025/);
  assert.match(home, /"@type": "Organization"/);
  assert.match(home, /"@type": "WebSite"/);
});

test("home uses company logos, category icons and shows each story once", () => {
  assert.match(home, /<CompanyMark mark=\{marks\.get\(brand\.slug\)!\} size="md" \/>/);
  assert.match(home, /<CategoryIcon slug=\{data\.hub\.slug\} color=\{data\.hub\.color\} \/>/);
  assert.match(home, /<FigureChip label=\{figure\.label\} change=\{figure\.change\} \/>/);
  assert.match(home, /const shownElsewhere = new Set\(\[\.\.\.results, \.\.\.policy, \.\.\.events\]/);
  assert.match(home, /news\.filter\(\(item\) => !shownElsewhere\.has\(item\.slug\)\)\.slice\(0, 7\)/);
  assert.doesNotMatch(home, /home-b-category-latest/);
});
