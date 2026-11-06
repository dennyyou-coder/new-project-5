import data from "../content/financials/results.json" with { type: "json" };

/** One reported period for one company, as published. Amounts are millions of `currency`. */
export type FinancialResult = {
  company: string;
  /** Company profile slug under /brands. */
  brand: string;
  /** Category page slug when the profile's own category would mislead (e.g. a multi-category group). */
  hub?: string;
  name: string;
  period: string;
  periodEnd: string;
  /** Release date, when the release states one. */
  reported?: string;
  currency: string;
  revenueLabel: string;
  revenue: number;
  revenuePrior?: number;
  /** Change as the company states it, when the prior-year amount is not in the release. */
  revenueChange?: string;
  profitLabel?: string;
  profit?: number;
  profitPrior?: number;
  profitChange?: string;
  /** The company gives the profit amount as approximate ("approx."). */
  approximate?: boolean;
  /** Worked out from two filed cumulative figures (full year minus nine months, or half year minus first quarter). */
  derived?: boolean;
  /** WCB news story on this release, if any. */
  news?: string;
  source: { label: string; url: string };
};

export const financialResults: FinancialResult[] = (data as { results: FinancialResult[] }).results;

/** Newest first: by release date, then by period end for releases without a stated date. */
export function latestResults(results: FinancialResult[] = financialResults) {
  const latestByCompany = new Map<string, FinancialResult>();
  for (const result of results) {
    const current = latestByCompany.get(result.company);
    if (!current || result.periodEnd > current.periodEnd) latestByCompany.set(result.company, result);
  }
  return [...latestByCompany.values()].sort(
    (a, b) => (b.reported ?? b.periodEnd).localeCompare(a.reported ?? a.periodEnd) || a.name.localeCompare(b.name)
  );
}

/** One company's quarters, oldest to newest, the most recent `limit` of them. */
export function resultsForBrand(brand: string, limit = 5, results: FinancialResult[] = financialResults) {
  return results
    .filter((result) => result.brand === brand)
    .sort((a, b) => a.periodEnd.localeCompare(b.periodEnd))
    .slice(-limit);
}

/** Year-on-year change computed from the two reported amounts, e.g. "+21.2%". */
export function computedChange(current: number | undefined, prior: number | undefined) {
  if (current === undefined || prior === undefined || prior === 0) return undefined;
  if (prior < 0 || current < 0) return undefined; // a percentage across a loss is not meaningful
  const change = ((current - prior) / prior) * 100;
  const rounded = Math.abs(change) >= 100 ? Math.round(change) : Math.round(change * 10) / 10;
  return `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${Math.abs(rounded)}%`;
}

export function revenueChange(result: FinancialResult) {
  return computedChange(result.revenue, result.revenuePrior) ?? result.revenueChange;
}

export function profitChange(result: FinancialResult) {
  if (result.profit !== undefined && result.profitPrior !== undefined && (result.profit < 0 || result.profitPrior < 0)) {
    return result.profit < 0 && result.profitPrior >= 0 ? "Loss (profit a year earlier)" : result.profit >= 0 ? "Back to profit" : "Loss both years";
  }
  return computedChange(result.profit, result.profitPrior) ?? result.profitChange;
}

/** "USD 1.98 billion", "SEK 340 million loss", "approx. CNY 121 million". */
export function formatAmount(millions: number, currency: string, approximate = false) {
  const loss = millions < 0;
  const value = Math.abs(millions);
  const text = value >= 1000
    ? `${(value / 1000).toLocaleString("en-US", { maximumFractionDigits: value >= 100000 ? 1 : 2 })} billion`
    : `${value.toLocaleString("en-US", { maximumFractionDigits: value >= 100 ? 1 : 2 })} million`;
  return `${approximate ? "approx. " : ""}${currency} ${text}${loss ? " loss" : ""}`;
}
