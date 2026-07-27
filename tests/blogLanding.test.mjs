import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentSource = await readFile(
  new URL("../components/BlogLanding.tsx", import.meta.url),
  "utf8"
).catch(() => "");
const headerSource = await readFile(
  new URL("../components/Header.tsx", import.meta.url),
  "utf8"
);
const cssSource = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8"
);

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
  assert.match(componentSource, /#series-episodes/);
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
