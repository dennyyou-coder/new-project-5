import type { Metadata } from "next";
import Link from "next/link";
import { getInsights, type Insight } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Signals, analysis and opportunities across the global cleaning industry, covering product shifts, supplier movements, market trends and industry opportunities."
};

const categories = [
  "All",
  "Products",
  "Brands",
  "Manufacturing",
  "Markets",
  "Supply Chain",
  "Trade Shows"
];

const topics = [
  "Robotic Vacuums",
  "Floor Washers",
  "Pool Robots",
  "Lawn Mowers",
  "Supply Chain",
  "Private Label"
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop"
];

function imageFor(article: Insight, index: number) {
  return article.coverImage || fallbackImages[index % fallbackImages.length];
}

function InsightCard({ article, index }: { article: Insight; index: number }) {
  return (
    <Link className="insights-card" href={`/insights/${article.slug}`}>
      <div className="insights-card-image">
        <img src={imageFor(article, index)} alt={`${article.title} cover`} />
      </div>
      <div className="insights-card-body">
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

export default function InsightsPage() {
  const articles = getInsights();
  const featured = articles.find((article) => article.featured) || articles[0];
  const remainingArticles = articles.filter((article) => article.slug !== featured?.slug);
  const firstGrid = remainingArticles.slice(0, 6);
  const moreGrid = remainingArticles.slice(6);
  const trendingSignals = articles.slice(0, 5);

  return (
    <>
      <section className="insights-hero">
        <div className="container insights-hero-grid">
          <div>
            <p className="eyebrow">Industry Insights</p>
            <h1>Signals, Analysis And Opportunities Across The Global Cleaning Industry</h1>
            <p>
              Track product shifts, supplier movements, market trends and
              industry opportunities.
            </p>
          </div>
          <div className="insights-metrics" aria-label="Insights platform metrics">
            <div>
              <strong>100+ Signals</strong>
              <span>Tracked across cleaning categories and markets</span>
            </div>
            <div>
              <strong>20+ Years Industry Experience</strong>
              <span>Built on long-term observation and industry network</span>
            </div>
            <div>
              <strong>Global Industry Coverage</strong>
              <span>Products, suppliers, markets and trade show movement</span>
            </div>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="section">
          <div className="container">
            <Link className="insights-featured" href={`/insights/${featured.slug}`}>
              <div className="insights-featured-image">
                <img src={imageFor(featured, 0)} alt={`${featured.title} featured cover`} />
              </div>
              <div className="insights-featured-copy">
                <p className="eyebrow">Featured Insight</p>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <div className="insights-card-meta">
                  <span>{featured.date}</span>
                  <span>{featured.readingTime}</span>
                </div>
                <strong>Read Insight</strong>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section section-soft insights-library-section">
        <div className="container">
          <div className="insights-filter" aria-label="Insight categories">
            {categories.map((category) => (
              <button className={category === "All" ? "active" : ""} key={category} type="button">
                {category}
              </button>
            ))}
          </div>

          <div className="insights-layout">
            <main>
              <div className="insights-grid">
                {firstGrid.map((article, index) => (
                  <InsightCard article={article} index={index + 1} key={article.slug} />
                ))}
              </div>

              <div className="insights-report-cta">
                <div>
                  <p className="eyebrow">Market Reports</p>
                  <h2>Stay Ahead Of The Cleaning Industry</h2>
                  <p>
                    Get weekly signals, analysis and free market reports
                    straight to your inbox.
                  </p>
                </div>
                <Link className="button" href="/market-reports">
                  Get Free Reports
                </Link>
              </div>

              {moreGrid.length > 0 ? (
                <>
                  <div className="section-head insights-more-head">
                    <div>
                      <p className="eyebrow">More Insights</p>
                      <h2>More Industry Signals</h2>
                    </div>
                  </div>
                  <div className="insights-grid">
                    {moreGrid.map((article, index) => (
                      <InsightCard article={article} index={index + 7} key={article.slug} />
                    ))}
                  </div>
                </>
              ) : null}

              <nav className="insights-pagination" aria-label="Insights pagination">
                <span>Previous</span>
                <strong>1</strong>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>Next</span>
              </nav>
            </main>

            <aside className="insights-sidebar" aria-label="Insights sidebar">
              <div className="sidebar-box">
                <h3>Trending Signals</h3>
                <ol className="trending-list">
                  {trendingSignals.map((article) => (
                    <li key={article.slug}>
                      <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="sidebar-box">
                <h3>Popular Topics</h3>
                <div className="topic-list">
                  {topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              </div>
              <div className="sidebar-box insights-sidebar-cta">
                <p className="eyebrow">Free Market Reports</p>
                <h3>Market intelligence for better decisions</h3>
                <p>
                  Get category reports and market notes for cleaning industry
                  opportunities.
                </p>
                <Link className="button" href="/market-reports">
                  Get Free Reports
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <h2>Turn Industry Signals Into Business Opportunities</h2>
              <p>
                World Clean Biz helps industry professionals make better
                decisions with signals, intelligence and global connections.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/market-reports">
                Get Free Reports
              </Link>
              <Link className="button-secondary" href="/contact">
                Contact Denny
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
