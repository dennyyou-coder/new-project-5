import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getEditorialInsights,
  getFeaturedGuides,
  getGuideInsights
} from "../lib/insightCollections.ts";

const blogSource = await readFile(
  new URL("../app/blog/page.tsx", import.meta.url),
  "utf8"
);

const articles = [
  {
    slug: "new-guide",
    contentClass: "search",
    guideType: "buying",
    guidePriority: 20,
    sortDate: "2026-07-27"
  },
  {
    slug: "latest-analysis",
    contentClass: "editorial",
    guidePriority: 0,
    sortDate: "2026-07-26"
  },
  {
    slug: "priority-guide",
    contentClass: "search",
    guideType: "sourcing",
    guidePriority: 10,
    sortDate: "2026-07-25"
  },
  {
    slug: "older-analysis",
    contentClass: "editorial",
    guidePriority: 0,
    sortDate: "2026-07-20"
  }
];

test("editorial collection excludes search articles and keeps date order", () => {
  assert.deepEqual(
    getEditorialInsights(articles).map(({ slug }) => slug),
    ["latest-analysis", "older-analysis"]
  );
});

test("guide collection excludes editorial and supports type filtering", () => {
  assert.deepEqual(
    getGuideInsights(articles).map(({ slug }) => slug),
    ["new-guide", "priority-guide"]
  );
  assert.deepEqual(
    getGuideInsights(articles, "sourcing").map(({ slug }) => slug),
    ["priority-guide"]
  );
});

test("featured guides use explicit priority rather than fabricated dates", () => {
  assert.deepEqual(
    getFeaturedGuides(articles, 2).map(({ slug }) => slug),
    ["priority-guide", "new-guide"]
  );
});

test("Blog derives every discovery surface from editorial articles", () => {
  assert.match(blogSource, /const articles = getEditorialInsights\(allArticles\)/);
  assert.match(blogSource, /const visibleCategories = categories\.filter/);
  assert.match(blogSource, /const visibleBrandTopics = brandTopics\.filter/);
  assert.match(blogSource, /getFeaturedGuides\(allArticles, 5\)/);
});
