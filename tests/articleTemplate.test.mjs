import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseFrontmatter } from "../lib/content.ts";

const template = fs.readFileSync(new URL("../app/blog/[slug]/page.tsx", import.meta.url), "utf8");

test("industry_view frontmatter parses as a list", () => {
  const { data } = parseFrontmatter('---\ntitle: "x"\nindustry_view:\n  - "First point"\n  - "Second point"\n---\nBody');
  assert.deepEqual(data.industry_view, ["First point", "Second point"]);
});

test("article template: takeaways box, guide-only Industry view, author box and subscribe bar", () => {
  assert.match(template, /<strong>Key takeaways<\/strong>/);
  assert.match(template, /\{isGuide && article\.industryView\.length \? \(/);
  assert.match(template, /href=\{`\/categories\/\$\{hub\.slug\}`\}/);
  assert.match(template, /className="blog-author-bio-box"/);
  assert.match(template, /ctaForm !== "newsletter"[\s\S]*className="blog-subscribe-bar"/);
});
