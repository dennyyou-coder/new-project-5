import Link from "next/link";
import { NewsImage, NewsImageCaption } from "@/components/news/NewsImage";
import { newsDate, type NewsArticle } from "@/lib/news";
import { formatBrandDate } from "@/lib/brandDates";
import { responsiveImageProps } from "@/lib/articleImages";
import type { BrandTaggedArticle } from "@/lib/brands";

function ArticleGroup({
  articles,
  title,
}: {
  articles: BrandTaggedArticle[];
  title: string;
}) {
  if (articles.length === 0) return null;

  const gridClassName = `guide-category-list brand-article-grid ${
    articles.length === 4 ? "brand-article-grid--balanced" : ""
  }`.trim();

  return (
    <section>
      <h2>{title}</h2>
      <div className={gridClassName}>
        {articles.map((article) => (
          <article className="guide-card" key={article.slug}>
            <Link href={`/blog/${article.slug}`}>
              {article.coverImage ? (
                <img
                  {...responsiveImageProps(article.coverImage, "card")}
                  alt={article.coverAlt || ""}
                />
              ) : null}
              <div className="guide-card-copy">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                {article.readingTime ? (
                  <small><time dateTime={article.sortDate}>{formatBrandDate(article.sortDate)}</time> · {article.readingTime}</small>
                ) : null}
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
  relatedArticles,
  brandName,
  analysisLink,
  news,
}: {
  brandName: string;
  analysisLink?: { href: string; label: string };
  news: NewsArticle[];
  primaryArticles: BrandTaggedArticle[];
  relatedArticles: BrandTaggedArticle[];
}) {
  const primarySlugs = new Set(primaryArticles.map((article) => article.slug));
  const uniqueRelatedArticles = relatedArticles.filter(
    (article) => !primarySlugs.has(article.slug),
  );


  return (
    <section className="section guides-featured-section" id="analysis">
      <div className="insights-page-container">
        <p className="eyebrow">Continue exploring {brandName}</p>
        <h2>Related Articles &amp; News</h2>
        <ArticleGroup
          articles={[...primaryArticles, ...uniqueRelatedArticles].slice(0, 4)}
          title={`Articles about ${brandName}`}
        />
        <section className="company-related-news" aria-labelledby="company-news-heading"><h3 id="company-news-heading">{brandName} News</h3>{news.length ? <div className="company-news-grid">{news.slice(0, 4).map((article) => <article className="guide-card" key={article.slug}>
          <figure className="company-news-media">
            <Link href={`/news/${article.slug}`} aria-label={article.title}><NewsImage article={article} /></Link>
            <figcaption><NewsImageCaption article={article} /></figcaption>
          </figure>
          <Link href={`/news/${article.slug}`}><div className="guide-card-copy"><h3>{article.title}</h3><p>{article.excerpt}</p><small><time dateTime={article.publishedAt}>{newsDate(article.publishedAt)}</time></small></div></Link>
        </article>)}</div> : <p>No dedicated {brandName} news stories are available in this collection yet.</p>}<Link className="refresh-card-link" href="/news">Browse industry news</Link></section>
        {analysisLink ? <Link className="refresh-card-link company-analysis-link" href={analysisLink.href}>
          {analysisLink.label}
        </Link> : null}
      </div>
    </section>
  );
}
