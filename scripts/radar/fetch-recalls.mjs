#!/usr/bin/env node
/**
 * Weekly recall candidates for /recalls.
 *
 *   node --experimental-strip-types scripts/radar/fetch-recalls.mjs [--from 2026-11-01]
 *
 * Pulls US CPSC recalls (official REST API) and EU Safety Gate weekly reports (official XML export),
 * keeps cleaning appliances, home appliances and power tools, and writes
 * content/radar/recall-candidates.json with the notices not yet in content/radar/recalls.json.
 * Review the candidates, move the ones to publish into recalls.json, and delete the candidates file.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { classifyRecall, firstSentence } from "../../lib/radar/classify.ts";

const root = new URL("../../", import.meta.url);
const published = JSON.parse(readFileSync(new URL("content/radar/recalls.json", root), "utf8"));
const known = new Set(published.recalls.map((item) => item.id));
const args = process.argv.slice(2);
const fromArg = args.includes("--from") ? args[args.indexOf("--from") + 1] : undefined;
const from = fromArg ?? published.recalls.map((item) => item.date).sort().at(-1) ?? "2026-01-01";
const to = new Date().toISOString().slice(0, 10);

const decode = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const country = (value) => (!value || /^unknown$/i.test(value) ? undefined : value.startsWith("People's Republic of China") ? "China" : value);
/** "Gourmia Recalls Air Fryer Ovens…" → "Gourmia"; titles like "Pressure Washers Recalled…" have no brand. */
const brandFromTitle = (title) => title.match(/^(.+?)\s+(?:Expands |Reannounces )?Recalls?\b/)?.[1];
const shortUnits = (units) => (units ? units.match(/^About [\d,.]+(?: million)?/)?.[0] ?? units.split("(")[0].trim().slice(0, 40) : undefined);

const cdata = (block, tag) => {
  const match = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return match ? match[1].trim() : "";
};

async function cpsc() {
  const url = `https://www.saferproducts.gov/RestWebServices/Recall?format=json&RecallDateStart=${from}&RecallDateEnd=${to}`;
  const items = await (await fetch(url)).json();
  return items.flatMap((item) => {
    const product = item.Products?.[0] ?? {};
    const text = [item.Title, product.Name, product.Type].join(" ");
    const sector = classifyRecall(text);
    if (!sector) return [];
    return [{
      id: `cpsc-${item.RecallNumber}`,
      source: "CPSC",
      date: item.RecallDate.slice(0, 10),
      sector,
      product: product.Name || item.Title,
      brand: brandFromTitle(item.Title),
      hazard: firstSentence(item.Hazards?.[0]?.Name ?? ""),
      units: shortUnits(product.NumberOfUnits),
      madeIn: country(item.ManufacturerCountries?.map((entry) => entry.Country).join(", ")),
      market: "United States",
      url: item.URL
    }];
  });
}

async function safetyGate() {
  const list = await (await fetch("https://ec.europa.eu/safety-gate-alerts/api/download/weeklyReport/list/xml/en")).text();
  const reports = [...list.matchAll(/<publicationDate>(\d\d)\/(\d\d)\/(\d{4})<\/publicationDate>[\s\S]*?<URL>([^<]+)<\/URL>/g)]
    .map(([, d, m, y, url]) => ({ date: `${y}-${m}-${d}`, url: url.replace(/&amp;/g, "&") }))
    .filter((report) => report.date >= from && report.date <= to);
  const out = [];
  for (const report of reports) {
    const xml = await (await fetch(report.url)).text();
    for (const [block] of xml.matchAll(/<notifications[\s\S]*?<\/notifications>/g)) {
      const category = cdata(block, "category");
      if (!/Electrical appliances|Machinery|Hand tools|Gas appliances/i.test(category)) continue;
      const product = cdata(block, "product");
      const name = cdata(block, "name");
      const sector = classifyRecall(`${product} ${name}`);
      if (!sector) continue;
      const [d, m, y] = cdata(block, "publicationDate").split("-");
      out.push({
        id: `eu-${cdata(block, "caseNumber").replace(/\//g, "-")}`,
        source: "EU Safety Gate",
        date: `${y}-${m}-${d}`,
        sector,
        product: decode(product || name),
        brand: decode(cdata(block, "brand")).replace(/^[*"\s]+|[*"\s]+$/g, "") || undefined,
        hazard: decode(firstSentence(cdata(block, "danger"))),
        risk: cdata(block, "riskType") || undefined,
        madeIn: country(cdata(block, "countryOfOrigin")),
        market: cdata(block, "notifyingCountry").replace("United Kingdom in respect of Northern Ireland", "Northern Ireland (UK)"),
        url: cdata(block, "reference")
      });
    }
  }
  return out;
}

const candidates = [...(await cpsc()), ...(await safetyGate())].filter((item) => !known.has(item.id)).sort((a, b) => b.date.localeCompare(a.date));
const target = new URL("content/radar/recall-candidates.json", root);
writeFileSync(target, `${JSON.stringify({ from, to, candidates }, null, 2)}\n`);
console.log(`${candidates.length} new candidates from ${from} to ${to}${existsSync(target) ? ` → ${target.pathname}` : ""}`);
