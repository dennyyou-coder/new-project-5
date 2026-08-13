import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import {
  buildEquipmentPageSchemas,
  buildEquipmentSitemapEntries,
  buildEquipmentStaticParams,
  getEquipmentProfiles,
  getPublishedEquipmentProfiles,
  isEquipmentDraftVisible,
  validateEquipmentProfile
} from "../lib/equipment.ts";
import { getPublishedBrandProfiles } from "../lib/brands.ts";
import { getInsights } from "../lib/content.ts";
import { buildTechnicalSitemap as sitemap } from "../lib/sitemaps.ts";
import { readRouteStyles } from "./readRouteStyles.mjs";

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
  contentVisuals: [
    {
      placement: "equipment-types",
      visualType: "official-photo",
      src: "/images/equipment/sample-equipment/types.webp",
      alt: "Sample walk-behind machine",
      caption: "Representative official image.",
      sourceUrl: "https://example.com/types.webp"
    },
    {
      placement: "application-fit",
      visualType: "official-photo",
      src: "/images/equipment/sample-equipment/application.webp",
      alt: "Sample machine in use",
      caption: "Representative application image.",
      sourceUrl: "https://example.com/application.webp"
    },
    {
      placement: "component-stack",
      visualType: "wcb-diagram",
      src: "/images/equipment/sample-equipment/components.svg",
      alt: "Component verification zones",
      caption: "WCB verification diagram.",
      sourceIds: ["source-1"],
      mobileSrc: "/images/equipment/sample-equipment/components-mobile.svg"
    }
  ],
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
  invalid.variants[0].spaceConstraints = "";
  invalid.sources[0].sourceType = "blog";
  invalid.contentVisuals[0].src = "/images/brands/sample.webp";
  invalid.contentVisuals[1].placement = "equipment-types";
  delete invalid.contentVisuals[1].sourceUrl;
  invalid.contentVisuals[2].sourceIds = ["missing-source"];
  const errors = validateEquipmentProfile(invalid, publishedBrandSlugs).join("\n");
  assert.match(errors, /at least five sources/i);
  assert.match(errors, /unknown source/i);
  assert.match(errors, /limitations/i);
  assert.match(errors, /published brand/i);
  assert.match(errors, /component links/i);
  assert.match(errors, /spaceConstraints/i);
  assert.match(errors, /sourceType is not supported/i);
  assert.match(errors, /contentVisuals row 1 src/i);
  assert.match(errors, /contentVisuals row 2 placement must be unique/i);
  assert.match(errors, /contentVisuals row 2 sourceUrl/i);
  assert.match(errors, /contentVisuals row 3 references unknown source/i);
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

