import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getTopics, getTopic, getTopicsFor, topicDate } from "../lib/topics.ts";
import { buildBlogSitemap } from "../lib/sitemaps.ts";

test("every topic resolves its articles, news, cover and links", () => {
  const topics = getTopics();
  assert.ok(topics.length >= 2);
  for (const summary of topics) {
    const topic = getTopic(summary.slug);
    assert.ok(topic, summary.slug);
    assert.equal(topic.insightArticles.length, topic.insights.length, `${topic.slug} lists an unknown insight`);
    assert.equal(topic.newsArticles.length, topic.news.length, `${topic.slug} lists an unknown news story`);
    assert.ok(topic.summary.length && topic.timeline.length && topic.questions.length && topic.sources.length, topic.slug);
    assert.ok(topic.seoTitle === undefined || topic.seoTitle.length <= 60, `${topic.slug} seoTitle too long`);
    if (topic.coverImage) assert.ok(fs.existsSync(`public${topic.coverImage}`), `${topic.slug} cover missing`);
    for (const event of topic.timeline) {
      assert.match(event.date, /^\d{4}-\d{2}(-\d{2})?$/);
      if (event.href) {
        const [, kind, slug] = event.href.split("/");
        const dir = kind === "news" ? "content/news" : "content/insights";
        assert.ok([".md", ".mdx"].some((ext) => fs.existsSync(`${dir}/${slug}${ext}`)), `${topic.slug} timeline link ${event.href}`);
      }
    }
    for (const slug of topic.insights) assert.ok(getTopicsFor("insight", slug).some((item) => item.slug === topic.slug));
  }
});

test("topic dates format for days and months", () => {
  assert.equal(topicDate("2026-07-28"), "28 Jul 2026");
  assert.equal(topicDate("2025-12"), "Dec 2025");
});

test("topic pages are listed in the blog sitemap", () => {
  const urls = buildBlogSitemap().map((entry) => entry.url);
  assert.ok(urls.includes("https://worldcleanbiz.com/topics"));
  for (const topic of getTopics()) assert.ok(urls.includes(`https://worldcleanbiz.com/topics/${topic.slug}`));
});

test("company photos exist on disk with a small version and a credit", () => {
  for (const file of fs.readdirSync("content/brands").filter((name) => name.endsWith(".json"))) {
    const profile = JSON.parse(fs.readFileSync(`content/brands/${file}`, "utf8"));
    for (const photo of profile.photos ?? []) {
      assert.ok(fs.existsSync(`public${photo.src}`), `${file} ${photo.src}`);
      assert.ok(fs.existsSync(`public${photo.src.replace(/\.webp$/, "-600.webp")}`), `${file} small ${photo.src}`);
      assert.ok(photo.caption && photo.credit, `${file} caption/credit`);
    }
  }
});
