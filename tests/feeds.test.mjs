import assert from "node:assert/strict";
import test from "node:test";
import { buildNewsSitemap, buildRss, feedItems, xmlEscape } from "../lib/feeds.ts";
import { authorFor, authorHref } from "../lib/authors.ts";
import { searchSite } from "../lib/search.ts";

test("RSS feed lists news and analysis newest first with escaped titles", () => {
  const items = feedItems(20);
  assert.ok(items.length > 0);
  for (let i = 1; i < items.length; i++) assert.ok(Date.parse(items[i - 1].published) >= Date.parse(items[i].published));
  const xml = buildRss(items);
  assert.match(xml, /<rss version="2.0"/);
  assert.match(xml, /<atom:link href="https:\/\/worldcleanbiz.com\/rss.xml" rel="self"/);
  assert.equal((xml.match(/<item>/g) || []).length, items.length);
  assert.equal(xmlEscape(`A & B <C> "D"`), "A &amp; B &lt;C&gt; &quot;D&quot;");
});

test("Google News sitemap only lists news from the last two days", () => {
  const now = Date.parse("2026-11-08T12:00:00Z");
  const xml = buildNewsSitemap(now);
  assert.match(xml, /xmlns:news="http:\/\/www.google.com\/schemas\/sitemap-news\/0.9"/);
  for (const date of xml.match(/<news:publication_date>[^<]+/g) ?? []) {
    const published = Date.parse(date.replace("<news:publication_date>", ""));
    assert.ok(published >= now - 2 * 86400000 && published <= now);
  }
});

test("bylines resolve to author pages", () => {
  assert.equal(authorHref("Denny You"), "/authors/denny-you");
  assert.equal(authorHref("You Denny"), "/authors/denny-you");
  assert.equal(authorFor("World Clean Biz Editorial").slug, "wcb-editorial");
  assert.equal(authorFor(undefined).slug, "wcb-editorial");
});

test("site search ranks name matches and requires every word", () => {
  const { groups, total } = searchSite("roborock");
  assert.ok(total > 0);
  assert.equal(groups.get("Companies")[0].entry.href, "/brands/roborock");
  assert.equal(searchSite("").total, 0);
  assert.equal(searchSite("roborock zzzzqqq").total, 0);
  assert.ok(groups.get("Topics").length === 0 || groups.get("Topics").every((hit) => hit.entry.kind === "Topics"));
  assert.ok(searchSite("FCC").groups.get("Topics").some((hit) => hit.entry.href === "/topics/us-fcc-robot-restrictions"));
});
