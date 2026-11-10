#!/usr/bin/env node
/**
 * Turns rows from scripts/radar/fcc-browser-query.js into candidates for /launch-radar.
 *
 *   node --experimental-strip-types scripts/radar/merge-fcc.mjs path/to/fcc-rows.json
 *
 * Writes content/radar/fcc-candidates.json with the filings not yet in content/radar/fcc-filings.json.
 * Review them, move the ones to publish into `filings`, and delete the candidates file.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { FILING_TYPES, bandsFor } from "../../lib/radar/fcc.ts";

const root = new URL("../../", import.meta.url);
const data = JSON.parse(readFileSync(new URL("content/radar/fcc-filings.json", root), "utf8"));
const rows = JSON.parse(readFileSync(process.argv[2], "utf8"));
const companyFor = new Map(data.companies.flatMap((company) => company.search.map((term) => [term, company.name])));
const known = new Set(data.filings.map((filing) => `${filing.fccId}|${filing.date}|${filing.type}`));

const merged = new Map();
for (const row of rows) {
  const company = companyFor.get(row.t);
  if (!company || !row.d || !row.id) continue;
  const [m, d, y] = row.d.split("/");
  const filing = { fccId: row.id, company, date: `${y}-${m}-${d}`, type: FILING_TYPES[row.p] ?? "other", bands: [], applicant: row.a };
  const key = `${filing.fccId}|${filing.date}|${filing.type}`;
  if (known.has(key)) continue;
  const current = merged.get(key) ?? filing;
  current.bands = bandsFor([...(current.ranges ?? []), ...row.f]);
  current.ranges = [...(current.ranges ?? []), ...row.f];
  merged.set(key, current);
}

const candidates = [...merged.values()].map(({ ranges, ...filing }) => filing).sort((a, b) => b.date.localeCompare(a.date));
writeFileSync(new URL("content/radar/fcc-candidates.json", root), `${JSON.stringify({ candidates }, null, 2)}\n`);
console.log(`${candidates.length} new FCC filings. Check that each applicant really is the company named before publishing.`);
