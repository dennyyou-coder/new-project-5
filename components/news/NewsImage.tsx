import Link from "next/link";
import { responsiveImageProps, type ArticleImageContext } from "@/lib/articleImages";
import { getNewsVisual, type NewsArticle } from "@/lib/news";

const GENERIC_THUMBNAIL_LABELS = new Set(["Company image", "Related coverage"]);

export function NewsImage({ article, context = "card" }: { article: NewsArticle; context?: ArticleImageContext }) {
  const visual = getNewsVisual(article);
  if (!visual) return null;
  const props = visual.prepared
    ? responsiveImageProps(visual.src, context)
    : { src: visual.src, width: visual.width, height: visual.height, loading: context === "cover" ? "eager" as const : "lazy" as const, fetchPriority: context === "cover" ? "high" as const : "auto" as const, decoding: "async" as const };
  return <img {...props} alt={visual.alt} data-visual-kind={visual.kind} style={{ objectFit: visual.fit || "cover", objectPosition: visual.position || "center" }} />;
}

export function NewsImageCaption({ article, full = false }: { article: NewsArticle; full?: boolean }) {
  const visual = getNewsVisual(article);
  if (!visual) return null;
  // Short captions under list thumbnails drop the generic "Company image" /
  // "Related coverage" labels; licence attribution is always kept.
  const parts = [
    full || !GENERIC_THUMBNAIL_LABELS.has(visual.label) ? <span key="label">{full ? visual.caption : visual.label}</span> : null,
    visual.sourceUrl && (full || visual.license) ? <Link key="source" href={visual.sourceUrl} rel="noopener noreferrer">{visual.sourceLabel || "Image source"}</Link> : null,
    visual.license ? <span key="license"><a href={visual.license.url} rel="noopener noreferrer">{visual.license.label}</a>{full ? " · Cropped for display" : null}</span> : null
  ].filter(Boolean);
  if (!parts.length) return null;
  return <span className="news-image-caption">
    {parts.map((part, index) => <span key={index}>{index > 0 ? " · " : null}{part}</span>)}
  </span>;
}
