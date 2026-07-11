import assert from "node:assert/strict";
import test from "node:test";
import {
  createBlogCtaContext,
  getBlogCta
} from "../lib/blogConversion.ts";

test("maps buying content to sourcing", () => {
  for (const category of ["Buyer Guide", "Sourcing Guide", "Sourcing"]) {
    assert.equal(getBlogCta(category).type, "sourcing");
  }
});

test("maps market content to reports", () => {
  for (const category of [
    "Market Signals",
    "Industry",
    "Supply Chain",
    "Supply Chain Analysis",
    "Commercial Cleaning"
  ]) {
    assert.equal(getBlogCta(category).type, "reports");
  }
});

test("maps trade shows to expo and unknown categories to newsletter", () => {
  assert.equal(getBlogCta("Trade Shows").type, "expo");
  assert.equal(getBlogCta("Floorcare").type, "newsletter");
});

test("creates stable article analytics context", () => {
  assert.deepEqual(
    createBlogCtaContext({
      category: "Buyer Guide",
      slug: "robot-vacuum-guide",
      location: "article_footer"
    }),
    {
      article_category: "Buyer Guide",
      article_slug: "robot-vacuum-guide",
      cta_location: "article_footer",
      cta_type: "sourcing"
    }
  );
});
