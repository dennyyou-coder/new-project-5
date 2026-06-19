import type { Metadata } from "next";
import { getInsights } from "@/lib/content";

export const metadata: Metadata = {
  title: "World Clean Biz Article Archive",
  description:
    "Browse all World Clean Biz articles on cleaning robots, cordless vacuums, floor washers, pool robots, lawn robots, commercial cleaning robots, brands, suppliers, and global cleaning industry strategy.",
  alternates: {
    canonical: "/blog/archive"
  }
};

function displayDate(date: string) {
  return date || "Undated";
}

export default function BlogArchivePage() {
  const articles = getInsights();

  return (
    <section className="section blog-archive-page">
      <div className="insights-page-container">
        <div className="section-heading">
          <p className="eyebrow">Article Archive</p>
          <h1>World Clean Biz Article Archive</h1>
          <p>
            Browse all World Clean Biz articles on cleaning robots, cordless
            vacuums, floor washers, pool robots, lawn robots, commercial
            cleaning robots, brands, suppliers, and global cleaning industry
            strategy.
          </p>
        </div>

        <div className="blog-archive-list" aria-label="All World Clean Biz articles">
          {articles.map((article) => (
            <article className="blog-archive-item" key={article.slug}>
              <div className="insights-card-meta">
                <span>{displayDate(article.date)}</span>
                {article.category ? <span>{article.category}</span> : null}
              </div>
              <h2>
                <a href={`/blog/${article.slug}`}>{article.title}</a>
              </h2>
              {article.excerpt ? <p>{article.excerpt}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
