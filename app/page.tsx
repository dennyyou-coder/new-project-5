import Link from "next/link";
import { getInsights } from "@/lib/content";

const platformCards = [
  {
    title: "Signals",
    text: "Track product, category and channel movement.",
    href: "/insights",
    cta: "Explore"
  },
  {
    title: "Reports",
    text: "Turn market noise into focused business context.",
    href: "/market-reports",
    cta: "View"
  },
  {
    title: "Sourcing",
    text: "Understand suppliers, OEM paths and buyer questions.",
    href: "/sourcing",
    cta: "Learn More"
  },
  {
    title: "Expo",
    text: "Follow trade show topics, exhibitors and opportunities.",
    href: "/world-clean-expo",
    cta: "Explore"
  }
];

const centerModules = [
  "Industry Insights",
  "Market Reports",
  "Sourcing Context",
  "Expo Intelligence",
  "Product Categories",
  "Supplier-Side Context",
  "Market Signals",
  "Global Expo Intelligence"
];

const signalTitles: Record<string, string> = {
  "commercial-cleaning-equipment-demand-signals": "Commercial Cleaning Demand Signals",
  "robot-vacuum-market-trends-2026": "Robot Vacuum Signals for 2026",
  "trade-show-intelligence-for-cleaning-brands": "Trade Show Signals for Brands and Buyers",
  "private-label-cleaning-products-sourcing-context": "Private Label Sourcing Context",
  "europe-floor-care-demand-update": "Europe Floor Care Demand Update",
  "china-cleaning-supply-chain-update": "China Supply Chain Signals"
};

const signalContexts: Record<string, string> = {
  "commercial-cleaning-equipment-demand-signals":
    "Labor pressure and service efficiency are shaping equipment demand.",
  "robot-vacuum-market-trends-2026":
    "Navigation, wet cleaning and buyer expectations are reshaping the category.",
  "trade-show-intelligence-for-cleaning-brands":
    "Exhibitor movement and buyer needs reveal useful trade show signals.",
  "private-label-cleaning-products-sourcing-context":
    "OEM paths, supplier fit and risk checks matter before comparison.",
  "europe-floor-care-demand-update":
    "Distributor channels and facility needs point to regional demand shifts.",
  "china-cleaning-supply-chain-update":
    "OEM capability, components and export readiness remain key signals."
};

export default function HomePage() {
  const signalFeed = getInsights().slice(1, 5);

  return (
    <>
      <div className="announcement">
        <div className="container announcement-inner">
          <span>The global home for cleaning industry intelligence, sourcing context, market signals, and expo insights.</span>
          <Link href="/insights">Track latest signals</Link>
        </div>
      </div>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Global Cleaning Industry Intelligence</p>
            <h1>
              Global Cleaning
              <span>Industry Intelligence</span>
            </h1>
            <p className="hero-copy">
              Track cleaning industry signals before they become business
              decisions.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/insights">
                Explore Signals
              </Link>
              <Link className="button-secondary" href="/contact">
                Share Your Inquiry
              </Link>
            </div>
          </div>
          <div className="hero-panel hero-track-card">
            <div className="hero-panel-top">
              <span>INTELLIGENCE TRACK</span>
              <span>GLOBAL</span>
            </div>
            <strong>What We Track</strong>
            <ul className="hero-panel-list">
              <li>Category Signals</li>
              <li>Supplier Context</li>
              <li>Buyer Movement</li>
              <li>Expo Intelligence</li>
            </ul>
          </div>
        </div>
        <div className="container hero-stats">
          <div className="hero-stat">
            <strong>Signals</strong>
            <span>Product, category and channel movement</span>
          </div>
          <div className="hero-stat">
            <strong>Reports</strong>
            <span>Focused market notes and regional demand</span>
          </div>
          <div className="hero-stat">
            <strong>Sourcing</strong>
            <span>Supplier-side context and OEM paths</span>
          </div>
          <div className="hero-stat">
            <strong>Expo</strong>
            <span>Trade show signals and event opportunities</span>
          </div>
        </div>
      </section>

      <section className="featured-signal-section">
        <div className="container">
          <Link
            className="featured-signal-editorial"
            href="/insights/global-cleaning-industry-center-vision"
          >
            <div className="featured-signal-copy">
              <p className="eyebrow">Featured Signal</p>
              <h2>Why the Global Cleaning Industry Needs a Shared Information Center</h2>
              <p>
                The industry is connected, but information is scattered across
                categories, suppliers, buyers, channels, and trade shows.
              </p>
              <span>Read Featured Signal</span>
            </div>
            <div className="featured-signal-image" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Platform Capability</p>
              <h2>Organize signals before they become decisions</h2>
              <p>
                Market movement, sourcing context, category change and trade
                show intelligence in one global industry view.
              </p>
            </div>
          </div>
          <div className="platform-grid platform-entry-grid">
            {platformCards.map((card) => (
              <Link className="platform-card platform-entry-card" href={card.href} key={card.title}>
                <div className="platform-icon" aria-hidden="true">
                  {card.title.slice(0, 1)}
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span>{card.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid-2">
          <div className="image-panel image-panel-global">
            <div>
              <p className="eyebrow">Global Industry Center</p>
              <h2>Read the cleaning industry as a connected system</h2>
              <p>
                Category movement, regional demand, supply capability and trade
                show signals viewed together.
              </p>
            </div>
          </div>
          <div className="module-grid">
            {centerModules.map((item) => (
              <div className="module-chip" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head signal-feed-head">
            <div>
              <p className="eyebrow">Latest Signals</p>
              <h2>Signal Feed</h2>
              <p>
                Market movement, sourcing context and expo observations worth
                tracking.
              </p>
            </div>
            <Link className="button-secondary" href="/insights">
              View all signals
            </Link>
          </div>
          <div className="signal-feed-grid">
            {signalFeed.map((article) => (
              <Link className="signal-feed-card" href={`/insights/${article.slug}`} key={article.slug}>
                <div className="meta">{article.category}</div>
                <h3>{signalTitles[article.slug] || article.title}</h3>
                <p>{signalContexts[article.slug] || article.description}</p>
                <span>Read Signal</span>
              </Link>
            ))}
          </div>
          <div className="insight-prompt">
            <div>
              <p className="eyebrow">Topic Requests</p>
              <h3>Have a signal worth tracking?</h3>
              <p>
                Share a category, region, supplier question or expo topic.
              </p>
            </div>
            <Link className="button" href="/contact">
              Share Signal
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container denny-section">
          <div className="denny-panel">
            <p className="eyebrow">Trust Source</p>
            <h2>Built by Denny You</h2>
            <p>
              A cleaning industry operator connecting information, sourcing
              context, supply-side knowledge and trade show opportunities.
            </p>
            <div className="denny-points">
              <span>Two decades in the cleaning industry</span>
              <span>Industry observer and content creator</span>
              <span>Trade show organizer and supply chain connector</span>
            </div>
            <Link className="button" href="/contact">
              Contact Denny You
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <h2>Make your next cleaning industry move with better context</h2>
              <p>
                Ask about an industry topic, sourcing direction, market report,
                expo cooperation, media request, or business opportunity.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Submit an Inquiry
              </Link>
              <Link className="button-secondary" href="/insights">
                Read Insights
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
