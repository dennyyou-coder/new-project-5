import Link from "next/link";
import type { Insight } from "@/lib/content";

const fallbackImages = [
  "/images/industry/about-forum-stage-2025.jpg",
  "/images/industry/sourcing-product-components-2025.jpg",
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/about-forum-audience-2025.jpg"
];

function imageFor(article: Insight, index: number) {
  return article.coverImage || fallbackImages[index % fallbackImages.length];
}

export function BlogSeriesHero({ article }: { article: Insight }) {
  return (
    <section className="blog-home-series" aria-labelledby="blog-series-title">
      <Link
        className="blog-home-series-main"
        href={`/blog/${article.slug}`}
        aria-label={`Read ${article.title}`}
      >
        <div className="blog-home-series-image">
          <img
            src={imageFor(article, 0)}
            alt={`${article.seriesTitle || article.title} cover`}
            fetchPriority="high"
            decoding="async"
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
      <Link className="blog-home-series-all" href={`/blog/${article.slug}#series-episodes`}>
        View all episodes
      </Link>
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
          src={imageFor(article, index)}
          alt={`${article.title} cover`}
          loading="lazy"
          decoding="async"
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
    <section className={`blog-home-section blog-home-section-${variant}`} aria-labelledby={sectionId}>
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
        <Link href="/world-clean-expo">Explore World Clean Expo</Link>
      </nav>
    </section>
  );
}
