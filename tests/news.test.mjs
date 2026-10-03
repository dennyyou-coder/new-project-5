import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getNews, getNewsContext, getNewsVisual, selectNews, newsHref, NEWS_PAGE_SIZE } from "../lib/news.ts";
import { getInsights } from "../lib/content.ts";
import { getPublishedBrandProfiles } from "../lib/brands.ts";
import { productModels } from "../lib/products.ts";
import { buildBlogSitemap } from "../lib/sitemaps.ts";

test("news separates publication from announcement dates and resolves every company, product and image", () => {
  const articles = getNews();
  const insights = getInsights();
  const brands = new Set(getPublishedBrandProfiles(insights).map((brand) => brand.slug));
  const products = new Map(productModels.map((model) => [model.slug, model]));
  assert.ok(articles.length >= 8);
  for (const article of articles) {
    assert.ok(Date.parse(article.eventDate) <= Date.parse(article.publishedAt), article.slug);
    assert.ok(article.sources.length > 0);
    assert.ok(article.brandSlugs.every((slug) => brands.has(slug)), `${article.slug}: unpublished brand`);
    assert.ok(article.productSlugs.every((slug) => products.has(slug)), `${article.slug}: unknown model`);
    assert.ok(article.productSlugs.every((slug) => article.brandSlugs.includes(products.get(slug).brandSlug)), `${article.slug}: wrong brand/model association`);
    assert.ok(article.relatedArticles.every((slug) => insights.some((item) => item.slug === slug)));
    const context = getNewsContext(article);
    const visual = getNewsVisual(article);
    assert.ok(visual && fs.existsSync(`public${visual.src}`), `${article.slug}: news visual missing`);
    if (article.imageProduct) {
      assert.ok(article.productSlugs.includes(article.imageProduct));
      assert.ok(context.image);
      assert.ok(fs.existsSync(`public${context.image.coverImage}`), `${article.slug}: image missing`);
      assert.equal(visual.kind, "product");
      assert.equal(visual.src, context.image.coverImage);
    } else {
      assert.equal(visual.kind, "brand");
      assert.ok(context.brands.some((brand) => brand.logoImage === visual.src), `${article.slug}: unrelated company visual`);
    }
    for (const [, href] of article.content.matchAll(/\]\((\/[^)]+)\)/g)) {
      if (href.startsWith("/brands/")) assert.ok(brands.has(href.slice(8)), href);
      else if (href.startsWith("/products/")) assert.ok(products.has(href.slice(10)), href);
      else if (href.startsWith("/blog/")) assert.ok(insights.some((item) => item.slug === href.slice(6)), href);
      else assert.fail(`Unverified internal news link: ${href}`);
    }
  }
});

test("topic filtering preserves article order and invalid filters fall back to the full collection", () => {
  const articles = getNews();
  const companies = articles.filter((item) => item.topic === "companies");
  const companyPages = Array.from({ length: selectNews(articles, "companies").totalPages }, (_, index) => selectNews(articles, "companies", String(index + 1)).articles).flat();
  assert.deepEqual(companyPages, companies);
  assert.equal(selectNews(articles, "invalid").total, articles.length);
  assert.deepEqual(selectNews(articles, "policy-standards").articles, articles.filter((item) => item.topic === "policy-standards").slice(0, NEWS_PAGE_SIZE));
});

test("historical backfills keep original news chronology and their actual WCB publication date", () => {
  const articles = getNews();
  for (let index = 1; index < articles.length; index++) {
    assert.ok(Date.parse(articles[index - 1].eventDate) >= Date.parse(articles[index].eventDate));
  }
  const backfill = articles.find((article) => article.slug === "narwal-flow-2-north-america-launch-april-2026");
  const recent = articles.find((article) => article.slug === "nilfisk-eurotier-2026-hot-water-cleaning-preview");
  assert.ok(backfill && recent);
  assert.ok(Date.parse(backfill.publishedAt) > Date.parse(recent.publishedAt));
  assert.ok(articles.indexOf(backfill) > articles.indexOf(recent));
  assert.equal(backfill.eventDate, "2026-04-13");
});

test("pagination handles boundaries and preserves the selected topic in links", () => {
  const article = getNews()[0];
  const articles = Array.from({ length: NEWS_PAGE_SIZE + 2 }, (_, index) => ({ ...article, slug: `story-${index}` }));
  assert.equal(selectNews(articles, undefined, "2").articles.length, 2);
  assert.equal(selectNews(articles, undefined, "999").page, 2);
  assert.equal(selectNews(articles, undefined, "-1").page, 1);
  assert.equal(selectNews(articles, undefined, "Infinity").page, 1);
  assert.equal(newsHref("products", 2), "/news?topic=products&page=2");
  assert.equal(newsHref(), "/news");
});

test("news has independent URLs in the sitemap and does not enter Blog collections", () => {
  const news = getNews();
  const insights = getInsights();
  const sitemap = buildBlogSitemap();
  assert.ok(sitemap.some((entry) => entry.url === "https://worldcleanbiz.com/news"));
  for (const article of news) {
    assert.ok(sitemap.some((entry) => entry.url === `https://worldcleanbiz.com/news/${article.slug}`));
    assert.ok(!insights.some((item) => item.slug === article.slug));
  }
});
