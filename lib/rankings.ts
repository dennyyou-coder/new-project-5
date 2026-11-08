import { latestResults, revenueChange, type FinancialResult } from "@/lib/financials";

/** Companies whose business is mainly cleaning, pool or outdoor equipment; everyone else is a diversified group. */
export const SPECIALISTS = new Set(["roborock", "ecovacs", "shark", "tennant", "hayward", "pentair", "husqvarna"]);

export type RankingRow = { result: FinancialResult; change?: string; growth: number; basis: "reported" | "organic" | "like-for-like" };

/** "+34.85%" → 34.85, "−5% organic" → -5. The first figure the company states is used. */
export function growthOf(change?: string) {
  const match = change?.match(/([+−-])?(\d+(?:\.\d+)?)%/);
  if (!match) return undefined;
  return (match[1] === "−" || match[1] === "-" ? -1 : 1) * Number(match[2]);
}

function basisOf(change?: string): RankingRow["basis"] {
  if (!change) return "reported";
  const first = change.split(",")[0];
  if (/organic/i.test(first)) return "organic";
  if (/like-for-like/i.test(first)) return "like-for-like";
  return "reported";
}

/** The quarter most companies have reported last, e.g. "Q3 2026". */
export function rankingPeriod(results: FinancialResult[] = latestResults()) {
  const counts = new Map<string, number>();
  for (const result of results) if (/^Q[1-4] \d{4}$/.test(result.period)) counts.set(result.period, (counts.get(result.period) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))[0]?.[0];
}

/** Every company that reported the ranking quarter, by year-on-year revenue change, fastest first. */
export function revenueGrowthRanking(results: FinancialResult[] = latestResults()) {
  const period = rankingPeriod(results);
  const rows: RankingRow[] = results
    .filter((result) => result.period === period)
    .map((result) => ({ result, change: revenueChange(result), growth: growthOf(revenueChange(result)) ?? Number.NaN, basis: basisOf(revenueChange(result)) }))
    .filter((row) => !Number.isNaN(row.growth))
    .sort((a, b) => b.growth - a.growth);
  return {
    period,
    specialists: rows.filter((row) => SPECIALISTS.has(row.result.brand)),
    diversified: rows.filter((row) => !SPECIALISTS.has(row.result.brand)),
    all: rows
  };
}
