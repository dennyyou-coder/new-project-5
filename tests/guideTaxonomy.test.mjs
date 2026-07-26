import assert from "node:assert/strict";
import test from "node:test";
import {
  GUIDE_TYPE_CONFIG,
  isContentClass,
  isGuideType
} from "../lib/guideTaxonomy.ts";

test("publishes exactly six reader-facing guide types", () => {
  assert.deepEqual(
    GUIDE_TYPE_CONFIG.map(({ type }) => type),
    ["buying", "ownership", "comparison", "sourcing", "maintenance", "explainer"]
  );
  assert.equal(isContentClass("editorial"), true);
  assert.equal(isContentClass("search"), true);
  assert.equal(isContentClass("seo"), false);
  assert.equal(isGuideType("comparison"), true);
  assert.equal(isGuideType("other"), false);
});

test("guide config exposes stable crawlable paths and reader-facing labels", () => {
  for (const guide of GUIDE_TYPE_CONFIG) {
    assert.equal(guide.href, `/guides/${guide.type}`);
    assert.doesNotMatch(
      `${guide.label} ${guide.description}`,
      /\bSEO\b|Search Content|Traffic Articles/i
    );
  }
});
