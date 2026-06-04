import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";
import { getInsights } from "@/lib/content";

const capabilityPoints: { icon: IconName; label: string }[] = [
  { icon: "radio", label: "Industry Signals" },
  { icon: "factory", label: "Supplier Context" },
  { icon: "file", label: "Market Notes" },
  { icon: "calendar", label: "Expo Intelligence" }
];

const heroTrackItems: { icon: IconName; label: string }[] = [
  { icon: "activity", label: "Category Signals" },
  { icon: "factory", label: "Supplier Context" },
  { icon: "users", label: "Buyer Movement" },
  { icon: "globe", label: "Expo Intelligence" }
];

const heroEntries: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "radio",
    title: "Signals",
    text: "Product, category and channel movement"
  },
  {
    icon: "file",
    title: "Reports",
    text: "Focused market notes and regional demand"
  },
  {
    icon: "search",
    title: "Sourcing",
    text: "Supplier-side context and OEM paths"
  },
  {
    icon: "globe",
    title: "Expo",
    text: "Trade show signals and event opportunities"
  }
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
              {heroTrackItems.map((item) => (
                <li key={item.label}>
                  <InlineIcon name={item.icon} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container hero-stats">
          {heroEntries.map((item) => (
            <div className="hero-stat" key={item.title}>
              <IconBadge name={item.icon} />
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          ))}
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
              <h2>Read the cleaning industry as a connected system</h2>
              <p>
                World Clean Biz connects market signals, supplier context,
                sourcing questions and trade show intelligence into one
                industry view.
              </p>
            </div>
          </div>
          <div className="module-grid">
            {capabilityPoints.map((item) => (
              <div className="module-chip" key={item.label}>
                <InlineIcon name={item.icon} />
                {item.label}
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
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <IconBadge name="message" />
              <h2>Have a cleaning industry question worth tracking?</h2>
              <p>
                Share a category, region, supplier question or expo topic. We
                may turn it into a future signal, market note or sourcing
                discussion.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Share Inquiry
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
