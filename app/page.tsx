import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getInsights } from "@/lib/content";

const coverage = [
  "Vacuum Cleaners",
  "Robot Vacuums",
  "Floor Care",
  "Pool Cleaning",
  "Commercial Cleaning",
  "Cleaning Technology"
];

const sourcingServices = [
  "OEM / ODM manufacturing support",
  "Private label product opportunities",
  "Supplier matching and factory introductions",
  "Distributor and channel opportunities",
  "Inventory and special purchasing opportunities"
];

export default function HomePage() {
  const latest = getInsights().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Global Cleaning Industry Intelligence</p>
            <h1>World Clean Biz</h1>
            <p className="hero-copy">
              Market insights, sourcing support, and business opportunities for
              cleaning industry professionals worldwide.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/insights">
                Explore Insights
              </Link>
              <Link className="button-secondary" href="/sourcing">
                Start Sourcing
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <strong>For buyers, brands, distributors, and industry teams</strong>
            <span>
              Built from long-term market observation, China supply chain
              knowledge, and global cleaning industry connections.
            </span>
          </div>
        </div>
        <div className="container hero-stats">
          <div className="hero-stat">
            <strong>Insights</strong>
            <span>Market trends, product categories, buyer behavior</span>
          </div>
          <div className="hero-stat">
            <strong>Sourcing</strong>
            <span>OEM, ODM, private label, supplier matching</span>
          </div>
          <div className="hero-stat">
            <strong>Expo</strong>
            <span>Future World Clean Expo interest and cooperation</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">What We Cover</p>
              <h2>Focused on high-value cleaning categories</h2>
              <p>
                World Clean Biz tracks product shifts, buyer demand, sourcing
                changes, and new business opportunities across key categories.
              </p>
            </div>
          </div>
          <div className="tag-list">
            {coverage.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="metric-grid" style={{ marginTop: 24 }}>
            <div className="metric-card">
              <strong>B2B</strong>
              <span>Designed for buyers, brands, and sourcing teams.</span>
            </div>
            <div className="metric-card">
              <strong>Global</strong>
              <span>Built for overseas market demand and trade decisions.</span>
            </div>
            <div className="metric-card">
              <strong>China</strong>
              <span>Connected to manufacturing and supplier-side knowledge.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured Insights</p>
              <h2>Latest industry analysis</h2>
              <p>
                Articles are built from Denny You's cleaning industry notes and
                edited for global B2B readers.
              </p>
            </div>
            <Link className="button-secondary" href="/insights">
              View All
            </Link>
          </div>
          <div className="grid-3">
            {latest.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Sourcing Services</p>
            <h2>Connect market demand with reliable supply</h2>
            <p>
              The sourcing page is the main conversion path for OEM, ODM,
              private label, supplier matching, and purchasing opportunities.
            </p>
            <div className="tag-list">
              {sourcingServices.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <ul className="feature-list">
              <li>Clarify target market, product positioning, and buyer requirements.</li>
              <li>Identify sourcing paths across OEM, ODM, private label, and inventory.</li>
              <li>Use market insight to avoid choosing suppliers only by unit price.</li>
            </ul>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Main conversion path</div>
            <h3>Need sourcing support?</h3>
            <p>
              Share your target category, market, volume, and timeline. Denny
              You can help identify suitable product directions and supplier
              paths.
            </p>
            <p>
              <Link className="button" href="/contact">
                Submit Inquiry
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Business Entrances</p>
              <h2>Three paths for industry cooperation</h2>
              <p>
                Keep the homepage simple while still giving every visitor a
                clear next step.
              </p>
            </div>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="module-kicker">Research</div>
              <h3>Market Reports</h3>
              <p>
                Category reports, regional demand notes, and buyer trend
                research for cleaning industry decisions.
              </p>
              <p>
                <Link className="text-link" href="/market-reports">
                  View reports
                </Link>
              </p>
            </div>
            <div className="card">
              <div className="module-kicker">Event</div>
              <h3>World Clean Expo</h3>
              <p>
                A future-facing exhibition entry for brands, buyers, suppliers,
                and partners in the global cleaning industry.
              </p>
              <p>
                <Link className="text-link" href="/world-clean-expo">
                  Explore expo
                </Link>
              </p>
            </div>
            <div className="card">
              <div className="module-kicker">Cooperation</div>
              <h3>Contact Denny You</h3>
              <p>
                For sourcing requests, market report interest, expo
                cooperation, and industry partnerships.
              </p>
              <p>
                <Link className="text-link" href="/contact">
                  Send inquiry
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
