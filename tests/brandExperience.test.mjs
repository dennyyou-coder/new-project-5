import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildBrandDirectorySchemas,
  buildBrandPageSchemas
} from "../lib/brands.ts";

const read = (relativePath) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

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
  ownership: { summary: "Sample Brand Holdings Ltd. controls the brand." },
  leadership: [],
  productPortfolio: [{ name: "Robot vacuums", positioning: "Premium residential floorcare" }],
  manufacturingSupplyChain: ["Verified manufacturing statement."],
  marketsChannels: ["Distributor and ecommerce channels."],
  competitivePosition: {
    summary: "WCB assessment based on verified company disclosures.",
    competitorSlugs: []
  },
  developments: [],
  sources: [
    {
      id: "source-1",
      title: "Company source",
      publisher: "Sample Brand",
      url: "https://example.com/company",
      accessedAt: "2026-07-29"
    }
  ],
  publishedAt: "2026-07-29T12:00:00+08:00",
  lastVerified: "2026-07-29",
  lastModified: "2026-07-29T12:00:00+08:00"
};

test("brand directory schemas describe the collection, profiles, and breadcrumb", () => {
  const schemas = buildBrandDirectorySchemas([profile], "https://worldcleanbiz.com");

  assert.deepEqual(schemas.map((schema) => schema["@type"]), [
    "CollectionPage",
    "ItemList",
    "BreadcrumbList"
  ]);
  assert.deepEqual(schemas[1].itemListElement, [{
    "@type": "ListItem",
    position: 1,
    name: "Sample Brand",
    url: "https://worldcleanbiz.com/brands/sample-brand"
  }]);
});

test("brand detail schemas use a WebPage about a separate verified organization node", () => {
  const schemas = buildBrandPageSchemas({
    profile,
    primaryArticles: [],
    relatedArticles: []
  }, "https://worldcleanbiz.com");

  assert.deepEqual(schemas.map((schema) => schema["@type"]), [
    "WebPage",
    "Organization",
    "BreadcrumbList"
  ]);
  assert.deepEqual(schemas[0].about, { "@id": "#brand" });
  assert.deepEqual(schemas[1], {
    "@context": "https://schema.org",
    "@id": "#brand",
    "@type": "Organization",
    name: "Sample Brand",
    legalName: "Sample Brand Holdings Ltd.",
    url: "https://example.com"
  });
});

test("brand directory route exposes one canonical collection with links for published profiles", () => {
  const source = read("app/brands/page.tsx");

  assert.match(source, /alternates:\s*\{\s*canonical:\s*"\/brands"\s*\}/);
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.match(source, /buildBrandDirectorySchemas\(profiles,\s*siteUrl\)/);
  assert.match(source, /getPublishedBrandProfiles\(articles\)/);
  assert.match(source, /profiles\.map\(\(profile\)\s*=>\s*\(/);
  assert.match(source, /<BrandDirectoryCard\s+key=\{profile\.slug\}\s+profile=\{profile\}/);
  assert.match(source, /href="\/blog"/);
  assert.match(source, /Cleaning Industry Brand Intelligence/);
});

test("brand detail route rejects invalid slugs and exposes static metadata and schemas", () => {
  const source = read("app/brands/[slug]/page.tsx");

  assert.match(source, /export const dynamicParams = false/);
  assert.match(source, /export function generateStaticParams\(\)/);
  assert.match(source, /export async function generateMetadata/);
  assert.match(source, /if \(!data\) return \{\}/);
  assert.match(source, /if \(!data\) notFound\(\)/);
  assert.match(source, /buildBrandPageSchemas\(data,\s*siteUrl\)/);
  assert.match(source, /Company Profile, Ownership, Products & Strategy/);

  const componentOrder = [
    "BrandHero",
    "BrandSections",
    "BrandTimeline",
    "BrandArticles",
    "BrandSources"
  ].map((name) => source.indexOf(`<${name}`));
  assert.ok(componentOrder.every((position) => position >= 0));
  assert.deepEqual(componentOrder, [...componentOrder].sort((a, b) => a - b));
});

test("brand experience shows independent positioning, disclaimer, sources, and update dates", () => {
  const brandSources = [
    read("app/brands/page.tsx"),
    read("app/brands/[slug]/page.tsx"),
    read("components/brands/BrandHero.tsx"),
    read("components/brands/BrandSources.tsx")
  ].join("\n");

  assert.doesNotMatch(brandSources, /ProfilePage/);
  assert.match(brandSources, /Independent Brand Intelligence/);
  assert.match(brandSources, /\{profile\.disclaimer\}/);
  assert.match(brandSources, /Sources/);
  assert.match(brandSources, /Accessed/);
  assert.match(brandSources, /First published/);
  assert.match(brandSources, /Last verified/);
  assert.match(brandSources, /Last material modification/);
});
