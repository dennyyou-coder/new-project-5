import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readRouteStyles } from "./readRouteStyles.mjs";

const read = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8").catch(() => "");

const [landing, category, directory, css] = await Promise.all([
  read("app/guides/listing.tsx"),
  read("app/guides/[type]/page.tsx") + read("app/guides/[type]/listing.tsx"),
  read("components/ContentDirectory.tsx"),
  Promise.resolve(readRouteStyles("content-directories.css"))
]);
const [header, footer, sitemap] = await Promise.all([
  read("components/Header.tsx"),
  read("components/Footer.tsx"),
  read("lib/sitemaps.ts")
]);

test("Guides landing has reader-facing categories and editorial return path", () => {
  assert.match(landing, /Industry Guides/);
  assert.match(landing, /GUIDE_TYPE_CONFIG/);
  assert.match(landing, /Guide Categories/);
  assert.match(landing, /Essential Guides/);
  assert.match(landing, /<ContentDirectory/);
  assert.match(landing, /paginateDirectoryItems/);
  assert.doesNotMatch(
    landing,
    /\bSEO Articles\b|Search Content|Traffic Articles/i
  );
});

test("Guide category pages are static, canonical and structured", () => {
  assert.match(category, /generateStaticParams/);
  assert.match(category, /generateMetadata/);
  assert.match(category, /BreadcrumbList/);
  assert.match(category, /ItemList/);
  assert.match(category, /notFound\(\)/);
});

test("Guide feed rows retain existing article URLs", () => {
  assert.match(directory, /href=\{`\/blog\/\$\{article\.slug\}`\}/);
});

test("directory sidebar supports guide categories and important content", () => {
  assert.match(directory, /<DirectorySidebar/);
  assert.match(directory, /featuredSeriesArticle/);
  assert.doesNotMatch(directory, /Latest Articles/);
});

test("Guides have isolated responsive styles", () => {
  assert.match(css, /Analysis and Guides directories/);
  assert.match(css, /\.content-directory-series/);
  assert.match(css, /\.content-directory-profile/);
  assert.match(css, /\.content-directory-keywords/);
  assert.match(css, /\.content-directory-layout/);
  assert.match(css, /\.content-directory-feed-item/);
  assert.match(css, /\.content-directory-sidebar/);
  assert.match(css, /data-sidebar-mode="analysis"/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /object-fit:\s*contain/);
});

test("Guide routes do not introduce a second main landmark", () => {
  assert.doesNotMatch(landing, /<main className="guides-hub"/);
  assert.doesNotMatch(category, /<main className="guides-hub/);
});

test("primary navigation links Guides from the Insights menu while discovery routes remain", () => {
  // Since Nov 2026 Guides sits in the Insights menu with Deep analysis, the journal, videos and reports.
  assert.match(header, /id: "insights",[\s\S]*\{ href: "\/guides", label: "Guides" \}/);
  assert.match(footer, /href="\/guides"/);
  assert.match(sitemap, /"\/guides"/);
  assert.match(sitemap, /GUIDE_TYPE_CONFIG/);
});
