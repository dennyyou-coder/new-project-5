import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import {
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

test("the release gate validates the exact ten published profiles and approved article relationships", () => {
  const expectedSlugs = [
    "aiper",
    "bissell",
    "dreame",
    "dyson",
    "ecovacs",
    "irobot",
    "mammotion",
    "maytronics",
    "roborock",
    "tineco"
  ];
  const expectedPrimaryBrands = {
    "aiper-fluidra-pool-robotics-alliance": ["aiper"],
    "aiper-vs-wybot-fluidra-wybotics": ["aiper"],
    "bissell-crosswave-hard-floor-washer-logic": ["bissell"],
    "bissell-robot-vacuums-flexclean-strategy": ["bissell"],
    "commercial-robotic-mower-market-navimow-mammotion": ["mammotion"],
    "dolphin-vs-aiper-maytronics-fluidra": ["maytronics", "aiper"],
    "dreame-new-disruptor-in-vacuums": ["dreame"],
    "dreame-rise-to-10-billion-in-five-years": ["dreame"],
    "dyson-at-a-crossroads": ["dyson"],
    "ecovacs-2018-annual-report-signals": ["ecovacs"],
    "ecovacs-at-a-crossroads": ["ecovacs"],
    "ecovacs-invests-in-battery-cell-factory": ["ecovacs"],
    "irobot-decline-and-the-new-robot-vacuum-order": ["irobot"],
    "irobot-financial-crisis": ["irobot"],
    "is-dreame-owned-by-xiaomi": ["dreame"],
    "is-roborock-owned-by-xiaomi": ["roborock"],
    "mammotion-luba-vs-yuka-robot-mowers": ["mammotion"],
    "maytronics-robotic-pool-cleaner-reinvention": ["maytronics"],
    "roborock-channel-shift-online-to-offline-experience": ["roborock"],
    "roborock-ipo-prospectus-signals": ["roborock"],
    "tineco-lacks-innovation": ["tineco"],
    "tineco-vs-bissell-crosswave-floor-washers": ["tineco", "bissell"],
    "where-are-dyson-vacuums-made": ["dyson"],
    "who-makes-dolphin-pool-cleaners-maytronics": ["maytronics"],
    "who-makes-luba-robot-mowers-mammotion-agilex": ["mammotion"],
    "who-owns-aiper-fluidra-stake": ["aiper"],
    "who-owns-bissell-family-sanitaire": ["bissell"],
    "who-owns-dyson-james-dyson-singapore-manufacturing": ["dyson"],
    "who-owns-irobot-roomba-picea-robotics": ["irobot"],
    "who-owns-tineco-ecovacs-group": ["tineco"]
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
  assert.equal(loadedProfiles.length, 10);
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

  assert.equal(Object.keys(expectedPrimaryBrands).length, 30);
  assert.equal(Object.values(expectedPrimaryBrands).flat().length, 32);
  assert.deepEqual(actualPrimaryBrands, expectedPrimaryBrands);
  for (const slug of Object.keys(expectedPrimaryBrands)) assert.ok(articleBySlug.has(slug));
  assert.deepEqual(
    Object.entries(expectedPrimaryBrands)
      .filter(([, primaryBrands]) => primaryBrands.length === 2)
      .map(([slug]) => slug)
      .sort(),
    [
      "dolphin-vs-aiper-maytronics-fluidra",
      "tineco-vs-bissell-crosswave-floor-washers"
    ]
  );

  assert.deepEqual(buildBrandStaticParams(publishedProfiles), expectedSlugs.map((slug) => ({ slug })));
  assert.deepEqual(
    buildBrandSitemapEntries(publishedProfiles, "https://worldcleanbiz.com")
      .map(({ url }) => url),
    expectedSlugs.map((slug) => `https://worldcleanbiz.com/brands/${slug}`)
  );
  assert.deepEqual(
    sitemap()
      .map(({ url }) => url)
      .filter((url) => url.startsWith("https://worldcleanbiz.com/brands/")),
    expectedSlugs.map((slug) => `https://worldcleanbiz.com/brands/${slug}`)
  );
  assert.equal(publishedProfiles.some(({ slug }) => slug === "dolphin"), false);
  assert.equal(buildBrandStaticParams(publishedProfiles).some(({ slug }) => slug === "dolphin"), false);
});

test("all published brand profiles have local official logos and two to three local visuals", () => {
  const profiles = getBrandProfiles();
  assert.equal(profiles.length, 10);

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
