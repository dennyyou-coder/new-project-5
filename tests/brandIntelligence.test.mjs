import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import {
  buildBrandCompetitorReferences,
  buildBrandPageSchemas,
  buildBrandSitemapEntries,
  buildBrandStaticParams,
  getBrandPageData,
  getBrandProfiles,
  getPublishedBrandProfiles,
  normalizeBrandSlugs,
  sortBrandArticlesNewestFirst,
  validateBrandProfile
} from "../lib/brands.ts";
import {
  buildBrandCategorySitemapEntries,
  buildBrandCategoryStaticParams,
  getBrandCategoryForProfile,
  getPublishedBrandCategories,
  validateBrandCategoryAssignments
} from "../lib/brandCategories.ts";
import { getInsights } from "../lib/content.ts";
import { partitionFeaturedLeadership } from "../components/brands/brandSectionData.ts";
import sitemap from "../app/sitemap.ts";

const profile = {
  status: "published",
  slug: "sample-brand",
  name: "Sample Brand",
  aliases: ["Sample"],
  legalName: "Sample Brand Holdings Ltd.",
  officialWebsite: "https://example.com",
  headline: "Sample Brand company, products and market strategy",
  description: "Independent company and market intelligence for cleaning-industry professionals.",
  metaDescription: "Sample Brand ownership, products, manufacturing, channels and strategy.",
  disclaimer: "World Clean Biz is not affiliated with Sample Brand.",
  headquarters: "Sample City",
  founded: "2018",
  heroImage: "/images/insights/sample-cover.jpg",
  heroImageAlt: "Sample Brand products",
  logoImage: "/images/brands/sample-brand/logo.webp",
  logoImageAlt: "Sample Brand logo",
  logoSourceUrl: "https://example.com/brand-assets",
  contentVisuals: [
    {
      placement: "ownership",
      src: "/images/blog/sample-brand-company-map.webp",
      alt: "Diagram of Sample Brand company ownership",
      caption: "Sample Brand ownership structure based on reviewed company records."
    },
    {
      placement: "portfolio",
      src: "/images/blog/sample-brand-product-map.webp",
      alt: "Sample Brand product portfolio map",
      caption: "Sample Brand product categories and positioning."
    }
  ],
  ownership: { summary: "Sample Brand Holdings Ltd. controls the brand." },
  leadership: [{ name: "Alex Example", role: "Founder" }],
  productPortfolio: [{
    name: "Robot vacuums",
    positioning: "Premium residential floorcare",
    buyerRelevance: "A core line for residential floorcare assortment planning."
  }],
  manufacturingSupplyChain: [{
    evidence: "Manufacturing statement verified against the cited company source.",
    scope: "Company disclosure",
    buyerCheck: "Confirm the manufacturer and origin for the contracted SKU."
  }],
  marketsChannels: [{
    evidence: "Direct ecommerce and distributor channels in named markets.",
    scope: "Named regional markets",
    buyerCheck: "Confirm seller authorization and local warranty coverage."
  }],
  competitivePosition: {
    summary: "WCB assessment based on product breadth, channel reach and verified company disclosures.",
    competitorSlugs: ["other-brand"]
  },
  developments: [{
    date: "2026-07-01",
    title: "Company update",
    summary: "The company disclosed a material channel update.",
    sourceIds: ["source-1"]
  }],
  sources: [
    { id: "source-1", title: "Company source", publisher: "Sample Brand", url: "https://example.com/company", accessedAt: "2026-07-29" },
    { id: "source-2", title: "Regulatory filing", publisher: "Exchange", url: "https://example.com/filing", accessedAt: "2026-07-29" },
    { id: "source-3", title: "Management interview", publisher: "Industry Publication", url: "https://example.com/interview", accessedAt: "2026-07-29" }
  ],
  publishedAt: "2026-07-29T12:00:00+08:00",
  lastVerified: "2026-07-29",
  lastModified: "2026-07-29T12:00:00+08:00"
};

const articles = [
  {
    slug: "sample-brand-market-update",
    title: "Sample Brand market update",
    excerpt: "Channel update",
    sortDate: "2026-07-20T12:00:00+08:00",
    primaryBrands: ["sample-brand"],
    relatedBrands: ["sample-brand"]
  },
  {
    slug: "sample-brand-product-update",
    title: "Sample Brand product update",
    excerpt: "Product update",
    sortDate: "2026-07-25T12:00:00+08:00",
    primaryBrands: ["sample-brand"],
    relatedBrands: []
  },
  {
    slug: "sample-brand-supply-chain-update",
    title: "Sample Brand supply-chain update",
    excerpt: "Supply-chain update",
    sortDate: "2026-07-10T12:00:00+08:00",
    primaryBrands: ["sample-brand"],
    relatedBrands: []
  }
];

test("verified cross-category brands appear in each relevant market and retain one primary category", () => {
  const publishedProfiles = getBrandProfiles().filter(({ status }) => status === "published");
  const categories = getPublishedBrandCategories(publishedProfiles);
  const membershipsFor = (slug) => categories
    .filter(({ profiles }) => profiles.some((candidate) => candidate.slug === slug))
    .map(({ category }) => category.slug);

  assert.deepEqual(membershipsFor("aiper"), [
    "lawn-garden-equipment",
    "pool-equipment-pool-care"
  ]);
  assert.deepEqual(membershipsFor("black-decker"), [
    "power-tools",
    "lawn-garden-equipment",
    "floorcare-home-cleaning"
  ]);
  assert.deepEqual(membershipsFor("ecovacs"), [
    "lawn-garden-equipment",
    "floorcare-home-cleaning",
    "commercial-industrial-cleaning"
  ]);
  assert.deepEqual(membershipsFor("mammotion"), [
    "lawn-garden-equipment",
    "pool-equipment-pool-care"
  ]);
  assert.deepEqual(membershipsFor("karcher"), [
    "floorcare-home-cleaning",
    "commercial-industrial-cleaning"
  ]);
  assert.deepEqual(membershipsFor("worx"), [
    "power-tools",
    "lawn-garden-equipment"
  ]);
  assert.deepEqual(membershipsFor("samsung-home-appliances"), [
    "floorcare-home-cleaning",
    "home-appliances-small-appliances"
  ]);
  assert.deepEqual(membershipsFor("fisher-paykel"), [
    "home-appliances-small-appliances"
  ]);
  assert.deepEqual(membershipsFor("beko"), [
    "floorcare-home-cleaning",
    "home-appliances-small-appliances"
  ]);
  assert.deepEqual(membershipsFor("whirlpool"), [
    "home-appliances-small-appliances"
  ]);
  assert.deepEqual(membershipsFor("kitchenaid"), [
    "home-appliances-small-appliances"
  ]);

  assert.equal(getBrandCategoryForProfile("aiper")?.slug, "pool-equipment-pool-care");
  assert.equal(getBrandCategoryForProfile("ecovacs")?.slug, "floorcare-home-cleaning");
  assert.equal(getBrandCategoryForProfile("eufy")?.slug, "floorcare-home-cleaning");
  assert.equal(getBrandCategoryForProfile("karcher")?.slug, "commercial-industrial-cleaning");
  assert.equal(getBrandCategoryForProfile("mammotion")?.slug, "lawn-garden-equipment");
  assert.equal(getBrandCategoryForProfile("worx")?.slug, "lawn-garden-equipment");
  assert.equal(
    getBrandCategoryForProfile("samsung-home-appliances")?.slug,
    "home-appliances-small-appliances"
  );
  assert.equal(
    getBrandCategoryForProfile("ge-appliances")?.slug,
    "home-appliances-small-appliances"
  );
  assert.equal(
    getBrandCategoryForProfile("beko")?.slug,
    "home-appliances-small-appliances"
  );
  assert.equal(
    getBrandCategoryForProfile("kitchenaid")?.slug,
    "home-appliances-small-appliances"
  );
  assert.equal(
    getBrandCategoryForProfile("whirlpool")?.slug,
    "home-appliances-small-appliances"
  );
});

test("normalizes supported brand frontmatter values and removes malformed slugs", () => {
  assert.deepEqual(normalizeBrandSlugs([" Roborock ", "roborock", "Dreame"]), [
    "roborock",
    "dreame"
  ]);
  assert.deepEqual(normalizeBrandSlugs("Roborock"), ["roborock"]);
  assert.deepEqual(normalizeBrandSlugs(undefined), []);
  assert.deepEqual(normalizeBrandSlugs(["", " ", "not a slug", "Dreame"]), ["dreame"]);
});

