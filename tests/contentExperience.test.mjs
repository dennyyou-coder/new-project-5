import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [blog, blogLanding, archive, article, css, sitemap] = await Promise.all([
  read("app/blog/page.tsx"),
  read("components/BlogLanding.tsx"),
  read("app/blog/archive/page.tsx"),
  read("app/blog/[slug]/page.tsx"),
  read("app/globals.css"),
  read("app/sitemap.ts")
]);

test("Blog uses the approved full-width landing without a sidebar", () => {
  assert.match(blog, /blog-home-intro/);
  assert.match(blog, /<BlogBusinessLinks \/>/);
  assert.match(blogLanding, /Explore Market Reports/);
  assert.match(blogLanding, /Discuss Product Opportunities/);
  assert.doesNotMatch(blog, /SidebarContent/);
  assert.doesNotMatch(blog, /<aside/);
});

test("Blog landing does not introduce a nested main landmark", () => {
  assert.doesNotMatch(blog, /<main className="insights-feed"/);
  assert.doesNotMatch(blogLanding, /<main\b/);
});

test("Blog images use intentional eager and lazy loading", () => {
  assert.match(blogLanding, /fetchPriority="high"/);
  assert.match(blogLanding, /loading="lazy"/);
  assert.match(blogLanding, /decoding="async"/);
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
  assert.match(css, /\.blog-home-intro/);
  assert.match(css, /\.archive-category-summary/);
  assert.match(css, /\.blog-visible-breadcrumb/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /content-visibility:\s*auto/);
  assert.match(css, /\.blog-archive-actions span\s*\{[^}]*gap:\s*4px/);
});

test("Sitemap keeps Blog and Archive discoverable", () => {
  assert.match(sitemap, /"\/blog"/);
  assert.match(sitemap, /"\/blog\/archive"/);
});

test("Archive separates analysis and guides without changing article links", () => {
  assert.match(archive, /Analysis &amp; Insights/);
  assert.match(archive, /Guides &amp; Comparisons/);
  assert.match(archive, /href="#analysis"/);
  assert.match(archive, /href="#guides"/);
  assert.match(archive, /getEditorialInsights/);
  assert.match(archive, /getGuideInsights/);
  assert.match(archive, /href=\{`\/blog\/\$\{article\.slug\}`\}/);
});

test("article breadcrumbs reflect the reader-facing collection", () => {
  assert.match(article, /article\.contentClass === "search"/);
  assert.match(article, /\/guides\/\$\{article\.guideType\}/);
  assert.match(article, /collectionName/);
  assert.match(article, /World Clean Biz Industry Guides/);
  assert.match(article, /url: `\$\{siteUrl\}\$\{collectionHref\}`/);
});
