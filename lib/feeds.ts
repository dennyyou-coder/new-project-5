import { getInsights } from "@/lib/content";
import { getNews } from "@/lib/news";

export const SITE_URL = "https://worldcleanbiz.com";

export function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type FeedItem = { title: string; url: string; summary: string; published: string; category: string; author: string };

/** News and analysis together, newest first by the date WCB published them. */
export function feedItems(limit = 50): FeedItem[] {
  const news = getNews().map((item) => ({
    title: item.title,
    url: `${SITE_URL}/news/${item.slug}`,
    summary: item.excerpt,
    published: item.publishedAt,
    category: "News",
    author: item.author
  }));
  const analysis = getInsights().map((article) => ({
    title: article.title,
    url: `${SITE_URL}/blog/${article.slug}`,
    summary: article.excerpt || article.description,
    published: article.publishedAt,
    category: "Analysis",
    author: article.author
  }));
  return [...news, ...analysis]
    .filter((item) => !Number.isNaN(Date.parse(item.published)))
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
    .slice(0, limit);
}

export function buildRss(items: FeedItem[]) {
  const updated = items[0] ? new Date(items[0].published).toUTCString() : new Date().toUTCString();
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "<channel>",
    "<title>World Clean Biz</title>",
    `<link>${SITE_URL}</link>`,
    `<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    "<description>News and analysis on the global cleaning industry: robot vacuums, floor care, pool robots, robotic mowers and commercial cleaning.</description>",
    "<language>en</language>",
    `<lastBuildDate>${updated}</lastBuildDate>`,
    ...items.map((item) =>
      [
        "<item>",
        `<title>${xmlEscape(item.title)}</title>`,
        `<link>${item.url}</link>`,
        `<guid isPermaLink="true">${item.url}</guid>`,
        `<pubDate>${new Date(item.published).toUTCString()}</pubDate>`,
        `<category>${item.category}</category>`,
        `<dc:creator>${xmlEscape(item.author)}</dc:creator>`,
        `<description>${xmlEscape(item.summary)}</description>`,
        "</item>"
      ].join("")
    ),
    "</channel>",
    "</rss>"
  ].join("\n");
}

/** Google News sitemap: news published in the last two days, as Google asks. */
export function buildNewsSitemap(now = Date.now()) {
  const cutoff = now - 2 * 24 * 60 * 60 * 1000;
  const recent = getNews().filter((item) => {
    const published = Date.parse(item.publishedAt);
    return published >= cutoff && published <= now;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...recent.map((item) =>
      [
        "<url>",
        `<loc>${SITE_URL}/news/${item.slug}</loc>`,
        "<news:news>",
        "<news:publication><news:name>World Clean Biz</news:name><news:language>en</news:language></news:publication>",
        `<news:publication_date>${new Date(item.publishedAt).toISOString()}</news:publication_date>`,
        `<news:title>${xmlEscape(item.title)}</news:title>`,
        "</news:news>",
        "</url>"
      ].join("")
    ),
    "</urlset>"
  ].join("\n");
}
