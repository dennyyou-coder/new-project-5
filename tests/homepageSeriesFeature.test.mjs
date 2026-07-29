import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentSource = await readFile(
  new URL("../components/HomeSeriesFeature.tsx", import.meta.url),
  "utf8"
);
const cssSource = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8"
);

test("founder-series card keeps the approved identity and semantic hierarchy", () => {
  assert.match(componentSource, /Founder Series · Latest Episode/);
  assert.match(
    componentSource,
    /Building the World’s No\.1 Cleaning Show from Scratch/
  );
  assert.equal((componentSource.match(/<h2/g) || []).length, 1);
  assert.equal((componentSource.match(/<h3/g) || []).length, 1);
  assert.doesNotMatch(componentSource, /<h1/);
});

test("founder-series card derives article and permanent-series destinations", () => {
  assert.match(componentSource, /getFeaturedSeriesLinks\(article\)/);
  assert.match(componentSource, /href=\{articleHref\}/);
  assert.match(componentSource, /href=\{seriesHref\}/);
  assert.match(componentSource, /Read Latest Episode/);
  assert.match(componentSource, /View All Episodes/);
});

test("founder-series card preserves cover metadata and has a local fallback", () => {
  assert.match(componentSource, /article\.coverImage \|\| fallbackCover/);
  assert.match(componentSource, /article\.coverAlt \|\| `\$\{seriesTitle\} cover`/);
  assert.match(
    componentSource,
    /building-worlds-no-1-cleaning-show-episode-01-cover\.webp/
  );
  assert.match(componentSource, /fetchPriority="high"/);
});

test("founder-series Hero styles keep the complete cover visible", () => {
  assert.match(
    cssSource,
    /\.home-v9-series-media\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9;/s
  );
  assert.match(
    cssSource,
    /\.home-v9-series-media img\s*\{[^}]*object-fit:\s*contain;/s
  );
});

test("founder-series Hero stacks and exposes full-width mobile actions", () => {
  assert.match(
    cssSource,
    /@media \(max-width: 1050px\)[\s\S]*?\.home-v9-series-card\s*\{[^}]*max-width:\s*720px;/s
  );
  assert.match(
    cssSource,
    /@media \(max-width: 720px\)[\s\S]*?\.home-v9-series-actions\s*\{[^}]*grid-template-columns:\s*1fr;/s
  );
  assert.match(
    cssSource,
    /\.home-v9-series-actions a:focus-visible\s*\{[^}]*outline:/s
  );
});
