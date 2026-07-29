import Link from "next/link";
import type { BrandTaggedArticle } from "@/lib/brands";

function ArticleGroup({
  articles,
  title
}: {
  articles: BrandTaggedArticle[];
  title: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section>
      <h2>{title}</h2>
      <div className="guide-category-list brand-article-grid">
        {articles.map((article) => (
          <article className="guide-card" key={article.slug}>
            <Link href={`/blog/${article.slug}`}>
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={article.coverAlt || ""}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div className="guide-card-copy">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                {article.readingTime ? <small>{article.readingTime}</small> : null}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BrandArticles({
  primaryArticles,
  relatedArticles
}: {
  primaryArticles: BrandTaggedArticle[];
  relatedArticles: BrandTaggedArticle[];
}) {
  const primarySlugs = new Set(primaryArticles.map((article) => article.slug));
  const uniqueRelatedArticles = relatedArticles.filter(
    (article) => !primarySlugs.has(article.slug)
  );

  if (primaryArticles.length === 0 && uniqueRelatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="section guides-featured-section">
      <div className="insights-page-container">
        <p className="eyebrow">World Clean Biz Research</p>
        <ArticleGroup articles={primaryArticles} title="Primary Analysis" />
        <ArticleGroup articles={uniqueRelatedArticles} title="Related Analysis" />
      </div>
    </section>
  );
}
