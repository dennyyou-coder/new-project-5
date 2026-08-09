import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  buildComponentPageSchemas,
  buildComponentSitemapEntries,
  buildComponentStaticParams,
  getComponentPageData,
  getComponentProfiles,
  getPublishedComponentProfiles,
  isComponentDraftVisible,
  validateComponentProfile
} from "../lib/componentProfiles.ts";

const evidence = {
  evidence: "The official source documents this statement.",
  scope: "Named product family and source document only.",
  sourceIds: ["source-1"],
  verifiedAt: "2026-08-09"
};

const assessment = {
  assessment: "Requires project-specific verification.",
  basis: "Reviewed official specifications.",
  limitations: "No exact appliance compatibility is established.",
  buyerAction: "Match the current part number and engineering specification."
};

const validProfile = {
  status: "published",
  slug: "sample-motor",
  name: "Sample Motor",
  aliases: ["Sample suction unit"],
  definition: "A sample motor used to exercise the component profile contract.",
  includedScope: ["Suction motor families"],
  excludedScope: ["Brush-roll drive motors"],
  primaryApplications: ["Vacuum cleaners"],
  headline: "A component family is not an exact replacement part.",
  description: "An evidence-backed technical reference.",
  metaDescription: "Sample motor types, specifications and compatibility checks.",
  disclaimer: "Physical resemblance and matching wattage do not establish compatibility.",
  heroImage: "/images/components/sample-motor/hero.webp",
  heroImageAlt: "Sample vacuum motor",
  heroImageCaption: "Official sample motor image.",
  heroSourceUrl: "https://example.com/hero",
  contentVisuals: [
    { placement: "architecture-families", visualType: "official-photo", src: "/images/components/sample-motor/architecture.webp", alt: "Motor family", caption: "Official motor family.", sourceUrl: "https://example.com/architecture" },
    { placement: "performance-boundaries", visualType: "wcb-diagram", src: "/images/components/sample-motor/performance.svg", mobileSrc: "/images/components/sample-motor/performance-mobile.svg", alt: "Performance boundaries", caption: "WCB performance boundary diagram.", sourceIds: ["source-1"] },
    { placement: "application-context", visualType: "official-photo", src: "/images/components/sample-motor/application.webp", alt: "Application context", caption: "Official application reference.", sourceUrl: "https://example.com/application" },
    { placement: "compatibility-gate", visualType: "wcb-diagram", src: "/images/components/sample-motor/compatibility.svg", mobileSrc: "/images/components/sample-motor/compatibility-mobile.svg", alt: "Compatibility gate", caption: "WCB compatibility gate.", sourceIds: ["source-1"] }
  ],
  keyFacts: [{ label: "Component boundary", value: "Suction motor and fan unit", ...evidence }],
  systemRole: [{ order: 1, name: "Electrical input", role: "Supplies energy to the motor and control system.", ...evidence }],
  architectures: [{ name: "Brushless DC", operatingPrinciple: "Electronic commutation", applicationBoundary: "Documented low-voltage family", benefits: ["Compact design"], limitations: ["Requires compatible controls"], buyerCheck: "Confirm controller and voltage range.", ...evidence }],
  specifications: [{ name: "Input power", purchasingMeaning: "Electrical input at the stated condition", reportingBoundary: "Not suction power", comparisonCaution: "Do not compare across unspecified test conditions.", ...evidence }],
  applicationMatrix: [{ application: "Stick vacuum", wcbAssessment: "Potential architecture fit only.", ...assessment, ...evidence }],
  compatibilityChecks: [{ check: "Part number", requiredMatch: "Exact manufacturer number and revision", why: "Family names do not define interfaces.", buyerAction: "Verify against current approved-parts documentation.", ...evidence }],
  failureModes: [{ symptom: "Motor does not start", possibleCauses: ["Power or control fault"], safetyBoundary: "Disconnect power before service.", serviceAction: "Use the authorized diagnostic procedure.", ...evidence }],
  representativeFamilies: [
    ["Maker A", "A1"], ["Maker A", "A2"], ["Maker B", "B1"],
    ["Maker B", "B2"], ["Maker C", "C1"], ["Maker C", "C2"]
  ].map(([manufacturer, familyName]) => ({
    manufacturer, familyName, architecture: "Officially stated architecture",
    applicationScope: "Named official application", distinguishingSpecifications: ["Official specification"],
    marketScope: "Source market", ...evidence
  })),
  procurementDecisions: [{ intendedUse: "New product design", attributeToVerify: "Operating point", comparisonTrap: "Using input power as suction performance", ...assessment, ...evidence }],
  engineeringChecks: [{ check: "Electrical interface", reason: "Protects the motor and appliance", buyerAction: "Approve voltage, control, protection and connector specification.", ...evidence }],
  standards: [{ name: "Sample safety standard", jurisdiction: "Sample market", version: "2026", applicability: "Named scope only; not a certification claim.", ...evidence }],
  developments: [{ date: "2026-01-01", title: "Sample development", summary: "Official technical development.", ...evidence }],
  sources: [1, 2, 3, 4, 5].map((number) => ({
    id: `source-${number}`,
    title: `Official source ${number}`,
    publisher: `Maker ${number}`,
    sourceType: number === 1 ? "manufacturer" : "technical",
    url: `https://example.com/source-${number}`,
    accessedAt: "2026-08-09"
  })),
  publishedAt: "2026-08-09",
  lastVerified: "2026-08-09",
  lastModified: "2026-08-09"
};

