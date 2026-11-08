import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { getInsights, markdownToHtml } from "../lib/content.ts";
import { getNews } from "../lib/news.ts";
import { GET as sitemapIndex } from "../app/sitemap.xml/route.ts";
import {
  buildBlogSitemap,
  buildDiscoverySitemap
} from "../lib/sitemaps.ts";
import { buildWebsiteMetadata, seoDescription, seoTitle } from "../lib/seo.ts";

const sourcingGuideSlugs = [
  "cleaning-appliance-moq-pricing-hidden-costs-china",
  "commercial-cleaning-robot-manufacturers-china",
  "compliance-certification-cleaning-appliances-china",
  "floor-washer-manufacturers-china",
  "private-label-cleaning-products-from-china",
  "quality-control-cleaning-appliances-china",
  "robotic-lawn-mower-manufacturers-china",
  "robotic-pool-cleaner-manufacturers-china",
  "sample-testing-cleaning-appliances-china",
  "spare-parts-warranty-cleaning-appliances-china"
];

test("SEO titles preserve full meaning while descriptions keep their existing budget", () => {
  const title = seoTitle(
    "Robotic Pool Cleaner Manufacturers in China: A Detailed Buyer Guide for Global Importers"
  );
  const description = seoDescription(
    "Evaluate robotic pool cleaner manufacturers in China through product architecture, waterproofing, navigation, supplier capability, sample testing, compliance, spare parts, warranty readiness, and after-sales economics."
  );

  assert.equal(title, "Robotic Pool Cleaner Manufacturers in China: A Detailed Buyer Guide for Global Importers");
  assert.equal(seoTitle("  Who owns\nDyson?  "), "Who owns Dyson?");
  const metadata = buildWebsiteMetadata({ title, description, canonical: "/guide" });
  assert.deepEqual(metadata.title, { absolute: title });
  assert.equal(metadata.openGraph.title, title);
  assert.equal(metadata.twitter.title, title);
  assert.ok(description.length <= 160, description);
  assert.match(title, /^Robotic Pool Cleaner Manufacturers in China/);
  assert.match(description, /^Evaluate robotic pool cleaner manufacturers in China/);
  assert.doesNotMatch(title, /\s…$/);
  assert.doesNotMatch(description, /\s…$/);
});

test("every published insight has a stable publication date", () => {
  const violations = getInsights()
    .filter((article) => !article.date || !article.publishedAt || !article.sortDate)
    .map((article) => article.slug);

  assert.deepEqual(violations, []);
});

test("updated_at is preserved as the article modification date", () => {
  const article = getInsights().find(
    ({ slug }) => slug === "robotic-lawn-mower-market-size-yard-automation"
  );

  assert.equal(article?.updatedAt, "2026-06-21");
});

test("confirmed buyer guides appear in the sourcing guide collection", () => {
  const articlesBySlug = new Map(
    getInsights().map((article) => [article.slug, article])
  );

  for (const slug of sourcingGuideSlugs) {
    const article = articlesBySlug.get(slug);
    assert.equal(article?.contentClass, "search", `${slug} content class`);
    assert.equal(article?.guideType, "sourcing", `${slug} guide type`);
  }
});

