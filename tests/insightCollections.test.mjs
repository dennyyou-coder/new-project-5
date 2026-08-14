import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import * as insightCollections from "../lib/insightCollections.ts";

const {
  getBlogHomepageEditorial,
  getBlogHomepageGuides,
  getEditorialInsights,
  getFeaturedGuides,
  getGuideInsights,
  getLatestSeriesInsight,
  getRelatedEditorialInsights,
  orderSeriesInsights
} = insightCollections;

const blogSource = await readFile(
  new URL("../app/blog/page.tsx", import.meta.url),
  "utf8"
);
const articleSource = await readFile(
  new URL("../app/blog/[slug]/page.tsx", import.meta.url),
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

test("Blog homepage uses the approved unified content selection helpers", () => {
  assert.match(blogSource, /getLatestSeriesInsight\(allArticles, featuredSeries\)/);
  assert.match(blogSource, /getBlogHomepageEditorial\(allArticles, featuredSeries, 6\)/);
  assert.match(blogSource, /getBlogHomepageGuides\(allArticles, 6, excludedGuideSlugs\)/);
});

test("article episode navigation uses the shared strict series ordering helper", () => {
  assert.match(articleSource, /orderSeriesInsights\(/);
  assert.doesNotMatch(articleSource, /Number\.parseInt\(.*seriesEpisode/);
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

test("related recommendations return three stable editorial articles", () => {
  const current = insight({ slug: "current" });
  const candidates = [
    current,
    insight({ slug: "analysis-a", sortDate: "2026-08-01" }),
    insight({ slug: "analysis-b", sortDate: "2026-08-02" }),
    insight({ slug: "analysis-c", sortDate: "2026-08-03" }),
    insight({ slug: "analysis-d", sortDate: "2026-08-04" }),
    insight({ slug: "guide", contentClass: "search", guideType: "buying" })
  ];

  const first = getRelatedEditorialInsights(candidates, current);
  const second = getRelatedEditorialInsights([...candidates].reverse(), current);

  assert.equal(first.length, 3);
  assert.deepEqual(first.map(({ slug }) => slug), second.map(({ slug }) => slug));
  assert.ok(first.every(({ contentClass }) => contentClass === "editorial"));
  assert.ok(first.every(({ slug }) => slug !== current.slug));
  assert.equal(new Set(first.map(({ slug }) => slug)).size, 3);
});

test("related recommendations reserve one slot for the latest serial analysis", () => {
  const current = insight({ slug: "current" });
  const candidates = [
    current,
    insight({ slug: "series-1", series: "expo-series", seriesEpisode: "1", sortDate: "2026-08-01" }),
    insight({ slug: "series-2", series: "expo-series", seriesEpisode: "2", sortDate: "2026-08-02" }),
    insight({ slug: "analysis-a" }),
    insight({ slug: "analysis-b" }),
    insight({ slug: "analysis-c" })
  ];

  const related = getRelatedEditorialInsights(candidates, current);
  assert.ok(related.some(({ slug }) => slug === "series-2"));
  assert.ok(related.every(({ slug }) => slug !== "series-1"));
});

test("related recommendations honor zero, one, and two item limits", () => {
  const current = insight({ slug: "current" });
  const candidates = [
    current,
    insight({ slug: "series-1", series: "expo-series", seriesEpisode: "1" }),
    insight({ slug: "series-2", series: "expo-series", seriesEpisode: "2" }),
    insight({ slug: "analysis-a" }),
    insight({ slug: "analysis-b" })
  ];

  assert.deepEqual(getRelatedEditorialInsights(candidates, current, 0), []);
  assert.equal(getRelatedEditorialInsights(candidates, current, 1).length, 1);
  assert.equal(getRelatedEditorialInsights(candidates, current, 2).length, 2);
});

test("related recommendations do not duplicate the current series", () => {
  const current = insight({ slug: "series-current", series: "expo-series", seriesEpisode: "3" });
  const related = getRelatedEditorialInsights([
    current,
    insight({ slug: "series-older", series: "expo-series", seriesEpisode: "2" }),
    insight({ slug: "other-series", series: "market-series", seriesEpisode: "1" }),
    insight({ slug: "analysis-a" }),
    insight({ slug: "analysis-b" }),
    insight({ slug: "analysis-c" })
  ], current);

  assert.ok(related.every(({ series }) => series !== "expo-series"));
});

test("related recommendations fail clearly when three editorial articles are unavailable", () => {
  const current = insight({ slug: "current" });
  assert.throws(
    () => getRelatedEditorialInsights([
      current,
      insight({ slug: "only-one" }),
      insight({ slug: "guide", contentClass: "search" })
    ], current),
    /RELATED_EDITORIAL_INSUFFICIENT slug=current required=3 available=1/
  );
});

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

test("rejects partial numeric series episode formats", () => {
  const articles = [
    insight({
      slug: "invalid-newer",
      series: "wcb-series",
      seriesEpisode: "02-special",
      sortDate: "2026-07-20"
    }),
    insight({
      slug: "valid-older",
      series: "wcb-series",
      seriesEpisode: "1",
      sortDate: "2026-06-01"
    })
  ];

  assert.equal(getLatestSeriesInsight(articles, "wcb-series")?.slug, "valid-older");
});

test("equal numeric episodes resolve by date independently of input order", () => {
  const older = insight({
    slug: "episode-older",
    series: "wcb-series",
    seriesEpisode: "2",
    sortDate: "2026-06-01"
  });
  const newer = insight({
    slug: "episode-newer",
    series: "wcb-series",
    seriesEpisode: "02",
    sortDate: "2026-07-01"
  });

  assert.equal(getLatestSeriesInsight([older, newer], "wcb-series")?.slug, "episode-newer");
  assert.equal(getLatestSeriesInsight([newer, older], "wcb-series")?.slug, "episode-newer");
});

test("equal episode and date resolve by slug independently of input order", () => {
  const alpha = insight({
    slug: "episode-alpha",
    series: "wcb-series",
    seriesEpisode: "2",
    sortDate: "2026-07-01"
  });
  const beta = insight({
    slug: "episode-beta",
    series: "wcb-series",
    seriesEpisode: "02",
    sortDate: "2026-07-01"
  });

  assert.equal(getLatestSeriesInsight([beta, alpha], "wcb-series")?.slug, "episode-alpha");
  assert.equal(getLatestSeriesInsight([alpha, beta], "wcb-series")?.slug, "episode-alpha");
});

test("orders mixed valid and invalid episodes consistently for All Episodes", () => {
  const articles = [
    insight({
      slug: "special",
      series: "wcb-series",
      seriesEpisode: "02-special",
      sortDate: "2026-07-03"
    }),
    insight({
      slug: "episode-2",
      series: "wcb-series",
      seriesEpisode: " 02 ",
      sortDate: "2026-07-02"
    }),
    insight({
      slug: "episode-1",
      series: "wcb-series",
      seriesEpisode: "1",
      sortDate: "2026-07-01"
    })
  ];

  assert.equal(typeof orderSeriesInsights, "function");
  assert.deepEqual(
    orderSeriesInsights(articles, "ascending").map((article) => article.slug),
    ["episode-1", "episode-2", "special"]
  );
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

test("fixed series hero cannot also fill the six-guide grid", () => {
  const fixedSeries = "building-worlds-no-1-cleaning-show-from-scratch";
  const seriesHero = insight({
    slug: fixedSeries,
    contentClass: "search",
    guideType: "explainer",
    guidePriority: 0,
    series: fixedSeries,
    seriesEpisode: "1",
    sortDate: "2026-07-30"
  });
  const articles = [
    seriesHero,
    ...Array.from({ length: 5 }, (_, index) =>
      insight({
        slug: `priority-guide-${index + 1}`,
        contentClass: "search",
        guideType: "buying",
        guidePriority: index + 1,
        sortDate: `2026-07-${String(25 - index).padStart(2, "0")}`
      })
    ),
    insight({
      slug: "fallback-guide",
      contentClass: "search",
      guideType: "comparison",
      guidePriority: 0,
      sortDate: "2026-07-20"
    })
  ];

  const latestSeries = getLatestSeriesInsight(articles, fixedSeries);
  const guides = getBlogHomepageGuides(
    articles,
    6,
    latestSeries ? [latestSeries.slug] : []
  );

  assert.equal(latestSeries?.slug, fixedSeries);
  assert.deepEqual(
    guides.map((article) => article.slug),
    [
      "priority-guide-1",
      "priority-guide-2",
      "priority-guide-3",
      "priority-guide-4",
      "priority-guide-5",
      "fallback-guide"
    ]
  );
  assert.equal(guides.some((article) => article.slug === latestSeries?.slug), false);
});

test("published insight metadata never advertises a future publication time", async () => {
  const contentDirectory = new URL("../content/insights/", import.meta.url);
  const files = (await readdir(contentDirectory)).filter((file) => file.endsWith(".mdx"));
  const latestAllowedTime = Date.now() + 5 * 60 * 1000;
  const violations = [];

  for (const file of files) {
    const source = await readFile(new URL(file, contentDirectory), "utf8");
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";

    if (/^hidden:\s*["']?true["']?\s*$/im.test(frontmatter)) continue;

    for (const field of ["publishedAt", "sortDate"]) {
      const value = frontmatter.match(new RegExp(`^${field}:\\s*["']?([^"'\\n]+)`, "m"))?.[1]?.trim();
      const timestamp = value ? Date.parse(value) : Number.NaN;

      if (Number.isFinite(timestamp) && timestamp > latestAllowedTime) {
        violations.push(`${file}: ${field}=${value}`);
      }
    }
  }

  assert.deepEqual(violations, []);
});
