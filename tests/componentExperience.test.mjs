import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("component detail route is draft aware and composes every section", () => {
  const source = read("app/components/[slug]/page.tsx");
  assert.match(source, /export const dynamicParams = true/);
  assert.match(source, /isComponentDraftVisible\(process\.env\.VERCEL_ENV\)/);
  assert.match(source, /robots: profile\.status === "draft" \? \{ index: false, follow: false \}/);
  const order = [
    "ComponentHero", "ComponentSystemRole", "ComponentArchitecture", "ComponentTechnicalSections",
    "ComponentCompatibility", "ComponentServiceSections", "ComponentRelationships",
    "ComponentDecisionSections", "ComponentTimeline", "ComponentSources"
  ].map((name) => source.indexOf(`<${name}`));
  assert.ok(order.every((position) => position >= 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
});

test("component directory exposes published profiles only", () => {
  const source = read("app/components/page.tsx");
  assert.match(source, /getPublishedComponentProfiles\(\)/);
  assert.match(source, /profiles\.map\(\(profile\) => <ComponentDirectoryCard/);
  assert.match(source, /Component profiles are under review/);
  assert.doesNotMatch(source, /vacuum-cleaner-motor/);
});

test("hero has one H1 scope draft label provenance and section navigation", () => {
  const source = read("components/component-intelligence/ComponentHero.tsx");
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  for (const text of ["Draft preview", "Included", "Excluded", "Official image source"]) assert.match(source, new RegExp(text));
  for (const id of ["system-role", "architectures", "specifications", "applications", "compatibility", "failure-modes", "families", "procurement", "engineering", "standards", "developments", "sources"]) {
    assert.match(source, new RegExp(`#${id}`));
  }
});

test("technical UI separates evidence assessment and compatibility boundaries", () => {
  const evidence = read("components/component-intelligence/ComponentEvidence.tsx");
  const compatibility = read("components/component-intelligence/ComponentCompatibility.tsx");
  const service = read("components/component-intelligence/ComponentServiceSections.tsx");
  const technical = read("components/component-intelligence/ComponentTechnicalSections.tsx");
  for (const label of [">Evidence<", ">Scope<", ">Verified<", ">Sources<"]) assert.match(evidence, new RegExp(label));
  assert.match(technical, /WCB assessment/);
  assert.match(compatibility, /Physical resemblance/);
  assert.match(compatibility, /matching wattage/);
  assert.match(compatibility, /not establish compatibility/);
  assert.match(service, /WCB inspection categories/);
});

test("four content visual placements are wired to provenance-aware figures", () => {
  const visual = read("components/component-intelligence/ComponentVisual.tsx");
  assert.match(visual, /Official image source/);
  assert.match(visual, /WCB explanatory visual/);
  assert.match(visual, /<source media="\(max-width: 760px\)"/);
  const sources = [
    read("components/component-intelligence/ComponentArchitecture.tsx"),
    read("components/component-intelligence/ComponentTechnicalSections.tsx"),
    read("components/component-intelligence/ComponentCompatibility.tsx")
  ].join("\n");
  for (const placement of ["architecture-families", "performance-boundaries", "application-context", "compatibility-gate"]) {
    assert.match(sources, new RegExp(`placement === "${placement}"`));
  }
});

test("component styles provide dense desktop layouts and safe 390 px collapse", () => {
  const source = read("app/globals.css");
  const marker = source.indexOf("/* Component intelligence */");
  assert.ok(marker >= 0);
  const styles = source.slice(marker);
  for (const selector of [".component-intelligence-hub", ".component-intelligence-hero-grid", ".component-intelligence-visual", ".component-intelligence-grid", ".component-intelligence-evidence", ".component-intelligence-source-list"]) {
    assert.match(styles, new RegExp(selector.replace(".", "\\.")));
  }
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /grid-template-columns:\s*1fr/);
  assert.match(styles, /min-width:\s*0/);
  assert.match(styles, /overflow-wrap:\s*anywhere/);
});

test("light component surfaces reset text inherited from the dark hero", () => {
  const source = read("app/globals.css");
  const marker = source.indexOf("/* Component intelligence */");
  assert.ok(marker >= 0);
  const styles = source.slice(marker);
  assert.match(
    styles,
    /\.component-intelligence-hero \.component-intelligence-key-facts\s*\{[^}]*color:\s*var\(--component-ink\)/s
  );
});
