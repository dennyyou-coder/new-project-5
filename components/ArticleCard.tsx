import Link from "next/link";
import type { Insight } from "@/lib/content";

export function ArticleCard({ article }: { article: Insight }) {
  return (
    <Link className="article-card" href={`/insights/${article.slug}`}>
      <div
        className="article-image"
        style={{ backgroundImage: article.coverImage ? `url(${article.coverImage})` : undefined }}
        aria-hidden="true"
      />
      <div className="article-body">
        <div className="meta">
          {article.category} / {article.date}
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="article-card-footer">Read Article</div>
      </div>
    </Link>
  );
}
