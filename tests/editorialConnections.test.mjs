import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getArticleProducts, getArticleReading, getArticleNews, getNewsReading, getArticleVideos } from "../lib/editorialConnections.ts";
import { getInsights } from "../lib/content.ts";
import { productModels, productCover } from "../lib/products.ts";
import { getNews } from "../lib/news.ts";
import { responsiveImageProps } from "../lib/articleImages.ts";

const insight = (slug, data = {}) => ({ slug, content: "", primaryBrands: [], sortDate: "2026-09-01", category: "Industry", tags: [], contentClass: "editorial", ...data });
const model = (slug, articles = [], data = {}) => ({ slug, articles, brandSlug: "brand-a", launchYear: 2026, ...data });
const newsItem = (slug, data = {}) => ({ slug, content: "", relatedArticles: [], brandSlugs: [], productSlugs: [], topic: "companies", eventDate: "2026-09-01", sortDate: "2026-09-01", ...data });

test("product connections require exact local links or curated article relationships, including older models", () => {
  const article = insight("current", { primaryBrands: ["brand-a"], content: "[Official](https://example.com/products/same-brand) [Exact](/products/exact?market=us) [Again](https://worldcleanbiz.com/products/exact#specs) [Unknown](/products/missing)" });
  const models = [model("older", ["current"], { launchYear: 2025 }), model("same-brand"), model("exact", ["current"])];
  assert.deepEqual(getArticleProducts(article, models).map(p => p.slug), ["exact", "older"]);
  assert.deepEqual(getArticleProducts(insight("no-links", { primaryBrands: ["brand-a"] }), models), []);
});

test("reading links rank direct relationships and never fill empty slots using a broad category", () => {
  const current = insight("current", { primaryBrands: ["brand-a"], series: "series-a", content: "[Guide](/blog/direct) [Missing](/blog/hidden-or-missing)" });
  const candidates = [current, insight("recent", { sortDate: "2026-10-07" }), insight("brand", { primaryBrands: ["brand-a"] }), insight("backlink", { content: "[Read](https://worldcleanbiz.com/blog/current)" }), insight("direct", { contentClass: "search" }), insight("own-episode", { series: "series-a", primaryBrands: ["brand-a"] })];
  assert.deepEqual(getArticleReading(current, candidates, []).map(a => a.slug), ["direct", "backlink", "brand"]);
  assert.deepEqual(getArticleReading(insight("unrelated"), [insight("recent")], []), []);
  assert.deepEqual(getArticleReading(current, candidates, [], 0), []);
});

test("news reading ranks curated article and exact-model connections before company context", () => {
  const news = newsItem("launch", { relatedArticles: ["explicit"], productSlugs: ["model-a"], brandSlugs: ["brand-a"] });
  const articles = [insight("brand", { primaryBrands: ["brand-a"] }), insight("different-model"), insight("model-guide", { contentClass: "search" }), insight("explicit")];
  const models = [model("model-a", ["model-guide"]), model("model-b", ["different-model"])];
  assert.deepEqual(getNewsReading(news, articles, models).map(a => a.slug), ["explicit", "model-guide", "brand"]);
  assert.deepEqual(getNewsReading(newsItem("unrelated"), articles, models), []);
});

test("article news favors exact products and excludes other model launches sharing a brand", () => {
  const article = insight("guide", { primaryBrands: ["brand-a"] });
  const news = [newsItem("other-model", { topic: "products", brandSlugs: ["brand-a"], productSlugs: ["model-b"], eventDate: "2026-10-01" }), newsItem("company", { brandSlugs: ["brand-a"] }), newsItem("exact", { topic: "products", productSlugs: ["model-a"] }), newsItem("direct", { relatedArticles: ["guide"] })];
  assert.deepEqual(getArticleNews(article, news, [model("model-a", ["guide"])]).map(a => a.slug), ["direct", "exact", "company"]);
});

test("video links use curated article slugs and obey the compact limit", () => {
  const videos = [{ key: "brand-match-only", articleSlugs: ["other"] }, { key: "one", articleSlugs: ["current"] }, { key: "two", articleSlugs: ["current"] }, { key: "three", articleSlugs: ["current"] }];
  assert.deepEqual(getArticleVideos(insight("current"), videos).map(v => v.key), ["one", "two"]);
  assert.deepEqual(getArticleVideos(insight("missing"), videos), []);
});

test("published corpus relationships resolve and exact-model boundary examples stay empty", () => {
  const articles = getInsights();
  const slugs = new Set(articles.map(a => a.slug));
  const models = new Set(productModels.map(p => p.slug));
  const news = getNews();
  for (const article of articles) {
    const relatedProducts = getArticleProducts(article, productModels);
    assert.equal(new Set(relatedProducts.map(p => p.slug)).size, relatedProducts.length);
    for (const product of relatedProducts) {
      assert.ok(models.has(product.slug));
      assert.ok(fs.existsSync(`public${responsiveImageProps(productCover(product.slug), "card").src}`));
    }
    for (const related of getArticleReading(article, articles, productModels)) assert.ok(slugs.has(related.slug) && related.slug !== article.slug);
    for (const related of getArticleNews(article, news, productModels)) assert.ok(news.some(n => n.slug === related.slug));
  }
  for (const item of news) {
    const related = getNewsReading(item, articles, productModels);
    assert.ok(related.length <= 3);
    for (const article of related) {
      assert.ok(slugs.has(article.slug));
      assert.ok(article.coverImage, `${article.slug}: related news reading needs its real cover`);
      assert.ok(fs.existsSync(`public${responsiveImageProps(article.coverImage, "card").src}`));
    }
  }
  for (const slug of ["navimow-h5-pro-edgemaestro-edge-mowing", "roborock-rockmow-z1-vs-mammotion-luba-3-awd"]) {
    const article = articles.find(a => a.slug === slug);
    assert.ok(article);
    assert.deepEqual(getArticleProducts(article, productModels), [], `${slug}: never substitute another model based on brand`);
  }
  assert.equal(getArticleProducts(articles.find(a => a.slug === "ifa-2026-cleaning-products-company-roundup"), productModels).length, 23);
});
