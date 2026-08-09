import Link from "next/link";
import { getFeaturedSeriesLinks } from "@/lib/blogSeries";
import { responsiveImageProps } from "@/lib/articleImages";
import type { Insight } from "@/lib/content";

const fallbackCover =
  "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";
const fallbackSeriesTitle =
  "Building the World’s No.1 Cleaning Show from Scratch";

export function HomeSeriesFeature({ article }: { article: Insight }) {
  const seriesTitle = article.seriesTitle || fallbackSeriesTitle;
  const { articleHref, seriesHref } = getFeaturedSeriesLinks(article);
  const imageProps = article.coverImage
    ? responsiveImageProps(article.coverImage, "card")
    : { src: fallbackCover, loading: "lazy" as const, decoding: "async" as const };

  return (
    <article
      className="home-v9-series-card"
      aria-labelledby="home-founder-series-title"
    >
      <div className="home-v9-series-media">
        <img
          {...imageProps}
          alt={article.coverAlt || `${seriesTitle} cover`}
        />
      </div>
      <div className="home-v9-series-copy">
        <p className="home-v9-series-label">
          Founder Series · Latest Episode
        </p>
        <h2 id="home-founder-series-title">{seriesTitle}</h2>
        <h3>{article.title}</h3>
        <p className="home-v9-series-excerpt">{article.excerpt}</p>
        <div className="home-v9-series-actions">
          <Link href={articleHref}>Read Latest Episode →</Link>
          {seriesHref ? (
            <Link href={seriesHref}>View All Episodes</Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