test("accepts a complete published brand profile", () => {
  assert.deepEqual(validateBrandProfile(profile, articles), []);
});

test("rejects incomplete leadership portrait metadata", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.leadership[0].portrait = {
    src: "/images/brands/sample-brand/founder.webp",
    alt: "Alex Example, founder of Sample Brand"
  };

  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /leadership item 1 portrait credit is required/i);
  assert.match(errors, /leadership item 1 portrait sourceUrl is required/i);
});

test("requires leadership portrait sources to use HTTPS", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.leadership[0].portrait = {
    src: "/images/brands/sample-brand/founder.webp",
    alt: "Alex Example, founder of Sample Brand",
    credit: "Sample Brand",
    sourceUrl: "http://example.com/press"
  };

  assert.match(
    validateBrandProfile(invalidProfile, articles).join("\n"),
    /leadership item 1 portrait sourceUrl must be a valid HTTPS URL/i
  );
});

test("keeps leadership portraits inside the current brand asset directory", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.leadership[0].portrait = {
    src: "/images/blog/founder.webp",
    alt: "Alex Example, founder of Sample Brand",
    credit: "Sample Brand",
    sourceUrl: "https://example.com/press"
  };

  assert.ok(
    validateBrandProfile(invalidProfile, articles).includes(
      "leadership item 1 portrait src must begin with /images/brands/sample-brand/."
    )
  );
});

test("page schema exposes the official logo while preserving the editorial hero image", () => {
  const schemas = buildBrandPageSchemas(
    { profile, primaryArticles: [], relatedArticles: [] },
    "https://worldcleanbiz.com"
  );
  const organization = schemas.find((schema) => schema["@type"] === "Organization");
  const webPage = schemas.find((schema) => schema["@type"] === "WebPage");

  assert.equal(
    organization.logo,
    "https://worldcleanbiz.com/images/brands/sample-brand/logo.webp"
  );
  assert.equal(
    webPage.image,
    "https://worldcleanbiz.com/images/insights/sample-cover.jpg"
  );
});

test("requires complete official logo metadata for a published profile", () => {
  for (const field of ["logoImage", "logoImageAlt", "logoSourceUrl"]) {
    const invalidProfile = structuredClone(profile);
    delete invalidProfile[field];
    assert.match(
      validateBrandProfile(invalidProfile, articles).join("\n"),
      new RegExp(field, "i")
    );
  }
});

test("allows a draft profile to omit official logo metadata", () => {
  const draftProfile = structuredClone(profile);
  draftProfile.status = "draft";
  delete draftProfile.logoImage;
  delete draftProfile.logoImageAlt;
  delete draftProfile.logoSourceUrl;

  assert.deepEqual(validateBrandProfile(draftProfile, articles), []);
});

test("validates any official logo metadata supplied by a draft profile", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.status = "draft";
  invalidProfile.logoImage = "logo.webp";
  invalidProfile.logoImageAlt = " ";
  invalidProfile.logoSourceUrl = "ftp://example.com/logo";
  const errors = validateBrandProfile(invalidProfile, articles).join("\n");

  assert.match(errors, /logoImage.*\/images\//i);
  assert.match(errors, /logoImageAlt/i);
  assert.match(errors, /logoSourceUrl.*HTTP\(S\)/i);
});

test("requires valid placed content visuals", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.contentVisuals[0].placement = "gallery";
  invalidProfile.contentVisuals[1].caption = " ";
  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /contentVisuals item 1 placement/i);
  assert.match(errors, /contentVisuals item 2 caption/i);
});

test("requires two or three content visuals with local image paths", () => {
  const tooShortProfile = structuredClone(profile);
  tooShortProfile.contentVisuals = tooShortProfile.contentVisuals.slice(0, 1);
  assert.match(
    validateBrandProfile(tooShortProfile, articles).join("\n"),
    /contentVisuals.*2 or 3/i
  );

  const invalidPathProfile = structuredClone(profile);
  invalidPathProfile.contentVisuals[0].src = "https://example.com/diagram.webp";
  assert.match(
    validateBrandProfile(invalidPathProfile, articles).join("\n"),
    /contentVisuals item 1 src.*\/images\//i
  );
});

test("requires structured manufacturing and channel evidence", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.manufacturingSupplyChain[0].scope = "";
  invalidProfile.marketsChannels[0].buyerCheck = 42;
  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /manufacturingSupplyChain item 1 scope/i);
  assert.match(errors, /marketsChannels item 1 buyerCheck/i);
});

test("requires non-empty buyer relevance when provided", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.productPortfolio[0].buyerRelevance = " ";

  assert.match(
    validateBrandProfile(invalidProfile, articles).join("\n"),
    /productPortfolio item 1 buyerRelevance/i
  );
});

test("accepts a legal entity scope note when one legal name cannot represent the brand", () => {
  const multiEntityProfile = structuredClone(profile);
  delete multiEntityProfile.legalName;
  multiEntityProfile.legalEntityNote =
    "The consumer brand spans multiple legal entities; entity scope is stated in ownership.";

  assert.deepEqual(validateBrandProfile(multiEntityProfile, articles), []);
});

test("requires either a legal name or a legal entity scope note", () => {
  const unidentifiedProfile = structuredClone(profile);
  delete unidentifiedProfile.legalName;
  delete unidentifiedProfile.legalEntityNote;

  assert.match(
    validateBrandProfile(unidentifiedProfile, articles).join("\n"),
    /legalName or legalEntityNote is required/i
  );
});

[
  {
    name: "rejects an object legalName even when legalEntityNote is valid",
    field: "legalName",
    value: { entity: "Sample Brand Holdings Ltd." },
    otherField: "legalEntityNote",
    otherValue: "The consumer brand spans multiple legal entities."
  },
  {
    name: "rejects a numeric legalEntityNote even when legalName is valid",
    field: "legalEntityNote",
    value: 2026,
    otherField: "legalName",
    otherValue: "Sample Brand Holdings Ltd."
  },
  {
    name: "rejects an empty legalName even when legalEntityNote is valid",
    field: "legalName",
    value: "",
    otherField: "legalEntityNote",
    otherValue: "The consumer brand spans multiple legal entities."
  },
  {
    name: "rejects a whitespace-only legalEntityNote even when legalName is valid",
    field: "legalEntityNote",
    value: "   ",
    otherField: "legalName",
    otherValue: "Sample Brand Holdings Ltd."
  }
].forEach(({ name, field, value, otherField, otherValue }) => {
  test(name, () => {
    const invalidProfile = structuredClone(profile);
    invalidProfile[field] = value;
    invalidProfile[otherField] = otherValue;

    const errors = validateBrandProfile(invalidProfile, articles).join("\n");
    assert.match(
      errors,
      new RegExp(`${field} must be a non-empty string when provided`, "i")
    );
    assert.doesNotMatch(errors, /legalName or legalEntityNote is required/i);
  });
});

test("an invalid optional legal entity value does not satisfy the either-or requirement", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.legalName = { entity: "Sample Brand Holdings Ltd." };
  delete invalidProfile.legalEntityNote;

  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /legalName must be a non-empty string when provided/i);
  assert.match(errors, /legalName or legalEntityNote is required/i);
});

test("requires three unique valid HTTP(S) sources", () => {
  const incompleteProfile = structuredClone(profile);
  incompleteProfile.sources = incompleteProfile.sources.slice(0, 2);

  assert.match(
    validateBrandProfile(incompleteProfile, articles).join("\n"),
    /at least three unique valid HTTP\(S\) sources/i
  );
});

test("requires complete, uniquely identified, dated source metadata", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.sources[0] = {
    ...invalidProfile.sources[0],
    id: "",
    title: "",
    publisher: "",
    accessedAt: "not-a-date",
    publishedAt: "also-not-a-date"
  };
  invalidProfile.sources[1].id = "source-3";

  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /source 1 id is required/i);
  assert.match(errors, /source 1 title is required/i);
  assert.match(errors, /source 1 publisher is required/i);
  assert.match(errors, /source 1 accessedAt must be a valid date/i);
  assert.match(errors, /source 1 publishedAt must be a valid date/i);
  assert.match(errors, /source IDs must be unique/i);
});

