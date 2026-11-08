import assert from "node:assert/strict";
import test from "node:test";
import { growthOf, rankingPeriod, revenueGrowthRanking } from "../lib/rankings.ts";

test("growth figures parse the first stated percentage with its sign", () => {
  assert.equal(growthOf("+34.85%"), 34.85);
  assert.equal(growthOf("−4.12%"), -4.12);
  assert.equal(growthOf("+2.5% reported, −0.1% like-for-like"), 2.5);
  assert.equal(growthOf(undefined), undefined);
});

test("ranking uses the most-reported quarter and sorts fastest growth first", () => {
  const ranking = revenueGrowthRanking();
  assert.match(ranking.period ?? "", /^Q[1-4] \d{4}$/);
  assert.equal(ranking.period, rankingPeriod());
  assert.ok(ranking.all.length >= 10);
  for (let i = 1; i < ranking.all.length; i++) assert.ok(ranking.all[i - 1].growth >= ranking.all[i].growth);
  assert.ok(ranking.all.every((row) => row.result.period === ranking.period));
  assert.equal(ranking.specialists.length + ranking.diversified.length, ranking.all.length);
  assert.ok(ranking.specialists.some((row) => row.result.brand === "roborock"));
  assert.ok(ranking.diversified.some((row) => row.result.brand === "midea"));
});
