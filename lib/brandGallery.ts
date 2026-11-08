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

/** Body images that are charts, maps, report pages or other non-photographs. */
const NOT_A_PHOTO = /(map|chart|timeline|diagram|flow|table|matrix|pathway|framework|structure|logo|prospectus|translation|cost|signals|ranking|share|diagnostic|scorecard|comparison|landscape|overview|summary|process|steps|checklist|infographic|-en-v\d|\.png$)/i;
/** Articles whose pictures are mostly scanned filings rather than photographs. */
const DOCUMENT_ARTICLE = /(annual-report|prospectus|faithful-translation|interim-report|report-reading)/i;

/**
 * Photographs from a company's own WCB articles (not their covers, which the news and analysis list
 * already shows), newest article first, at most two per article.
 */
export function galleryForArticles(articles: { slug: string; title: string }[], limit = 8): GalleryImage[] {
  const images: GalleryImage[] = [];
  for (const article of articles) {
    if (DOCUMENT_ARTICLE.test(article.slug)) continue;
    const files = (byArticle.get(article.slug) ?? [])
      .filter((src) => !/\/01-cover\.webp$/.test(src) && !NOT_A_PHOTO.test(src.split("/").pop() ?? ""))
      .sort()
      .slice(0, 2);
    for (const src of files) {
      images.push({ src, title: article.title, href: `/blog/${article.slug}` });
      if (images.length >= limit) return images;
    }
  }
  return images;
}
