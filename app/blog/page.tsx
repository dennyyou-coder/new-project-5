import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterLeadForm, TallyReportButton } from "@/components/LeadForms";
import { getInsights, type Insight } from "@/lib/content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Blog | World Clean Biz",
  description:
    "World Clean Biz publishes cleaning appliance industry analysis, brand strategy, product category signals, supplier intelligence and global market observations.",
  alternates: {
    canonical: "/blog"
  }
};

const siteUrl = "https://worldcleanbiz.com";
const articlesPerPage = 10;

const brandTopics = [
  "Dyson",
  "Ecovacs",
  "Tineco",
  "Dreame",
  "Roborock",
  "Narwal",
  "iRobot",
  "SharkNinja",
  "Anker",
  "Aiper",
  "Maytronics",
  "Beatbot",
  "Bissell",
  "Midea",
  "Kingclean",
  "Kärcher",
  "Milwaukee",
  "De’Longhi",
  "DJI",
  "Mijia",
  "Laifen",
  "Uwant",
  "TTI",
  "Bosch"
];

const topicMatchers: Record<string, string[]> = {
  Dyson: ["dyson"],
  Ecovacs: ["ecovacs"],
  Tineco: ["tineco"],
  Dreame: ["dreame"],
  Roborock: ["roborock"],
  Narwal: ["narwal"],
  iRobot: ["irobot", "roomba"],
  SharkNinja: ["sharkninja", "shark", "ninja"],
  Anker: ["anker", "eufy"],
  Aiper: ["aiper", "aiper intelligent"],
  Maytronics: ["maytronics", "dolphin"],
  Beatbot: ["beatbot", "beatbot innovation"],
  Bissell: ["bissell", "crosswave", "barkbath"],
  Midea: ["midea"],
  Kingclean: ["kingclean", "mojie"],
  Kärcher: ["kärcher", "karcher"],
  Milwaukee: ["milwaukee"],
  "De’Longhi": ["de’longhi", "de'longhi", "delonghi"],
  DJI: ["dji", "romo"],
  Mijia: ["mijia", "xiaomi"],
  Laifen: ["laifen"],
  Uwant: ["uwant"],
  TTI: ["tti", "hoover", "oreck"],
  Bosch: ["bosch"]
};

