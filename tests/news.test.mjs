import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getNews, getNewsContext, getNewsVisual, getRelatedNewsForArticle, selectNews, newsHref, NEWS_PAGE_SIZE } from "../lib/news.ts";
import { newsStoryVisuals, newsCompanyVisuals } from "../lib/newsVisuals.ts";
import { getInsights } from "../lib/content.ts";
import { getPublishedBrandProfiles } from "../lib/brands.ts";
import { productModels } from "../lib/products.ts";
import { getArticleImage } from "../lib/articleImages.ts";
import { buildBlogSitemap } from "../lib/sitemaps.ts";

test("news separates publication from announcement dates and resolves every company, product and image", () => {
  const articles = getNews();
  const insights = getInsights();
  const brands = new Set(getPublishedBrandProfiles(insights).map((brand) => brand.slug));
  const products = new Map(productModels.map((model) => [model.slug, model]));
  assert.ok(articles.length >= 8);
  assert.equal(new Set(articles.map(article => article.slug)).size, articles.length, "Markdown and MDX news must not duplicate a public URL");
  for (const article of articles) {
    assert.ok(Date.parse(article.eventDate) <= Date.parse(article.publishedAt), article.slug);
    assert.ok(article.sources.length > 0);
    assert.ok(article.brandSlugs.every((slug) => brands.has(slug)), `${article.slug}: unpublished brand`);
    assert.ok(article.productSlugs.every((slug) => products.has(slug)), `${article.slug}: unknown model`);
    assert.ok(article.productSlugs.every((slug) => article.brandSlugs.includes(products.get(slug).brandSlug)), `${article.slug}: wrong brand/model association`);
    assert.ok(article.relatedArticles.every((slug) => insights.some((item) => item.slug === slug)));
    const context = getNewsContext(article);
    const visual = getNewsVisual(article);
    assert.ok(visual, `${article.slug}: every news row has a verified image or labeled WCB archive context`);
    if (visual) {
      assert.ok(["product", "company", "coverage", "event", "context"].includes(visual.kind));
      assert.ok(visual.caption && visual.label && visual.sourceUrl, `${article.slug}: media context missing`);
      assert.ok(!/\/logo[.-]/i.test(visual.src), `${article.slug}: logo used as news image`);
      if (visual.src.startsWith("/")) assert.ok(fs.existsSync(`public${visual.src}`), `${article.slug}: missing image`);
      else assert.match(visual.src, /^https:\/\//);
      if (visual.prepared) assert.ok(getArticleImage(visual.src), `${article.slug}: prepared image missing from runtime index`);
      if (article.coverImage) assert.equal(visual.src, article.coverImage, `${article.slug}: prepared cover not used`);
    }
    if (article.imageProduct) {
      assert.ok(article.productSlugs.includes(article.imageProduct));
      assert.ok(context.image);
      assert.ok(fs.existsSync(`public${context.image.coverImage}`), `${article.slug}: image missing`);
      if (!newsStoryVisuals[article.slug]) {
        assert.equal(visual.kind, "product");
        assert.equal(visual.src, context.image.coverImage);
      }
    } else if (visual.kind === "context") {
      assert.equal(visual.label, "Industry context");
      assert.match(visual.caption, /2025.*not a photograph of this news event/);
      assert.equal(visual.src, "/images/industry/about-forum-audience-2025.jpg");
    } else if (visual && !newsStoryVisuals[article.slug]) {
      assert.ok(article.brandSlugs.some((slug) => newsCompanyVisuals[slug] === visual), `${article.slug}: unrelated company visual`);
      if (visual.relatedArticleSlug) {
        const related = insights.find((item) => item.slug === visual.relatedArticleSlug);
        assert.ok(related && related.primaryBrands.some((slug) => article.brandSlugs.includes(slug)), `${article.slug}: unrelated coverage`);
      }
    }
    for (const [, href] of article.content.matchAll(/\]\((\/[^)]+)\)/g)) {
      if (href.startsWith("/brands/")) assert.ok(brands.has(href.slice(8)), href);
      else if (href.startsWith("/products/")) assert.ok(products.has(href.slice(10)), href);
      else if (href.startsWith("/blog/")) assert.ok(insights.some((item) => item.slug === href.slice(6)), href);
      else if (href.startsWith("/news/")) assert.ok(articles.some((item) => item.slug === href.slice(6)), href);
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

test("article news links use explicit published article or brand relationships", () => {
  const insights = getInsights();
  for (const article of insights) {
    const related = getRelatedNewsForArticle(article);
    assert.ok(related.length <= 3);
    for (const news of related) {
      assert.ok(news.relatedArticles.includes(article.slug) || news.brandSlugs.some(slug => article.primaryBrands.includes(slug)));
    }
  }
  const miele = insights.find(article => article.slug === "miele-two-families-company-story");
  assert.ok(miele);
  assert.equal(getRelatedNewsForArticle(miele).length, 0, "do not invent Miele news");
});

test("key figures are optional and every number in them appears in the article body", () => {
  const articles = getNews();
  const withFigures = articles.filter((article) => article.keyFigures.length > 0);
  assert.ok(withFigures.length >= 5, "at least five results stories carry key figures");
  assert.ok(articles.some((article) => article.keyFigures.length === 0), "articles without key figures still load");
  for (const article of withFigures) {
    for (const figure of article.keyFigures) {
      assert.ok(figure.label && figure.value, `${article.slug} figure needs label and value`);
      for (const field of [figure.value, figure.change ?? ""]) {
        for (const number of field.match(/\d[\d.,]*/g) ?? []) {
          assert.ok(article.content.includes(number), `${article.slug}: ${number} must appear in the body`);
        }
      }
      if (!figure.usd) continue;
      // USD only with a stated rate, and it must match the converted value within 1%.
      assert.ok(article.usdRate, `${article.slug}: usd needs usd_rate`);
      const rate = article.usdRate.match(/^1 (USD|[A-Z]{3}) = ([\d.]+) ([A-Z]{3}); Federal Reserve H\.10, \d{1,2} \w{3} \d{4}$/);
      assert.ok(rate, `${article.slug}: usd_rate format`);
      const amount = figure.value.match(/([A-Z]{3}) ([\d.]+) (billion|million)/);
      const usd = figure.usd.match(/^USD ([\d.]+) (billion|million)/);
      assert.ok(amount && usd, `${article.slug}: ${figure.label} amount and usd parse`);
      const toNumber = (n, unit) => Number(n) * (unit === "billion" ? 1e9 : 1e6);
      const local = toNumber(amount[2], amount[3]);
      const expected = rate[1] === "USD" ? local / Number(rate[2]) : local * Number(rate[2]);
      const actual = toNumber(usd[1], usd[2]);
      assert.ok(Math.abs(actual - expected) / expected < 0.01, `${article.slug}: ${figure.label} ${figure.usd} vs ${expected}`);
    }
  }
});

test("category filter narrows news by hub and keeps topic and page in links", async () => {
  const { hubCategoriesForNews } = await import("../lib/hubCategories.ts");
  const articles = getNews();
  const pool = selectNews(articles, undefined, "1", "pool-robots");
  assert.equal(pool.category, "pool-robots");
  assert.ok(pool.total > 0);
  assert.ok(pool.articles.every((article) => hubCategoriesForNews(article).includes("pool-robots")));
  const combined = selectNews(articles, "companies", "1", "pool-robots");
  assert.ok(combined.articles.every((article) => article.topic === "companies"));
  assert.equal(selectNews(articles, undefined, "1", "not-a-hub").category, undefined);
  assert.equal(newsHref("companies", 2, "pool-robots"), "/news?topic=companies&category=pool-robots&page=2");
  assert.equal(newsHref(undefined, 1), "/news");
});
