import { responsiveImageProps, type ArticleImageContext } from "@/lib/articleImages";
import { getNewsVisual, type NewsArticle } from "@/lib/news";

export function NewsImage({ article, context = "card" }: { article: NewsArticle; context?: ArticleImageContext }) {
  const visual = getNewsVisual(article);
  if (!visual) return null;
  return visual.kind === "product"
    ? <img {...responsiveImageProps(visual.src, context)} alt={visual.alt} />
    : <img className="news-brand-image" src={visual.src} alt={visual.alt} width={320} height={180} loading={context === "cover" ? "eager" : "lazy"} fetchPriority={context === "cover" ? "high" : "auto"} decoding="async" />;
}
