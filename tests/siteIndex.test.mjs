import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import { getInsights } from "@/lib/content";
import { getNews } from "@/lib/news";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getArticleIndex, getNewsIndex, getSiteIndexOverview } from "@/lib/siteIndex";
import { buildDiscoverySitemap } from "@/lib/sitemaps";

const hrefs = (groups) => new Set(groups.flatMap((group) => group.links.map((link) => link.href)));

test("site index links every article, news story and company", () => {
  const articles = hrefs(getArticleIndex());
  for (const article of getInsights()) assert.ok(articles.has(`/blog/${article.slug}`), article.slug);
  const news = hrefs(getNewsIndex());
  for (const story of getNews()) assert.ok(news.has(`/news/${story.slug}`), story.slug);
  const overview = hrefs(getSiteIndexOverview().groups);
  for (const brand of getPublishedBrandProfiles(getInsights())) assert.ok(overview.has(`/brands/${brand.slug}`), brand.slug);
});

test("site index pages are in the sitemap and linked from the footer", () => {
  const urls = new Set(buildDiscoverySitemap().map((entry) => entry.url));
  for (const path of ["/site-index", "/site-index/articles", "/site-index/news"]) {
    assert.ok(urls.has(`https://worldcleanbiz.com${path}`), path);
  }
  assert.match(readFileSync("components/Footer.tsx", "utf8"), /href="\/site-index"/);
});

test("article redirects point at articles that exist", () => {
  const config = readFileSync("next.config.ts", "utf8");
  const targets = [...config.matchAll(/destination: "\/blog\/([a-z0-9-]+)"/g)].map((match) => match[1]);
  assert.ok(targets.length > 0);
  for (const slug of targets) {
    assert.ok(existsSync(`content/insights/${slug}.mdx`) || existsSync(`content/insights/${slug}.md`), slug);
  }
});

test("every listed category hub has enough coverage; thin hubs stay out of the sitemap", async () => {
  const { HUB_CATEGORIES, LISTED_HUB_CATEGORIES } = await import("@/lib/hubCategories");
  const { getHubCategoryData } = await import("@/lib/hubCategoryContent");
  const urls = new Set(buildDiscoverySitemap().map((entry) => entry.url));
  for (const hub of HUB_CATEGORIES) {
    const data = getHubCategoryData(hub);
    const coverage = data.analysis.length + data.guides.length + data.news.length;
    const listed = LISTED_HUB_CATEGORIES.includes(hub);
    if (listed) assert.ok(coverage >= 3, `${hub.slug} is listed with only ${coverage} items`);
    assert.equal(urls.has(`https://worldcleanbiz.com/categories/${hub.slug}`), listed, hub.slug);
  }
});

test("company pages link the ownership guide about that company", async () => {
  const { pickOwnershipGuide } = await import("@/lib/brandProfileView");
  const articles = getInsights();
  const brands = new Map(getPublishedBrandProfiles(articles).map((brand) => [brand.slug, brand]));
  const expected = {
    dyson: "who-owns-dyson-james-dyson-singapore-manufacturing",
    whirlpool: "who-owns-whirlpool-appliances-beko-europe",
    tineco: "who-owns-tineco-ecovacs-group",
    electrolux: "who-owns-electrolux-brands-manufacturing",
    "bosch-power-tools": "who-owns-bosch-power-tools-robert-bosch"
  };
  for (const [slug, guide] of Object.entries(expected)) {
    assert.equal(pickOwnershipGuide(brands.get(slug), articles)?.slug, guide, slug);
  }
});

test("company pages list comparison guides that name the company", async () => {
  const { pickComparisonGuides } = await import("@/lib/brandProfileView");
  const articles = getInsights();
  const brands = new Map(getPublishedBrandProfiles(articles).map((brand) => [brand.slug, brand]));
  for (const slug of ["roborock", "segway-navimow", "bissell"]) {
    const guides = pickComparisonGuides(brands.get(slug), articles);
    assert.ok(guides.length > 0 && guides.length <= 4, `${slug} has ${guides.length} comparisons`);
    for (const guide of guides) assert.equal(guide.guideType, "comparison");
  }
  for (const guide of pickComparisonGuides(brands.get("roborock"), articles)) {
    assert.match(guide.slug, /(^|-)roborock(-|$)/);
  }
});
