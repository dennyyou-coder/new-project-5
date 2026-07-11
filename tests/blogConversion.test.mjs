import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createBlogCtaContext,
  getBlogCta
} from "../lib/blogConversion.ts";

const blogCtaSource = await readFile(
  new URL("../components/BlogConversionCta.tsx", import.meta.url),
  "utf8"
).catch(() => "");
const blogSource = await readFile(
  new URL("../app/blog/page.tsx", import.meta.url),
  "utf8"
);
const articleSource = await readFile(
  new URL("../app/blog/[slug]/page.tsx", import.meta.url),
  "utf8"
);
const homeSource = await readFile(
  new URL("../app/page.tsx", import.meta.url),
  "utf8"
);

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

test("Blog CTA tracks views and clicks through the shared Tally transport", () => {
  assert.match(blogCtaSource, /cta_view/);
  assert.match(blogCtaSource, /cta_click/);
  assert.match(blogCtaSource, /TallyButton/);
  assert.doesNotMatch(blogCtaSource, /category ===/);
});

test("Blog metadata relies on the root title template exactly once", () => {
  assert.match(blogSource, /title: "Blog"/);
  assert.doesNotMatch(blogSource, /title: "Blog \| World Clean Biz"/);
  assert.match(blogSource, /openGraph:/);
  assert.match(
    blogSource,
    /\/images\/industry\/about-forum-stage-2025\.jpg/
  );
});

test("article footer uses one mapped conversion CTA", () => {
  assert.match(articleSource, /<BlogConversionCta/);
  assert.match(articleSource, /category=\{article\.category\}/);
  assert.match(articleSource, /slug=\{article\.slug\}/);
  assert.doesNotMatch(articleSource, /article_footer_contact/);
  assert.doesNotMatch(articleSource, />Get Free Reports</);
});

test("Blog keeps a dedicated Newsletter form and homepage stays outside this batch", () => {
  assert.match(blogSource, /<NewsletterLeadForm \/>/);
  assert.doesNotMatch(homeSource, /BlogConversionCta/);
});
