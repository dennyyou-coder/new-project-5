import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEquipmentPageSchemas,
  buildEquipmentSitemapEntries,
  buildEquipmentStaticParams,
  getPublishedEquipmentProfiles,
  isEquipmentDraftVisible,
  validateEquipmentProfile
} from "../lib/equipment.ts";

const evidence = {
  evidence: "The official manual describes the cleaning system.",
  scope: "Sample model and market",
  sourceIds: ["source-1"],
  verifiedAt: "2026-08-08"
};

const validProfile = {
  status: "published",
  slug: "sample-equipment",
  name: "Sample Equipment",
  aliases: ["sample machine"],
  definition: "A sample equipment category used to validate the content contract.",
  includedScope: ["Included equipment"],
  excludedScope: ["Excluded equipment"],
  primaryApplications: ["Commercial floors"],
  headline: "Sample equipment technical profile",
  description: "Independent technical reference for professional buyers and engineers.",
  metaDescription: "Sample equipment types, specifications, components and procurement checks.",
  disclaimer: "Verify model-specific specifications, safety instructions and service requirements.",
  heroImage: "/images/equipment/sample-equipment/hero.webp",
  heroImageAlt: "Sample equipment operating on a commercial floor",
  heroImageCaption: "Official product reference.",
  heroSourceUrl: "https://example.com/official-image",
  keyFacts: [{ label: "Mechanism", value: "Mechanical agitation and liquid recovery", ...evidence }],
  systemFlow: [
    { order: 1, name: "Solution delivery", componentFamily: "Solution system", role: "Applies solution", ...evidence }
  ],
  variants: [
    { name: "Walk-behind", taskScale: "Small to medium", operatorRelationship: "Operator walks behind", spaceConstraints: "Requires aisle clearance", limitations: "Model dependent", ...evidence }
  ],
  performanceMetrics: [
    { name: "Cleaning path", purchasingMeaning: "Nominal working width", reportingBoundary: "Model specification", comparisonCaution: "Does not establish practical productivity", ...evidence }
  ],
  applicationFit: [
    {
      application: "Retail",
      ...evidence,
      wcbAssessment: "Potential fit where aisle dimensions and floor type are compatible.",
      basis: "Reviewed official application and specification material.",
      limitations: "No universal suitability is established.",
      buyerAction: "Run a site trial on the intended floor and cleaning cycle."
    }
  ],
  componentStack: [
    { name: "Squeegee assembly", role: "Collects suspended soil and solution", variants: ["Straight", "curved"], criticalChecks: ["Part number", "blade material"], ...evidence }
  ],
  representativeModels: [
    "alpha", "beta", "gamma", "delta", "epsilon", "zeta"
  ].map((modelName, index) => ({
    brandSlug: ["brand-a", "brand-b", "brand-c", "brand-d"][index % 4],
    brandName: ["Brand A", "Brand B", "Brand C", "Brand D"][index % 4],
    modelName,
    subtype: index % 2 ? "Ride-on" : "Walk-behind",
    distinguishingSpecifications: ["Officially stated specification"],
    marketScope: "Sample market",
    ...evidence
  })),
  procurementDecisions: [
    {
      intendedTask: "Routine hard-floor cleaning",
      attributeToVerify: "Practical productivity",
      comparisonTrap: "Comparing theoretical productivity as achieved output",
      ...evidence,
      assessment: "Compare within the same test boundary.",
      basis: "Manufacturer specifications and site conditions.",
      limitations: "No cross-model ranking is established.",
      buyerAction: "Request a timed site demonstration.",
      engineeringCheck: "Confirm duty cycle and charging window."
    }
  ],
  engineeringChecks: [
    { check: "Battery and charger", reason: "Electrical compatibility and duty cycle", buyerAction: "Confirm voltage, chemistry and charger part number", ...evidence }
  ],
  standards: [
    { name: "Sample safety requirement", jurisdiction: "Sample market", version: "2026", applicability: "Named equipment scope only", ...evidence }
  ],
  developments: [
    { date: "2026-01-01", title: "Sample development", summary: "Official technical development.", ...evidence }
  ],
  sources: [1, 2, 3, 4, 5].map((number) => ({
    id: `source-${number}`,
    title: `Official source ${number}`,
    publisher: "Sample Manufacturer",
    sourceType: number === 1 ? "manual" : "manufacturer",
    url: `https://example.com/source-${number}`,
    accessedAt: "2026-08-08"
  })),
  publishedAt: "2026-08-08",
  lastVerified: "2026-08-08",
  lastModified: "2026-08-08"
};

const publishedBrandSlugs = new Set(["brand-a", "brand-b", "brand-c", "brand-d"]);

test("valid equipment profile passes the contract", () => {
  assert.deepEqual(validateEquipmentProfile(validProfile, publishedBrandSlugs), []);
  assert.deepEqual(buildEquipmentStaticParams([validProfile]), [{ slug: "sample-equipment" }]);
});

test("draft visibility is limited to local and Preview environments", () => {
  assert.equal(isEquipmentDraftVisible(undefined), true);
  assert.equal(isEquipmentDraftVisible("development"), true);
  assert.equal(isEquipmentDraftVisible("preview"), true);
  assert.equal(isEquipmentDraftVisible("production"), false);
});

test("validator rejects evidence and relationship failures", () => {
  const invalid = structuredClone(validProfile);
  invalid.sources = invalid.sources.slice(0, 4);
  invalid.applicationFit[0].sourceIds = ["missing-source"];
  invalid.applicationFit[0].limitations = "";
  invalid.representativeModels[0].brandSlug = "unpublished-brand";
  invalid.componentStack[0].href = "/components/squeegee";
  const errors = validateEquipmentProfile(invalid, publishedBrandSlugs).join("\n");
  assert.match(errors, /at least five sources/i);
  assert.match(errors, /unknown source/i);
  assert.match(errors, /limitations/i);
  assert.match(errors, /published brand/i);
  assert.match(errors, /component links/i);
});

test("published loader, sitemap and schemas exclude unsupported semantics", () => {
  assert.deepEqual(getPublishedEquipmentProfiles(publishedBrandSlugs), []);
  assert.deepEqual(buildEquipmentSitemapEntries([validProfile], "https://worldcleanbiz.com"), [{
    url: "https://worldcleanbiz.com/equipment/sample-equipment",
    lastModified: "2026-08-08"
  }]);
  const schemaText = JSON.stringify(buildEquipmentPageSchemas(validProfile, "https://worldcleanbiz.com"));
  assert.doesNotMatch(schemaText, /Organization|aggregateRating|offers|manufacturer/);
  assert.match(schemaText, /Product/);
  assert.match(schemaText, /BreadcrumbList/);
});
