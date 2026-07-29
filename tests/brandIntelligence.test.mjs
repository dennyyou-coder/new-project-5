import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  getBrandPageData,
  getBrandProfiles,
  getPublishedBrandProfiles,
  validateBrandProfile
} from "../lib/brands.ts";

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
  ownership: { summary: "Sample Brand Holdings Ltd. controls the brand." },
  leadership: [{ name: "Alex Example", role: "Founder" }],
  productPortfolio: [{ name: "Robot vacuums", positioning: "Premium residential floorcare" }],
  manufacturingSupplyChain: ["Manufacturing statement verified against the cited company source."],
  marketsChannels: ["Direct ecommerce and distributor channels in named markets."],
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

test("accepts a complete published brand profile", () => {
  assert.deepEqual(validateBrandProfile(profile, articles), []);
});

test("requires three unique valid HTTP(S) sources", () => {
  const incompleteProfile = structuredClone(profile);
  incompleteProfile.sources = incompleteProfile.sources.slice(0, 2);

  assert.match(
    validateBrandProfile(incompleteProfile, articles).join("\n"),
    /at least three unique valid HTTP\(S\) sources/i
  );
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

test("rejects profile and development dates that cannot be parsed", () => {
  const invalidProfile = structuredClone(profile);
  invalidProfile.lastVerified = "not-a-date";
  invalidProfile.developments[0].date = "also-not-a-date";

  const errors = validateBrandProfile(invalidProfile, articles).join("\n");
  assert.match(errors, /lastVerified.*valid date/i);
  assert.match(errors, /development.*valid date/i);
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
  const draftArticles = articles.map((article) => ({
    ...article,
    slug: `draft-${article.slug}`,
    primaryBrands: ["draft-brand"],
    relatedBrands: []
  }));

  try {
    fs.writeFileSync(path.join(brandsDirectory, "sample-brand.json"), JSON.stringify(profile));
    fs.writeFileSync(path.join(brandsDirectory, "draft-brand.json"), JSON.stringify(draftProfile));
    fs.writeFileSync(path.join(brandsDirectory, "ignored.txt"), JSON.stringify({ name: "Ignored" }));
    process.chdir(temporaryDirectory);

    assert.deepEqual(getBrandProfiles().map(({ name }) => name), ["Draft Brand", "Sample Brand"]);
    assert.deepEqual(
      getPublishedBrandProfiles([...articles, ...draftArticles]).map(({ slug }) => slug),
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