test("requires three distinct tagged articles", () => {
  assert.match(
    validateBrandProfile(profile, articles.slice(0, 2)).join("\n"),
    /at least three unique primary or related articles/i
  );
});

test("rejects development source IDs that are not declared", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.developments[0].sourceIds = ["unknown-source"];

  assert.match(
    validateBrandProfile(invalidProfile, articles).join("\n"),
    /unknown source ID/i
  );
});

test("requires every development to cite at least one declared source", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.developments[0].sourceIds = [];

  assert.match(
    validateBrandProfile(invalidProfile, articles).join("\n"),
    /development 1 must reference at least one source/i
  );
});

test("requires an ownership summary", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.ownership.summary = " ";

  assert.match(
    validateBrandProfile(invalidProfile, articles).join("\n"),
    /ownership\.summary is required/i
  );
});

test("rejects profile and development dates that cannot be parsed", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.lastVerified = "not-a-date";
  invalidProfile.developments[0].date = "also-not-a-date";

  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /lastVerified.*valid date/i);
  assert.match(errors, /development.*valid date/i);
});

test("rejects impossible calendar dates instead of accepting Date.parse normalization", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.lastVerified = "2026-02-30";

  assert.match(
    validateBrandProfile(invalidProfile, articles).join("\n"),
    /lastVerified.*valid date/i
  );
});

test("rejects malformed values at every nested BrandProfile boundary", () => {
  const mutations = [
    ["status", (candidate) => { candidate.status = "archived"; }, /status/i],
    ["identity text", (candidate) => { candidate.name = 42; }, /name/i],
    ["aliases", (candidate) => { candidate.aliases = ["Sample", null]; }, /aliases/i],
    ["hero", (candidate) => { candidate.heroImageAlt = { alt: "Products" }; }, /heroImageAlt/i],
    ["ownership", (candidate) => { candidate.ownership = null; }, /ownership/i],
    ["ownership parent", (candidate) => { candidate.ownership.parentCompany = 42; }, /parentCompany/i],
    ["leadership item", (candidate) => { candidate.leadership = [null]; }, /leadership/i],
    ["leadership context", (candidate) => { candidate.leadership[0].context = 42; }, /leadership.*context/i],
    ["portfolio item", (candidate) => { candidate.productPortfolio = [null]; }, /productPortfolio/i],
    ["supply chain item", (candidate) => { candidate.manufacturingSupplyChain = [null]; }, /manufacturingSupplyChain/i],
    ["markets array", (candidate) => { candidate.marketsChannels = null; }, /marketsChannels/i],
    ["competitive position", (candidate) => { candidate.competitivePosition = null; }, /competitivePosition/i],
    ["competitor slugs", (candidate) => { candidate.competitivePosition.competitorSlugs = null; }, /competitorSlugs/i],
    ["competitor slug value", (candidate) => { candidate.competitivePosition.competitorSlugs = ["Not A Slug"]; }, /competitorSlugs/i],
    ["developments array", (candidate) => { candidate.developments = null; }, /developments/i],
    ["development item", (candidate) => { candidate.developments = [null]; }, /development 1/i],
    ["development title", (candidate) => { candidate.developments[0].title = 42; }, /development 1 title/i],
    ["sources array", (candidate) => { candidate.sources = null; }, /sources/i],
    ["source item", (candidate) => { candidate.sources = [null, ...candidate.sources.slice(1)]; }, /source 1/i],
    ["timestamp type", (candidate) => { candidate.publishedAt = { date: "2026-07-29" }; }, /publishedAt/i]
  ];

  for (const [label, mutate, expectedError] of mutations) {
    const invalidProfile = structuredClone(profile);
    mutate(invalidProfile);
    assert.match(
      validateBrandProfile(invalidProfile, articles).join("\n"),
      expectedError,
      label
    );
  }
});

test("nested validation errors retain original source and development indexes", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.sources[1] = null;
  invalidProfile.sources[2].title = "";
  invalidProfile.developments = [
    null,
    {
      date: "2026-07-02",
      title: "",
      summary: "Second update",
      sourceIds: ["source-1"]
    }
  ];

  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /source 2 must be an object/i);
  assert.match(errors, /source 3 title is required/i);
  assert.match(errors, /development 1 must be an object/i);
  assert.match(errors, /development 2 title is required/i);
});

test("sorts brand articles by absolute time with deterministic invalid and tie fallbacks", () => {
  const input = [
    { slug: "invalid-b", sortDate: "not-a-date" },
    { slug: "same-b", sortDate: "2026-07-30T00:00:00Z" },
    { slug: "earlier", sortDate: "2026-07-30T01:00:00+08:00" },
    { slug: "later", sortDate: "2026-07-29T18:00:00-07:00" },
    { slug: "same-a", sortDate: "2026-07-30T00:00:00Z" },
    { slug: "invalid-a", sortDate: "" }
  ];

  assert.deepEqual(
    sortBrandArticlesNewestFirst(input).map(({ slug }) => slug),
    ["later", "same-a", "same-b", "earlier", "invalid-a", "invalid-b"]
  );
  assert.deepEqual(input.map(({ slug }) => slug), [
    "invalid-b",
    "same-b",
    "earlier",
    "later",
    "same-a",
    "invalid-a"
  ]);
});

test("home-appliance analysis exposes only the verified primary and related brand relationships", () => {
  const articleBySlug = new Map(getInsights().map((article) => [article.slug, article]));
  const expectedRelationships = {
    "cleaning-appliance-companies-at-awe": {
      primaryBrands: ["midea", "lg-home-appliances"],
      relatedBrands: []
    },
    "dyson-finally-sells-self-emptying-vacuum": {
      primaryBrands: ["dyson"],
      relatedBrands: ["lg-home-appliances", "samsung-home-appliances"]
    },
    "ifa-2019-vacuum-cleaner-new-products-by-major-brands": {
      primaryBrands: ["philips-home-appliances", "aeg", "samsung-home-appliances"],
      relatedBrands: []
    },
    "who-makes-lg-appliances-manufacturing-network": {
      primaryBrands: ["lg-home-appliances"],
      relatedBrands: []
    },
    "who-makes-samsung-appliances-manufacturing-bespoke-ai": {
      primaryBrands: ["samsung-home-appliances"],
      relatedBrands: []
    },
    "who-owns-fisher-paykel-haier-manufacturing": {
      primaryBrands: ["fisher-paykel"],
      relatedBrands: ["haier-home-appliances", "ge-appliances"]
    },
    "who-owns-ge-appliances-haier-manufacturing": {
      primaryBrands: ["ge-appliances"],
      relatedBrands: ["haier-home-appliances", "fisher-paykel"]
    },
    "who-owns-haier-appliances-brand-portfolio": {
      primaryBrands: ["haier-home-appliances"],
      relatedBrands: ["ge-appliances", "fisher-paykel"]
    },
    "who-owns-midea-appliances-brand-portfolio": {
      primaryBrands: ["midea"],
      relatedBrands: ["eureka"]
    },
    "who-owns-whirlpool-appliances-beko-europe": {
      primaryBrands: ["whirlpool"],
      relatedBrands: ["beko", "kitchenaid"]
    },
    "who-makes-kitchenaid-appliances-whirlpool": {
      primaryBrands: ["kitchenaid"],
      relatedBrands: ["whirlpool", "beko"]
    },
    "who-owns-beko-appliances-beko-europe": {
      primaryBrands: ["beko"],
      relatedBrands: ["whirlpool", "kitchenaid"]
    }
  };

  for (const [slug, expected] of Object.entries(expectedRelationships)) {
    const article = articleBySlug.get(slug);
    assert.ok(article, `${slug} must exist`);
    assert.deepEqual(article.primaryBrands, expected.primaryBrands, `${slug} primary brands`);
    assert.deepEqual(article.relatedBrands, expected.relatedBrands, `${slug} related brands`);
  }
});

