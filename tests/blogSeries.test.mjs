import assert from "node:assert/strict";
import test from "node:test";
import {
  getBlogSeriesSlugs,
  getBlogSeriesPageData,
  getFeaturedSeriesLinks,
  getSeriesArticles
} from "../lib/blogSeries.ts";

const articles = [
  {
    slug: "episode-10",
    series: "wcb-series",
    seriesEpisode: "10",
    sortDate: "2026-08-10"
  },
  {
    slug: "other-series",
    series: "other",
    seriesEpisode: "01",
    sortDate: "2026-08-01"
  },
  {
    slug: "episode-02",
    series: "wcb-series",
    seriesEpisode: "02",
    sortDate: "2026-07-28"
  },
  {
    slug: "episode-01",
    series: "wcb-series",
    seriesEpisode: "01",
    sortDate: "2026-07-20"
  }
];

test("filters one series and sorts numeric episode values in ascending order", () => {
  assert.deepEqual(
    getSeriesArticles(articles, "wcb-series").map(({ slug }) => slug),
    ["episode-01", "episode-02", "episode-10"]
  );
});

test("uses chronological sortDate order when episode numbers are missing or equal", () => {
  const episodesWithoutNumbers = [
    { slug: "later", series: "wcb-series", sortDate: "2026-08-02" },
    { slug: "earlier", series: "wcb-series", sortDate: "2026-08-01" }
  ];

  assert.deepEqual(
    getSeriesArticles(episodesWithoutNumbers, "wcb-series").map(({ slug }) => slug),
    ["earlier", "later"]
  );
});

test("returns each published series slug once", () => {
  assert.deepEqual(
    getBlogSeriesSlugs([
      ...articles,
      { slug: "episode-03", series: "wcb-series", sortDate: "2026-08-03" },
      { slug: "standalone", sortDate: "2026-08-04" }
    ]),
    ["wcb-series", "other"]
  );
});

test("builds separate article and full-series destinations", () => {
  assert.deepEqual(
    getFeaturedSeriesLinks({
      slug: "episode-02",
      series: "building-worlds-no-1-cleaning-show-from-scratch"
    }),
    {
      articleHref: "/blog/episode-02",
      seriesHref: "/blog/series/building-worlds-no-1-cleaning-show-from-scratch"
    }
  );

  assert.deepEqual(
    getFeaturedSeriesLinks({ slug: "standalone" }),
    {
      articleHref: "/blog/standalone",
      seriesHref: undefined
    }
  );
});

test("builds series page data from its ordered episodes and latest publication", () => {
  assert.deepEqual(
    getBlogSeriesPageData(
      [
        {
          slug: "episode-02",
          series: "wcb-series",
          seriesTitle: "WCB Original Series",
          seriesEpisode: "02",
          sortDate: "2026-07-28",
          publishedAt: "2026-07-28T20:00:00+08:00"
        },
        {
          slug: "episode-01",
          series: "wcb-series",
          seriesTitle: "WCB Original Series",
          seriesEpisode: "01",
          sortDate: "2026-07-20",
          publishedAt: "2026-07-20T20:00:00+08:00"
        }
      ],
      "wcb-series"
    ),
    {
      title: "WCB Original Series",
      episodes: [
        {
          slug: "episode-01",
          series: "wcb-series",
          seriesTitle: "WCB Original Series",
          seriesEpisode: "01",
          sortDate: "2026-07-20",
          publishedAt: "2026-07-20T20:00:00+08:00"
        },
        {
          slug: "episode-02",
          series: "wcb-series",
          seriesTitle: "WCB Original Series",
          seriesEpisode: "02",
          sortDate: "2026-07-28",
          publishedAt: "2026-07-28T20:00:00+08:00"
        }
      ],
      latestPublishedAt: "2026-07-28T20:00:00+08:00"
    }
  );

  assert.equal(getBlogSeriesPageData(articles, "missing-series"), undefined);
});
