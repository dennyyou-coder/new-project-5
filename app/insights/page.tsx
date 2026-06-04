import type { Metadata } from "next";
import Link from "next/link";
import { getInsights, type Insight } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Analysis, signals and opportunities from the global cleaning industry, covering product shifts, supplier movements, market trends and business opportunities."
};

const topics = [
  "Cleaning Equipment",
  "Sustainability",
  "Private Label",
  "E-commerce",
  "Disinfection",
  "Smart Cleaning",
  "Hygiene",
  "Innovation"
];

const categories = [
  "All",
  "Products",
  "Brands",
  "Manufacturing",
  "Markets",
  "Supply Chain",
  "Trade Shows",
  "Sourcing"
];

const summaryDetails: Record<string, string> = {
  "global-cleaning-industry-center-vision":
    "This signal explains why the cleaning industry needs a shared information center as products, suppliers, channels and trade shows become more connected. It looks at how scattered information slows business decisions and why a clearer industry view can help buyers, brands and suppliers identify opportunities earlier.",
  "commercial-cleaning-equipment-demand-signals":
    "Commercial cleaning equipment demand is being shaped by labor pressure, higher service standards and the need for better operating efficiency. This article looks at the signals behind category movement and why manufacturers, distributors and service-focused buyers should monitor how facility needs are changing.",
  "robot-vacuum-market-trends-2026":
    "The robot vacuum category is entering a more competitive phase as navigation, wet cleaning, docking systems and pricing expectations continue to shift. This article explores the product signals that matter for brands, suppliers and buyers watching where the next wave of category growth may come from.",
  "trade-show-intelligence-for-cleaning-brands":
    "Trade shows reveal more than exhibitor lists. They show category movement, buyer interest, supplier positioning and partnership opportunities. This article explains how cleaning brands and buyers can read trade show signals to better understand what is changing across the global industry.",
  "private-label-cleaning-products-sourcing-context":
    "Private label cleaning products require more than choosing a supplier from a catalog. This article looks at OEM paths, supplier fit, category expectations and sourcing risks that buyers should understand before comparing factories or committing to a new product direction.",
  "europe-floor-care-demand-update":
    "European floor care demand is influenced by regional channels, facility requirements and changing expectations around performance and reliability. This article breaks down the signals buyers and suppliers should monitor when evaluating floor care opportunities in mature but still active markets.",
  "china-cleaning-supply-chain-update":
    "China remains a critical supply chain base for cleaning products, components and OEM development. This article examines supplier capability, export readiness and the manufacturing signals global buyers should understand before building sourcing plans or comparing factory options."
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"
];

const imageOverrides: Record<string, string> = {
  "commercial-cleaning-equipment-demand-signals":
    "https://source.unsplash.com/INDGbj_ojG4/1200x675",
  "robot-vacuum-market-trends-2026":
    "https://source.unsplash.com/eSUOY0OImJc/1200x675",
  "europe-floor-care-demand-update":
    "https://source.unsplash.com/yy-msv5-LFo/1200x675",
  "private-label-cleaning-products-sourcing-context":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"
};

function imageFor(article: Insight, index: number) {
  return imageOverrides[article.slug] || article.coverImage || fallbackImages[index % fallbackImages.length];
}

function summaryFor(article: Insight) {
  return summaryDetails[article.slug] || article.excerpt;
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

function SidebarContent({ latestSignals }: { latestSignals: Insight[] }) {
  return (
    <>
      <div className="sidebar-box market-report-priority">
        <p className="eyebrow">Free Market Reports</p>
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
        <h3>Get industry trends, supplier intelligence and market opportunities from World Clean Biz.</h3>
        <Link className="button" href="/market-reports">
          Get Free Reports
        </Link>
      </div>

      <div className="sidebar-box about-denny-sidebar">
        <img
          src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=360&h=360&auto=format&fit=crop&crop=faces"
          alt="Professional portrait placeholder for Denny You"
        />
        <h3>Denny Connects The Industry</h3>
        <ul>
          <li>20+ Years In The Cleaning Industry</li>
          <li>9,000+ Industry Professionals</li>
          <li>Global Industry Events And Connections</li>
          <li>Supplier, Brand And Market Network</li>
        </ul>
        <Link href="/about">Learn More About Denny</Link>
      </div>

      <div className="sidebar-box">
        <h3>Popular Topics</h3>
        <div className="topic-list">
          {topics.map((topic) => (
            <Link href="/insights" key={topic}>
              {topic}
            </Link>
          ))}
        </div>
      </div>

      <div className="sidebar-box latest-signals-sidebar">
        <h3>Latest Signals</h3>
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
        <strong>Read Insight</strong>
      </div>
    </Link>
  );
}

export default function InsightsPage() {
  const articles = getInsights();
  const featured = articles.find((article) => article.featured) || articles[0];
  const feedArticles = articles.filter((article) => article.slug !== featured?.slug);
  const latestSignals = articles.slice(0, 5);
  const featuredSummary =
    "This signal explains why the cleaning industry needs a shared information center as products, suppliers, channels and trade shows become more connected. It shows how scattered information slows business decisions and why a clearer industry view can help buyers, brands and suppliers identify opportunities earlier.";
  const featuredImage =
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop";

  return (
    <>
      <section className="insights-featured-top">
        <div className="insights-page-container">
          {featured ? (
            <Link className="insights-featured-hero" href={`/insights/${featured.slug}`}>
              <div className="insights-featured-hero-image">
                <img src={featuredImage} alt={`${featured.title} featured cover`} />
              </div>
              <div className="insights-featured-hero-copy">
                <p className="eyebrow">Featured Insight</p>
                <span className="insights-category">Industry</span>
                <h1>{featured.title}</h1>
                <p>{featuredSummary}</p>
                <div className="insights-card-meta">
                  <span>{displayDate(featured)}</span>
                  <span>{displayReadTime(featured, 0)}</span>
                </div>
                <strong>Read Insight →</strong>
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
            {feedArticles.map((article, index) => (
              <ArticleFeedItem article={article} index={index} key={article.slug} />
            ))}
          </main>

          <aside className="insights-sidebar insights-sidebar-v2 insights-sidebar-desktop" aria-label="Insights sidebar">
            <SidebarContent latestSignals={latestSignals} />
          </aside>

          <aside className="insights-sidebar insights-sidebar-v2 insights-sidebar-mobile" aria-label="Insights sidebar">
            <SidebarContent latestSignals={latestSignals} />
          </aside>
        </div>
        <div className="insights-page-container">
          <nav className="insights-pagination insights-pagination-v2" aria-label="Insights pagination">
            <span>Previous</span>
            <strong>1</strong>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>Next</span>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="insights-page-container">
          <form className="insights-newsletter-cta">
            <div>
              <p className="eyebrow">Newsletter & Reports</p>
              <h2>Stay Ahead Of The Cleaning Industry</h2>
              <p>
                Get weekly signals, analysis and free market reports straight
                to your inbox.
              </p>
            </div>
            <div className="newsletter-form-row">
              <input aria-label="Email Address" placeholder="Email Address" type="email" />
              <button className="button" type="submit">
                Get Free Reports
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