test("the release gate validates the sixty-four published profiles and approved article relationships", () => {
  const expectedCategorySlugs = [
    "power-tools",
    "lawn-garden-equipment",
    "pool-equipment-pool-care",
    "floorcare-home-cleaning",
    "commercial-industrial-cleaning",
    "home-appliances-small-appliances"
  ];
  const expectedSlugs = [
    "aeg",
    "aiper",
    "aquabot",
    "beatbot",
    "beko",
    "bissell",
    "black-decker",
    "bosch-home-appliances",
    "bosch-power-tools",
    "craftsman",
    "dewalt",
    "dirt-devil",
    "dji-romo",
    "dreame",
    "dremel",
    "dyson",
    "ecovacs",
    "electrolux",
    "eufy",
    "eureka",
    "festool",
    "fisher-paykel",
    "flex",
    "fluidra",
    "ge-appliances",
    "greenworks",
    "haier-home-appliances",
    "hayward",
    "hikoki",
    "hilti",
    "hoover",
    "husqvarna",
    "irobot",
    "karcher",
    "kitchenaid",
    "kobalt",
    "lg-home-appliances",
    "makita",
    "mammotion",
    "maytronics",
    "metabo",
    "midea",
    "miele",
    "milwaukee",
    "mova",
    "narwal",
    "nilfisk",
    "oreck",
    "pentair",
    "philips-home-appliances",
    "polaris",
    "roborock",
    "ryobi",
    "samsung-home-appliances",
    "segway-navimow",
    "shark",
    "skil",
    "stihl",
    "sunseeker",
    "tineco",
    "vax",
    "whirlpool",
    "worx",
    "wybot"
  ];
  const expectedPrimaryBrands = {
    "aiper-fluidra-pool-robotics-alliance": ["aiper", "fluidra"],
    "aiper-scuba-v3-ultra-vs-beatbot-aquasense-x": ["aiper", "beatbot"],
    "aiper-vs-wybot-fluidra-wybotics": ["aiper", "wybot"],
    "amazon-first-stop-for-backyard-robotics": ["aiper", "mammotion", "segway-navimow"],
    "anker-cleaning-appliance-strategy-analysis": ["eufy"],
    "anker-needs-a-hard-battle": ["eufy"],
    "backyard-robots-price-and-channel-war": ["greenworks"],
    "beatbot-vs-polaris-robotic-pool-cleaners": ["polaris"],
    "beatbot-vs-dolphin-xingmai-maytronics": ["beatbot", "maytronics"],
    "bissell-little-green-vs-hoover-cleanslate": ["bissell", "hoover"],
    "bissell-crosswave-hard-floor-washer-logic": ["bissell"],
    "bissell-robot-vacuums-flexclean-strategy": ["bissell"],
    "bosch-cordless-dust-collector": ["bosch-power-tools"],
    "china-cleaning-robot-giants-move-into-backyard": ["dreame", "ecovacs", "roborock", "eufy"],
    "chinese-cleaning-brands-at-ces-2026": ["eureka"],
    "cleaning-appliance-companies-at-awe": ["midea", "lg-home-appliances"],
    "commercial-robotic-mower-market-navimow-mammotion": ["mammotion", "sunseeker"],
    "dewalts-rise-harvard-case": ["dewalt"],
    "dolphin-vs-aiper-maytronics-fluidra": ["maytronics", "aiper"],
    "dolphin-vs-hayward-robotic-pool-cleaners": ["hayward", "pentair"],
    "dolphin-vs-polaris-pool-cleaners": ["polaris", "pentair"],
    "dreame-new-disruptor-in-vacuums": ["dreame"],
    "dreame-rise-to-10-billion-in-five-years": ["dreame"],
    "dyson-at-a-crossroads": ["dyson"],
    "dyson-fights-bosch-again": ["dyson", "bosch-home-appliances"],
    "dyson-finally-sells-self-emptying-vacuum": ["dyson"],
    "dji-romo-launch-analysis": ["dji-romo"],
    "dji-romo-p-vs-ecovacs-deebot-x11": ["dji-romo", "ecovacs"],
    "dji-romo-p-vs-roborock-saros-10r": ["dji-romo", "roborock"],
    "dji-romo-weaknesses-exposed": ["dji-romo"],
    "ecovacs-2018-annual-report-signals": ["ecovacs"],
    "ecovacs-at-a-crossroads": ["ecovacs"],
    "ecovacs-invests-in-battery-cell-factory": ["ecovacs"],
    "european-tool-brands-battery-alliances": ["stihl", "makita"],
    "freudenberg-acquires-nilfisk": ["nilfisk", "karcher"],
    "global-power-tool-brands-reshaping-portfolios": [
      "dewalt",
      "black-decker",
      "makita",
      "bosch-power-tools",
      "craftsman",
      "kobalt",
      "skil",
      "hilti",
      "festool",
      "hikoki",
      "flex",
      "dremel"
    ],
    "husqvarna-automower-vs-mammotion-luba": ["husqvarna", "mammotion"],
    "hoover-cleanslate-vs-shark-stainstriker": ["hoover", "shark"],
    "irobot-decline-and-the-new-robot-vacuum-order": ["irobot"],
    "irobot-financial-crisis": ["irobot"],
    "is-dreame-owned-by-xiaomi": ["dreame", "mova"],
    "is-roborock-owned-by-xiaomi": ["roborock"],
    "luba-vs-navimow-mammotion-ninebot": ["mammotion", "segway-navimow"],
    "mammotion-luba-vs-yuka-robot-mowers": ["mammotion"],
    "maytronics-robotic-pool-cleaner-reinvention": ["maytronics"],
    "german-vacuum-brands-in-the-cordless-wave": ["miele", "bosch-home-appliances"],
    "hayward-vs-pentair-vs-fluidra": ["hayward", "pentair", "fluidra"],
    "ifa-2019-vacuum-cleaner-new-products-by-major-brands": [
      "philips-home-appliances",
      "aeg",
      "samsung-home-appliances"
    ],
    "industrial-cleaning-equipment-market": ["nilfisk"],
    "irobot-2018-annual-report-faithful-translation": ["irobot"],
    "karcher-hidden-champion-in-cleaning-appliances": ["karcher"],
    "midea-cleaning-appliance-past": ["midea", "eureka", "electrolux"],
    "midea-group-and-the-possible-philips-domestic-appliances-acquisition": [
      "midea",
      "philips-home-appliances"
    ],
    "midea-supplier-summit-review": ["midea"],
    "miele-duoflex-hx2-floor-washer": ["miele"],
    "milwaukee-2761-quiet-revolution-power-tools": ["milwaukee"],
    "milwaukee-next-stop-20-billion": ["milwaukee"],
    "mova-took-me-to-meet-a-celebrity": ["mova"],
    "narwal-vs-ecovacs-robot-vacuums": ["narwal", "ecovacs"],
    "nilfisk-2018-annual-report-commercial-cleaning": ["nilfisk"],
    "pool-robotics-new-competitive-table": ["aquabot"],
    "power-tools-new-cycle-cordless-specialization": ["stihl", "makita"],
    "roborock-channel-shift-online-to-offline-experience": ["roborock"],
    "roborock-ipo-prospectus-signals": ["roborock"],
    "roborock-targets-70-billion-rmb-by-2029": ["roborock"],
    "roborock-vs-narwal-robot-vacuums": ["roborock", "narwal"],
    "robotic-mower-sales-channels": ["worx", "greenworks"],
    "robotic-vs-suction-vs-pressure-pool-cleaners": ["pentair"],
    "segway-navimow-vs-husqvarna-automower": ["segway-navimow", "husqvarna"],
    "segway-navimow-vs-worx-landroid-robot-mowers": ["segway-navimow", "worx"],
    "shark-hydrovac-vs-bissell-crosswave": ["shark", "bissell"],
    "shark-powerdetect-speed-vs-dyson-v16-piston-animal": ["shark", "dyson"],
    "sunseeker-vs-mammotion-robot-mowers": ["sunseeker", "mammotion"],
    "tineco-lacks-innovation": ["tineco"],
    "tineco-vs-bissell-crosswave-floor-washers": ["tineco", "bissell"],
    "where-are-dyson-vacuums-made": ["dyson"],
    "who-makes-aquabot-pool-cleaners-bwt-aquatron": ["aquabot"],
    "who-makes-dolphin-pool-cleaners-maytronics": ["maytronics"],
    "who-makes-kobalt-tools-lowes-suppliers": ["kobalt"],
    "who-makes-luba-robot-mowers-mammotion-agilex": ["mammotion"],
    "who-makes-mova-robot-mowers-dreame-group": ["mova"],
    "who-makes-philips-vacuum-cleaners-versuni": [
      "philips-home-appliances",
      "aeg"
    ],
    "who-makes-lg-appliances-manufacturing-network": ["lg-home-appliances"],
    "who-makes-samsung-appliances-manufacturing-bespoke-ai": ["samsung-home-appliances"],
    "who-makes-sunseeker-robot-mowers-zhejiang-sunseeker": ["sunseeker"],
    "who-makes-wybot-pool-cleaners-wybotics-wangyuan": ["wybot"],
    "who-owns-aeg-electrolux-relationship": ["aeg", "electrolux"],
    "who-owns-aiper-fluidra-stake": ["aiper"],
    "who-owns-beatbot-xingmai-manufacturing": ["beatbot"],
    "who-owns-bissell-family-sanitaire": ["bissell"],
    "who-owns-black-and-decker-stanley-tools": ["black-decker"],
    "who-owns-bosch-appliances-bsh-siemens-brands": ["bosch-home-appliances"],
    "who-owns-bosch-power-tools-robert-bosch": ["bosch-power-tools"],
    "who-owns-craftsman-tools-stanley-black-decker": ["craftsman"],
    "who-owns-dewalt-stanley-black-decker": ["dewalt", "black-decker", "craftsman"],
    "who-owns-dremel-bosch-manufacturing": ["dremel", "bosch-power-tools"],
    "who-owns-dyson-james-dyson-singapore-manufacturing": ["dyson"],
    "who-owns-greenworks-globe-stihl": ["greenworks", "stihl"],
    "who-owns-hayward-pool-products": ["hayward"],
    "who-owns-husqvarna-automower-motorcycles": ["husqvarna"],
    "who-owns-hilti-family-trust-manufacturing": ["hilti"],
    "who-owns-hoover-tti-haier-candy": ["hoover", "dirt-devil"],
    "who-owns-irobot-roomba-picea-robotics": ["irobot"],
    "who-owns-narwal-yunjing-investors-manufacturing": ["narwal"],
    "who-owns-eufy-anker-smart-home": ["eufy"],
    "who-owns-eureka-midea-electrolux-manufacturing": ["midea", "eureka", "electrolux"],
    "who-owns-festool-tts-tooltechnic-systems": ["festool"],
    "who-owns-fisher-paykel-haier-manufacturing": ["fisher-paykel"],
    "who-owns-flex-tools-chervon-lowes": ["flex"],
    "who-owns-ge-appliances-haier-manufacturing": ["ge-appliances"],
    "who-owns-karcher-family-professional-cleaning-network": ["karcher"],
    "who-owns-haier-appliances-brand-portfolio": ["haier-home-appliances"],
    "who-owns-makita-company-manufacturing": ["makita"],
    "who-owns-miele-family-manufacturing-network": ["miele"],
    "who-owns-midea-appliances-brand-portfolio": ["midea"],
    "who-owns-milwaukee-tools-tti-manufacturing": ["milwaukee", "tti"],
    "who-makes-kitchenaid-appliances-whirlpool": ["kitchenaid"],
    "who-owns-beko-appliances-beko-europe": ["beko"],
    "who-owns-whirlpool-appliances-beko-europe": ["whirlpool"],
    "who-owns-metabo-metabo-hpt-hikoki": ["metabo", "hikoki"],
    "who-owns-polaris-pool-cleaners-fluidra-zodiac": ["polaris", "fluidra"],
    "who-owns-ryobi-tti-kyocera": ["ryobi"],
    "who-owns-segway-navimow-ninebot-willand": ["segway-navimow"],
    "who-owns-sharkninja-js-global-joyoung": ["shark"],
    "who-owns-skil-tools-chervon": ["skil"],
    "who-owns-stihl-family-manufacturing": ["stihl"],
    "who-owns-tineco-ecovacs-group": ["tineco"],
    "who-owns-tti-milwaukee-ryobi-hoover-vax-oreck": [
      "ryobi",
      "milwaukee",
      "vax",
      "oreck",
      "dirt-devil"
    ],
    "who-will-be-eliminated-in-the-cordless-vacuum-cleaner-era": ["vax", "oreck", "dirt-devil"],
    "who-owns-worx-positec-landroid-manufacturing": ["worx"],
    "tti-cleaning-appliance-strategy": ["ryobi", "vax", "oreck", "dirt-devil"],
    "what-brands-does-fluidra-own": ["aquabot"],
    "wybot-vs-dolphin-robotic-pool-cleaners": ["wybot", "maytronics"]
  };

  const realArticles = getInsights();
  const articleBySlug = new Map(realArticles.map((article) => [article.slug, article]));
  const loadedProfiles = getBrandProfiles();
  const publishedProfiles = getPublishedBrandProfiles(realArticles);
  const actualPrimaryBrands = Object.fromEntries(
    realArticles
      .filter((article) => article.primaryBrands.some((slug) => expectedSlugs.includes(slug)))
      .map((article) => [article.slug, article.primaryBrands])
      .sort(([a], [b]) => a.localeCompare(b))
  );

  assert.deepEqual(publishedProfiles.map(({ slug }) => slug).sort(), expectedSlugs);
  assert.equal(loadedProfiles.length, 64);
  for (const candidate of loadedProfiles) {
    assert.deepEqual(validateBrandProfile(candidate, realArticles), []);
  }
  for (const candidate of publishedProfiles) {
    const schemas = buildBrandPageSchemas(
      { profile: candidate, primaryArticles: [], relatedArticles: [] },
      "https://worldcleanbiz.com"
    );
    const organization = schemas.find((schema) => schema["@type"] === "Organization");
    const webPage = schemas.find((schema) => schema["@type"] === "WebPage");

    assert.equal(
      organization.logo,
      `https://worldcleanbiz.com${candidate.logoImage}`,
      `${candidate.slug} Organization.logo must use the official brand logo`
    );
    assert.equal(
      webPage.image,
      candidate.heroImage
        ? `https://worldcleanbiz.com${candidate.heroImage}`
        : undefined,
      `${candidate.slug} WebPage.image must remain the editorial hero image`
    );
  }

  assert.equal(Object.keys(expectedPrimaryBrands).length, 133);
  assert.equal(Object.values(expectedPrimaryBrands).flat().length, 208);
  assert.deepEqual(actualPrimaryBrands, expectedPrimaryBrands);
  for (const slug of Object.keys(expectedPrimaryBrands)) assert.ok(articleBySlug.has(slug));
  assert.ok(
    Object.values(expectedPrimaryBrands).some((primaryBrands) => primaryBrands.length === 3),
    "the release gate must retain at least one three-brand relationship"
  );

  assert.deepEqual(buildBrandStaticParams(publishedProfiles), expectedSlugs.map((slug) => ({ slug })));
  assert.deepEqual(
    buildBrandCategoryStaticParams(publishedProfiles),
    expectedCategorySlugs.map((slug) => ({ slug }))
  );
  assert.deepEqual(validateBrandCategoryAssignments(loadedProfiles), []);
  assert.deepEqual(
    buildBrandSitemapEntries(publishedProfiles, "https://worldcleanbiz.com")
      .map(({ url }) => url),
    expectedSlugs.map((slug) => `https://worldcleanbiz.com/brands/${slug}`)
  );
  assert.deepEqual(
    sitemap()
      .map(({ url }) => url)
      .filter((url) => url.startsWith("https://worldcleanbiz.com/brands/")),
    [
      ...expectedSlugs.map((slug) => `https://worldcleanbiz.com/brands/${slug}`),
      ...expectedCategorySlugs.map((slug) => `https://worldcleanbiz.com/brands/${slug}`)
    ]
  );
  assert.deepEqual(
    buildBrandCategorySitemapEntries(publishedProfiles, "https://worldcleanbiz.com")
      .map(({ url }) => url),
    expectedCategorySlugs.map((slug) => `https://worldcleanbiz.com/brands/${slug}`)
  );
  assert.equal(publishedProfiles.some(({ slug }) => slug === "dolphin"), false);
  assert.equal(buildBrandStaticParams(publishedProfiles).some(({ slug }) => slug === "dolphin"), false);
});

