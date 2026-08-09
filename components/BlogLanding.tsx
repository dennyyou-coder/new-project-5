import Link from "next/link";
import { getFeaturedSeriesLinks } from "@/lib/blogSeries";
import { responsiveImageProps } from "@/lib/articleImages";
import type { Insight } from "@/lib/content";

const fallbackImages = [
  "/images/industry/about-forum-stage-2025.jpg",
  "/images/industry/sourcing-product-components-2025.jpg",
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/about-forum-audience-2025.jpg"
];

function imagePropsFor(article: Insight, index: number) {
  return article.coverImage
    ? responsiveImageProps(article.coverImage, "card")
    : {
        src: fallbackImages[index % fallbackImages.length],
        loading: "lazy" as const,
        decoding: "async" as const
      };
}

export function BlogSeriesHero({ article }: { article: Insight }) {
  const { articleHref, seriesHref } = getFeaturedSeriesLinks(article);

  return (
    <section className="blog-home-series" aria-labelledby="blog-series-title">
      <Link
        className="blog-home-series-main"
        href={articleHref}
        aria-label={`Read ${article.title}`}
      >
        <div className="blog-home-series-image">
          <img
            {...imagePropsFor(article, 0)}
            alt={`${article.seriesTitle || article.title} cover`}
          />
        </div>
        <div className="blog-home-series-copy">
          <p className="eyebrow">Ongoing Series · Latest Episode</p>
          <h2 id="blog-series-title">{article.seriesTitle || article.title}</h2>
          {article.seriesTitle ? <h3>{article.title}</h3> : null}
          <p>{article.excerpt}</p>
          <strong>Read latest episode →</strong>
        </div>
      </Link>
      {seriesHref ? (
        <Link className="blog-home-series-all" href={seriesHref}>
          View all episodes
        </Link>
      ) : null}
    </section>
  );
}

function BlogHomeCard({
  article,
  index,
  variant
}: {
  article: Insight;
  index: number;
  variant: "analysis" | "guide";
}) {
  return (
    <Link
      className="blog-home-card"
      data-variant={variant}
      href={`/blog/${article.slug}`}
      aria-label={`Read ${article.title}`}
    >
      <div className="blog-home-card-image">
        <img
          {...imagePropsFor(article, index)}
          alt={`${article.title} cover`}
        />
      </div>
      <div className="blog-home-card-copy">
        <span className="insights-category">{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="insights-card-meta">
          <span>{article.date}</span>
          <span>{article.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}

type BlogArticleGridProps = {
  articles: Insight[];
  sectionId: string;
  eyebrow: string;
  title: string;
  description: string;
  archiveHref: string;
  archiveLabel: string;
  variant: "analysis" | "guide";
};

export function BlogArticleGrid({
  articles,
  sectionId,
  eyebrow,
  title,
  description,
  archiveHref,
  archiveLabel,
  variant
}: BlogArticleGridProps) {
  return (
    <section className="blog-home-section" data-variant={variant} aria-labelledby={sectionId}>
      <div className="blog-home-section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={sectionId}>{title}</h2>
          <p>{description}</p>
        </div>
        <Link href={archiveHref}>{archiveLabel}</Link>
      </div>
      <div className="blog-home-grid">
        {articles.map((article, index) => (
          <BlogHomeCard article={article} index={index} key={article.slug} variant={variant} />
        ))}
      </div>
    </section>
  );
}

export function BlogBusinessLinks() {
  return (
    <section className="blog-home-business" aria-labelledby="blog-business-title">
      <div>
        <p className="eyebrow">Continue With World Clean Biz</p>
        <h2 id="blog-business-title">Turn industry intelligence into practical opportunities.</h2>
      </div>
      <nav aria-label="World Clean Biz business resources">
        <Link href="/reports">Explore Market Reports</Link>
        <Link href="/sourcing">Discuss Product Opportunities</Link>
        <Link href="/wcb-expo">Explore WCB Expo</Link>
      </nav>
    </section>
  );
}
