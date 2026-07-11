import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const aboutSource = await readFile(
  new URL("../app/about/page.tsx", import.meta.url),
  "utf8"
);
const globalStyles = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8"
);

test("About leads with Denny's organizer role and value-chain network", () => {
  assert.match(aboutSource, /Organizer Of World Clean Expo/);
  assert.match(aboutSource, /Connected Across The Entire Value Chain/);
  assert.match(aboutSource, /one of the\s+cleaning industry’s most extensive professional networks/);
  assert.match(aboutSource, /Manufacturers/);
  assert.match(aboutSource, /International Brands/);
  assert.match(aboutSource, /Buyers & Distributors/);
  assert.match(aboutSource, /Investors & Media/);
});

test("About explains the current World Clean Biz business platform", () => {
  assert.match(aboutSource, /Industry Intelligence/);
  assert.match(aboutSource, /Product & Sourcing Opportunities/);
  assert.match(aboutSource, /World Clean Expo & Business Connections/);
  assert.match(aboutSource, /href="\/sourcing"/);
  assert.match(aboutSource, /href="\/reports"/);
  assert.match(aboutSource, /href="\/world-clean-expo"/);
});

test("About connects Denny's judgement to team execution", () => {
  assert.match(aboutSource, /Early Industry Signals/);
  assert.match(aboutSource, /Commercial Judgment/);
  assert.match(aboutSource, /The Right Connections/);
  assert.match(aboutSource, /Team Execution/);
  assert.match(aboutSource, /Denny Reviews\. The Team Executes\./);
});

test("About uses approved factual trust statements", () => {
  assert.match(aboutSource, /Inside The Cleaning Industry Since 2006/);
  assert.match(aboutSource, /For A Decade/);
  assert.match(aboutSource, /one of the industry’s best-known professional voices/);
  assert.match(aboutSource, /hardware entrepreneur whose ventures have raised tens of millions in funding/);
  assert.match(aboutSource, /securities firms and investment banks/);
  assert.match(aboutSource, /cross-border sellers and international brands/);
  assert.doesNotMatch(aboutSource, /Trusted By Industry Professionals/);
  assert.doesNotMatch(aboutSource, /20\+ Years/);
});

test("About has isolated conversion styling and complete metadata", () => {
  assert.match(aboutSource, /className="about-network-page"/);
  assert.match(globalStyles, /\.about-network-page/);
  assert.match(aboutSource, /alternates:/);
  assert.match(aboutSource, /openGraph:/);
  assert.match(aboutSource, /twitter:/);
});
