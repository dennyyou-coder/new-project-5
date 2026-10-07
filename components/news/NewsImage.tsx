import Link from "next/link";
import { responsiveImageProps, type ArticleImageContext } from "@/lib/articleImages";
import { getNewsVisual, type NewsArticle } from "@/lib/news";

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
  return <span className="news-image-caption">
    <span>{full ? visual.caption : visual.label}</span>
    {visual.sourceUrl && (full || visual.license) ? <> · <Link href={visual.sourceUrl} rel="noopener noreferrer">{visual.sourceLabel || "Image source"}</Link></> : null}
    {visual.license ? <> · <a href={visual.license.url} rel="noopener noreferrer">{visual.license.label}</a>{full ? " · Cropped for display" : null}</> : null}
  </span>;
}
