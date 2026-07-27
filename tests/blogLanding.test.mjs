import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentSource = await readFile(
  new URL("../components/BlogLanding.tsx", import.meta.url),
  "utf8"
).catch(() => "");

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
