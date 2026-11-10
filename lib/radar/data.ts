/** Curated radar data: official recall notices and FCC filings, reviewed before publishing. */

import recallData from "../../content/radar/recalls.json" with { type: "json" };
import fccData from "../../content/radar/fcc-filings.json" with { type: "json" };
import type { Recall, Sector } from "./classify";
import type { FccCompany, FccFiling } from "./fcc";

export const RECALLS_UPDATED: string = recallData.updated;
export const FCC_UPDATED: string = fccData.updated;
export const FCC_FROM: string = fccData.from;

export function getRecalls(sector?: Sector): Recall[] {
  const recalls = (recallData.recalls as Recall[]).slice().sort((a, b) => b.date.localeCompare(a.date));
  return sector ? recalls.filter((recall) => recall.sector === sector) : recalls;
}

export const getFccCompanies = () => fccData.companies as FccCompany[];

export function getFccFilings(): FccFiling[] {
  return (fccData.filings as FccFiling[]).slice().sort((a, b) => b.date.localeCompare(a.date) || a.fccId.localeCompare(b.fccId));
}

/** Each company's most recent filing, newest first; robot makers are flagged for the Covered List story. */
export function lastFilingByCompany() {
  const latest = new Map<string, FccFiling>();
  for (const filing of getFccFilings()) if (!latest.has(filing.company)) latest.set(filing.company, filing);
  return getFccCompanies()
    .map((company) => ({ company, last: latest.get(company.name) }))
    .filter((entry) => entry.last)
    .sort((a, b) => b.last!.date.localeCompare(a.last!.date));
}

export { shortDate } from "./classify";
