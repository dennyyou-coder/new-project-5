import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8").catch(() => "");

const [landing, category, card, css] = await Promise.all([
  read("app/guides/page.tsx"),
  read("app/guides/[type]/page.tsx"),
  read("components/GuideCard.tsx"),
  read("app/globals.css")
]);
const [header, footer, sitemap] = await Promise.all([
  read("components/Header.tsx"),
  read("components/Footer.tsx"),
  read("app/sitemap.ts")
]);

test("Guides landing has reader-facing categories and editorial return path", () => {
  assert.match(landing, /Industry Guides/);
  assert.match(landing, /GUIDE_TYPE_CONFIG/);
  assert.match(landing, /Featured Guides/);
  assert.match(landing, /Read Industry Analysis/);
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

test("Guide cards retain existing article URLs", () => {
  assert.match(card, /href=\{`\/blog\/\$\{article\.slug\}`\}/);
});

test("Guides have isolated responsive styles", () => {
  assert.match(css, /Guides content hub/);
  assert.match(css, /\.guides-category-grid/);
  assert.match(css, /\.guide-card/);
});

test("Guides are reachable from global navigation and sitemap", () => {
  assert.match(header, /\{ href: "\/guides", label: "Guides" \}/);
  assert.match(footer, /href="\/guides"/);
  assert.match(sitemap, /"\/guides"/);
  assert.match(sitemap, /GUIDE_TYPE_CONFIG/);
});
