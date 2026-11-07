import Link from "next/link";
import { Icon } from "@/components/Icon";
import { newsDate, type NewsArticle } from "@/lib/news";
import { formatBrandDate } from "@/lib/brandDates";
import { responsiveImageProps } from "@/lib/articleImages";
import type { BrandTaggedArticle } from "@/lib/brands";

/** Analysis cards with images, then the latest news headlines about the company. */
export function BrandArticles({
  primaryArticles,
  relatedArticles,
  brandName,
  analysisLink,
  news
}: {
  brandName: string;
  analysisLink?: { href: string; label: string };
  news: NewsArticle[];
  primaryArticles: BrandTaggedArticle[];
  relatedArticles: BrandTaggedArticle[];
}) {
  const primarySlugs = new Set(primaryArticles.map((article) => article.slug));
  const articles = [...primaryArticles, ...relatedArticles.filter((article) => !primarySlugs.has(article.slug))].slice(0, 3);
  const headlines = [...news].sort((a, b) => b.eventDate.localeCompare(a.eventDate)).slice(0, 8);
  if (!articles.length && !headlines.length) return null;

  return (
    <section className="bp-card" id="analysis" aria-labelledby="analysis-title">
      <div className="bp-card-head">
        <h2 id="analysis-title"><span className="bp-card-icon"><Icon name="newspaper" /></span>News &amp; analysis</h2>
        {analysisLink ? <Link className="bp-card-more wcb-more" href={analysisLink.href}>{analysisLink.label}</Link> : null}
      </div>
      {articles.length ? (
        <div className="bp-articles">
          {articles.map((article) => (
            <Link className="bp-article" href={`/blog/${article.slug}`} key={article.slug}>
              {article.coverImage ? (
                <span className="bp-article-image"><img {...responsiveImageProps(article.coverImage, "card")} alt={article.coverAlt || ""} /></span>
              ) : null}
              <span className="bp-article-copy">
                <small>{"category" in article && typeof article.category === "string" ? `${article.category} · ` : ""}<time dateTime={article.sortDate}>{formatBrandDate(article.sortDate)}</time></small>
                <b>{article.title}</b>
              </span>
            </Link>
          ))}
        </div>
      ) : null}
      {headlines.length ? (
        <ul className="bp-news" aria-label={`${brandName} news`}>
          {headlines.map((item) => (
            <li key={item.slug}>
              <time dateTime={item.eventDate}>{newsDate(item.eventDate)}</time>
              <Link href={`/news/${item.slug}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
