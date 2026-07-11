import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pages = Object.fromEntries(
  await Promise.all(
    ["page", "sourcing/page", "contact/page", "reports/page", "world-clean-expo/page"].map(
      async (name) => [
        name,
        await readFile(new URL(`../app/${name}.tsx`, import.meta.url), "utf8")
      ]
    )
  )
);

test("homepage presents Denny's current industry identity without changing its structure", () => {
  assert.match(pages.page, /Organizer, World Clean Expo/);
  assert.match(pages.page, /For a decade/);
  assert.match(pages.page, /Hardware entrepreneur/);
  assert.match(pages.page, /Since 2006/);
  assert.match(pages.page, /className="home-v9-section home-v9-trust"/);
});

test("Sourcing uses relevant operator, entrepreneur and network proof", () => {
  assert.match(pages["sourcing/page"], /Product Experience Since 2006/);
  assert.match(pages["sourcing/page"], /Cleaning industry hardware entrepreneur/);
  assert.match(pages["sourcing/page"], /Network across manufacturers, suppliers, brands and buyers/);
  assert.doesNotMatch(pages["sourcing/page"], /20 years inside the cleaning industry/i);
});

test("Contact carries the compact founder and organizer identity", () => {
  assert.match(pages["contact/page"], /Founder, World Clean Biz · Organizer, World Clean Expo/);
  assert.match(pages["contact/page"], /Inside the cleaning industry since 2006/);
});

test("Reports emphasizes Denny's decade of analysis and financial-market audiences", () => {
  assert.match(pages["reports/page"], /For a decade, Denny has shared cleaning industry analysis/);
  assert.match(pages["reports/page"], /securities firms and investment banks/);
  assert.match(pages["reports/page"], /Inside the cleaning industry since 2006/);
  assert.doesNotMatch(pages["reports/page"], /with 20 years inside/);
});

test("Expo identifies its organizer and explains the network behind matching", () => {
  assert.match(pages["world-clean-expo/page"], /ORGANIZER &amp; INDUSTRY NETWORK/);
  assert.match(pages["world-clean-expo/page"], /Denny You/);
  assert.match(pages["world-clean-expo/page"], /organizer of World Clean\s+Expo/);
  assert.match(pages["world-clean-expo/page"], /manufacturers, suppliers, brands,\s+buyers, investors and media/);
});