test("all published brand profiles have local official logos and two to three local visuals", () => {
  const profiles = getBrandProfiles().filter((profile) => profile.status === "published");
  assert.equal(profiles.length, 64);

  for (const candidate of profiles) {
    assert.equal(candidate.status, "published");
    assert.match(candidate.logoImage, /^\/images\/brands\/[a-z0-9-]+\/logo\.webp$/);
    assert.equal(
      fs.existsSync(path.join(process.cwd(), "public", candidate.logoImage)),
      true,
      `${candidate.slug} logo must exist`
    );
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);
    for (const visual of candidate.contentVisuals) {
      assert.equal(
        fs.existsSync(path.join(process.cwd(), "public", visual.src)),
        true,
        `${candidate.slug} visual must exist: ${visual.src}`
      );
    }
  }
});

test("home-appliance batch three profiles use dedicated assets, article depth, and current entity boundaries", async () => {
  const newSlugs = ["beko", "kitchenaid", "whirlpool"];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.status, "published", `${slug} must be published`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);
    assert.ok(
      candidate.contentVisuals.every((visual) => visual.src.startsWith(`/images/brands/${slug}/`)),
      `${slug} must use dedicated content visuals`
    );

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);

    const relatedArticles = articles.filter(
      (article) => article.primaryBrands.includes(slug) || article.relatedBrands.includes(slug)
    );
    assert.ok(relatedArticles.length >= 3, `${slug} must have at least three article relationships`);
  }

  assert.match(profilesBySlug.get("whirlpool").ownership.summary, /Whirlpool Corporation/i);
  assert.match(profilesBySlug.get("whirlpool").ownership.summary, /Beko Europe.*licen[cs]/i);
  assert.match(profilesBySlug.get("kitchenaid").ownership.summary, /Whirlpool Corporation/i);
  assert.match(profilesBySlug.get("kitchenaid").legalEntityNote, /major.*countertop|countertop.*major/i);
  assert.match(profilesBySlug.get("beko").ownership.summary, /Beko Europe.*100%|100%.*Beko Europe/i);
  assert.match(profilesBySlug.get("beko").legalEntityNote, /Arçelik A\.Ş\./i);
});

