import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const home = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const header = await readFile(new URL("../components/Header.tsx", import.meta.url), "utf8");
const footer = await readFile(new URL("../components/Footer.tsx", import.meta.url), "utf8");

test("home retains the confirmed event facts and separate visitor/exhibitor forms", () => {
  for (const text of ['form="wceExhibitor"', 'form="wceVisitor"', 'ctaLocation="home_hero_wce_exhibitor"', 'ctaLocation="home_hero_wce_visitor"', "EXPO_2026.dates", "EXPO_2026.venue"]) {
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

test("home order: hero, news, WCB Expo, radar, From Denny, directory, business, subscribe", () => {
  // The A design opens with a visible heading, a search box and what WCB tracks.
  assert.match(home, /The global cleaning industry, in one place\./);
  assert.match(home, /action="\/search"/);
  assert.match(home, /getTopics\(\)/);
  assert.match(home, /\{expoUpcoming \? \(\s*<section className="ha-expo"/);
  const body = home.slice(home.indexOf("  return (\n    <div className=\"home-a\">"));
  const order = [
    'id="home-title"',
    'id="home-feed-title"',
    'id="home-expo-title"',
    'id="home-radar-title"',
    'id="home-denny-title"',
    'id="home-categories-title"',
    'id="home-companies-title"',
    'id="home-owners-title"',
    'id="home-products-title"',
    'id="home-business-title"',
    'id="home-subscribe-title"'
  ].map((marker) => body.indexOf(marker));
  assert.ok(order.every((index) => index > 0), "all sections present");
  assert.deepEqual([...order].sort((a, b) => a - b), order, "sections in order");
  assert.doesNotMatch(home, /Guides for professionals|<HomeVideos|<HomeSeriesFeature/);
  assert.match(home, /"@type": "Organization"/);
  assert.match(home, /"@type": "WebSite"/);
});

test("home uses company logos, white product photos per category and one news block: a lead story and a list", () => {
  assert.match(home, /<Logo mark=\{marks\.get\(brand\.slug\)\} \/>/);
  assert.match(home, /const CATEGORY_IMAGES: Record<HubCategorySlug/);
  // The lead is a news story with its own picture; the list skips it, so each story appears once.
  assert.match(home, /const leadNews = leadTiers/);
  // A related article's cover or a generic industry picture never leads; an official company image is credited.
  assert.match(home, /visual\.label === "Company image"/);
  assert.match(home, /className="ha-lead-credit"/);
  assert.match(home, /leadVisual\.label === "Company image" \? "File photo"/);
  assert.match(home, /const weekNews = recent\.filter\(\(item\) => item\.slug !== leadNews\?\.slug\)/);
  assert.match(home, /href=\{`\/news\/\$\{leadNews\.slug\}`\}/);
  assert.equal((home.match(/className="ha-stream"/g) || []).length, 1, "one news list");
});