const categories = [
  "All",
  "Floorcare",
  "Vacuum",
  "Pool Cleaning",
  "Robotic Mowers",
  "Commercial Cleaning",
  "Supply Chain",
  "Supply Chain Analysis",
  "Sourcing",
  "Industry",
  "Trade Shows",
  "Sourcing Guide",
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

function displayReadTime(article: Insight) {
  return article.readingTime;
}

function displayDate(article: Insight) {
  if (article.date === "2026-06-03") return "June 3, 2026";
  return article.date;
}

function queryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function makeHref(params: { page?: number; category?: string; topic?: string }) {
  const search = new URLSearchParams();

  if (params.page && params.page > 1) {
    search.set("page", String(params.page));
  }

  if (params.category && params.category !== "All") {
    search.set("category", params.category);
  }

  if (params.topic) {
    search.set("topic", params.topic);
  }

  const query = search.toString();
  return query ? `?${query}` : "/blog";
}

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function matchesTopic(article: Insight, topic?: string) {
  if (!topic) return true;
  const needles = topicMatchers[topic] || [topic];
  const haystack = [
    article.title,
    article.category,
    article.excerpt,
    ...article.tags
  ]
    .join(" ")
    .toLowerCase();

  return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

function SidebarContent({ latestSignals, selectedTopic }: { latestSignals: Insight[]; selectedTopic?: string }) {
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
        <h3>Popular Brands</h3>
        <div className="topic-list">
          {brandTopics.map((brand) => {
            const isSelected = brand === selectedTopic;

            return (
              <Link
                aria-current={isSelected ? "true" : undefined}
                className={isSelected ? "active" : undefined}
                href={isSelected ? "/blog" : makeHref({ topic: brand })}
                key={brand}
              >
                {brand}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="sidebar-box latest-signals-sidebar">
        <h3>Latest Articles</h3>
        <div className="latest-signal-list">
          {latestSignals.map((article, index) => (
            <Link href={`/blog/${article.slug}`} key={article.slug}>
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
    <Link className="insights-feed-item" href={`/blog/${article.slug}`}>
      <div className="insights-feed-image">
        <img src={imageFor(article, index)} alt={`${article.title} cover`} />
      </div>
      <div className="insights-feed-copy">
        <span className="insights-category">{article.category}</span>
        <h2>{article.title}</h2>
        <p>{summaryFor(article)}</p>
        <div className="insights-card-meta">
          <span>{displayDate(article)}</span>
          <span>{displayReadTime(article)}</span>
        </div>
        <strong>Read Article</strong>
      </div>
    </Link>
  );
}

export default async function InsightsPage({ searchParams }: { searchParams?: SearchParams }) {
  const articles = getInsights();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedCategory = queryValue(resolvedSearchParams.category);
  const selectedTopic = queryValue(resolvedSearchParams.topic);
  const filteredArticles = articles.filter((article) => {
    const categoryMatches = !selectedCategory || selectedCategory === "All" || article.category === selectedCategory;
    return categoryMatches && matchesTopic(article, selectedTopic);
  });
  const hasFilter = Boolean(selectedCategory && selectedCategory !== "All") || Boolean(selectedTopic);
  const featured = hasFilter
    ? filteredArticles[0]
    : articles.find((article) => article.featured) || articles[0];
  const feedArticles = hasFilter
    ? filteredArticles.filter((article) => article.slug !== featured?.slug)
    : articles.filter((article) => article.slug !== featured?.slug);
  const totalPages = Math.max(1, Math.ceil(feedArticles.length / articlesPerPage));
  const currentPage = Math.min(parsePage(resolvedSearchParams.page), totalPages);
  const pageStart = (currentPage - 1) * articlesPerPage;
  const visibleFeedArticles = feedArticles.slice(pageStart, pageStart + articlesPerPage);
  const latestSignals = articles.slice(0, 5);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: hasFilter ? "Filtered World Clean Biz Articles" : "World Clean Biz Blog Articles",
    itemListElement: visibleFeedArticles.map((article, index) => ({
      "@type": "ListItem",
      position: pageStart + index + 1,
      url: `${siteUrl}/blog/${article.slug}`,
      name: article.title
    }))
  };

  return (
    <>
      <section className="insights-featured-top">
        <div className="insights-page-container">
          {featured ? (
            <Link className="insights-featured-hero" href={`/blog/${featured.slug}`}>
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
                  <span>{displayReadTime(featured)}</span>
                </div>
                <strong>Read Article →</strong>
              </div>
            </Link>
          ) : null}

          <div className="insights-filter-wrap insights-filter-panel">
            <div className="insights-filter insights-filter-v3" aria-label="Insight categories">
              {categories.map((category) => {
                const isAllSelected = !selectedCategory && category === "All" && !selectedTopic;
                const isCategorySelected = selectedCategory === category;
                const isSelected = isAllSelected || isCategorySelected;

                return (
                  <Link
                    aria-current={isSelected ? "true" : undefined}
                    className={isSelected ? "active" : undefined}
                    href={isCategorySelected ? "/blog" : makeHref({ category })}
                    key={category}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section insights-publication-section">
        <div className="insights-page-container insights-publication-layout">
          <main className="insights-feed" aria-label="Industry insight articles">
            {visibleFeedArticles.length ? (
              visibleFeedArticles.map((article, index) => (
              <ArticleFeedItem article={article} index={pageStart + index} key={article.slug} />
              ))
            ) : !filteredArticles.length ? (
              <div className="insights-empty-state">
                <h2>No articles found</h2>
                <p>Try another category or topic.</p>
                <Link href="/blog">View all articles</Link>
              </div>
            ) : null}
          </main>

          <aside className="insights-sidebar insights-sidebar-v2 insights-sidebar-desktop" aria-label="Insights sidebar">
            <SidebarContent latestSignals={latestSignals} selectedTopic={selectedTopic} />
          </aside>

          <aside className="insights-sidebar insights-sidebar-v2 insights-sidebar-mobile" aria-label="Insights sidebar">
            <SidebarContent latestSignals={latestSignals} selectedTopic={selectedTopic} />
          </aside>
        </div>
        {totalPages > 1 ? (
          <div className="insights-page-container">
            <nav className="insights-pagination insights-pagination-v2" aria-label="Insights pagination">
              {currentPage > 1 ? (
                <Link href={makeHref({ page: currentPage - 1, category: selectedCategory, topic: selectedTopic })}>Previous</Link>
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
                  <Link href={makeHref({ page, category: selectedCategory, topic: selectedTopic })} key={page}>
                    {page}
                  </Link>
                );
              })}
              {currentPage < totalPages ? (
                <Link href={makeHref({ page: currentPage + 1, category: selectedCategory, topic: selectedTopic })}>Next</Link>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
}
