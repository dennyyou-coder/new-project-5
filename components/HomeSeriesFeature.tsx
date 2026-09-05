import Image from "next/image";
import Link from "next/link";
import { getFeaturedSeriesLinks } from "@/lib/blogSeries";
import { getArticleImage } from "@/lib/articleImages";
import type { Insight } from "@/lib/content";

const fallbackCover =
  "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";
const fallbackSeriesTitle =
  "Building the World’s No.1 Cleaning Show from Scratch";

export function HomeSeriesFeature({ article }: { article: Insight }) {
  const seriesTitle = article.seriesTitle || fallbackSeriesTitle;
  const { articleHref, seriesHref } = getFeaturedSeriesLinks(article);
  const coverUrl = article.coverImage || fallbackCover;
  const cover = getArticleImage(coverUrl);
  if (!cover) {
    throw new Error(`Missing homepage series image metadata: ${coverUrl}`);
  }

  return (
    <article
      className="home-v9-series-card"
      aria-labelledby="home-founder-series-title"
    >
      <div className="home-v9-series-media">
        <Image
          src={coverUrl}
          alt={article.coverAlt || `${seriesTitle} cover`}
          width={cover.width}
          height={cover.height}
          sizes="(max-width: 1050px) calc(100vw - 40px), 480px"
          loading="eager"
          decoding="async"
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
