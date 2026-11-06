import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { getMarketsData, isResultsNews } from "../lib/markets.ts";
import { buildDiscoverySitemap } from "../lib/sitemaps.ts";
import { computedChange, financialResults, formatAmount, latestResults, profitChange } from "../lib/financials.ts";

test("financial results are complete, sourced and tied to a company profile", () => {
  assert.ok(financialResults.length >= 15);
  const keys = new Set();
  for (const result of financialResults) {
    const key = `${result.company}|${result.period}`;
    assert.ok(!keys.has(key), `duplicate ${key}`);
    keys.add(key);
    assert.ok(existsSync(`content/brands/${result.brand}.json`), `${result.company}: profile ${result.brand}`);
    assert.match(result.periodEnd, /^\d{4}-\d{2}-\d{2}$/, result.company);
    if (result.reported) assert.match(result.reported, /^\d{4}-\d{2}-\d{2}$/, result.company);
    assert.match(result.currency, /^[A-Z]{3}$/, result.company);
    assert.equal(typeof result.revenue, "number", result.company);
    assert.match(result.source.url, /^https:\/\//, result.company);
    // A change needs either both amounts or the company's own wording.
    assert.ok(result.revenuePrior !== undefined || result.revenueChange, `${result.company}: revenue change`);
    if (result.profit !== undefined) assert.ok(result.profitLabel, `${result.company}: profit label`);
    if (result.news) assert.ok(existsSync(`content/news/${result.news}.md`), `${result.company}: news ${result.news}`);
  }
});

test("financial helpers compute changes from reported amounts and never across a loss", () => {
  assert.equal(computedChange(1976.427, 1630.24), "+21.2%");
  assert.equal(computedChange(976.4, 1022), "−4.5%");
  assert.equal(computedChange(-237, 73), undefined);
  assert.equal(profitChange({ profit: -237, profitPrior: 73 }), "Loss (profit a year earlier)");
  assert.equal(formatAmount(-340, "SEK"), "SEK 340 million loss");
  assert.equal(formatAmount(121, "CNY", true), "approx. CNY 121 million");
  assert.equal(formatAmount(3731.6, "USD"), "USD 3.73 billion");
  const latest = latestResults();
  assert.equal(new Set(latest.map((row) => row.company)).size, latest.length);
});

test("markets page reads the tracker; coverage and deals come from news", () => {
  const { coverage, deals } = getMarketsData();
  assert.ok(coverage.length > 0);
  for (const article of deals) assert.equal(isResultsNews(article), false, article.slug);
  assert.ok(buildDiscoverySitemap().some((entry) => entry.url === "https://worldcleanbiz.com/markets"));
});
