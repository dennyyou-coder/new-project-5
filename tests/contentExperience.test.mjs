import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [blog, archive, article, css, sitemap] = await Promise.all([
  read("app/blog/page.tsx"),
  read("app/blog/archive/page.tsx"),
  read("app/blog/[slug]/page.tsx"),
  read("app/globals.css"),
  read("app/sitemap.ts")
]);

test("Blog has one responsive sidebar and clear commercial entry points", () => {
  assert.match(blog, /blog-editorial-intro/);
  assert.match(blog, /Explore Market Reports/);
  assert.match(blog, /Discuss Product Opportunities/);
  assert.equal((blog.match(/<SidebarContent/g) || []).length, 1);
  assert.doesNotMatch(blog, /insights-sidebar-desktop/);
  assert.doesNotMatch(blog, /insights-sidebar-mobile/);
});

test("Blog images use intentional eager and lazy loading", () => {
  assert.match(blog, /fetchPriority="high"/);
  assert.match(blog, /loading="lazy"/);
  assert.match(blog, /decoding="async"/);
});

test("Archive exposes coverage, reading metadata, and structured data", () => {
  assert.match(archive, /archive-category-summary/);
  assert.match(archive, /articles\.length/);
  assert.match(archive, /article\.readingTime/);
  assert.match(archive, /CollectionPage/);
  assert.match(archive, /ItemList/);
  assert.match(archive, /BreadcrumbList/);
  assert.match(archive, /Explore Market Reports/);
  assert.match(archive, /Explore Sourcing/);
});

test("Article template strengthens trust and related discovery without changing body conversion", () => {
  assert.match(article, /blog-visible-breadcrumb/);
  assert.match(article, /publishedTime/);
  assert.match(article, /href="\/about"/);
  assert.match(article, /className="related-signal-image"/);
  assert.match(article, /loading="lazy"/);
  assert.match(article, /<BlogConversionCta/);
  assert.equal((article.match(/<BlogConversionCta/g) || []).length, 1);
});

test("Article schema includes author identity, section, keywords, and publisher logo", () => {
  assert.match(article, /articleSection: article\.category/);
  assert.match(article, /keywords: article\.tags/);
  assert.match(article, /url: `\$\{siteUrl\}\/about`/);
  assert.match(article, /logo:/);
  assert.match(article, /isPartOf:/);
});

test("Content pages have isolated responsive and long-reading styles", () => {
  assert.match(css, /Content experience optimization/);
  assert.match(css, /\.blog-editorial-intro/);
  assert.match(css, /\.archive-category-summary/);
  assert.match(css, /\.blog-visible-breadcrumb/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /content-visibility:\s*auto/);
});

test("Sitemap keeps Blog and Archive discoverable", () => {
  assert.match(sitemap, /"\/blog"/);
  assert.match(sitemap, /"\/blog\/archive"/);
});
