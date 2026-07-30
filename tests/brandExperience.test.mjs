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
    url: "https://example.com"
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

test("brand hero labels legal names and multi-entity scope notes separately", () => {
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
    /\{legalName \? \([\s\S]*?<dt>Legal name<\/dt>[\s\S]*?<dd>\{legalName\}<\/dd>[\s\S]*?\) : null\}/
  );
  assert.match(
    hero,
    /\{legalEntityNote \? \([\s\S]*?<dt>Legal entity scope<\/dt>[\s\S]*?<dd>\{legalEntityNote\}<\/dd>[\s\S]*?\) : null\}/
  );
  assert.doesNotMatch(hero, /\{profile\.(?:legalName|legalEntityNote) \?/);
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
    ".brand-snapshot-grid",
    ".brand-section-grid",
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
  const cardLogoImageRule = brandStyles.match(
    /\.brand-logo--card img\s*\{[^}]*\}/
  )?.[0];
  assert.ok(cardLogoImageRule);
  assert.match(cardLogoImageRule, /width:\s*100%/);
  assert.match(cardLogoImageRule, /height:\s*100%/);
  assert.match(cardLogoImageRule, /max-width:\s*100%/);
  assert.match(cardLogoImageRule, /max-height:\s*100%/);
  assert.match(cardLogoImageRule, /object-fit:\s*contain/);
  assert.doesNotMatch(cardLogoImageRule, /object-fit:\s*cover/);
  assert.doesNotMatch(cardLogoImageRule, /(?:filter|box-shadow):/);
  assert.match(
    brandStyles,
    /\.brand-detail-hero img,[\s\S]*\.brand-article-grid img\s*\{[\s\S]*object-fit:\s*cover/
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
    ".brand-snapshot-grid",
    ".brand-section-grid",
    ".brand-article-grid"
  ].forEach((selector) => assert.match(
    mobileStyles,
    new RegExp(`\\${selector}[\\s\\S]*grid-template-columns:\\s*1fr`)
  ));
  assert.match(mobileStyles, /\.brand-sources a\s*\{[\s\S]*overflow-wrap:\s*anywhere/);
  assert.match(mobileStyles, /\.brand-detail-hero img\s*\{[\s\S]*(?:aspect-ratio|height):/);
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
  assert.match(hero, /className="brand-snapshot-grid"/);
  assert.match(
    hero,
    /className="brand-detail-hero"[\s\S]*\{profile\.heroImage \? \([\s\S]*<img/
  );
  assert.match(sections, /className="guides-category-grid brand-section-grid"/);
  assert.match(timeline, /<ol className="brand-timeline">/);
  assert.match(articles, /className="guide-category-list brand-article-grid"/);
  assert.match(sources, /<section className="section brand-sources">/);
  assert.match(articleBrandLinks, /className="article-brand-links"/);
});

test("brand and article routes rely on the root layout main landmark", () => {
  [
    "app/brands/page.tsx",
    "app/brands/[slug]/page.tsx",
    "app/blog/[slug]/page.tsx"
  ].forEach((route) => assert.doesNotMatch(read(route), /<main\b/));
});
