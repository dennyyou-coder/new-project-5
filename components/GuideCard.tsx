import Link from "next/link";
import { responsiveImageProps } from "@/lib/articleImages";
import type { Insight } from "@/lib/content";

export function GuideCard({ article }: { article: Insight }) {
  return (
    <article className="guide-card">
      <Link href={`/blog/${article.slug}`}>
        {article.coverImage ? (
          <img
            {...responsiveImageProps(article.coverImage, "card")}
            alt={article.coverAlt || `${article.title} guide cover`}
          />
        ) : null}
        <div className="guide-card-copy">
          <span>{article.category}</span>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <small>{article.readingTime}</small>
        </div>
      </Link>
    </article>
  );
}
