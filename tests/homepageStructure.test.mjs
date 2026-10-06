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
