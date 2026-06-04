import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";

const heroSignals: { icon: IconName; label: string }[] = [
  { icon: "target", label: "Product Opportunities" },
  { icon: "factory", label: "Supply Chain Signals" },
  { icon: "trending", label: "Market Opportunities" },
  { icon: "radio", label: "Industry Intelligence" }
];

const credibilityTags = [
  "20+ Years Industry Experience",
  "9,000+ Industry Professionals",
  "Global Supplier Network",
  "Industry Events & Intelligence"
];

const opportunityCards: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "target",
    title: "Product Opportunities",
    text: "Identify emerging cleaning products and category shifts."
  },
  {
    icon: "factory",
    title: "Supply Chain Opportunities",
    text: "Understand manufacturers, suppliers and sourcing directions."
  },
  {
    icon: "trending",
    title: "Market Opportunities",
    text: "Track regional demand, channel changes and buyer needs."
  },
  {
    icon: "radio",
    title: "Industry Intelligence",
    text: "Follow signals from brands, products, exhibitions and industry movements."
  }
];

const dennyPoints = [
  "20+ years in the cleaning industry",
  "Connected with manufacturers, brands and suppliers",
  "Organizer of industry events and forums",
  "Long-term observer of global cleaning industry trends"
];

const dennyStats = [
  { value: "20+ Years", label: "Cleaning industry experience" },
  { value: "9,000+", label: "Industry professionals" },
  { value: "100+ Brands", label: "Tracked across categories" },
  { value: "Global Network", label: "Suppliers, brands and events" }
];

const helpCards: { icon: IconName; title: string; text: string; cta: string; href: string }[] = [
  {
    icon: "radio",
    title: "Industry Signals",
    text: "Follow the latest market changes, product shifts and business opportunities.",
    cta: "Explore Signals",
    href: "/insights"
  },
  {
    icon: "search",
    title: "Sourcing Intelligence",
    text: "Understand suppliers, manufacturers and product opportunities before making sourcing decisions.",
    cta: "Learn About Sourcing",
    href: "/sourcing"
  },
  {
    icon: "file",
    title: "Free Market Reports",
    text: "Get free cleaning industry reports and market insights.",
    cta: "Get Reports",
    href: "/market-reports"
  },
  {
    icon: "globe",
    title: "World Clean Expo",
    text: "Connect with manufacturers, brands, buyers and industry professionals.",
    cta: "Visit Expo Page",
    href: "/world-clean-expo"
  }
];

const testimonials = [
  {
    quote:
      "World Clean Biz helps us understand which cleaning products and suppliers deserve attention before the market becomes crowded.",
    label: "Overseas Distributor"
  },
  {
    quote:
      "Denny understands both the factory side and the market side. His insights are practical for companies looking for global opportunities.",
    label: "Cleaning Product Manufacturer"
  },
  {
    quote:
      "This is not just industry news. It helps connect signals, suppliers and real business opportunities.",
    label: "Industry Professional"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Providing Profitable Opportunities And Intelligence</p>
            <h1>
              Global Cleaning
              <span>Industry Intelligence</span>
            </h1>
            <p className="hero-copy">
              Discover product opportunities, supply chain opportunities,
              market opportunities and industry signals for the global cleaning
              industry.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/insights">
                Explore Signals
              </Link>
              <Link className="button-secondary" href="/market-reports">
                Get Free Market Reports
              </Link>
            </div>
            <div className="hero-trust-tags" aria-label="World Clean Biz credibility">
              {credibilityTags.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="hero-panel hero-track-card">
            <div className="hero-panel-top">
              <span>OPPORTUNITY INTELLIGENCE</span>
              <span>GLOBAL</span>
            </div>
            <strong>What We Track</strong>
            <ul className="hero-panel-list">
              {heroSignals.map((item) => (
                <li key={item.label}>
                  <InlineIcon name={item.icon} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid-2 home-intro-grid">
          <div>
            <p className="eyebrow">What Is World Clean Biz?</p>
            <h2>The Global Hub For Cleaning Industry Opportunities</h2>
            <p>
              World Clean Biz helps cleaning industry professionals discover
              profitable opportunities, market signals and supply chain
              intelligence across the global cleaning industry.
            </p>
            <p>
              It is built for manufacturers, brands, distributors, retailers,
              sourcing teams and industry professionals who need to understand
              where the next business opportunities are coming from.
            </p>
          </div>
          <div className="module-grid opportunity-card-grid">
            {opportunityCards.map((item) => (
              <div className="card opportunity-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2 denny-section-grid">
          <div>
            <p className="eyebrow">Why Denny?</p>
            <h2>Why Industry Leaders Follow Denny</h2>
            <p>
              Denny has spent more than 20 years in the cleaning industry,
              connecting manufacturers, brands, suppliers, distributors and
              industry professionals. World Clean Biz is built on his long-term
              industry observation, supplier network and ability to identify
              business opportunities before they become obvious.
            </p>
            <ul className="feature-list denny-point-list">
              {dennyPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link className="button-secondary" href="/about">
              Learn More About Denny
            </Link>
          </div>
          <div className="denny-stat-grid">
            {dennyStats.map((item) => (
              <div className="card denny-stat-card" key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
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
              <h2>Why The Global Cleaning Industry Needs A Shared Information Center</h2>
              <p>
                The cleaning industry is changing faster than ever. New
                products, new manufacturers, new channels and new market
                opportunities are emerging globally. World Clean Biz helps
                industry professionals see these signals earlier.
              </p>
              <span>Read Featured Signal</span>
            </div>
            <div className="featured-signal-image" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">How We Help</p>
              <h2>How We Help</h2>
              <p>
                World Clean Biz turns cleaning industry information into
                practical paths for signals, sourcing, reports and industry
                connections.
              </p>
            </div>
          </div>
          <div className="platform-grid">
            {helpCards.map((item) => (
              <Link className="platform-card compact-card" href={item.href} key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>{item.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Industry Trust</p>
              <h2>Trusted By Industry Professionals</h2>
              <p>
                Practical industry information, supplier context and market
                signals for people making cleaning industry decisions.
              </p>
            </div>
          </div>
          <div className="grid-3">
            {testimonials.map((item) => (
              <div className="card testimonial-card" key={item.label}>
                <p className="testimonial-quote">"{item.quote}"</p>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <IconBadge name="trending" />
              <h2>Stay Ahead Of The Cleaning Industry</h2>
              <p>
                Get global cleaning industry intelligence, market insights and
                profitable opportunities from World Clean Biz.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/insights">
                Explore Signals
              </Link>
              <Link className="button-secondary" href="/market-reports">
                Get Free Market Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