test("floor scrubber pilot meets evidence, relationship and image gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const floorScrubber = getEquipmentProfiles().find(
    (candidate) => candidate?.slug === "floor-scrubber"
  );
  assert.ok(floorScrubber);
  assert.equal(floorScrubber.status, "published");
  assert.deepEqual(validateEquipmentProfile(floorScrubber, realPublishedBrandSlugs), []);
  assert.ok(floorScrubber.sources.length >= 5);
  assert.ok(floorScrubber.representativeModels.length >= 6);
  assert.ok(floorScrubber.representativeModels.length <= 8);
  assert.ok(new Set(floorScrubber.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
  assert.equal(floorScrubber.componentStack.some((item) => "href" in item), false);
  assert.equal(floorScrubber.contentVisuals.length, 3);
  assert.deepEqual(
    new Set(floorScrubber.contentVisuals.map(({ placement }) => placement)),
    new Set(["equipment-types", "application-fit", "component-stack"])
  );
  assert.equal(floorScrubber.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
  assert.equal(floorScrubber.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

  const heroMetadata = await sharp(
    path.join(process.cwd(), "public", floorScrubber.heroImage)
  ).metadata();
  assert.equal(heroMetadata.format, "webp");
  assert.ok((heroMetadata.width ?? 0) >= 1600);
  assert.ok((heroMetadata.height ?? 0) >= 1000);

  for (const visual of floorScrubber.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
    const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
    assert.equal(metadata.format, "webp");
    assert.ok((metadata.width ?? 0) >= 1500);
    assert.ok((metadata.height ?? 0) >= 900);
  }

  const diagram = floorScrubber.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
  const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
  const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
  assert.match(diagramSource, /<svg/);
  assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
  assert.match(mobileDiagramSource, /<svg/);
  assert.match(mobileDiagramSource, /Family labels do not establish cross-model compatibility/);
});

test("published floor scrubber is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  assert.equal(urls.some((url) => url.endsWith("/equipment/floor-scrubber")), true);
  assert.equal(urls.some((url) => url.endsWith("/equipment")), true);
});

test("second equipment batch meets evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();

  for (const slug of ["floor-sweeper", "carpet-extractor", "wet-dry-vacuum"]) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 5);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(
      path.join(process.cwd(), "public", profile.heroImage)
    ).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published second equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["floor-sweeper", "carpet-extractor", "wet-dry-vacuum"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("third equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();

  for (const slug of ["single-disc-floor-machine", "floor-burnisher", "commercial-pressure-washer"]) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 5);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);
    if (slug === "commercial-pressure-washer") {
      assert.match(profile.sources.find(({ id }) => id === "karcher-hd615")?.url ?? "", /hd-6-15-m-11509300/);
    } else {
      assert.equal(
        profile.sources.find(({ id }) => id === "iec-floor-treatment")?.url,
        "https://webstore.iec.ch/en/publication/64775"
      );
    }

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published third equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["single-disc-floor-machine", "floor-burnisher", "commercial-pressure-washer"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("fourth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();

  for (const slug of ["commercial-dry-vacuum", "backpack-vacuum", "commercial-steam-cleaner"]) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 5);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published fourth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["commercial-dry-vacuum", "backpack-vacuum", "commercial-steam-cleaner"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("fifth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();

  for (const slug of ["autonomous-floor-scrubber", "commercial-robot-vacuum", "combination-sweeper-scrubber"]) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 5);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published fifth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["autonomous-floor-scrubber", "commercial-robot-vacuum", "combination-sweeper-scrubber"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("sixth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();

  for (const slug of ["industrial-dust-extractor", "upright-commercial-vacuum", "escalator-cleaner"]) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 5);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published sixth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["industrial-dust-extractor", "upright-commercial-vacuum", "escalator-cleaner"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("seventh equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();

  for (const slug of ["walk-behind-floor-scrubber", "ride-on-floor-scrubber", "wide-area-vacuum"]) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 5);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published seventh equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["walk-behind-floor-scrubber", "ride-on-floor-scrubber", "wide-area-vacuum"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("eighth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();

  for (const slug of ["walk-behind-floor-sweeper", "ride-on-floor-sweeper", "carpet-spot-extractor"]) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 5);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published eighth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["walk-behind-floor-sweeper", "ride-on-floor-sweeper", "carpet-spot-extractor"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("ninth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();
  const expectedBoundaries = new Map([
    ["hot-water-pressure-washer", /integrated or manufacturer-defined water-heating system/i],
    ["cold-water-pressure-washer", /without an integrated water-heating system/i],
    ["commercial-air-mover", /accelerate evaporation/i],
  ]);

  for (const [slug, boundary] of expectedBoundaries) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.match(profile.definition, boundary);
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 7);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published ninth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["hot-water-pressure-washer", "cold-water-pressure-washer", "commercial-air-mover"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("tenth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();
  const expectedBoundaries = new Map([
    ["cordless-stick-vacuum", /battery-powered household dry vacuum/i],
    ["canister-vacuum-cleaner", /separate body connected.+flexible hose/i],
    ["household-robot-vacuum", /autonomous dry-cleaning robot.+household/i],
  ]);

  for (const [slug, boundary] of expectedBoundaries) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.match(profile.definition, boundary);
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 7);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.match(profile.heroSourceUrl, /^https:\/\//);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      assert.match(visual.sourceUrl, /^https:\/\//);
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published tenth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["cordless-stick-vacuum", "canister-vacuum-cleaner", "household-robot-vacuum"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("eleventh equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();
  const expectedBoundaries = new Map([
    ["cordless-wet-dry-floor-cleaner", /battery-powered upright household machine.+dispenses.+recovers dirty liquid/i],
    ["steam-mop", /household upright appliance.+delivers steam.+floor head/i],
    ["handheld-vacuum-cleaner", /compact portable household dry vacuum.+self-contained hand unit/i],
  ]);

  for (const [slug, boundary] of expectedBoundaries) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.match(profile.definition, boundary);
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 7);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.match(profile.heroSourceUrl, /^https:\/\//);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      assert.match(visual.sourceUrl, /^https:\/\//);
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published eleventh equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["cordless-wet-dry-floor-cleaner", "steam-mop", "handheld-vacuum-cleaner"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("twelfth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();
  const expectedBoundaries = new Map([
    ["upright-vacuum-cleaner", /mains-powered household dry vacuum.+upright body.+floor head/i],
    ["household-carpet-cleaner", /household upright extraction appliance.+dispenses.+recovers dirty liquid/i],
    ["robotic-pool-cleaner", /self-propelled pool-cleaning machine.+underwater.+filtration/i],
  ]);

  for (const [slug, boundary] of expectedBoundaries) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.match(profile.definition, boundary);
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 7);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.match(profile.heroSourceUrl, /^https:\/\//);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      assert.match(visual.sourceUrl, /^https:\/\//);
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published twelfth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["upright-vacuum-cleaner", "household-carpet-cleaner", "robotic-pool-cleaner"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("thirteenth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();
  const expectedBoundaries = new Map([
    ["portable-carpet-upholstery-cleaner", /portable household extraction appliance.+dispense.+recover dirty liquid/i],
    ["electric-pressure-washer", /mains-powered household.+electric motor.+pressurize supplied water/i],
    ["robotic-pool-skimmer", /self-propelled pool-surface cleaning robot.+floating debris/i],
  ]);

  for (const [slug, boundary] of expectedBoundaries) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.match(profile.definition, boundary);
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 7);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.match(profile.heroSourceUrl, /^https:\/\//);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      assert.match(visual.sourceUrl, /^https:\/\//);
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published thirteenth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["portable-carpet-upholstery-cleaner", "electric-pressure-washer", "robotic-pool-skimmer"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("fourteenth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();
  const expectedBoundaries = new Map([
    ["front-load-washing-machine", /household automatic washer.+horizontal-axis drum.+front door/i],
    ["dishwasher", /household automatic dishwasher.+heated water.+racks.+spray/i],
    ["air-purifier", /portable household room air cleaner.+indoor air.+filter/i],
  ]);

  for (const [slug, boundary] of expectedBoundaries) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.match(profile.definition, boundary);
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 7);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.match(profile.heroSourceUrl, /^https:\/\//);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      assert.match(visual.sourceUrl, /^https:\/\//);
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published fourteenth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["front-load-washing-machine", "dishwasher", "air-purifier"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("fifteenth equipment batch meets published evidence relationship and visual gates", async () => {
  const realPublishedBrandSlugs = new Set(
    getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug)
  );
  const profiles = getEquipmentProfiles();
  const expectedBoundaries = new Map([
    ["washer-dryer-combo", /household front-load cabinet.+washing.+tumble drying/i],
    ["heat-pump-dryer", /household tumble dryer.+closed-loop refrigerant.+heat-pump/i],
    ["dehumidifier", /portable household appliance.+moisture.+indoor air.+collect.+drain/i],
  ]);

  for (const [slug, boundary] of expectedBoundaries) {
    const profile = profiles.find((candidate) => candidate?.slug === slug);
    assert.ok(profile, `${slug} profile should exist`);
    assert.equal(profile.status, "published");
    assert.match(profile.definition, boundary);
    assert.deepEqual(validateEquipmentProfile(profile, realPublishedBrandSlugs), []);
    assert.ok(profile.sources.length >= 7);
    assert.ok(profile.representativeModels.length >= 6);
    assert.ok(profile.representativeModels.length <= 8);
    assert.ok(new Set(profile.representativeModels.map(({ brandSlug }) => brandSlug)).size >= 4);
    assert.equal(profile.componentStack.some((item) => "href" in item), false);
    assert.match(profile.heroSourceUrl, /^https:\/\//);
    assert.equal(profile.contentVisuals.length, 3);
    assert.deepEqual(
      new Set(profile.contentVisuals.map(({ placement }) => placement)),
      new Set(["equipment-types", "application-fit", "component-stack"])
    );
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo").length, 2);
    assert.equal(profile.contentVisuals.filter(({ visualType }) => visualType === "wcb-diagram").length, 1);

    const heroMetadata = await sharp(path.join(process.cwd(), "public", profile.heroImage)).metadata();
    assert.equal(heroMetadata.format, "webp");
    assert.ok((heroMetadata.width ?? 0) >= 1600);
    assert.ok((heroMetadata.height ?? 0) >= 1000);

    for (const visual of profile.contentVisuals.filter(({ visualType }) => visualType === "official-photo")) {
      assert.match(visual.sourceUrl, /^https:\/\//);
      const metadata = await sharp(path.join(process.cwd(), "public", visual.src)).metadata();
      assert.equal(metadata.format, "webp");
      assert.ok((metadata.width ?? 0) >= 1500);
      assert.ok((metadata.height ?? 0) >= 900);
    }

    const diagram = profile.contentVisuals.find(({ visualType }) => visualType === "wcb-diagram");
    const diagramSource = readFileSync(path.join(process.cwd(), "public", diagram.src), "utf8");
    const mobileDiagramSource = readFileSync(path.join(process.cwd(), "public", diagram.mobileSrc), "utf8");
    assert.match(diagramSource, /<svg/);
    assert.match(diagramSource, /Family labels do not establish cross-model compatibility/);
    assert.match(mobileDiagramSource, /<svg/);
    assert.match(
      mobileDiagramSource.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
      /Family labels do not establish cross-model compatibility/
    );
  }
});

test("published fifteenth equipment batch is included in production sitemap discovery", () => {
  const urls = sitemap().map(({ url }) => url);
  for (const slug of ["washer-dryer-combo", "heat-pump-dryer", "dehumidifier"]) {
    assert.equal(urls.some((url) => url.endsWith(`/equipment/${slug}`)), true);
  }
});

test("equipment layout avoids empty title columns and balances odd card grids", () => {
  const styles = readRouteStyles("equipment.css");

  assert.match(
    styles,
    /\.equipment-hero-media img\s*\{[^}]*height:\s*auto/s
  );

  assert.match(
    styles,
    /\.equipment-assessment-card\s*\{[^}]*grid-template-areas:\s*"heading assessment"\s*"evidence assessment"/s
  );
  assert.match(
    styles,
    /\.equipment-(?:type|decision)-card:last-child:nth-child\(odd\)[^{]*\{[^}]*grid-column:\s*1\s*\/\s*-1/s
  );
  assert.match(
    styles,
    /@media \(max-width:\s*840px\)[\s\S]*?\.equipment-assessment-card\s*\{[^}]*grid-template-areas:\s*"heading"\s*"evidence"\s*"assessment"/s
  );
  assert.match(
    styles,
    /\.equipment-key-facts \.brand-data-table (?:th|td)[^{]*\{[^}]*color:\s*var\(--equipment-ink\)/s
  );
});
