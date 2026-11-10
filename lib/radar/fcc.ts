/**
 * FCC equipment authorizations for /launch-radar: shared by the page and scripts/radar/merge-fcc.mjs.
 * A new FCC ID usually appears weeks before a connected product goes on sale in the US.
 */

import type { Sector } from "./classify";

export type FilingType = "new" | "change" | "rebrand" | "other";

export type FccCompany = {
  name: string;
  sector: Sector;
  /** /brands/{profile} when WCB has a company profile. */
  profile?: string;
  /** Makes robots that fall under the FCC Covered List rule of 28 July 2026. */
  robotMaker: boolean;
  /** Applicant-name searches used on the FCC site. */
  search: string[];
};

export type FccFiling = {
  fccId: string;
  company: string;
  /** ISO grant date. */
  date: string;
  type: FilingType;
  bands: string[];
};

export const FILING_TYPE_LABELS: Record<FilingType, string> = {
  new: "New product",
  change: "Change to an existing product",
  rebrand: "New name or ID",
  other: "Other"
};

export const FILING_TYPES: Record<string, FilingType> = {
  "Original Equipment": "new",
  "Class II Permissive Change": "change",
  "Change in Identification": "rebrand"
};

/** Radio bands named the way product people talk about them. */
export function bandsFor(ranges: string[]) {
  const out: string[] = [];
  for (const range of ranges) {
    const [lo, hi] = range.split("-").map(Number);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) continue;
    let band: string | null = null;
    if (lo >= 2400 && lo <= 2410 && hi >= 2470) band = "Bluetooth";
    else if (lo >= 2410 && lo <= 2420 && hi <= 2475) band = "Wi-Fi 2.4 GHz";
    else if (lo >= 5100 && lo <= 5900) band = "Wi-Fi 5 GHz";
    else if (lo === 2450) band = "Microwave (ISM)";
    else if (lo === 13) band = "NFC / 13.56 MHz";
    else if (lo >= 900 && lo <= 930) band = "Sub-GHz (900 MHz)";
    else if (lo >= 57000) band = "60 GHz radar";
    else if (lo >= 3100 && lo <= 10600) band = "UWB";
    if (band && !out.includes(band)) out.push(band);
  }
  return out;
}

/** Public record of an FCC ID (fccid.io mirrors the FCC's files with a stable URL). */
export const fccIdUrl = (fccId: string) => `https://fccid.io/${encodeURIComponent(fccId)}`;

/** The grantee code is the part of the FCC ID that identifies the company. */
export function granteeCode(fccId: string) {
  if (fccId.includes("-")) return fccId.split("-")[0];
  return /^[0-9]/.test(fccId) ? fccId.slice(0, 5) : fccId.slice(0, 3);
}
