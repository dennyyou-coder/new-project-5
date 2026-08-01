import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import test from "node:test";
import {
  buildBrandCompetitorReferences,
  buildBrandDirectorySchemas,
  buildBrandPageSchemas,
  sortBrandDevelopmentsNewestFirst
} from "../lib/brands.ts";
import { formatBrandDate } from "../lib/brandDates.ts";

const read = (relativePath) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

const readCssBlock = (source, marker) => {
  const markerPosition = source.indexOf(marker);
  assert.ok(markerPosition >= 0, `missing CSS block: ${marker}`);
  const openingBrace = source.indexOf("{", markerPosition);
  let depth = 0;

  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(markerPosition, index + 1);
  }

  assert.fail(`unclosed CSS block: ${marker}`);
};

const parseHexColor = (value) => {
  const normalized = value.trim().replace(/^#/, "");
  assert.match(normalized, /^[0-9a-f]{6}$/i);
  return [0, 2, 4].map((offset) =>
    Number.parseInt(normalized.slice(offset, offset + 2), 16)
  );
};

const relativeLuminance = (rgb) =>
  rgb
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    )
    .reduce(
      (luminance, channel, index) =>
        luminance + channel * [0.2126, 0.7152, 0.0722][index],
      0
    );

const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(parseHexColor(foreground));
  const backgroundLuminance = relativeLuminance(parseHexColor(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

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
  contentVisuals: [],
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
    url: "https://example.com",
    logo: "https://worldcleanbiz.com/images/brands/sample-brand/logo.webp"
  });
});

test("brand detail schema omits legalName when the profile only has a legal entity scope note", () => {
  const multiEntityProfile = structuredClone(profile);
  delete multiEntityProfile.legalName;
  multiEntityProfile.legalEntityNote =
    "The consumer brand spans multiple legal entities; entity scope is stated in ownership.";

  const schemas = buildBrandPageSchemas({
    profile: multiEntityProfile,
    primaryArticles: [],
    relatedArticles: []
  }, "https://worldcleanbiz.com");

  assert.deepEqual(schemas[1], {
    "@context": "https://schema.org",
    "@id": "#brand",
    "@type": "Organization",
    name: "Sample Brand",
    url: "https://example.com",
    logo: "https://worldcleanbiz.com/images/brands/sample-brand/logo.webp"
  });
});

test("brand detail schema trims a valid legal name before emitting JSON-LD", () => {
  const paddedProfile = structuredClone(profile);
  paddedProfile.legalName = "  Sample Brand Holdings Ltd.  ";

  const schemas = buildBrandPageSchemas({
    profile: paddedProfile,
    primaryArticles: [],
    relatedArticles: []
  }, "https://worldcleanbiz.com");

  assert.equal(schemas[1].legalName, "Sample Brand Holdings Ltd.");
});

test("brand developments sort by parsed timestamps instead of lexical date order", () => {
  const developments = [
    {
      date: "2026-07-01T01:00:00+02:00",
      title: "Earlier absolute time",
      summary: "Lexically later but chronologically earlier.",
      sourceIds: ["source-1"]
    },
    {
      date: "2026-07-01T00:00:00Z",
      title: "Later absolute time",
      summary: "Lexically earlier but chronologically later.",
      sourceIds: ["source-1"]
    }
  ];

  assert.deepEqual(
    sortBrandDevelopmentsNewestFirst(developments).map(({ title }) => title),
    ["Later absolute time", "Earlier absolute time"]
  );
  assert.deepEqual(
    developments.map(({ title }) => title),
    ["Earlier absolute time", "Later absolute time"]
  );
});

test("brand date output preserves source precision and the Shanghai calendar date", () => {
  assert.equal(formatBrandDate("2026"), "2026");
  assert.equal(formatBrandDate("2026-07"), "July 2026");
  assert.equal(formatBrandDate("2026-07-30"), "Jul 30, 2026");
  assert.equal(formatBrandDate("2026-07-30", "long"), "July 30, 2026");
  assert.equal(
    formatBrandDate("2026-07-30T00:00:00+08:00"),
    "Jul 30, 2026"
  );
});

test("all date-bearing brand components use the shared precision-preserving formatter", () => {
  const hero = read("components/brands/BrandHero.tsx");
  const timeline = read("components/brands/BrandTimeline.tsx");
  const sources = read("components/brands/BrandSources.tsx");

  for (const source of [hero, timeline, sources]) {
    assert.match(source, /formatBrandDate/);
    assert.doesNotMatch(source, /new Intl\.DateTimeFormat/);
  }
});