test("home-appliance launch profiles have dedicated assets, article depth, and explicit identity boundaries", async () => {
  const newSlugs = [
    "samsung-home-appliances",
    "lg-home-appliances",
    "haier-home-appliances",
    "ge-appliances",
    "fisher-paykel"
  ];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.status, "published", `${slug} must be published`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);
    assert.ok(
      candidate.contentVisuals.every((visual) => visual.src.startsWith(`/images/brands/${slug}/`)),
      `${slug} must use dedicated content visuals`
    );

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);

    const relatedArticles = articles.filter(
      (article) => article.primaryBrands.includes(slug) || article.relatedBrands.includes(slug)
    );
    assert.ok(relatedArticles.length >= 3, `${slug} must have at least three article relationships`);
  }

  assert.match(profilesBySlug.get("samsung-home-appliances").ownership.summary, /Samsung Electronics/i);
  assert.match(profilesBySlug.get("lg-home-appliances").ownership.summary, /LG Electronics/i);
  assert.match(
    profilesBySlug.get("haier-home-appliances").ownership.summary,
    /Haier Smart Home.*Haier Group/i
  );
  assert.match(profilesBySlug.get("ge-appliances").legalEntityNote, /Haier US Appliance Solutions/i);
  assert.match(profilesBySlug.get("ge-appliances").ownership.summary, /license|licensed/i);
  assert.match(profilesBySlug.get("fisher-paykel").ownership.summary, /Haier/i);
  assert.match(profilesBySlug.get("fisher-paykel").legalEntityNote, /Fisher & Paykel Appliances Limited/i);
});

test("power-tool completion profiles use dedicated assets, article depth, and distinct identities", async () => {
  const slugs = [
    "bosch-power-tools",
    "craftsman",
    "kobalt",
    "skil",
    "hilti",
    "festool",
    "hikoki",
    "flex",
    "dremel",
    "metabo"
  ];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of slugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.status, "published", `${slug} must be published`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);
    assert.ok(
      candidate.contentVisuals.every(
        (visual) => visual.src.startsWith(`/images/brands/${slug}/`)
          && !visual.src.includes("global-power-tool-brands-reshaping-portfolios-image-01")
      ),
      `${slug} must use dedicated, relevant content visuals`
    );

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);
    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);

    const relatedArticles = articles.filter(
      (article) => article.primaryBrands.includes(slug) || article.relatedBrands.includes(slug)
    );
    assert.ok(relatedArticles.length >= 3, `${slug} must have at least three article relationships`);
  }

  const bosch = profilesBySlug.get("bosch-power-tools");
  const hikoki = profilesBySlug.get("hikoki");
  const metabo = profilesBySlug.get("metabo");
  assert.match(bosch.ownership.summary, /distinct from BSH/i);
  assert.match(hikoki.legalEntityNote, /Metabo is a distinct/i);
  assert.match(metabo.legalEntityNote, /Metabo HPT.*North America/i);
  assert.notEqual(hikoki.officialWebsite, metabo.officialWebsite);
});

test("sixth batch profiles use dedicated assets, article depth, and explicit identity boundaries", async () => {
  const newSlugs = [
    "aquabot",
    "black-decker",
    "eureka",
    "milwaukee",
    "oreck",
    "vax"
  ];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);

    assert.ok(
      articles.filter((article) => article.primaryBrands.includes(slug)).length >= 3,
      `${slug} must have at least three primary articles`
    );
  }

  assert.match(
    profilesBySlug.get("black-decker").ownership.summary,
    /Stanley Black & Decker/i
  );
  assert.match(profilesBySlug.get("eureka").ownership.summary, /Midea/i);
  assert.match(profilesBySlug.get("milwaukee").ownership.summary, /TTI|Techtronic/i);
  assert.match(profilesBySlug.get("vax").ownership.summary, /TTI|Techtronic/i);
  assert.match(profilesBySlug.get("oreck").ownership.summary, /TTI|Techtronic/i);
  assert.match(profilesBySlug.get("aquabot").ownership.summary, /Aquatron|BWT/i);
});

test("seventh batch profiles use dedicated assets, article depth, and explicit identity boundaries", async () => {
  const newSlugs = ["dirt-devil", "electrolux", "fluidra", "makita", "pentair", "stihl"];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);
    assert.ok(
      articles.filter((article) => article.primaryBrands.includes(slug)).length >= 3,
      `${slug} must have at least three primary articles`
    );
  }

  assert.match(profilesBySlug.get("dirt-devil").ownership.summary, /TTI|Techtronic/i);
  assert.match(profilesBySlug.get("electrolux").ownership.summary, /Electrolux/i);
  assert.match(profilesBySlug.get("fluidra").ownership.summary, /Fluidra/i);
  assert.match(profilesBySlug.get("pentair").ownership.summary, /Pentair/i);
  assert.match(profilesBySlug.get("stihl").ownership.summary, /STIHL/i);
  assert.match(profilesBySlug.get("makita").ownership.summary, /Makita/i);
});

test("fifth batch profiles use dedicated assets, article depth, and explicit identity boundaries", async () => {
  const newSlugs = ["aeg", "dewalt", "greenworks", "hayward", "polaris", "ryobi"];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);

    assert.ok(
      articles.filter((article) => article.primaryBrands.includes(slug)).length >= 3,
      `${slug} must have at least three primary articles`
    );
  }

  assert.match(profilesBySlug.get("aeg").ownership.summary, /Electrolux/i);
  assert.match(profilesBySlug.get("dewalt").ownership.summary, /Stanley Black & Decker/i);
  assert.match(profilesBySlug.get("greenworks").ownership.summary, /STIHL/i);
  assert.match(profilesBySlug.get("ryobi").ownership.summary, /TTI|Techtronic/i);
  assert.match(profilesBySlug.get("polaris").ownership.summary, /Fluidra|Zodiac/i);
  assert.match(profilesBySlug.get("hayward").ownership.summary, /listed|NYSE/i);
});

test("fourth batch profiles use dedicated assets, article depth, and explicit identity boundaries", async () => {
  const newSlugs = [
    "bosch-home-appliances",
    "midea",
    "nilfisk",
    "philips-home-appliances",
    "sunseeker",
    "worx"
  ];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);

    assert.ok(
      articles.filter((article) => article.primaryBrands.includes(slug)).length >= 3,
      `${slug} must have at least three primary articles`
    );
  }

  assert.match(profilesBySlug.get("bosch-home-appliances").ownership.summary, /BSH/i);
  assert.match(profilesBySlug.get("philips-home-appliances").ownership.summary, /Versuni/i);
  assert.match(profilesBySlug.get("midea").disclaimer, /Eureka/i);
  assert.match(profilesBySlug.get("sunseeker").legalEntityNote, /White Horse/i);
  assert.match(profilesBySlug.get("worx").ownership.summary, /Positec/i);
  assert.match(profilesBySlug.get("nilfisk").ownership.summary, /Freudenberg/i);
});

