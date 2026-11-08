import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import { getInsights } from "@/lib/content";
import { getNews } from "@/lib/news";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getArticleIndex, getNewsIndex, getSiteIndexOverview } from "@/lib/siteIndex";
import { buildDiscoverySitemap } from "@/lib/sitemaps";

const hrefs = (groups) => new Set(groups.flatMap((group) => group.links.map((link) => link.href)));

test("site index links every article, news story and company", () => {
  const articles = hrefs(getArticleIndex());
  for (const article of getInsights()) assert.ok(articles.has(`/blog/${article.slug}`), article.slug);
  const news = hrefs(getNewsIndex());
  for (const story of getNews()) assert.ok(news.has(`/news/${story.slug}`), story.slug);
  const overview = hrefs(getSiteIndexOverview().groups);
  for (const brand of getPublishedBrandProfiles(getInsights())) assert.ok(overview.has(`/brands/${brand.slug}`), brand.slug);
});

test("site index pages are in the sitemap and linked from the footer", () => {
  const urls = new Set(buildDiscoverySitemap().map((entry) => entry.url));
  for (const path of ["/site-index", "/site-index/articles", "/site-index/news"]) {
    assert.ok(urls.has(`https://worldcleanbiz.com${path}`), path);
  }
  assert.match(readFileSync("components/Footer.tsx", "utf8"), /href="\/site-index"/);
});

test("article redirects point at articles that exist", () => {
  const config = readFileSync("next.config.ts", "utf8");
  const targets = [...config.matchAll(/destination: "\/blog\/([a-z0-9-]+)"/g)].map((match) => match[1]);
  assert.ok(targets.length > 0);
  for (const slug of targets) {
    assert.ok(existsSync(`content/insights/${slug}.mdx`) || existsSync(`content/insights/${slug}.md`), slug);
  }
});
