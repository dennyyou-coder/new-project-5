import assert from "node:assert/strict";
import test from "node:test";
import {
  HUB_CATEGORIES,
  HUB_CATEGORY_SLUGS,
  explicitHubCategories,
  getHubCategory,
  hubCategoriesForBrand,
  hubCategoriesForInsight,
  hubCategoriesForNews,
  hubCategoriesForProduct
} from "../lib/hubCategories.ts";
import { getInsights } from "../lib/content.ts";
import { getNews } from "../lib/news.ts";
import { productModels } from "../lib/products.ts";
import { getPublishedBrandProfiles } from "../lib/brands.ts";
import { getBrandCategoriesForProfile } from "../lib/brandCategories.ts";

test("nine hubs with unique slugs, names, groups and colours", () => {
  assert.equal(HUB_CATEGORIES.length, 9);
  assert.deepEqual(HUB_CATEGORIES.map((hub) => hub.slug), [...HUB_CATEGORY_SLUGS]);
  assert.equal(new Set(HUB_CATEGORIES.map((hub) => hub.name)).size, 9);
  for (const hub of HUB_CATEGORIES) {
    assert.match(hub.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(hub.color, /^#[0-9a-f]{6}$/);
    assert.ok(hub.intro.length > 20 && hub.intro.length < 160, `${hub.slug} intro length`);
    assert.ok(["core-cleaning", "adjacent-industries"].includes(hub.group));
  }
  assert.equal(getHubCategory("pool-robots")?.name, "Pool robots");
  assert.equal(getHubCategory("not-a-hub"), undefined);
});

test("articles are classified by normalized category and tags", () => {
  assert.deepEqual(hubCategoriesForInsight({ category: "Pool Cleaning", tags: [] }), ["pool-robots"]);
  assert.deepEqual(
    hubCategoriesForInsight({ category: "Industry", tags: ["Robot Vacuum", "Power Tools"] }),
    ["robot-vacuums", "power-tools-outdoor"]
  );
  assert.deepEqual(hubCategoriesForInsight({ category: "Industry", tags: ["Manufacturing"] }), []);
});

test("explicit hub_categories are kept, validated and merged with derived hubs", () => {
  assert.deepEqual(explicitHubCategories(["Window-Robots", "nope", "pool-robots"]), ["window-robots", "pool-robots"]);
  assert.deepEqual(explicitHubCategories(undefined), []);
  assert.deepEqual(
    hubCategoriesForInsight({ category: "Pool Cleaning", tags: [], hubCategories: ["window-robots"] }),
    ["pool-robots", "window-robots"]
  );
});

test("news is classified by category and whole-word title terms", () => {
  assert.deepEqual(hubCategoriesForNews({ category: "Robot Mowers", title: "x" }), ["robotic-mowers"]);
  assert.deepEqual(
    hubCategoriesForNews({ category: "Cleaning Industry", title: "Brand X launches two robot vacuums" }),
    ["robot-vacuums"]
  );
  assert.deepEqual(hubCategoriesForNews({ category: "Cleaning Industry", title: "Quarterly results" }), []);
});

test("products and brands map through their existing categories", () => {
  assert.deepEqual(hubCategoriesForProduct({ category: "Window robots" }), ["window-robots"]);
  assert.deepEqual(hubCategoriesForProduct({ category: "Unknown" }), []);
  assert.deepEqual(hubCategoriesForBrand(["power-tools"]), ["power-tools-outdoor"]);
  assert.deepEqual(hubCategoriesForBrand(["pool-equipment-pool-care"]), ["pool-robots"]);
});

test("every hub matches at least one news item, article or product in the content", () => {
  const insights = getInsights();
  const news = getNews();
  const brands = getPublishedBrandProfiles(insights);
  for (const hub of HUB_CATEGORIES) {
    const counts = {
      articles: insights.filter((item) => hubCategoriesForInsight(item).includes(hub.slug)).length,
      news: news.filter((item) => hubCategoriesForNews(item).includes(hub.slug)).length,
      products: productModels.filter((item) => hubCategoriesForProduct(item).includes(hub.slug)).length,
      brands: brands.filter((brand) =>
        hubCategoriesForBrand(getBrandCategoriesForProfile(brand.slug).map((category) => category.slug)).includes(hub.slug)
      ).length
    };
    assert.ok(counts.articles + counts.news + counts.products > 0, `${hub.slug}: ${JSON.stringify(counts)}`);
  }
});

test("every product category in the catalogue belongs to a hub", () => {
  for (const category of new Set(productModels.map((product) => product.category))) {
    assert.ok(hubCategoriesForProduct({ category }).length > 0, `${category} has no hub`);
  }
});

test("hub pages are in the discovery sitemap and each has content to show", async () => {
  const { buildDiscoverySitemap } = await import("../lib/sitemaps.ts");
  const { getAllHubCategoryData } = await import("../lib/hubCategoryContent.ts");
  const urls = new Set(buildDiscoverySitemap().map((entry) => entry.url));
  assert.ok(urls.has("https://worldcleanbiz.com/categories"));
  for (const hub of HUB_CATEGORIES) {
    assert.ok(urls.has(`https://worldcleanbiz.com/categories/${hub.slug}`), `${hub.slug} in sitemap`);
  }
  for (const data of getAllHubCategoryData()) {
    const modules = [data.feed, data.newModels, data.essential, data.companies, data.guides].filter((list) => list.length > 0);
    assert.ok(modules.length > 0, `${data.hub.slug} has at least one module`);
    assert.ok(data.feed.every((item, index, all) => index === 0 || Date.parse(all[index - 1].date.length === 10 ? `${all[index - 1].date}T00:00:00+08:00` : all[index - 1].date) >= Date.parse(item.date.length === 10 ? `${item.date}T00:00:00+08:00` : item.date)), `${data.hub.slug} feed newest first`);
  }
});