test("third batch profiles use dedicated assets, article depth, and explicit identity boundaries", async () => {
  const newSlugs = ["dji-romo", "eufy", "hoover", "karcher", "miele", "mova"];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );
  const articles = getInsights();

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(candidate.heroImage, new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`));
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3);

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);

    assert.ok(
      articles.filter((article) => article.primaryBrands.includes(slug)).length >= 3,
      `${slug} must have at least three primary articles`
    );
  }

  assert.match(
    profilesBySlug.get("dji-romo").disclaimer,
    /ROMO|cleaning/i,
    "DJI ROMO must remain scoped to the cleaning-robot business"
  );
  assert.match(
    profilesBySlug.get("hoover").ownership.summary,
    /North America/i,
    "Hoover ownership must identify the North American boundary"
  );
  assert.match(
    profilesBySlug.get("hoover").ownership.summary,
    /Europe|European/i,
    "Hoover ownership must identify the European boundary"
  );
});

test("second batch profiles use dedicated local logos, product heroes, and active competitor links", async () => {
  const newSlugs = [
    "beatbot",
    "husqvarna",
    "narwal",
    "segway-navimow",
    "shark",
    "wybot"
  ];
  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );

  for (const slug of newSlugs) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.logoImage, `/images/brands/${slug}/logo.webp`);
    assert.match(
      candidate.heroImage,
      new RegExp(`^/images/brands/${slug}/hero-.+\\.webp$`)
    );
    assert.match(candidate.logoSourceUrl, /^https:\/\//);
    assert.ok(
      candidate.contentVisuals.length >= 2 && candidate.contentVisuals.length <= 3,
      `${slug} must use two or three content visuals`
    );

    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(logoPath), true, `${slug} logo must exist`);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero must exist`);

    const logoMetadata = await sharp(logoPath).metadata();
    const heroMetadata = await sharp(heroPath).metadata();
    assert.equal(logoMetadata.format, "webp", `${slug} logo format`);
    assert.equal(logoMetadata.hasAlpha, true, `${slug} logo transparency`);
    assert.equal(heroMetadata.format, "webp", `${slug} hero format`);
    assert.equal(heroMetadata.width, 1600, `${slug} hero width`);
    assert.equal(heroMetadata.height, 1000, `${slug} hero height`);
  }

  const expectedRoutes = {
    shark: "/brands/shark",
    wybot: "/brands/wybot",
    beatbot: "/brands/beatbot",
    husqvarna: "/brands/husqvarna",
    "segway-navimow": "/brands/segway-navimow"
  };
  const publishedSlugs = new Set(getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug));
  const references = buildBrandCompetitorReferences(
    Object.keys(expectedRoutes),
    publishedSlugs
  );

  assert.deepEqual(
    Object.fromEntries(references.map(({ slug, href }) => [slug, href])),
    expectedRoutes
  );
});

test("the first four founder profiles use complete local portrait assets without table duplication", async () => {
  const expectedPortraits = {
    aiper: {
      name: "Richard Wang",
      src: "/images/brands/aiper/founder-richard-wang.webp"
    },
    dreame: {
      name: "Yu Hao",
      src: "/images/brands/dreame/founder-yu-hao.webp"
    },
    dyson: {
      name: "Sir James Dyson",
      src: "/images/brands/dyson/founder-james-dyson.webp"
    },
    mammotion: {
      name: "Jidong (Jayden) Wei",
      src: "/images/brands/mammotion/founder-jidong-wei.webp"
    }
  };
  const profileBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );

  for (const [slug, expected] of Object.entries(expectedPortraits)) {
    const candidate = profileBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);

    const { featuredLeader, tableLeaders } = partitionFeaturedLeadership(
      candidate.leadership
    );
    assert.ok(featuredLeader, `${slug} must expose one featured founder`);
    assert.equal(featuredLeader.name, expected.name);
    assert.equal(featuredLeader.portrait.src, expected.src);
    assert.ok(featuredLeader.portrait.alt.includes(expected.name));
    assert.ok(featuredLeader.portrait.credit.trim().length > 0);
    assert.match(featuredLeader.portrait.sourceUrl, /^https:\/\//);
    assert.equal(
      tableLeaders.some((leader) => leader.name === featuredLeader.name),
      false,
      `${slug} featured founder must not be repeated in leadership table rows`
    );

    const portraitPath = path.join(
      process.cwd(),
      "public",
      featuredLeader.portrait.src
    );
    assert.equal(fs.existsSync(portraitPath), true, `${slug} portrait must exist`);
    const metadata = await sharp(portraitPath).metadata();
    assert.equal(metadata.format, "webp", `${slug} portrait must be WebP`);
    assert.equal(metadata.width, 720, `${slug} portrait width`);
    assert.equal(metadata.height, 840, `${slug} portrait height`);
  }
});

test("verified founders and current leaders use complete local portrait assets without table duplication", async () => {
  const expectedPortraits = {
    ecovacs: {
      name: "Qian Dongqi",
      src: "/images/brands/ecovacs/founder-qian-dongqi.webp"
    },
    irobot: {
      name: "Gary Cohen",
      src: "/images/brands/irobot/leader-gary-cohen.webp"
    },
    maytronics: {
      name: "Rafi Benami",
      src: "/images/brands/maytronics/leader-rafi-benami.webp"
    },
    roborock: {
      name: "Chang Jing",
      src: "/images/brands/roborock/founder-chang-jing.webp"
    }
  };
  const profileBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );

  for (const [slug, expected] of Object.entries(expectedPortraits)) {
    const candidate = profileBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);

    const { featuredLeader, tableLeaders } = partitionFeaturedLeadership(
      candidate.leadership
    );
    assert.ok(featuredLeader, `${slug} must expose one featured leader`);
    assert.equal(featuredLeader.name, expected.name);
    assert.equal(featuredLeader.portrait.src, expected.src);
    assert.ok(featuredLeader.portrait.alt.includes(expected.name));
    assert.ok(featuredLeader.portrait.credit.trim().length > 0);
    assert.match(featuredLeader.portrait.sourceUrl, /^https:\/\//);
    assert.equal(
      tableLeaders.some((leader) => leader.name === featuredLeader.name),
      false,
      `${slug} featured leader must not be repeated in leadership table rows`
    );

    const portraitPath = path.join(
      process.cwd(),
      "public",
      featuredLeader.portrait.src
    );
    assert.equal(fs.existsSync(portraitPath), true, `${slug} portrait must exist`);
    const metadata = await sharp(portraitPath).metadata();
    assert.equal(metadata.format, "webp", `${slug} portrait must be WebP`);
    assert.equal(metadata.width, 720, `${slug} portrait width`);
    assert.equal(metadata.height, 840, `${slug} portrait height`);
  }
});

