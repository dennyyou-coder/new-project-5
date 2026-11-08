import manifest from "./generated/article-image-runtime.json" with { type: "json" };

export type GalleryImage = { src: string; title: string; href: string };

const assets = Object.keys((manifest as { assets: Record<string, unknown> }).assets);
const byArticle = new Map<string, string[]>();
for (const key of assets) {
  const match = key.match(/^\/images\/articles\/([^/]+)\/([^/]+)$/);
  if (!match) continue;
  const list = byArticle.get(match[1]) ?? [];
  list.push(key);
  byArticle.set(match[1], list);
}

/** Images that are logos, raw filing scans or files kept only as PNG sources. */
const SKIP = /(logo|prospectus|translation|annual-report|\.png$)/i;
/** Articles whose pictures are mostly scanned filings rather than photographs. */
const DOCUMENT_ARTICLE = /(annual-report|prospectus|faithful-translation|interim-report|report-reading)/i;

/**
 * Graphics and photographs from WCB articles where the company is the main subject (not their covers,
 * which the news and analysis list already shows), newest article first, at most two per article.
 */
export function galleryForArticles(articles: { slug: string; title: string }[], limit = 8): GalleryImage[] {
  const images: GalleryImage[] = [];
  for (const article of articles) {
    if (DOCUMENT_ARTICLE.test(article.slug)) continue;
    const files = (byArticle.get(article.slug) ?? [])
      .filter((src) => !/\/01-cover\.webp$/.test(src) && !SKIP.test(src.split("/").pop() ?? ""))
      .sort()
      .slice(0, 2);
    for (const src of files) {
      images.push({ src, title: article.title, href: `/blog/${article.slug}` });
      if (images.length >= limit) return images;
    }
  }
  return images;
}