test("competitor references only add hrefs for confirmed published profile slugs", () => {
  assert.deepEqual(
    buildBrandCompetitorReferences(
      ["published-brand", "draft-brand", "invalid-brand", "missing-brand"],
      new Set(["published-brand"])
    ),
    [
      { slug: "published-brand", href: "/brands/published-brand" },
      { slug: "draft-brand" },
      { slug: "invalid-brand" },
      { slug: "missing-brand" }
    ]
  );
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

test("brand directory groups profiles below each product-category introduction", () => {
  const source = read("app/brands/page.tsx");

  assert.match(source, /categories\.map\(\(data(?:,\s*index)?\)\s*=>\s*\(/);
  assert.match(source, /brand-category-list/);
  assert.match(source, /data\.profiles\.map\(\(profile\)\s*=>\s*\(/);
  assert.match(source, /<BrandDirectoryCard\s+key=\{profile\.slug\}\s+profile=\{profile\}/);
  assert.doesNotMatch(source, /<BrandCategoryCard\b/);
  assert.doesNotMatch(source, /Browse All Verified Brand Profiles/);
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
  assert.match(source, /getPublishedBrandProfiles\(articles\)/);
  assert.match(source, /allowedCompetitorSlugs=\{publishedBrandSlugs\}/);

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

test("brand hero normalizes the available legal entity scope", () => {
  const hero = read("components/brands/BrandHero.tsx");

  assert.match(
    hero,
    /const legalName = normalizeOptionalBrandText\(profile\.legalName\)/
  );
  assert.match(
    hero,
    /const legalEntityNote = normalizeOptionalBrandText\(profile\.legalEntityNote\)/
  );
  assert.match(
    hero,
    /const legalEntityScope = legalName \|\| legalEntityNote/
  );
  assert.doesNotMatch(hero, /\{profile\.(?:legalName|legalEntityNote) \?/);
});

test("brand hero separates official identity from editorial cover and renders key facts", () => {
  const hero = read("components/brands/BrandHero.tsx");

  assert.match(hero, /<BrandLogo\s+profile=\{profile\}\s+variant="hero"/);
  assert.match(hero, /profile\.heroImage/);
  assert.match(hero, /caption="Key facts"/);
  [
    "Legal entity scope",
    "Ownership type",
    "Headquarters",
    "Founded",
    "Official website",
    "Last verified"
  ].forEach((label) => assert.match(hero, new RegExp(label)));
  assert.doesNotMatch(hero, /<dl className="brand-snapshot-grid"/);
});

test("brand visual primitives preserve logo geometry and semantic figures", () => {
  const logo = read("components/brands/BrandLogo.tsx");
  const visual = read("components/brands/BrandVisual.tsx");
  const table = read("components/brands/BrandDataTable.tsx");

  assert.match(logo, /variant:\s*"card"\s*\|\s*"hero"/);
  assert.match(logo, /src=\{profile\.logoImage\}/);
  assert.match(logo, /alt=\{profile\.logoImageAlt\}/);
  assert.match(visual, /<figure/);
  assert.match(visual, /<figcaption>/);
  assert.match(visual, /className="brand-visual__eyebrow"/);
  assert.match(visual, /width=\{1600\}/);
  assert.match(visual, /height=\{900\}/);
  assert.match(table, /<table/);
  assert.match(table, /<caption/);
  assert.match(table, /scope="col"/);
  assert.match(table, /data-label=/);
});

test("brand directory cards use official logos instead of editorial hero images", () => {
  const card = read("components/brands/BrandDirectoryCard.tsx");

  assert.match(card, /<BrandLogo\s+profile=\{profile\}\s+variant="card"/);
  assert.match(card, /categories\.slice\(0,\s*3\)/);
  assert.doesNotMatch(card, /profile\.heroImage/);
  assert.doesNotMatch(card, /profile\.heroImageAlt/);
  assert.equal((card.match(/<Link\b/g) || []).length, 1);
});

test("brand data table caption is visually hidden without leaving the accessibility tree", () => {
  const table = read("components/brands/BrandDataTable.tsx");

  assert.match(table, /const visuallyHiddenCaptionStyle:\s*CSSProperties\s*=/);
  assert.match(table, /position:\s*"absolute"/);
  assert.match(table, /width:\s*"1px"/);
  assert.match(table, /height:\s*"1px"/);
  assert.match(table, /margin:\s*"-1px"/);
  assert.match(table, /overflow:\s*"hidden"/);
  assert.match(table, /clip:\s*"rect\(0, 0, 0, 0\)"/);
  assert.match(table, /clipPath:\s*"inset\(50%\)"/);
  assert.match(table, /whiteSpace:\s*"nowrap"/);
  assert.match(table, /border:\s*0/);
  assert.match(
    table,
    /<caption style=\{visuallyHiddenCaptionStyle\}>\{caption\}<\/caption>/
  );
  assert.doesNotMatch(table, /<caption[^>]*(?:hidden|display:\s*"none")/);
});

test("brand sections pair structured tables with each configured visual placement", () => {
  const sections = read("components/brands/BrandSections.tsx");

  assert.match(sections, /selectBrandContentVisuals\(profile\.contentVisuals\)/);
  assert.match(sections, /partitionFeaturedLeadership\(\s*profile\.leadership\s*\)/);
  assert.match(sections, /<BrandFounderCard leader=\{featuredLeader\}/);
  assert.match(sections, /buildLeadershipRows\(tableLeaders\)/);
  [
    "ownership",
    "portfolio",
    "operations",
    "competition"
  ].forEach((placement) => {
    assert.match(
      sections,
      new RegExp(`visualByPlacement\\.get\\("${placement}"\\)`)
    );
  });
  assert.match(sections, /caption="Leadership"/);
  assert.match(sections, /caption="Product portfolio"/);
  assert.match(sections, /caption="Manufacturing and supply-chain evidence"/);
  assert.match(sections, /caption="Markets and channels evidence"/);
  assert.match(sections, /buyerRelevance/);
  assert.match(sections, /buyerCheck/);
  assert.match(sections, /className="brand-competitor-links"/);
  assert.doesNotMatch(sections, /function TextList/);
  assert.doesNotMatch(sections, /guides-category-grid brand-section-grid/);
});

test("brand section helpers keep first unique visuals and provide an empty-leadership row", async () => {
  let helpers;

  try {
    helpers = await import(
      "../components/brands/brandSectionData.ts"
    );
  } catch (error) {
    if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
  }

  assert.equal(typeof helpers?.selectBrandContentVisuals, "function");
  assert.equal(typeof helpers?.buildLeadershipRows, "function");
  assert.equal(typeof helpers?.partitionFeaturedLeadership, "function");
  assert.equal(typeof helpers?.getLeadershipProfileLabel, "function");

  const visual = (placement, src) => ({
    placement,
    src,
    alt: `${placement} visual`,
    caption: `${placement} caption`
  });
  const selected = helpers.selectBrandContentVisuals([
    visual("ownership", "/images/ownership-first.webp"),
    visual("portfolio", "/images/ownership-first.webp"),
    visual("ownership", "/images/ownership-second.webp"),
    visual("competition", "/images/competition.webp"),
    visual("portfolio", "/images/portfolio.webp")
  ]);

  assert.deepEqual([...selected.entries()], [
    ["ownership", visual("ownership", "/images/ownership-first.webp")],
    ["competition", visual("competition", "/images/competition.webp")],
    ["portfolio", visual("portfolio", "/images/portfolio.webp")]
  ]);
  assert.deepEqual(helpers.buildLeadershipRows([]), [
    {
      person: "Not publicly identified",
      role: "Not publicly identified",
      evidenceNote: "No named leader was identified in reviewed sources."
    }
  ]);

  const founder = {
    name: "Alex Example",
    role: "Founder and CEO",
    context: "Identified in the reviewed company announcement.",
    portrait: {
      src: "/images/brands/sample-brand/founder.webp",
      alt: "Alex Example, founder and CEO of Sample Brand",
      credit: "Sample Brand",
      sourceUrl: "https://example.com/press"
    }
  };
  const chair = {
    name: "Taylor Example",
    role: "Chair"
  };

  assert.deepEqual(
    helpers.partitionFeaturedLeadership([founder, chair]),
    {
      featuredLeader: founder,
      tableLeaders: [chair]
    }
  );
  assert.deepEqual(
    helpers.partitionFeaturedLeadership([chair]),
    {
      featuredLeader: undefined,
      tableLeaders: [chair]
    }
  );
  assert.equal(helpers.getLeadershipProfileLabel(founder), "Founder profile");
  assert.equal(
    helpers.getLeadershipProfileLabel({
      name: "Morgan Example",
      role: "Chief Executive Officer",
      context: "Current company leader."
    }),
    "Leadership profile"
  );
});

test("founder card exposes the portrait, leadership evidence, and image provenance", () => {
  const founderCard = read("components/brands/BrandFounderCard.tsx");

  assert.match(founderCard, /<figure className="brand-founder-card">/);
  assert.match(founderCard, /src=\{leader\.portrait\.src\}/);
  assert.match(founderCard, /alt=\{leader\.portrait\.alt\}/);
  assert.match(founderCard, /\{leader\.name\}/);
  assert.match(founderCard, /\{leader\.role\}/);
  assert.match(founderCard, /leader\.context/);
  assert.match(founderCard, /\{leader\.portrait\.credit\}/);
  assert.match(founderCard, /href=\{leader\.portrait\.sourceUrl\}/);
  assert.match(founderCard, /rel="noopener noreferrer"/);
  assert.match(founderCard, /getLeadershipProfileLabel\(leader\)/);
  assert.doesNotMatch(founderCard, />Founder profile</);
});

test("article brand links preserve primary-brand order and exclude unpublished profiles", () => {
  const component = read("components/ArticleBrandLinks.tsx");

  assert.match(component, /brandSlugs:\s*string\[\]/);
  assert.match(component, /profiles:\s*BrandProfile\[\]/);
  assert.match(component, /new Set\(brandSlugs\)/);
  assert.match(component, /profile\.status === "published"/);
  assert.match(component, /if \(!linkedProfiles\.length\) return null/);
  assert.match(component, />Brand Intelligence</);
  assert.match(component, /href=\{`\/brands\/\$\{profile\.slug\}`\}/);
});

test("article route renders one published primary-brand link group between metadata and body", () => {
  const source = read("app/blog/[slug]/page.tsx");

  assert.equal((source.match(/<ArticleBrandLinks\b/g) || []).length, 1);
  assert.equal((source.match(/getPublishedBrandProfiles\(articles\)/g) || []).length, 1);
  assert.match(source, /brandSlugs=\{article\.primaryBrands\}/);
  assert.match(source, /profiles=\{publishedBrandProfiles\}/);
  assert.doesNotMatch(source, /brandSlugs=\{article\.relatedBrands\}/);

  const metadataPosition = source.indexOf('className="signal-detail-meta"');
  const brandLinksPosition = source.indexOf("<ArticleBrandLinks");
  const bodyPosition = source.indexOf("dangerouslySetInnerHTML");
  assert.ok(metadataPosition >= 0);
  assert.ok(brandLinksPosition > metadataPosition);
  assert.ok(bodyPosition > brandLinksPosition);
});

test("sitemap publishes the brand directory and valid profile modification dates", () => {
  const source = read("app/sitemap.ts");

  assert.equal((source.match(/getInsights\(\)/g) || []).length, 1);
  assert.match(source, /const profiles = getPublishedBrandProfiles\(insights\)/);
  assert.match(source, /"\/brands"/);
  assert.match(source, /\.\.\.buildBrandSitemapEntries\(profiles,\s*baseUrl\)/);
});

test("footer exposes exactly one Brand Intelligence discovery link", () => {
  const source = read("components/Footer.tsx");

  assert.equal((source.match(/href="\/brands"/g) || []).length, 1);
  assert.match(source, /<Link href="\/brands">Brand Intelligence<\/Link>/);
});

test("brand styles contain logos without cropping and collapse multi-column layouts on mobile", () => {
  const source = read("app/globals.css");
  const marker = "/* Brand intelligence hub */";
  const markerPosition = source.indexOf(marker);
  assert.ok(markerPosition >= 0);

  const brandStyles = source.slice(markerPosition);
  [
    ".brand-hub",
    ".brand-directory-hero",
    ".brand-directory-grid",
    ".brand-directory-card",
    ".brand-detail",
    ".brand-detail-hero",
    ".brand-hero-identity",
    ".brand-logo--hero",
    ".brand-key-facts",
    ".brand-data-table",
    ".brand-content-sections",
    ".brand-content-section",
    ".brand-section-layout",
    ".brand-section-tables",
    ".brand-visual",
    ".brand-competitor-links",
    ".brand-timeline",
    ".brand-article-grid",
    ".brand-sources",
    ".article-brand-links"
  ].forEach((selector) => assert.match(brandStyles, new RegExp(`\\${selector}\\b`)));

  assert.match(
    brandStyles,
    /\.brand-logo--card\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*7[^}]*\}/
  );
  const cardLogoStageRule = brandStyles.match(
    /\.brand-logo--card\s*\{[^}]*\}/
  )?.[0];
  assert.ok(cardLogoStageRule);
  assert.match(cardLogoStageRule, /padding:\s*clamp\(10px,\s*1\.5vw,\s*20px\)/);
  assert.match(cardLogoStageRule, /min-width:\s*0/);
  assert.match(cardLogoStageRule, /overflow:\s*hidden/);
  const cardLinkRule = brandStyles.match(
    /\.brand-directory-card > a\s*\{[^}]*\}/
  )?.[0];
  assert.ok(cardLinkRule);
  assert.match(cardLinkRule, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(cardLinkRule, /min-width:\s*0/);
  const cardLogoImageRule = brandStyles.match(
    /\.brand-logo--card img\s*\{[^}]*\}/
  )?.[0];
  assert.ok(cardLogoImageRule);
  assert.match(cardLogoImageRule, /width:\s*100%/);
  assert.match(cardLogoImageRule, /height:\s*100%/);
  assert.match(cardLogoImageRule, /min-width:\s*0/);
  assert.match(cardLogoImageRule, /min-height:\s*0/);
  assert.match(cardLogoImageRule, /max-width:\s*100%/);
  assert.match(cardLogoImageRule, /max-height:\s*100%/);
  assert.match(cardLogoImageRule, /object-fit:\s*contain/);
  assert.doesNotMatch(cardLogoImageRule, /object-fit:\s*cover/);
  assert.doesNotMatch(cardLogoImageRule, /(?:filter|box-shadow):/);
  const heroLogoStageRule = brandStyles.match(
    /\.brand-logo--hero\s*\{[^}]*\}/
  )?.[0];
  assert.ok(heroLogoStageRule);
  assert.match(heroLogoStageRule, /background:\s*#fff/);
  const heroLogoImageRule = brandStyles.match(
    /\.brand-logo--hero img\s*\{[^}]*\}/
  )?.[0];
  assert.ok(heroLogoImageRule);
  assert.match(heroLogoImageRule, /object-fit:\s*contain/);
  assert.doesNotMatch(heroLogoImageRule, /object-fit:\s*cover/);
  assert.match(
    brandStyles,
    /\.brand-detail-hero img,[\s\S]*\.brand-article-grid img\s*\{[\s\S]*object-fit:\s*cover/
  );
  const sectionVisualRule = brandStyles.match(
    /\.brand-visual img\s*\{[^}]*\}/
  )?.[0];
  assert.ok(sectionVisualRule);
  assert.match(sectionVisualRule, /height:\s*auto/);
  assert.match(sectionVisualRule, /object-fit:\s*contain/);
  assert.match(sectionVisualRule, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.doesNotMatch(sectionVisualRule, /object-fit:\s*cover/);
  assert.match(
    brandStyles,
    /\.brand-section-layout--visual\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.1fr\)\s+minmax\(280px,\s*0\.8fr\)/
  );

  const twoColumnPosition = brandStyles.indexOf("@media (max-width: 1249px)");
  const oneColumnPosition = brandStyles.indexOf("@media (max-width: 840px)");
  const mobilePosition = brandStyles.indexOf("@media (max-width: 760px)");
  assert.ok(twoColumnPosition >= 0);
  assert.ok(oneColumnPosition > twoColumnPosition);
  assert.ok(mobilePosition > oneColumnPosition);

  const twoColumnStyles = readCssBlock(
    brandStyles,
    "@media (max-width: 1249px)"
  );
  const oneColumnStyles = readCssBlock(
    brandStyles,
    "@media (max-width: 840px)"
  );
  const mobileStyles = readCssBlock(
    brandStyles,
    "@media (max-width: 760px)"
  );
  assert.match(
    twoColumnStyles,
    /\.brand-directory-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/
  );
  assert.match(
    oneColumnStyles,
    /\.brand-directory-grid\s*\{[^}]*grid-template-columns:\s*1fr/
  );
  assert.doesNotMatch(mobileStyles, /\.brand-directory-grid\b/);
  [
    ".brand-directory-hero",
    ".brand-detail-hero",
    ".brand-section-layout--visual",
    ".brand-article-grid"
  ].forEach((selector) => assert.match(
    mobileStyles,
    new RegExp(`\\${selector}[\\s\\S]*grid-template-columns:\\s*1fr`)
  ));
  assert.match(
    mobileStyles,
    /\.brand-data-table\s*\{[^}]*display:\s*block/
  );
  assert.match(mobileStyles, /\.brand-data-table thead\s*\{[\s\S]*position:\s*absolute/);
  assert.match(mobileStyles, /\.brand-data-table tr\s*\{[\s\S]*display:\s*block/);
  assert.match(mobileStyles, /\.brand-data-table td\s*\{[\s\S]*display:\s*block/);
  assert.match(
    mobileStyles,
    /\.brand-data-table td::before\s*\{[\s\S]*content:\s*attr\(data-label\)/
  );
  assert.match(
    mobileStyles,
    /\.brand-data-table td::before\s*\{[\s\S]*display:\s*block/
  );
  assert.match(mobileStyles, /\.brand-sources a\s*\{[\s\S]*overflow-wrap:\s*anywhere/);
  assert.match(mobileStyles, /\.brand-detail-hero img\s*\{[\s\S]*(?:aspect-ratio|height):/);
  assert.match(
    mobileStyles,
    /\.brand-content-section,[\s\S]*#timeline,[\s\S]*#analysis,[\s\S]*\.brand-sources\s*\{[\s\S]*scroll-margin-top:\s*148px/
  );
  assert.match(
    mobileStyles,
    /\.brand-section-layout--operations \.brand-data-table th,[\s\S]*\.brand-section-layout--operations \.brand-data-table td\s*\{[\s\S]*width:\s*auto[\s\S]*min-width:\s*100%/
  );
});

test("founder cards use a compact portrait grid and stack safely on mobile", () => {
  const source = read("app/globals.css");
  const brandStyles = source.slice(source.indexOf("/* Brand intelligence hub */"));

  const cardRule = brandStyles.match(
    /\.brand-founder-card\s*\{[^}]*\}/
  )?.[0];
  assert.ok(cardRule);
  assert.match(
    cardRule,
    /grid-template-columns:\s*minmax\(0,\s*180px\)\s+minmax\(0,\s*1fr\)/
  );
  assert.match(cardRule, /min-width:\s*0/);
  assert.match(cardRule, /overflow:\s*hidden/);

  const portraitRule = brandStyles.match(
    /\.brand-founder-portrait\s*\{[^}]*\}/
  )?.[0];
  assert.ok(portraitRule);
  assert.match(portraitRule, /aspect-ratio:\s*6\s*\/\s*7/);

  const portraitImageRule = brandStyles.match(
    /\.brand-founder-portrait img\s*\{[^}]*\}/
  )?.[0];
  assert.ok(portraitImageRule);
  assert.match(portraitImageRule, /object-fit:\s*cover/);
  assert.match(portraitImageRule, /width:\s*100%/);
  assert.match(portraitImageRule, /height:\s*100%/);

  const detailsRule = brandStyles.match(
    /\.brand-founder-details\s*\{[^}]*\}/
  )?.[0];
  assert.ok(detailsRule);
  assert.match(detailsRule, /min-width:\s*0/);

  const sourceLinkRule = brandStyles.match(
    /\.brand-founder-credit a\s*\{[^}]*\}/
  )?.[0];
  assert.ok(sourceLinkRule);
  assert.match(sourceLinkRule, /text-decoration:\s*underline/);

  const mobileRules = readCssBlock(brandStyles, "@media (max-width: 760px)");
  assert.match(
    mobileRules,
    /\.brand-founder-card\s*\{[^}]*grid-template-columns:\s*104px\s+minmax\(0,\s*1fr\)/
  );
  assert.match(
    mobileRules,
    /\.brand-founder-portrait\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*4/
  );
});

test("competitor links meet normal-text contrast and retain a non-color cue", () => {
  const source = read("app/globals.css");
  const rootRule = source.match(/:root\s*\{[^}]*\}/)?.[0];
  const linkRule = source.match(
    /\.brand-competitor-links a\s*\{[^}]*\}/
  )?.[0];

  assert.ok(rootRule);
  assert.ok(linkRule);
  const navy = rootRule.match(/--navy:\s*(#[0-9a-f]{6})/i)?.[1];
  const soft = rootRule.match(/--soft:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(navy);
  assert.ok(soft);
  assert.match(linkRule, /color:\s*var\(--navy\)/);
  assert.ok(
    contrastRatio(navy, soft) >= 4.5,
    `competitor link contrast must be at least 4.5:1; actual ${contrastRatio(navy, soft).toFixed(2)}:1`
  );
  assert.match(linkRule, /text-decoration:\s*underline/);
  assert.match(linkRule, /text-underline-offset:/);
});

test("directory wordmarks remain legible at real one, two, and three-column boundaries", async () => {
  const layouts = [
    {
      viewportWidth: 390,
      containerWidth: 362,
      columns: 1,
      gap: 24,
      stagePadding: 10
    },
    {
      viewportWidth: 841,
      containerWidth: 793,
      columns: 2,
      gap: 24,
      stagePadding: 12.615
    },
    {
      viewportWidth: 1250,
      containerWidth: 1202,
      columns: 3,
      gap: 24,
      stagePadding: 18.75
    }
  ];
  const expectedMinimums = {
    tineco: { width: 120, height: 20 },
    dreame: { width: 170, height: 23 },
    aiper: { width: 198, height: 58 }
  };

  for (const [slug, minimum] of Object.entries(expectedMinimums)) {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "brands",
      slug,
      "logo.webp"
    );
    const decoded = await sharp(logoPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alphaChannelIndex = decoded.info.channels - 1;
    let minimumVisibleX = decoded.info.width;
    let minimumVisibleY = decoded.info.height;
    let maximumVisibleX = -1;
    let maximumVisibleY = -1;

    for (let y = 0; y < decoded.info.height; y += 1) {
      for (let x = 0; x < decoded.info.width; x += 1) {
        const alphaIndex =
          (y * decoded.info.width + x) * decoded.info.channels + alphaChannelIndex;
        if (decoded.data[alphaIndex] > 0) {
          minimumVisibleX = Math.min(minimumVisibleX, x);
          minimumVisibleY = Math.min(minimumVisibleY, y);
          maximumVisibleX = Math.max(maximumVisibleX, x);
          maximumVisibleY = Math.max(maximumVisibleY, y);
        }
      }
    }

    const visibleWidth = maximumVisibleX - minimumVisibleX + 1;
    const visibleHeight = maximumVisibleY - minimumVisibleY + 1;

    for (const layout of layouts) {
      const cardWidth =
        (layout.containerWidth - layout.gap * (layout.columns - 1)) /
        layout.columns;
      const stageContentWidth = cardWidth - (2 * layout.stagePadding);
      const stageContentHeight =
        cardWidth * 7 / 16 - (2 * layout.stagePadding);
      const scale = Math.min(
        stageContentWidth / decoded.info.width,
        stageContentHeight / decoded.info.height
      );
      const renderedVisibleWidth = visibleWidth * scale;
      const renderedVisibleHeight = visibleHeight * scale;

      assert.ok(
        renderedVisibleWidth >= minimum.width,
        `${slug} at ${layout.viewportWidth}px must remain at least ${minimum.width}px wide; actual ${renderedVisibleWidth.toFixed(1)}px`
      );
      assert.ok(
        renderedVisibleHeight >= minimum.height,
        `${slug} at ${layout.viewportWidth}px must remain at least ${minimum.height}px high; actual ${renderedVisibleHeight.toFixed(1)}px`
      );
    }
  }
});

test("hero wordmarks remain legible after asset whitespace at desktop and mobile widths", async () => {
  const source = read("app/globals.css");
  const brandStyles = source.slice(source.indexOf("/* Brand intelligence hub */"));
  const heroLogoStageRule = brandStyles.match(
    /\.brand-logo--hero\s*\{[^}]*\}/
  )?.[0];
  const heroLogoImageRule = brandStyles.match(
    /\.brand-logo--hero img\s*\{[^}]*\}/
  )?.[0];

  assert.ok(heroLogoStageRule);
  assert.ok(heroLogoImageRule);
  assert.match(heroLogoStageRule, /width:\s*min\(280px,\s*100%\)/);
  assert.match(heroLogoStageRule, /min-height:\s*80px/);
  assert.match(heroLogoStageRule, /padding:\s*8px/);
  assert.match(heroLogoImageRule, /height:\s*64px/);
  assert.match(heroLogoImageRule, /max-height:\s*64px/);

  const layouts = [
    {
      label: "desktop 280px stage",
      contentWidth: 264,
      contentHeight: 64,
      minimums: {
        tineco: { width: 80, height: 13 },
        dreame: { width: 112, height: 15 },
        aiper: { width: 132, height: 38 }
      }
    },
    {
      label: "mobile 260px stage",
      contentWidth: 244,
      contentHeight: 60,
      minimums: {
        tineco: { width: 75, height: 12 },
        dreame: { width: 105, height: 14 },
        aiper: { width: 124, height: 35 }
      }
    }
  ];

  for (const slug of ["tineco", "dreame", "aiper"]) {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "brands",
      slug,
      "logo.webp"
    );
    const decoded = await sharp(logoPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alphaChannelIndex = decoded.info.channels - 1;
    let minimumVisibleX = decoded.info.width;
    let minimumVisibleY = decoded.info.height;
    let maximumVisibleX = -1;
    let maximumVisibleY = -1;

    for (let y = 0; y < decoded.info.height; y += 1) {
      for (let x = 0; x < decoded.info.width; x += 1) {
        const alphaIndex =
          (y * decoded.info.width + x) * decoded.info.channels + alphaChannelIndex;
        if (decoded.data[alphaIndex] > 0) {
          minimumVisibleX = Math.min(minimumVisibleX, x);
          minimumVisibleY = Math.min(minimumVisibleY, y);
          maximumVisibleX = Math.max(maximumVisibleX, x);
          maximumVisibleY = Math.max(maximumVisibleY, y);
        }
      }
    }

    const visibleWidth = maximumVisibleX - minimumVisibleX + 1;
    const visibleHeight = maximumVisibleY - minimumVisibleY + 1;

    for (const layout of layouts) {
      const scale = Math.min(
        layout.contentWidth / decoded.info.width,
        layout.contentHeight / decoded.info.height
      );
      const renderedVisibleWidth = visibleWidth * scale;
      const renderedVisibleHeight = visibleHeight * scale;
      const minimum = layout.minimums[slug];

      assert.ok(
        renderedVisibleWidth >= minimum.width,
        `${slug} in ${layout.label} must remain at least ${minimum.width}px wide; actual ${renderedVisibleWidth.toFixed(1)}px`
      );
      assert.ok(
        renderedVisibleHeight >= minimum.height,
        `${slug} in ${layout.label} must remain at least ${minimum.height}px high; actual ${renderedVisibleHeight.toFixed(1)}px`
      );
    }
  }
});

test("mobile key-fact labels retain sufficient white opacity on the dark hero", () => {
  const source = read("app/globals.css");
  const brandStyles = source.slice(source.indexOf("/* Brand intelligence hub */"));
  const mobileStyles = readCssBlock(brandStyles, "@media (max-width: 760px)");
  const labelRule = mobileStyles.match(
    /\.brand-key-facts \.brand-data-table td::before\s*\{[^}]*\}/
  )?.[0];

  assert.ok(labelRule);
  const alpha = Number(
    labelRule.match(
      /color:\s*rgba\(255,\s*255,\s*255,\s*([0-9.]+)\)/
    )?.[1]
  );
  assert.ok(
    Number.isFinite(alpha) && alpha >= 0.68,
    `mobile key-fact label opacity must be at least 0.68; actual ${alpha}`
  );
});

test("brand JSX connects every required CSS selector to rendered content", () => {
  const directoryRoute = read("app/brands/page.tsx");
  const detailRoute = read("app/brands/[slug]/page.tsx");
  const directoryCard = read("components/brands/BrandDirectoryCard.tsx");
  const hero = read("components/brands/BrandHero.tsx");
  const sections = read("components/brands/BrandSections.tsx");
  const timeline = read("components/brands/BrandTimeline.tsx");
  const articles = read("components/brands/BrandArticles.tsx");
  const sources = read("components/brands/BrandSources.tsx");
  const articleBrandLinks = read("components/ArticleBrandLinks.tsx");

  assert.match(directoryRoute, /className="guides-hub brand-hub"/);
  assert.match(directoryRoute, /className="insights-page-container guides-hero-grid brand-directory-hero"/);
  assert.match(directoryRoute, /className="guides-featured-grid brand-directory-grid"/);
  assert.match(directoryCard, /className="guide-card brand-directory-card"/);

  assert.match(detailRoute, /className="guides-hub brand-hub brand-detail"/);
  assert.match(hero, /className="brand-detail-hero"/);
  assert.match(hero, /className="brand-hero-media"/);
  assert.match(hero, /className="brand-hero-identity"/);
  assert.match(hero, /className="brand-key-facts"/);
  assert.match(hero, /<BrandDataTable/);
  assert.match(
    hero,
    /className="brand-detail-hero"[\s\S]*\{profile\.heroImage \? \([\s\S]*<img/
  );
  assert.match(sections, /className="brand-content-sections"/);
  assert.match(sections, /className="brand-content-section"/);
  assert.match(
    sections,
    /className="brand-section-layout brand-section-layout--operations"/
  );
  assert.match(sections, /<BrandDataTable/);
  assert.match(sections, /<BrandVisual/);
  assert.match(timeline, /<ol className="brand-timeline">/);
  assert.match(
    articles,
    /const gridClassName = `guide-category-list brand-article-grid \$\{[\s\S]*brand-article-grid--balanced[\s\S]*className=\{gridClassName\}/
  );
  assert.match(sources, /<section className="section brand-sources" id="sources">/);
  assert.match(articleBrandLinks, /className="article-brand-links"/);
});

test("brand detail layout uses compact operations, navigation, and full-size visual affordances", () => {
  const hero = read("components/brands/BrandHero.tsx");
  const sections = read("components/brands/BrandSections.tsx");
  const visual = read("components/brands/BrandVisual.tsx");
  const styles = read("app/globals.css");
  const brandStyles = styles.slice(styles.indexOf("/* Brand intelligence hub */"));

  assert.match(hero, /className="brand-section-nav"/);
  [
    "#company-ownership",
    "#product-portfolio",
    "#manufacturing-channels",
    "#competitive-position",
    "#timeline",
    "#analysis",
    "#sources"
  ].forEach((href) => assert.match(hero, new RegExp(`href="${href}"`)));

  [
    'id="company-ownership"',
    'id="product-portfolio"',
    'id="manufacturing-channels"',
    'id="competitive-position"'
  ].forEach((id) => assert.match(sections, new RegExp(id)));

  assert.match(
    brandStyles,
    /\.brand-section-layout--operations\s*\{[^}]*display:\s*grid/
  );
  assert.match(
    brandStyles,
    /\.brand-section-layout--operations \.brand-section-tables\s*\{[^}]*order:\s*2/
  );
  assert.match(
    brandStyles,
    /\.brand-section-layout--operations \.brand-visual\s*\{[^}]*order:\s*1/
  );
  assert.match(
    visual,
    /<a[\s\S]*className="brand-visual-link"[\s\S]*target="_blank"/
  );
});

test("brand and article routes rely on the root layout main landmark", () => {
  [
    "app/brands/page.tsx",
    "app/brands/[slug]/page.tsx",
    "app/blog/[slug]/page.tsx"
  ].forEach((route) => assert.doesNotMatch(read(route), /<main\b/));
});