test("Tineco uses a verified founder portrait without duplicating the leadership table", async () => {
  const candidate = getBrandProfiles().find(({ slug }) => slug === "tineco");
  assert.ok(candidate, "tineco profile must exist");

  const { featuredLeader, tableLeaders } = partitionFeaturedLeadership(
    candidate.leadership
  );
  assert.ok(featuredLeader, "tineco must expose one featured founder");
  assert.equal(featuredLeader.name, "Qian Dongqi");
  assert.equal(
    featuredLeader.portrait.src,
    "/images/brands/tineco/founder-qian-dongqi.webp"
  );
  assert.ok(featuredLeader.portrait.alt.includes("Qian Dongqi"));
  assert.ok(featuredLeader.portrait.credit.trim().length > 0);
  assert.match(featuredLeader.portrait.sourceUrl, /^https:\/\//);
  assert.equal(
    tableLeaders.some((leader) => leader.name === featuredLeader.name),
    false,
    "tineco featured founder must not be repeated in leadership table rows"
  );

  const portraitPath = path.join(
    process.cwd(),
    "public",
    featuredLeader.portrait.src
  );
  assert.equal(fs.existsSync(portraitPath), true, "tineco portrait must exist");
  const metadata = await sharp(portraitPath).metadata();
  assert.equal(metadata.format, "webp", "tineco portrait must be WebP");
  assert.equal(metadata.width, 720, "tineco portrait width");
  assert.equal(metadata.height, 840, "tineco portrait height");
});

test("Tineco uses a dedicated official product photo for its brand hero", async () => {
  const candidate = getBrandProfiles().find(({ slug }) => slug === "tineco");
  assert.ok(candidate, "tineco profile must exist");
  assert.equal(
    candidate.heroImage,
    "/images/brands/tineco/hero-floor-one-s9-artist-steam.webp"
  );
  assert.match(candidate.heroImageAlt, /Tineco FLOOR ONE S9 Artist Steam/i);

  const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
  assert.equal(fs.existsSync(heroPath), true, "tineco hero image must exist");
  const metadata = await sharp(heroPath).metadata();
  assert.equal(metadata.format, "webp", "tineco hero image must be WebP");
  assert.equal(metadata.width, 1300, "tineco hero image width");
  assert.equal(metadata.height, 1000, "tineco hero image height");
});

test("remaining brand profiles use dedicated high-resolution product heroes", async () => {
  const expectedHeroes = {
    bissell: {
      src: "/images/brands/bissell/hero-crosswave-all-in-one.webp",
      alt: /BISSELL CrossWave All-in-One/i
    },
    dyson: {
      src: "/images/brands/dyson/hero-clean-wash-hygiene.webp",
      alt: /Dyson Clean\+Wash Hygiene/i
    },
    ecovacs: {
      src: "/images/brands/ecovacs/hero-deebot-x12-omnicyclone.webp",
      alt: /ECOVACS DEEBOT X12 OmniCyclone/i
    },
    irobot: {
      src: "/images/brands/irobot/hero-roomba-mini.webp",
      alt: /iRobot Roomba Mini/i
    },
    mammotion: {
      src: "/images/brands/mammotion/hero-robotic-mower-portfolio.webp",
      alt: /Mammotion robotic mower portfolio/i
    },
    roborock: {
      src: "/images/brands/roborock/hero-saros-z70.webp",
      alt: /Roborock Saros Z70/i
    }
  };

  const profilesBySlug = new Map(
    getBrandProfiles().map((candidate) => [candidate.slug, candidate])
  );

  for (const [slug, expected] of Object.entries(expectedHeroes)) {
    const candidate = profilesBySlug.get(slug);
    assert.ok(candidate, `${slug} profile must exist`);
    assert.equal(candidate.heroImage, expected.src, `${slug} hero path`);
    assert.match(candidate.heroImageAlt, expected.alt, `${slug} hero alt`);

    const heroPath = path.join(process.cwd(), "public", candidate.heroImage);
    assert.equal(fs.existsSync(heroPath), true, `${slug} hero image must exist`);

    const metadata = await sharp(heroPath).metadata();
    assert.equal(metadata.format, "webp", `${slug} hero image must be WebP`);
    assert.ok(metadata.width >= 1200, `${slug} hero image must be at least 1200 px wide`);
    assert.ok(metadata.height >= 675, `${slug} hero image must be at least 675 px tall`);
  }
});

test("all local official logo files decode as transparent WebP images", async () => {
  for (const candidate of getBrandProfiles()) {
    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    assert.equal(fs.existsSync(logoPath), true, `${candidate.slug} logo must exist`);

    const metadata = await sharp(logoPath).metadata();
    assert.equal(metadata.format, "webp", `${candidate.slug} logo must be WebP`);
    assert.equal(metadata.hasAlpha, true, `${candidate.slug} logo must preserve transparency`);

    const decoded = await sharp(logoPath).raw().toBuffer({ resolveWithObject: true });
    assert.ok(decoded.data.length > 0, `${candidate.slug} logo must decode to pixels`);
    assert.ok(decoded.info.width >= 600, `${candidate.slug} logo must be at least 600 px wide`);
    assert.ok(decoded.info.height > 0, `${candidate.slug} logo must have a positive height`);
    const alphaChannelIndex = decoded.info.channels - 1;
    assert.equal(
      decoded.data.some(
        (value, index) => index % decoded.info.channels === alphaChannelIndex && value < 255
      ),
      true,
      `${candidate.slug} logo must contain transparent pixels`
    );
  }
});

test("all local official logos occupy at least thirty percent of their canvas width", async () => {
  for (const candidate of getBrandProfiles()) {
    const logoPath = path.join(process.cwd(), "public", candidate.logoImage);
    const decoded = await sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alphaChannelIndex = decoded.info.channels - 1;
    let minimumVisibleX = decoded.info.width;
    let maximumVisibleX = -1;

    for (let y = 0; y < decoded.info.height; y += 1) {
      for (let x = 0; x < decoded.info.width; x += 1) {
        const alphaIndex =
          (y * decoded.info.width + x) * decoded.info.channels + alphaChannelIndex;
        if (decoded.data[alphaIndex] > 0) {
          minimumVisibleX = Math.min(minimumVisibleX, x);
          maximumVisibleX = Math.max(maximumVisibleX, x);
        }
      }
    }

    const visibleWidth = maximumVisibleX >= minimumVisibleX
      ? maximumVisibleX - minimumVisibleX + 1
      : 0;
    const visibleWidthRatio = visibleWidth / decoded.info.width;
    assert.ok(
      visibleWidthRatio >= 0.3,
      `${candidate.slug} logo visible width must cover at least 30% of its canvas; actual ${(visibleWidthRatio * 100).toFixed(1)}%`
    );
  }
});

test("loads JSON profiles, groups articles without duplicates, and filters draft profiles", () => {
  const originalDirectory = process.cwd();
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "wcb-brands-"));
  const brandsDirectory = path.join(temporaryDirectory, "content", "brands");
  fs.mkdirSync(brandsDirectory, { recursive: true });

  const draftProfile = {
    ...profile,
    status: "draft",
    slug: "draft-brand",
    name: "Draft Brand"
  };
  const malformedSourceProfile = {
    ...profile,
    slug: "malformed-source-brand",
    name: "Malformed Source Brand",
    sources: profile.sources.map((source, index) => index === 0 ? {
      ...source,
      title: "",
      accessedAt: "not-a-date"
    } : source)
  };
  const draftArticles = articles.map((article) => ({
    ...article,
    slug: `draft-${article.slug}`,
    primaryBrands: ["draft-brand"],
    relatedBrands: []
  }));
  const malformedSourceArticles = articles.map((article) => ({
    ...article,
    slug: `malformed-${article.slug}`,
    primaryBrands: ["malformed-source-brand"],
    relatedBrands: []
  }));

  try {
    fs.writeFileSync(path.join(brandsDirectory, "sample-brand.json"), JSON.stringify(profile));
    fs.writeFileSync(path.join(brandsDirectory, "draft-brand.json"), JSON.stringify(draftProfile));
    fs.writeFileSync(path.join(brandsDirectory, "malformed-source-brand.json"), JSON.stringify(malformedSourceProfile));
    fs.writeFileSync(path.join(brandsDirectory, "ignored.txt"), JSON.stringify({ name: "Ignored" }));
    process.chdir(temporaryDirectory);

    assert.deepEqual(getBrandProfiles().map(({ name }) => name), ["Draft Brand", "Malformed Source Brand", "Sample Brand"]);
    assert.deepEqual(
      getPublishedBrandProfiles([...articles, ...draftArticles, ...malformedSourceArticles]).map(({ slug }) => slug),
      ["sample-brand"]
    );

    const pageData = getBrandPageData("sample-brand", articles);
    assert.ok(pageData);
    assert.deepEqual(
      pageData.primaryArticles.map(({ slug }) => slug),
      [
        "sample-brand-product-update",
        "sample-brand-market-update",
        "sample-brand-supply-chain-update"
      ]
    );
    assert.deepEqual(pageData.relatedArticles, []);
  } finally {
    process.chdir(originalDirectory);
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test("identifies the malformed JSON filename when loading profiles", () => {
  const originalDirectory = process.cwd();
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "wcb-brands-"));
  const brandsDirectory = path.join(temporaryDirectory, "content", "brands");
  fs.mkdirSync(brandsDirectory, { recursive: true });

  try {
    fs.writeFileSync(path.join(brandsDirectory, "broken.json"), "{");
    process.chdir(temporaryDirectory);

    assert.throws(() => getBrandProfiles(), /broken\.json/);
  } finally {
    process.chdir(originalDirectory);
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});
