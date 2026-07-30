import Link from "next/link";
import type { Insight } from "@/lib/content";

const fallbackCover =
  "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";

export function DirectorySeriesFeature({ article }: { article: Insight }) {
  const seriesTitle = article.seriesTitle || article.title;

  return (
    <section
      className="insights-page-container content-directory-series"
      aria-labelledby="directory-series-title"
    >
      <div className="content-directory-series-image">
        <img
          src={article.coverImage || fallbackCover}
          alt={article.coverAlt || `${seriesTitle} cover`}
          fetchPriority="high"
          decoding="async"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="content-directory-series-copy">
        <p className="eyebrow">Ongoing Series · Latest Episode</p>
        <h2 id="directory-series-title">{seriesTitle}</h2>
        {article.seriesTitle ? <h3>{article.title}</h3> : null}
        <p>{article.excerpt}</p>
        <div className="content-directory-series-actions">
          <Link href={`/blog/${article.slug}`}>Read latest episode →</Link>
          <Link href={`/blog/${article.slug}#series-episodes`}>
            View all episodes
          </Link>
        </div>
      </div>
    </section>
  );
}
