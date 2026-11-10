/**
 * Trade and product-rule dates for /rules-calendar and the homepage radar. Checked 10 November 2026.
 * Keep in step with lib/tools/certifications.ts, lib/tools/landedCost.ts and the tariff topics.
 */

import type { Sector } from "./classify";

export type RuleRegion = "US" | "EU" | "UK" | "Global";

export type RuleDate = {
  id: string;
  /** ISO date. */
  date: string;
  region: RuleRegion;
  title: string;
  detail: string;
  sectors: Sector[];
  /** Status as reported but not yet published in an official text. */
  reported?: boolean;
  href?: string;
};

const ALL: Sector[] = ["cleaning", "appliances", "tools"];

export const RULE_DATES: RuleDate[] = [
  {
    id: "us-301-exclusions",
    date: "2027-01-09",
    region: "US",
    title: "Section 301 exclusions run out",
    detail: "The 178 product exclusions from the China Section 301 duties were reported extended by two months, to 9 January 2027. Entries after that pay the full duty unless they are extended again.",
    sectors: ALL,
    reported: true,
    href: "/topics/us-tariffs-chinese-cleaning-appliances"
  },
  {
    id: "us-china-truce",
    date: "2027-01-10",
    region: "US",
    title: "US–China trade truce ends",
    detail: "The arrangement agreed in Busan, which keeps further US and Chinese tariff increases on hold, runs to 10 January 2027 unless it is extended.",
    sectors: ALL,
    href: "/topics/us-tariffs-chinese-cleaning-appliances"
  },
  {
    id: "eu-mower-ad",
    date: "2027-01-19",
    region: "EU",
    title: "EU decision on Chinese robotic mowers",
    detail: "Deadline for definitive anti-dumping duties, if any, in case AD745. Rates of 45.6% to 53.3% were reported at disclosure.",
    sectors: ["tools"],
    href: "/topics/eu-robotic-mower-anti-dumping"
  },
  {
    id: "eu-machinery",
    date: "2027-01-20",
    region: "EU",
    title: "Machinery Regulation applies",
    detail: "Regulation (EU) 2023/1230 replaces the Machinery Directive for robotic mowers, power tools, garden machinery and commercial cleaning machines placed on the market from this date.",
    sectors: ["tools", "cleaning"],
    href: "/tools/export-compliance-checklist"
  },
  {
    id: "eu-batteries-replaceable",
    date: "2027-02-18",
    region: "EU",
    title: "Replaceable batteries in appliances",
    detail: "Portable batteries built into appliances and tools must be removable and replaceable by the end user under the Batteries Regulation, with limited exemptions.",
    sectors: ALL,
    href: "/tools/export-compliance-checklist"
  },
  {
    id: "eu-cra-full",
    date: "2027-12-11",
    region: "EU",
    title: "Cyber Resilience Act applies in full",
    detail: "Connected products need to meet the Act's security requirements and carry CE marking under it.",
    sectors: ALL,
    href: "/tools/export-compliance-checklist"
  },
  {
    id: "eu-cra-reporting",
    date: "2026-09-11",
    region: "EU",
    title: "Cyber Resilience Act: vulnerability reporting",
    detail: "Manufacturers of connected products must report actively exploited vulnerabilities and serious incidents.",
    sectors: ALL
  },
  {
    id: "eu-battery-labels",
    date: "2026-08-18",
    region: "EU",
    title: "New battery labelling",
    detail: "Batteries need the new labels under the Batteries Regulation, including capacity and the separate-collection symbol.",
    sectors: ALL
  },
  {
    id: "eu-ppwr",
    date: "2026-08-12",
    region: "EU",
    title: "Packaging and Packaging Waste Regulation applies",
    detail: "New EU-wide rules on packaging design, labelling and producer registration start to apply.",
    sectors: ALL
  },
  {
    id: "us-fcc-robots",
    date: "2026-07-28",
    region: "US",
    title: "FCC Covered List: foreign-produced robots",
    detail: "New robots made outside the US that navigate on their own and connect to a network can no longer get FCC authorization without Conditional Approval.",
    sectors: ["cleaning", "tools"],
    href: "/topics/us-fcc-robot-restrictions"
  },
  {
    id: "us-301-forced-labor",
    date: "2026-07-24",
    region: "US",
    title: "Section 301 forced-labor duties start",
    detail: "12.5% on goods from China, Vietnam and Thailand; 10% on Malaysia, Indonesia, Mexico and India, on top of existing duties.",
    sectors: ALL,
    href: "/tools/landed-cost-calculator"
  },
  {
    id: "us-ieepa-ruling",
    date: "2026-02-20",
    region: "US",
    title: "Supreme Court strikes down IEEPA tariffs",
    detail: "Collection stopped on 24 February; refunds go to the importer of record.",
    sectors: ALL,
    href: "/blog/ieepa-tariff-refunds-who-gets-the-money"
  }
];

export function upcomingRules(now = new Date(), limit?: number) {
  const today = now.toISOString().slice(0, 10);
  const rules = RULE_DATES.filter((rule) => rule.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  return limit ? rules.slice(0, limit) : rules;
}

export function recentRules(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return RULE_DATES.filter((rule) => rule.date < today).sort((a, b) => b.date.localeCompare(a.date));
}

/** Whole days from today to the date (negative once it has passed). */
export function daysUntil(date: string, now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const [y, m, d] = date.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
}
