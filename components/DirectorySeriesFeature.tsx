import Link from "next/link";
import type { DirectoryArticle } from "@/components/ContentDirectory";
import { directoryArticleImageProps } from "@/lib/contentDirectory";

const fallbackCover =
  "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";

export function DirectorySeriesFeature({ article }: { article: DirectoryArticle }) {
  const seriesTitle = article.seriesTitle || article.title;
  const imageProps = directoryArticleImageProps(article, fallbackCover);

  return (
    <section
      className="insights-page-container content-directory-series"
      aria-labelledby="directory-series-title"
    >
      <div className="content-directory-series-image">
        <img
          {...imageProps}
          alt={article.coverAlt || `${seriesTitle} cover`}
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
