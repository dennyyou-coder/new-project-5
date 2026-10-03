import { responsiveImageProps } from "@/lib/articleImages";
import { getNewsVisual, type NewsArticle } from "@/lib/news";

export function NewsImage({ article }: { article: NewsArticle }) {
  const visual = getNewsVisual(article);
  if (!visual) return null;
  return visual.kind === "product"
    ? <img {...responsiveImageProps(visual.src, "card")} alt={visual.alt} />
    : <img className="news-brand-image" src={visual.src} alt={visual.alt} width={320} height={180} loading="lazy" decoding="async" />;
}
