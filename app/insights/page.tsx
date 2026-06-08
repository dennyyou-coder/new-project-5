import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterLeadForm, TallyReportButton } from "@/components/LeadForms";
import { getInsights, type Insight } from "@/lib/content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Cleaning industry signals and analysis shaped by front-line product, supplier, category and trade show observations."
};

const articlesPerPage = 5;

const topics = [
  "Robot Vacuums",
  "Robot Lawn Mowers",
  "Robotic Pool Cleaners",
  "Wet-Dry Floor Cleaners",
  "Chinese Brands",
  "Overseas Markets",
  "Product Strategy",
  "Category Signals"
];

const categories = [
  "All",
  "Floorcare",
  "Pool Cleaning",
  "Robotic Mowers",
  "Industry",
  "Market Signals"
];

const fallbackImages = [
  "/images/industry/about-forum-stage-2025.jpg",
  "/images/industry/sourcing-product-components-2025.jpg",
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/about-forum-audience-2025.jpg"
];

function imageFor(article: Insight, index: number) {
  return article.coverImage || fallbackImages[index % fallbackImages.length];
}

function summaryFor(article: Insight) {
  return article.excerpt;
}

function displayReadTime(article: Insight, index: number) {
  if (index === 0) return "8 min read";
  const minutes = 5 + (index % 4);
  return `${minutes} min read`;
}

function displayDate(article: Insight) {
  if (article.date === "2026-06-03") return "June 3, 2026";
  return article.date;
}