test("all internal article links resolve to a published insight", async () => {
  const contentDirectory = new URL("../content/insights/", import.meta.url);
  const files = (await readdir(contentDirectory)).filter((file) => file.endsWith(".mdx"));
  const publishedSlugs = new Set(getInsights().map(({ slug }) => slug));
  const brokenLinks = [];

  for (const file of files) {
    const source = await readFile(new URL(file, contentDirectory), "utf8");
    const links = source.matchAll(/\]\(\/blog\/([^/)#?]+)(?:[?#][^)]*)?\)/g);

    for (const [, slug] of links) {
      if (slug === "archive" || slug === "series") continue;
      if (!publishedSlugs.has(slug)) brokenLinks.push(`${file} -> ${slug}`);
    }
  }

  assert.deepEqual(brokenLinks, []);
});

test("the legacy Laifen insight URL redirects to the published article", async () => {
  const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
  const exactRedirect = [
    'source: "/insights/laifen-hard-floor-washer-chances"',
    'destination: "/blog/laifen-hard-floor-washer-entry-strategy"'
  ];

  for (const line of exactRedirect) assert.match(config, new RegExp(line));
  assert.ok(
    config.indexOf(exactRedirect[0]) < config.indexOf('source: "/insights/:path*"'),
    "the exact legacy redirect must come before the catch-all redirect"
  );
});

test("markdown body images are lazy, asynchronous, and dimensionally stable", () => {
  const html = markdownToHtml(
    "![Factory production line](/images/articles/roborock-at-a-crossroads/04-roborock-at-the-crossroads-image-003.webp \"Production line\")"
  );

  assert.match(html, /loading="lazy"/);
  assert.match(html, /decoding="async"/);
  assert.match(html, /width="\d+"/);
  assert.match(html, /height="\d+"/);
});

test("sitemap index exposes focused child sitemaps without mixing page URLs", () => {
  const response = sitemapIndex();
  return response.text().then((xml) => {
    assert.equal(response.headers.get("content-type"), "application/xml; charset=utf-8");
    assert.match(xml, /<sitemapindex/);
    assert.equal((xml.match(/<sitemap>/g) || []).length, 5);
    assert.match(xml, /https:\/\/worldcleanbiz\.com\/sitemaps\/blog\/sitemap\.xml/);
    assert.match(xml, /https:\/\/worldcleanbiz\.com\/sitemaps\/discovery\/sitemap\.xml/);
    assert.match(xml, /https:\/\/worldcleanbiz\.com\/sitemaps\/brands\/sitemap\.xml/);
    assert.match(xml, /https:\/\/worldcleanbiz\.com\/sitemaps\/technical\/sitemap\.xml/);
    // The Google News sitemap lists only the last two days of news.
    assert.match(xml, /https:\/\/worldcleanbiz\.com\/sitemaps\/news\/sitemap\.xml/);
    assert.doesNotMatch(xml, /<url>/);
  });
});

test("child sitemaps preserve trustworthy page dates and intentional discovery routes", () => {
  const blogEntries = buildBlogSitemap();
  const discoveryEntries = buildDiscoverySitemap();
  const qualityRoute = discoveryEntries.find(
    ({ url }) => url === "https://worldcleanbiz.com/quality-compliance"
  );
  const updatedArticle = blogEntries.find(
    ({ url }) =>
      url ===
      "https://worldcleanbiz.com/blog/robotic-lawn-mower-market-size-yard-automation"
  );

  assert.ok(qualityRoute);
  assert.equal(qualityRoute.lastModified, undefined);
  assert.equal(
    updatedArticle?.lastModified?.toISOString(),
    "2026-06-20T16:00:00.000Z"
  );
});

test("sitemaps leave out paginated lists and never report a bulk timestamp as a news update", () => {
  const entries = [...buildBlogSitemap(), ...buildDiscoverySitemap()];
  assert.ok(entries.every(({ url }) => !/[?&]page=\d+/.test(url)), "no paginated list URLs");

  const news = getNews();
  const shared = new Map();
  for (const { updatedAt } of news) shared.set(updatedAt, (shared.get(updatedAt) ?? 0) + 1);
  const sitemapDate = new Map(buildBlogSitemap().map(({ url, lastModified }) => [url, lastModified?.toISOString()]));
  for (const article of news) {
    const reported = sitemapDate.get(`https://worldcleanbiz.com/news/${article.slug}`);
    assert.ok(reported, `${article.slug} has a date`);
    if (shared.get(article.updatedAt) > 20) {
      assert.equal(reported, new Date(article.publishedAt).toISOString(), `${article.slug} uses its publication date`);
    }
  }

  const models = buildDiscoverySitemap().filter(({ url }) => /\/products\/[^/]+$/.test(url));
  assert.ok(models.length > 0 && models.every(({ lastModified }) => lastModified), "product models carry their verification date");
});