test("valid component profile passes the independent contract", () => {
  assert.deepEqual(validateComponentProfile(validProfile), []);
  assert.deepEqual(buildComponentStaticParams([validProfile]), [{ slug: "sample-motor" }]);
});

test("draft visibility is limited to local and Preview environments", () => {
  assert.equal(isComponentDraftVisible(undefined), true);
  assert.equal(isComponentDraftVisible("development"), true);
  assert.equal(isComponentDraftVisible("preview"), true);
  assert.equal(isComponentDraftVisible("production"), false);
});

test("validator rejects provenance evidence and compatibility failures", () => {
  const invalid = structuredClone(validProfile);
  invalid.sources = invalid.sources.slice(0, 4);
  invalid.specifications[0].sourceIds = ["missing-source"];
  invalid.procurementDecisions[0].limitations = "";
  invalid.disclaimer = "General technical reference.";
  invalid.contentVisuals[1].mobileSrc = "";
  invalid.contentVisuals[2].placement = "architecture-families";
  invalid.contentVisuals[0].src = "/images/equipment/sample.webp";
  invalid.representativeFamilies = invalid.representativeFamilies.slice(0, 5);
  invalid.sources[0].sourceType = "blog";
  const errors = validateComponentProfile(invalid).join("\n");
  assert.match(errors, /at least five sources/i);
  assert.match(errors, /unknown source/i);
  assert.match(errors, /limitations/i);
  assert.match(errors, /compatibility boundary/i);
  assert.match(errors, /mobileSrc/i);
  assert.match(errors, /placement must be unique/i);
  assert.match(errors, /profile image directory/i);
  assert.match(errors, /6–8 rows/i);
  assert.match(errors, /sourceType is not supported/i);
});

test("published loader sitemap and schemas expose only safe semantics", () => {
  assert.deepEqual(getPublishedComponentProfiles().map(({ slug }) => slug), ["vacuum-cleaner-motor"]);
  assert.deepEqual(buildComponentSitemapEntries([validProfile], "https://worldcleanbiz.com"), [{
    url: "https://worldcleanbiz.com/components/sample-motor",
    lastModified: "2026-08-09"
  }]);
  const schemaText = JSON.stringify(buildComponentPageSchemas(validProfile, "https://worldcleanbiz.com"));
  assert.match(schemaText, /Product/);
  assert.match(schemaText, /BreadcrumbList/);
  assert.doesNotMatch(schemaText, /Organization|Brand|offers|aggregateRating|manufacturer/);
});

test("site discovery integrates published components without hard-coding the pilot", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "app/sitemap.ts"), "utf8");
  assert.match(source, /getPublishedComponentProfiles\(\)/);
  assert.match(source, /componentProfiles\.length > 0 \? \["\/components"\] : \[\]/);
  assert.match(source, /buildComponentSitemapEntries\(componentProfiles, baseUrl\)/);
  assert.doesNotMatch(source, /vacuum-cleaner-motor/);
});

test("vacuum cleaner motor pilot meets evidence relationship and visual gates", async () => {
  const profile = getComponentProfiles().find((candidate) => candidate?.slug === "vacuum-cleaner-motor");
  assert.ok(profile);
  assert.equal(profile.status, "published");
  assert.deepEqual(validateComponentProfile(profile), []);
  assert.equal(getComponentPageData(profile.slug, { includeDrafts: false })?.slug, profile.slug);
  assert.equal(getComponentPageData(profile.slug, { includeDrafts: true })?.slug, profile.slug);
  assert.ok(profile.sources.length >= 5);
  assert.equal(profile.contentVisuals.length, 4);
  assert.deepEqual(new Set(profile.contentVisuals.map(({ placement }) => placement)), new Set([
    "architecture-families", "performance-boundaries", "application-context", "compatibility-gate"
  ]));
  assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
  assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 2);
  assert.ok(profile.representativeFamilies.length >= 6 && profile.representativeFamilies.length <= 8);
  assert.ok(new Set(profile.representativeFamilies.map(({ manufacturer }) => manufacturer)).size >= 3);

  const hero = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
  assert.equal(hero.format, "webp");
  assert.ok((hero.width ?? 0) >= 1600 && (hero.height ?? 0) >= 1000);
  for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
    const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
    assert.equal(metadata.format, "webp");
    assert.ok((metadata.width ?? 0) >= 1500 && (metadata.height ?? 0) >= 900);
    assert.match(visual.sourceUrl, /^https:\/\//);
  }
  for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram")) {
    const desktop = fs.readFileSync(path.join(process.cwd(), "public", visual.src), "utf8");
    const mobile = fs.readFileSync(path.join(process.cwd(), "public", visual.mobileSrc), "utf8");
    assert.match(desktop, /<svg/);
    assert.match(mobile, /<svg/);
  }
  const compatibility = fs.readFileSync(path.join(process.cwd(), "public/images/components/vacuum-cleaner-motor/compatibility-gate.svg"), "utf8");
  assert.match(compatibility, /Physical resemblance/);
  assert.match(compatibility, /matching wattage/);
});
