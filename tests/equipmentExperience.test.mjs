import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("equipment detail route supports draft Preview without public static generation", () => {
  const source = read("app/equipment/[slug]/page.tsx");
  assert.match(source, /export const dynamicParams = true/);
  assert.match(source, /export function generateStaticParams\(\)/);
  assert.match(source, /getPublishedEquipmentProfiles\(publishedBrandSlugs\)/);
  assert.match(source, /isEquipmentDraftVisible\(process\.env\.VERCEL_ENV\)/);
  assert.match(source, /robots: profile\.status === "draft" \? \{ index: false, follow: false \}/);
  assert.match(source, /if \(!profile\) notFound\(\)/);
  assert.match(source, /buildEquipmentPageSchemas\(profile, siteUrl\)/);

  const componentOrder = [
    "EquipmentHero", "EquipmentSystemFlow", "EquipmentTypeComparison",
    "EquipmentTechnicalSections", "EquipmentRelationships", "EquipmentDecisionSections",
    "EquipmentTimeline", "EquipmentSources"
  ].map((name) => source.indexOf(`<${name}`));
  assert.ok(componentOrder.every((position) => position >= 0));
  assert.deepEqual(componentOrder, [...componentOrder].sort((a, b) => a - b));
});

test("equipment directory exposes only published profiles and a safe empty state", () => {
  const source = read("app/equipment/page.tsx");
  assert.match(source, /getPublishedEquipmentProfiles\(brandSlugs\)/);
  assert.match(source, /profiles\.map\(\(profile\) => <EquipmentDirectoryCard/);
  assert.match(source, /Technical profiles are under review/);
  assert.doesNotMatch(source, /floor-scrubber/);
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
});

test("hero establishes scope, draft status, one H1 and complete section navigation", () => {
  const source = read("components/equipment/EquipmentHero.tsx");
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.match(source, /Draft preview/);
  assert.match(source, /Included/);
  assert.match(source, /Excluded/);
  assert.match(source, /Official image source/);
  for (const id of [
    "working-system", "equipment-types", "performance-metrics", "application-fit",
    "component-stack", "representative-models", "procurement", "engineering",
    "standards", "developments", "sources"
  ]) assert.match(source, new RegExp(`#${id}`));
});

test("system and type visuals are semantic original UI rather than copied diagrams", () => {
  const flow = read("components/equipment/EquipmentSystemFlow.tsx");
  const types = read("components/equipment/EquipmentTypeComparison.tsx");
  assert.match(flow, /<ol className="equipment-system-flow">/);
  assert.doesNotMatch(flow, /<img/);
  assert.match(flow, /componentFamily/);
  assert.match(types, /None is a universal winner/);
  assert.doesNotMatch(types, /<img/);
});

test("technical sections visibly separate evidence, WCB assessment and compatibility boundaries", () => {
  const technical = read("components/equipment/EquipmentTechnicalSections.tsx");
  const evidence = read("components/equipment/EquipmentEvidence.tsx");
  assert.match(evidence, />Evidence</);
  assert.match(evidence, />Scope</);
  assert.match(evidence, />Verified</);
  assert.match(evidence, />Sources</);
  assert.match(technical, /WCB assessment/);
  assert.match(technical, /Buyer action/);
  assert.match(technical, /No component link or cross-model compatibility is claimed/);
});

test("approved content visuals render through one provenance-aware figure", () => {
  const visual = read("components/equipment/EquipmentContentVisual.tsx");
  const types = read("components/equipment/EquipmentTypeComparison.tsx");
  const technical = read("components/equipment/EquipmentTechnicalSections.tsx");

  assert.match(visual, /import Image from "next\/image"/);
  assert.match(visual, /equipment-content-visual/);
  assert.match(visual, /Official image source/);
  assert.match(visual, /rel="noopener noreferrer"/);
  assert.match(visual, /guidance/);
  assert.match(types, /placement === "equipment-types"/);
  assert.match(types, /EquipmentContentVisualFigure/);
  assert.match(technical, /placement === "application-fit"/);
  assert.match(technical, /placement === "component-stack"/);
  assert.equal((technical.match(/<EquipmentContentVisualFigure/g) || []).length, 2);
});

test("representative models link published brands without ownership or OEM claims", () => {
  const source = read("components/equipment/EquipmentRelationships.tsx");
  assert.match(source, /href=\{`\/brands\/\$\{model\.brandSlug\}`\}/);
  assert.match(source, /Representative, not exhaustive/);
  assert.match(source, /does not establish a factory, OEM or component-supplier relationship/);
  assert.doesNotMatch(source, /score|rating|winner/i);
});

test("decision, engineering, standards, timeline and sources are auditable", () => {
  const decisions = read("components/equipment/EquipmentDecisionSections.tsx");
  const timeline = read("components/equipment/EquipmentTimeline.tsx");
  const sources = read("components/equipment/EquipmentSources.tsx");
  assert.match(decisions, /WCB assessment/);
  assert.match(decisions, /Comparison trap/);
  assert.match(decisions, /Buyer action/);
  assert.match(decisions, /not a compatibility guarantee or repair manual/);
  assert.match(decisions, /Jurisdiction/);
  assert.match(timeline, /Date\.parse\(b\.date\) - Date\.parse\(a\.date\)/);
  assert.match(sources, /id=\{`source-\$\{source\.id\}`\}/);
  assert.match(sources, /rel="noopener noreferrer"/);
  assert.match(sources, /Last material modification/);
});

test("equipment styles preserve scoped desktop and mobile layouts", () => {
  const source = read("app/globals.css");
  const marker = source.indexOf("/* Equipment intelligence */");
  assert.ok(marker >= 0);
  const styles = source.slice(marker);
  for (const selector of [
    ".equipment-hub", ".equipment-hero-grid", ".equipment-key-facts",
    ".equipment-section-nav", ".equipment-system-flow", ".equipment-type-grid",
    ".equipment-evidence-meta", ".equipment-table-scroll", ".equipment-source-list"
  ]) assert.match(styles, new RegExp(selector.replace(".", "\\.")));
  assert.match(styles, /@media \(max-width: 840px\)/);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /min-width: 0/);
  assert.match(styles, /overflow-wrap: anywhere/);
});

test("sitemap integrates published equipment without hard-coding the draft pilot", () => {
  const source = read("app/sitemap.ts");
  assert.match(source, /getPublishedEquipmentProfiles\(publishedBrandSlugs\)/);
  assert.match(source, /equipmentProfiles\.length > 0 \? \["\/equipment"\] : \[\]/);
  assert.match(source, /buildEquipmentSitemapEntries\(equipmentProfiles, baseUrl\)/);
  assert.doesNotMatch(source, /floor-scrubber/);
});
