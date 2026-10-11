import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { discoverArticleInventory } from '../scripts/article-images/references.mjs';
import { buildManifest } from '../scripts/article-images/manifest.mjs';
import { verifyPageGalleryImages } from '../scripts/verify-built-article-images.mjs';

test('page records preserve the destination without changing article classification', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'wcb-page-gallery-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const contentRoot = path.join(root, 'content');
  fs.mkdirSync(path.join(contentRoot, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(contentRoot, 'insights'));
  const record = path.join(contentRoot, 'pages', 'gallery.mdx');
  fs.writeFileSync(record, '---\npage_route: "/about"\n---\n');
  fs.writeFileSync(path.join(contentRoot, 'insights', 'article.mdx'), '---\ntitle: "Article"\n---\n');
  const inventory = discoverArticleInventory({ contentRoot, publicRoot: root });
  const manifest = buildManifest({ inventory, processedAssets: {}, processorVersion: '1' });
  assert.equal(manifest.articles.gallery.pageRoute, '/about');
  assert.equal(manifest.articles.article.pageRoute, undefined);
  fs.writeFileSync(record, '---\npage_route: "/../about"\n---\n');
  assert.throws(() => discoverArticleInventory({ contentRoot, publicRoot: root }), /safe site path/);
  fs.writeFileSync(record, '---\npage_route: "/about"\n---\n');
  fs.writeFileSync(path.join(contentRoot, 'insights', 'article.mdx'), '---\npage_route: "/about"\n---\n');
  assert.throws(() => discoverArticleInventory({ contentRoot, publicRoot: root }), /content\/pages/);
});

test('built gallery checks reject missing photos, broken responsive candidates and dimensions', t => {
  const publicRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wcb-gallery-public-'));
  t.after(() => fs.rmSync(publicRoot, { recursive: true, force: true }));
  fs.mkdirSync(path.join(publicRoot, 'images'));
  fs.writeFileSync(path.join(publicRoot, 'images', 'cover.webp'), 'fixture');
  fs.writeFileSync(path.join(publicRoot, 'images', 'small.webp'), 'fixture');
  const url = '/images/cover.webp';
  const options = { slug: 'gallery', publicRoot, article: { cover: url, body: [] }, manifest: { assets: { [url]: { width: 1600, height: 900, mobile: { src: '/images/small.webp', width: 800 } } } } };
  const html = '<img src="/images/cover.webp" width="1600" height="900" sizes="650px" decoding="async" loading="lazy" srcset="/images/small.webp 800w, /images/cover.webp 1600w">';
  assert.deepEqual(verifyPageGalleryImages({ ...options, html }), []);
  assert.equal(verifyPageGalleryImages({ ...options, html: '' })[0].code, 'BUILT_PAGE_IMAGE_MISSING');
  assert.ok(verifyPageGalleryImages({ ...options, html: html.replace('width="1600"', 'width="100"') }).some(f => f.code === 'BUILT_PAGE_IMAGE_ATTRIBUTES'));
  fs.unlinkSync(path.join(publicRoot, 'images', 'small.webp'));
  assert.ok(verifyPageGalleryImages({ ...options, html }).some(f => f.code === 'BUILT_CANDIDATE_MISSING'));
});
