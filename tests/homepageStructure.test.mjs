import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homeSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const headerSource = await readFile(new URL("../components/Header.tsx", import.meta.url), "utf8");
const updatesSource = await readFile(
  new URL("../components/HomeUpdatesForm.tsx", import.meta.url),
  "utf8"
);

test("homepage exposes the six-section commercial journey", () => {
  const sectionNames = [
    "home-v9-hero",
    "home-v9-pathways",
    "home-v9-trust",
    "home-v9-commercial",
    "home-v9-proof",
    "home-v9-updates"
  ];

  for (const sectionName of sectionNames) {
    assert.match(homeSource, new RegExp(`className=\\"[^\\"]*${sectionName}`));
  }
});

test("homepage prioritizes sourcing and separates secondary lead intents", () => {
  assert.match(homeSource, /Start A Sourcing Inquiry/);
  assert.match(updatesSource, /Get Industry Updates/);
  assert.match(homeSource, /form="wceExhibitor"/);
  assert.match(homeSource, /form="wceVisitor"/);
  assert.match(homeSource, /ctaLocation="home_wce_exhibitor"/);
  assert.match(homeSource, /ctaLocation="home_wce_visitor"/);
});

test("homepage retains core category semantics without the duplicate category grid", () => {
  for (const term of [
    "Global Cleaning Appliances, Robotics & Smart Equipment",
    "Robot Vacuums",
    "Floor Washers",
    "Pool Robots",
    "Robotic Lawn Mowers",
    "Commercial Cleaning"
  ]) {
    assert.match(homeSource, new RegExp(term));
  }

  assert.doesNotMatch(homeSource, /categoryCards/);
  assert.doesNotMatch(homeSource, /dennyJourney/);
  assert.doesNotMatch(homeSource, /sourcingItems/);
});

test("homepage pathways use industry imagery instead of text-only cards", () => {
  assert.match(homeSource, /image: "\/images\/sourcing\/robotic-vacuums\.png"/);
  assert.match(homeSource, /image: "\/images\/industry\/sourcing-supplier-meeting-2026\.jpg"/);
  assert.match(homeSource, /image: "\/images\/industry\/expo-hall-shenzhen-2026\.jpg"/);
  assert.match(homeSource, /className="home-v9-pathway-media"/);
});

test("homepage trust section includes clearly labelled draft testimonials", () => {
  assert.match(homeSource, /What Industry Professionals Value/);
  assert.match(homeSource, /Draft layout copy — replace with approved client feedback before production/);
  assert.match(homeSource, /Founder · European Floorcare Brand/);
  assert.match(homeSource, /Sourcing Director · North American Distributor/);
  assert.equal((homeSource.match(/<blockquote>/g) || []).length, 3);
});

test("homepage limits editorial proof to three insights and one report", () => {
  assert.match(homeSource, /if \(unique\.size === 3\) break/);
  assert.doesNotMatch(homeSource, /reportCovers/);
});

test("header keeps navigation but removes the fixed report CTA", () => {
  for (const label of [
    "Home",
    "Blog",
    "Sourcing",
    "Market Reports",
    "World Clean Expo",
    "About",
    "Contact"
  ]) {
    assert.match(headerSource, new RegExp(`label: "${label}"`));
  }

  assert.doesNotMatch(headerSource, /TallyReportButton/);
  assert.doesNotMatch(headerSource, /header-cta/);
});
