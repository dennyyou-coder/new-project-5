/**
 * Monthly radar report: one page per month at /radar/YYYY-MM that sums up the recalls and FCC filings
 * published in the trackers, plus the rule dates coming up. Only months listed in MONTHLY_ISSUES are
 * published, so each issue goes out once its month is complete and checked.
 */

import type { Recall, Sector } from "./classify";
import type { FccCompany, FccFiling } from "./fcc";
import type { RuleDate } from "./rules";

export type MonthlyIssue = {
  /** YYYY-MM */
  month: string;
  /** ISO date the issue was published. */
  published: string;
  /** Two or three sentences of editorial reading, drawn only from the numbers on the page. */
  summary: string;
};

export const MONTHLY_ISSUES: MonthlyIssue[] = [
  {
    month: "2026-10",
    published: "2026-11-14",
    summary:
      "October was quiet for cleaning appliances: none of the 12 recalls and alerts was a vacuum, robot or floor cleaner. Electric shock was the most common hazard, mostly in products sold in the EU, and China was named as the place of manufacture in 8 of 12 notices. On the FCC side, the robot makers WCB tracks filed nothing in October, after one filing each in August and September; from January to July they averaged about eight a month."
  }
];

/** The newest published issue, for links from the trackers. */
export const LATEST_ISSUE = MONTHLY_ISSUES.reduce((latest, issue) => (issue.month > latest.month ? issue : latest));

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "October 2026" */
export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "Oct" */
export function monthShort(month: string) {
  return MONTHS[Number(month.split("-")[1]) - 1].slice(0, 3);
}

/** The month before or after, as YYYY-MM. */
export function shiftMonth(month: string, by: number) {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + by, 1));
  return date.toISOString().slice(0, 7);
}

export const getIssue = (month: string) => MONTHLY_ISSUES.find((issue) => issue.month === month);

export const SECTOR_ORDER: Sector[] = ["cleaning", "appliances", "tools"];

export type MonthlyRadar = {
  month: string;
  recalls: Recall[];
  us: number;
  eu: number;
  bySector: Record<Sector, number>;
  /** Notices that say where the product was made, and how many of those name China. */
  withOrigin: number;
  china: number;
  /** Hazard types, most common first. EU notices name them; US notices are read from the hazard text. */
  hazards: { label: string; count: number }[];
  filings: FccFiling[];
  newProducts: number;
  /** Filings by tracked robot makers in each of the last `span` months, oldest first. */
  robotTrend: { month: string; count: number }[];
  /** Rule dates in the three months after the report month. */
  ahead: RuleDate[];
};

const HAZARD_WORDS: [string, RegExp][] = [
  ["Fire", /\b(fire|ignite|ignit|burn hazard|overheat)/i],
  ["Electric shock", /\b(shock|electrocut)/i],
  ["Burns", /\bburn/i],
  ["Cuts", /\b(cut|laceration)/i],
  ["Injuries", /\binjur/i]
];

function hazardsOf(recall: Recall) {
  if (recall.risk) return recall.risk.split(",").map((risk) => risk.trim()).filter(Boolean);
  const found = HAZARD_WORDS.filter(([, rule]) => rule.test(recall.hazard)).map(([label]) => label);
  return found.length ? [found[0]] : ["Other"];
}

export function buildMonthlyRadar(
  month: string,
  data: { recalls: Recall[]; filings: FccFiling[]; companies: FccCompany[]; rules: RuleDate[] },
  span = 10
): MonthlyRadar {
  const inMonth = <T extends { date: string }>(items: T[], m: string) => items.filter((item) => item.date.slice(0, 7) === m);
  const recalls = inMonth(data.recalls, month).sort((a, b) => a.date.localeCompare(b.date));
  const filings = inMonth(data.filings, month).sort((a, b) => a.date.localeCompare(b.date));
  const bySector = { cleaning: 0, appliances: 0, tools: 0 } as Record<Sector, number>;
  for (const recall of recalls) bySector[recall.sector] += 1;
  const hazardCount = new Map<string, number>();
  for (const recall of recalls) for (const hazard of hazardsOf(recall)) hazardCount.set(hazard, (hazardCount.get(hazard) ?? 0) + 1);
  const robots = new Set(data.companies.filter((company) => company.robotMaker).map((company) => company.name));
  const robotTrend = Array.from({ length: span }, (_, i) => shiftMonth(month, i - span + 1)).map((m) => ({
    month: m,
    count: inMonth(data.filings, m).filter((filing) => robots.has(filing.company)).length
  }));
  const after = shiftMonth(month, 1);
  const until = shiftMonth(month, 4);
  const withOrigin = recalls.filter((recall) => recall.madeIn).length;
  return {
    month,
    recalls,
    us: recalls.filter((recall) => recall.source === "CPSC").length,
    eu: recalls.filter((recall) => recall.source !== "CPSC").length,
    bySector,
    withOrigin,
    china: recalls.filter((recall) => recall.madeIn?.includes("China")).length,
    hazards: [...hazardCount].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    filings,
    newProducts: filings.filter((filing) => filing.type === "new").length,
    robotTrend,
    ahead: data.rules.filter((rule) => rule.date.slice(0, 7) >= after && rule.date.slice(0, 7) < until).sort((a, b) => a.date.localeCompare(b.date))
  };
}
