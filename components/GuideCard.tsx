import Link from "next/link";
import type { Insight } from "@/lib/content";

export function GuideCard({ article }: { article: Insight }) {
  return (
    <article className="guide-card">
      <Link href={`/blog/${article.slug}`}>
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.coverAlt || `${article.title} guide cover`}
            loading="lazy"
            decoding="async"
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