function pageHref(page: number) {
  return `?page=${page}`;
}

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function SidebarContent({ latestSignals }: { latestSignals: Insight[] }) {
  return (
    <>
      <div className="sidebar-box market-report-priority">
        <p className="eyebrow">Free Reports</p>
        <div className="report-stack" aria-hidden="true">
          <div className="report-cover report-cover-market">
            <small>World Clean Biz</small>
            <strong>
              Global Cleaning
              <br />
              Market Outlook
            </strong>
            <span>2026</span>
          </div>
          <div className="report-cover report-cover-category">
            <small>World Clean Biz</small>
            <strong>
              Cleaning Products
              <br />
              Category Trends
            </strong>
            <span>2026</span>
          </div>
          <div className="report-cover report-cover-supplier">
            <small>World Clean Biz</small>
            <strong>
              Supplier Landscape
              <br />
              Report
            </strong>
            <span>2026</span>
          </div>
        </div>
        <h3>Get field-informed industry trends, supplier intelligence and market opportunities from World Clean Biz.</h3>
        <TallyReportButton />
      </div>

      <div className="sidebar-box about-denny-sidebar">
        <img
          src="/images/industry/about-denny-portrait-event.jpg"
          alt="Denny You at a cleaning industry event"
        />
        <h3>Industry Analysis From The Front Line</h3>
        <ul>
          <li>Inside The Industry Since 2006</li>
          <li>Publishing Industry Analysis Since 2018</li>
          <li>Product, Supplier And Category Signals</li>
          <li>Forums, Trade Shows And Market Conversations</li>
        </ul>
        <Link href="/about">About Denny</Link>
      </div>

      <div className="sidebar-box">
        <h3>Popular Topics</h3>
        <div className="topic-list">
          {topics.map((topic) => (
            <Link href="/blog" key={topic}>
              {topic}
            </Link>
          ))}
        </div>
      </div>

      <div className="sidebar-box latest-signals-sidebar">
        <h3>Latest Articles</h3>
        <div className="latest-signal-list">
          {latestSignals.map((article, index) => (
            <Link href={`/insights/${article.slug}`} key={article.slug}>
              <img src={imageFor(article, index)} alt="" />
              <span>
                <strong>{article.title}</strong>
                <small>{displayDate(article)}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

function ArticleFeedItem({ article, index }: { article: Insight; index: number }) {
  return (
    <Link className="insights-feed-item" href={`/insights/${article.slug}`}>
      <div className="insights-feed-image">
        <img src={imageFor(article, index)} alt={`${article.title} cover`} />
      </div>
      <div className="insights-feed-copy">
        <span className="insights-category">{article.category}</span>
        <h2>{article.title}</h2>
        <p>{summaryFor(article)}</p>
        <div className="insights-card-meta">
          <span>{displayDate(article)}</span>
          <span>{displayReadTime(article, index)}</span>
        </div>
        <strong>Read Article</strong>
      </div>
    </Link>
  );
}

export default async function InsightsPage({ searchParams }: { searchParams?: SearchParams }) {
  const articles = getInsights();
  const featured = articles.find((article) => article.featured) || articles[0];
  const feedArticles = articles.filter((article) => article.slug !== featured?.slug);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const totalPages = Math.max(1, Math.ceil(feedArticles.length / articlesPerPage));
  const currentPage = Math.min(parsePage(resolvedSearchParams.page), totalPages);
  const pageStart = (currentPage - 1) * articlesPerPage;
  const visibleFeedArticles = feedArticles.slice(pageStart, pageStart + articlesPerPage);
  const latestSignals = articles.slice(0, 5);

  return (
    <>
      <section className="insights-featured-top">
        <div className="insights-page-container">
          {featured ? (
            <Link className="insights-featured-hero" href={`/insights/${featured.slug}`}>
              <div className="insights-featured-hero-image">
                <img src={imageFor(featured, 0)} alt={`${featured.title} featured cover`} />
              </div>
              <div className="insights-featured-hero-copy">
                <p className="eyebrow">Featured Article</p>
                <span className="insights-category">{featured.category}</span>
                <h1>{featured.title}</h1>
                <p>{featured.excerpt}</p>
                <div className="insights-card-meta">
                  <span>{displayDate(featured)}</span>
                  <span>{displayReadTime(featured, 0)}</span>
                </div>
                <strong>Read Article →</strong>
              </div>
            </Link>
          ) : null}

          <div className="insights-filter-wrap insights-filter-panel">
            <div className="insights-filter insights-filter-v3" aria-label="Insight categories">
              {categories.map((category) => (
                <button className={category === "All" ? "active" : ""} key={category} type="button">
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section insights-publication-section">
        <div className="insights-page-container insights-publication-layout">
          <main className="insights-feed" aria-label="Industry insight articles">
            {visibleFeedArticles.map((article, index) => (
              <ArticleFeedItem article={article} index={pageStart + index} key={article.slug} />
            ))}
          </main>

          <aside className="insights-sidebar insights-sidebar-v2 insights-sidebar-desktop" aria-label="Insights sidebar">
            <SidebarContent latestSignals={latestSignals} />
          </aside>

          <aside className="insights-sidebar insights-sidebar-v2 insights-sidebar-mobile" aria-label="Insights sidebar">
            <SidebarContent latestSignals={latestSignals} />
          </aside>
        </div>
        {totalPages > 1 ? (
          <div className="insights-page-container">
            <nav className="insights-pagination insights-pagination-v2" aria-label="Insights pagination">
              {currentPage > 1 ? (
                <Link href={pageHref(currentPage - 1)}>Previous</Link>
              ) : (
                <span aria-disabled="true">Previous</span>
              )}
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return page === currentPage ? (
                  <strong aria-current="page" key={page}>
                    {page}
                  </strong>
                ) : (
                  <Link href={pageHref(page)} key={page}>
                    {page}
                  </Link>
                );
              })}
              {currentPage < totalPages ? (
                <Link href={pageHref(currentPage + 1)}>Next</Link>
              ) : (
                <span aria-disabled="true">Next</span>
              )}
            </nav>
          </div>
        ) : null}
      </section>

      <section className="section">
        <div className="insights-page-container">
          <NewsletterLeadForm />
        </div>
      </section>
    </>
  );
}
