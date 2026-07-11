import type { Metadata } from "next";
import Link from "next/link";
import { getInsights } from "@/lib/content";

const siteUrl = "https://worldcleanbiz.com";

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
  const categoryCounts = Array.from(
    articles.reduce((counts, article) => {
      const category = article.category || "Industry";
      counts.set(category, (counts.get(category) || 0) + 1);
      return counts;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "World Clean Biz Article Archive",
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: `${siteUrl}/blog/${article.slug}`
    }))
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/blog/archive`,
    name: "World Clean Biz Article Archive",
    url: `${siteUrl}/blog/archive`,
    mainEntity: itemListSchema
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: "Archive", item: `${siteUrl}/blog/archive` }
    ]
  };

  return (
    <>
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
          <div className="blog-archive-actions">
            <strong>{articles.length} published articles</strong>
            <Link href="/blog">Return To Blog</Link>
            <Link href="/reports">Explore Market Reports</Link>
            <Link href="/sourcing">Explore Sourcing</Link>
          </div>
        </div>

        <div className="archive-category-summary" aria-label="Article categories">
          {categoryCounts.map(([category, count]) => (
            <span key={category}><strong>{count}</strong>{category}</span>
          ))}
        </div>

        <div className="blog-archive-list" aria-label="All World Clean Biz articles">
          {articles.map((article) => (
            <article className="blog-archive-item" key={article.slug}>
              <div className="insights-card-meta">
                <span>{displayDate(article.date)}</span>
                {article.category ? <span>{article.category}</span> : null}
                <span>{article.readingTime}</span>
              </div>
              <h2>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>
              {article.excerpt ? <p>{article.excerpt}</p> : null}
            </article>
          ))}
        </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionSchema, itemListSchema, breadcrumbSchema]) }} />
    </>
  );
}
