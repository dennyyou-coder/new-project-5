import test from "node:test";
import assert from "node:assert/strict";
import { getMarketsData, isResultsNews } from "../lib/markets.ts";
import { buildDiscoverySitemap } from "../lib/sitemaps.ts";

test("markets table rows come from results news and link to them", () => {
  const { results, coverage, deals } = getMarketsData();
  assert.ok(results.length >= 5);
  for (const row of results) {
    assert.ok(isResultsNews(row.news), row.news.slug);
    if (row.figure) {
      assert.ok(row.news.keyFigures.includes(row.figure), `${row.news.slug} figure comes from key_figures`);
      assert.match(row.figure.label, /revenue|sales/i);
    }
  }
  for (const article of [...coverage, ...deals]) assert.equal(isResultsNews(article), false, article.slug);
  assert.ok(buildDiscoverySitemap().some((entry) => entry.url === "https://worldcleanbiz.com/markets"));
});
