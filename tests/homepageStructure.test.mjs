import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homeSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const headerSource = await readFile(new URL("../components/Header.tsx", import.meta.url), "utf8");
const cssSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const updatesSource = await readFile(
  new URL("../components/HomeUpdatesForm.tsx", import.meta.url),
  "utf8"
);

test("homepage exposes the streamlined commercial journey", () => {
  const sectionNames = [
    "home-v9-hero",
    "home-v9-pathways",
    "home-v9-trust",
    "home-v9-conversion",
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

test("homepage restores a compact standalone six-category section", () => {
  assert.match(homeSource, /className="home-v9-section home-v9-categories"/);
  assert.match(homeSource, /Categories Where The Next Opportunities Are Forming/);
  assert.match(homeSource, /className="home-v9-category-grid"/);
  assert.match(homeSource, /heroProducts\.map/);
});

test("homepage pathways use industry imagery instead of text-only cards", () => {
  assert.match(homeSource, /image: "\/images\/sourcing\/robotic-vacuums\.png"/);
  assert.match(homeSource, /image: "\/images\/industry\/sourcing-supplier-meeting-2026\.jpg"/);
  assert.match(homeSource, /image: "\/images\/industry\/expo-hall-shenzhen-2026\.jpg"/);
  assert.match(homeSource, /className="home-v9-pathway-media"/);
});

test("homepage trust section includes three formal testimonials", () => {
  assert.match(homeSource, /What Industry Professionals Value/);
  assert.doesNotMatch(homeSource, /replace with approved client feedback/);
  assert.doesNotMatch(homeSource, /Illustrative placeholders/);
  assert.doesNotMatch(homeSource, /portraits are illustrative/);
  assert.match(homeSource, /Founder · European Floorcare Brand/);
  assert.match(homeSource, /Sourcing Director · North American Distributor/);
  assert.equal((homeSource.match(/<blockquote>/g) || []).length, 3);
  assert.match(cssSource, /testimonial-avatar-sprite\.jpg/);
  assert.match(cssSource, /\.home-v9-testimonial-avatar[^}]*background-size:\s*200%\s+auto;/s);
  assert.match(homeSource, /home-v9-avatar-founder/);
  assert.match(homeSource, /home-v9-avatar-sourcing/);
  assert.match(homeSource, /home-v9-avatar-product/);
  assert.match(cssSource, /testimonial-avatar-product-director\.png/);
});

test("homepage replaces the oversized business section with a compact conversion bar", () => {
  assert.match(homeSource, /className="[^"]*home-v9-conversion-bar/);
  assert.match(homeSource, /Have A Product Or Sourcing Project\?/);
  assert.match(homeSource, /Planning For World Clean Expo\?/);
  assert.doesNotMatch(homeSource, /Two Direct Business Paths/);
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
