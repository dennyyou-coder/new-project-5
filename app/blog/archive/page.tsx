import type { Metadata } from "next";
import Link from "next/link";
import { getInsights, type Insight } from "@/lib/content";
import {
  getEditorialInsights,
  getGuideInsights
} from "@/lib/insightCollections";

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

function ArchiveList({
  articles,
  label
}: {
  articles: Insight[];
  label: string;
}) {
  return (
    <div className="blog-archive-list" aria-label={label}>
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
  );
}

export default function BlogArchivePage() {
  const articles = getInsights();
  const editorialArticles = getEditorialInsights(articles);
  const guideArticles = getGuideInsights(articles);
  const orderedArticles = [...editorialArticles, ...guideArticles];
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
    itemListElement: orderedArticles.map((article, index) => ({
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
      <section className="section blog-archive-page" id="all-articles">
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
            <span><strong>{articles.length}</strong>All Articles</span>
            <span><strong>{editorialArticles.length}</strong>Analysis &amp; Insights</span>
            <span><strong>{guideArticles.length}</strong>Guides &amp; Comparisons</span>
            <Link href="/blog">Return To Blog</Link>
            <Link href="/guides">Explore Guides</Link>
            <Link href="/reports">Explore Market Reports</Link>
            <Link href="/sourcing">Explore Sourcing</Link>
          </div>
        </div>

        <nav className="archive-content-nav" aria-label="Article archive sections">
          <a href="#all-articles">All Articles</a>
          <a href="#analysis">Analysis &amp; Insights</a>
          <a href="#guides">Guides &amp; Comparisons</a>
        </nav>

        <div className="archive-category-summary" aria-label="Article categories">
          {categoryCounts.map(([category, count]) => (
            <span key={category}><strong>{count}</strong>{category}</span>
          ))}
        </div>

        <section className="archive-content-group" id="analysis">
          <div className="archive-content-group-heading">
            <p className="eyebrow">Original Editorial</p>
            <h2>Analysis &amp; Insights</h2>
            <p>Industry shifts, company strategy, original research and market observations.</p>
          </div>
          <ArchiveList articles={editorialArticles} label="World Clean Biz analysis and insights" />
        </section>

        <section className="archive-content-group" id="guides">
          <div className="archive-content-group-heading">
            <p className="eyebrow">Practical Research</p>
            <h2>Guides &amp; Comparisons</h2>
            <p>Brand ownership, buying decisions, product comparisons, sourcing and maintenance research.</p>
          </div>
          <ArchiveList articles={guideArticles} label="World Clean Biz guides and comparisons" />
        </section>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionSchema, itemListSchema, breadcrumbSchema]) }} />
    </>
  );
}
