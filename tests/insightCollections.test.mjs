import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getBlogHomepageEditorial,
  getBlogHomepageGuides,
  getEditorialInsights,
  getFeaturedGuides,
  getGuideInsights,
  getLatestSeriesInsight
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

function insight(overrides) {
  return {
    slug: overrides.slug,
    contentClass: "editorial",
    guideType: undefined,
    guidePriority: 0,
    sortDate: "2026-01-01",
    series: undefined,
    seriesEpisode: undefined,
    ...overrides
  };
}

test("selects the highest numeric episode from the fixed series", () => {
  const articles = [
    insight({ slug: "ep-2", series: "wcb-series", seriesEpisode: "02", sortDate: "2026-07-01" }),
    insight({ slug: "ep-10", series: "wcb-series", seriesEpisode: "10", sortDate: "2026-06-01" }),
    insight({ slug: "other", series: "another-series", seriesEpisode: "99" })
  ];

  assert.equal(getLatestSeriesInsight(articles, "wcb-series")?.slug, "ep-10");
});

test("falls back to sortDate when series episodes are not numeric", () => {
  const articles = [
    insight({ slug: "older", series: "wcb-series", seriesEpisode: "", sortDate: "2026-06-01" }),
    insight({ slug: "newer", series: "wcb-series", seriesEpisode: "special", sortDate: "2026-07-01" })
  ];

  assert.equal(getLatestSeriesInsight(articles, "wcb-series")?.slug, "newer");
});

test("returns six newest editorial articles while excluding the fixed series", () => {
  const articles = [
    insight({ slug: "series-episode", series: "wcb-series", sortDate: "2026-07-20" }),
    ...Array.from({ length: 8 }, (_, index) =>
      insight({
        slug: `editorial-${index}`,
        sortDate: `2026-07-${String(19 - index).padStart(2, "0")}`
      })
    ),
    insight({ slug: "guide", contentClass: "search", guideType: "buying", sortDate: "2026-07-21" })
  ];

  assert.deepEqual(
    getBlogHomepageEditorial(articles, "wcb-series").map((article) => article.slug),
    ["editorial-0", "editorial-1", "editorial-2", "editorial-3", "editorial-4", "editorial-5"]
  );
});

test("puts prioritized guides first and fills the remaining six by newest date", () => {
  const articles = [
    insight({ slug: "priority-2", contentClass: "search", guideType: "buying", guidePriority: 2, sortDate: "2026-01-01" }),
    insight({ slug: "priority-1", contentClass: "search", guideType: "ownership", guidePriority: 1, sortDate: "2025-01-01" }),
    ...Array.from({ length: 6 }, (_, index) =>
      insight({
        slug: `latest-${index}`,
        contentClass: "search",
        guideType: "comparison",
        guidePriority: 0,
        sortDate: `2026-07-${String(20 - index).padStart(2, "0")}`
      })
    )
  ];

  assert.deepEqual(
    getBlogHomepageGuides(articles).map((article) => article.slug),
    ["priority-1", "priority-2", "latest-0", "latest-1", "latest-2", "latest-3"]
  );
});
