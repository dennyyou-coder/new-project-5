import Link from "next/link";
import { responsiveImageProps } from "@/lib/articleImages";
import type { Insight } from "@/lib/content";

export function ArticleCard({ article }: { article: Insight }) {
  return (
    <Link className="article-card" href={`/blog/${article.slug}`}>
      <div className="article-image">
        {article.coverImage ? (
          <img
            {...responsiveImageProps(article.coverImage, "card")}
            alt={article.coverAlt || ""}
            style={{ display: "block", height: "100%", objectFit: "contain", width: "100%" }}
          />
        ) : null}
      </div>
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
