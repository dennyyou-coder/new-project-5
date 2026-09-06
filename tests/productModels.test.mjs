import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import './register-path-alias.mjs';
import { productModels, featuredProductModels, productSelectionYear, getProduct, productSourcingRoutes } from '../lib/products.ts';
import { getInsights } from '../lib/content.ts';
import { getPublishedBrandProfiles } from '../lib/brands.ts';
import { buildDiscoverySitemap } from '../lib/sitemaps.ts';
import { getArticleImage } from '../lib/articleImages.ts';

const articles = getInsights();
const articleSlugs = new Set(articles.map(item => item.slug));
const brandSlugs = new Set(getPublishedBrandProfiles(articles).map(item => item.slug));

test('model profiles have unique routes, official provenance and real prepared images', () => {
  assert.equal(productModels.length, 10);
  assert.equal(new Set(productModels.map(item => item.slug)).size, productModels.length);
  for (const model of productModels) {
    const page = getProduct(model.slug);
    assert.ok(page.content.includes('## Versions and market differences'), model.slug);
    assert.ok(page.content.includes('## Maintenance and ownership'), model.slug);
    assert.ok(model.market && model.verifiedAt && model.facts.length >= 4);
    assert.ok(model.sources.length > 0);
    for (const source of model.sources) assert.equal(new URL(source.url).protocol, 'https:');
    assert.equal(new URL(model.imageSource).protocol, 'https:');
    assert.ok(getArticleImage(page.coverImage).width > 0);
    assert.ok(fs.existsSync(`public${page.coverImage}`));
    assert.ok(brandSlugs.has(model.brandSlug), `Unpublished brand ${model.brandSlug}`);
    assert.ok(productSourcingRoutes[model.category]);
    for (const article of model.articles) assert.ok(articleSlugs.has(article), `Missing article ${article}`);
    for (const slug of model.related) {
      const other = getProduct(slug);
      assert.ok(other && slug !== model.slug);
      assert.equal(other.category, model.category);
    }
  }
});

test('products stay out of the blog and each model is discoverable in the sitemap', () => {
  const urls = new Set(buildDiscoverySitemap().map(item => item.url));
  assert.ok(urls.has('https://worldcleanbiz.com/products'));
  for (const model of productModels) {
    assert.ok(!articleSlugs.has(model.slug));
    assert.ok(urls.has(`https://worldcleanbiz.com/products/${model.slug}`));
  }
  assert.equal(getProduct('unlisted-model'), undefined);
  assert.equal(getProduct('../../package'), undefined);
});


test('first selection contains only sourced 2026 launches and preserves older published routes', () => {
  assert.equal(productSelectionYear, 2026);
  assert.equal(featuredProductModels.length, 7);
  for (const model of featuredProductModels) {
    assert.equal(model.launchYear, 2026);
    assert.ok(model.launchNote);
    assert.ok(model.sources.some(source => source.url === model.launchSource));
    if (model.announced) assert.ok(model.announced.startsWith('2026-'));
  }
  for (const slug of ['dyson-v16-piston-animal', 'sunseeker-s4', 'wybot-s3']) {
    assert.ok(!featuredProductModels.some(model => model.slug === slug));
    assert.equal(getProduct(slug).launchYear, 2025);
  }
});
