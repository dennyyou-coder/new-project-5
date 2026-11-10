import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { INDUSTRY_EVENTS, eventDateRange, upcomingEvents } from "../lib/industryEvents.ts";
import { WCB_REPORTS, reportDownloadUrl } from "../lib/reports.ts";

test("events are well formed and past ones drop off", () => {
  for (const event of INDUSTRY_EVENTS) {
    assert.match(event.start, /^\d{4}-\d{2}-\d{2}$/, event.slug);
    assert.ok(event.end >= event.start, event.slug);
    assert.ok(event.url.startsWith("https://") || event.url.startsWith("/"), event.slug);
  }
  assert.equal(new Set(INDUSTRY_EVENTS.map((event) => event.slug)).size, INDUSTRY_EVENTS.length);
  const after = upcomingEvents(new Date("2026-11-21T12:00:00Z"));
  assert.ok(!after.some((event) => event.slug === "wcb-expo-2026"));
  assert.ok(upcomingEvents(new Date("2026-11-20T12:00:00Z")).some((event) => event.slug === "wcb-expo-2026"));
  assert.equal(upcomingEvents(new Date("2026-11-10T00:00:00Z"), 5).length, 5);
});

test("event date ranges read naturally", () => {
  assert.equal(eventDateRange({ start: "2026-11-16", end: "2026-11-19" }), "16–19 Nov 2026");
  assert.equal(eventDateRange({ start: "2027-03-30", end: "2027-04-02" }), "30 Mar – 2 Apr 2027");
});

test("a report request links to the PDF only when it exists", () => {
  const available = WCB_REPORTS.filter((report) => report.file);
  assert.ok(available.length > 0);
  for (const report of available) assert.ok(existsSync(new URL(`../public${report.file}`, import.meta.url)), report.id);
  assert.equal(reportDownloadUrl("next-decade-cleaning-growth", "https://x.test"), "https://x.test/reports/wcb-cleaning-industry-growth-map-english-report.pdf");
  assert.equal(reportDownloadUrl("pool-robot-channels-service-costs", "https://x.test"), undefined);
  assert.equal(reportDownloadUrl(undefined, "https://x.test"), undefined);
});
