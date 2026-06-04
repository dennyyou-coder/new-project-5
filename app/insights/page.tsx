import type { Metadata } from "next";
import Link from "next/link";
import { getInsights, type Insight } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Analysis, signals and opportunities from the global cleaning industry, covering product shifts, supplier movements, market trends and business opportunities."
};

const topics = [
  "Robotic Vacuums",
  "Floor Washers",
  "Pool Robots",
  "Lawn Mowers",
  "Private Label",
  "Supply Chain",
  "Cleaning Chemicals",
  "Trade Shows"
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop"
];

function imageFor(article: Insight, index: number) {
  return article.coverImage || fallbackImages[index % fallbackImages.length];
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
  const latestSignals = articles.slice(0, 5);

  return (
    <>
      <section className="insights-hero insights-hero-v2">
        <div className="insights-page-container">
          <p className="eyebrow">Industry Insights</p>
          <h1>
            Analysis, Signals And Opportunities
            <span>From The Global Cleaning Industry</span>
          </h1>
          <p>
            Latest thinking from Denny and World Clean Biz. Track product
            shifts, supplier movements, market trends and business
            opportunities across the global cleaning industry.
          </p>
        </div>
      </section>

      <section className="section insights-publication-section">
        <div className="insights-page-container">
          <div className="insights-publication-layout">
            <main className="insights-feed" aria-label="Industry insight articles">
              {articles.map((article, index) => (
                <ArticleFeedItem article={article} index={index} key={article.slug} />
              ))}
            </main>

            <aside className="insights-sidebar insights-sidebar-v2" aria-label="Insights sidebar">
              <div className="sidebar-box market-report-priority">
                <p className="eyebrow">Free Market Reports</p>
                <div className="report-stack" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h3>Get access to industry trends, supplier intelligence and market opportunities.</h3>
                <Link className="button" href="/market-reports">
                  Get Free Reports
                </Link>
              </div>

              <div className="sidebar-box about-denny-sidebar">
                <img
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=360&h=360&auto=format&fit=crop&crop=faces"
                  alt="Professional portrait placeholder for Denny You"
                />
                <h3>About Denny</h3>
                <ul>
                  <li>20+ Years In The Cleaning Industry</li>
                  <li>9,000+ Industry Professionals In Network</li>
                  <li>Global Industry Events And Connections</li>
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
                        <small>{article.date}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

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
