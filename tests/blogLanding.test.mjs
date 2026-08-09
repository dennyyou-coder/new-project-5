import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readRouteStyles } from "./readRouteStyles.mjs";

const componentSource = await readFile(
  new URL("../components/BlogLanding.tsx", import.meta.url),
  "utf8"
).catch(() => "");
const headerSource = await readFile(
  new URL("../components/Header.tsx", import.meta.url),
  "utf8"
);
const cssSource = readRouteStyles("content-directories.css");

test("article cards are ordinary whole-card links", () => {
  assert.match(componentSource, /className="blog-home-card"/);
  assert.match(componentSource, /href=\{`\/blog\/\$\{article\.slug\}`\}/);
  assert.match(componentSource, /aria-label=\{`Read \$\{article\.title\}`\}/);
});

test("landing components expose series, grid, and business modules", () => {
  assert.match(componentSource, /export function BlogSeriesHero/);
  assert.match(componentSource, /export function BlogArticleGrid/);
  assert.match(componentSource, /export function BlogBusinessLinks/);
});

test("series hero provides latest episode and all episodes links", () => {
  assert.match(componentSource, /Read latest episode/);
  assert.match(componentSource, /View all episodes/);
});

test("primary navigation keeps Blog and removes Guides", () => {
  assert.match(headerSource, /href: "\/blog", label: "Blog"/);
  assert.doesNotMatch(headerSource, /href: "\/guides", label: "Guides"/);
});

test("Blog grids use three, two, and one columns at responsive breakpoints", () => {
  assert.match(cssSource, /\.blog-home-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s);
  assert.match(cssSource, /@media \(max-width: 900px\)[\s\S]*\.blog-home-grid\s*\{[^}]*repeat\(2,/);
  assert.match(cssSource, /@media \(max-width: 760px\)[\s\S]*\.blog-home-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
});

test("Blog section variants bind through data attributes", () => {
  assert.match(componentSource, /<section className="blog-home-section" data-variant=\{variant\}/);
  assert.doesNotMatch(componentSource, /blog-home-section-\$\{variant\}/);
  assert.match(cssSource, /\.blog-home-section\[data-variant="guide"\]/);
  assert.doesNotMatch(cssSource, /\.blog-home-section-guide/);
});

test("Blog landing links have a visible solid keyboard focus ring", () => {
  const focusRule = cssSource.match(
    /([^{}]*\.blog-home-card:focus-visible[^{}]*)\{([^}]*)\}/
  );

  assert.ok(focusRule);
  for (const selector of [
    ".blog-home-card:focus-visible",
    ".blog-home-series-main:focus-visible",
    ".blog-home-series-all:focus-visible",
    ".blog-home-section-heading > a:focus-visible",
    ".blog-home-business nav a:focus-visible"
  ]) {
    assert.ok(focusRule[1].includes(selector), `missing ${selector}`);
  }
  assert.match(focusRule[2], /outline:\s*3px solid\s+#[0-9a-f]{6}/i);
});

test("Blog landing respects reduced-motion preferences", () => {
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(
    cssSource,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.blog-home-card[\s\S]*transition:\s*none/
  );
  assert.match(
    cssSource,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.blog-home-card:hover[\s\S]*transform:\s*none/
  );
});

test("Blog newsletter trigger and button are full width through 760px", () => {
  assert.match(
    cssSource,
    /@media \(max-width: 760px\)[\s\S]*\.blog-home-main \.insights-newsletter-cta \.lead-form-trigger,\s*\.blog-home-main \.insights-newsletter-cta \.lead-form-trigger > button\s*\{[^}]*width:\s*100%/
  );
});

test("Blog landing artwork stays fully visible instead of being cropped", () => {
  assert.match(
    cssSource,
    /\.blog-home-series-image img\s*\{[^}]*object-fit:\s*contain/
  );
  assert.match(
    cssSource,
    /\.blog-home-card-image img\s*\{[^}]*object-fit:\s*contain/
  );
  assert.doesNotMatch(
    cssSource,
    /\.blog-home-card:hover \.blog-home-card-image img\s*\{[^}]*transform:\s*scale/
  );
});
