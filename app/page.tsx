import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";

const heroSignals: { icon: IconName; label: string }[] = [
  { icon: "target", label: "Product Opportunities" },
  { icon: "factory", label: "Supply Chain Opportunities" },
  { icon: "trending", label: "Market Opportunities" },
  { icon: "radio", label: "Industry Intelligence" }
];

const credibilityTags = [
  "Since 2006 - Front-Line Industry Operator",
  "Since 2018 - Industry Analysis And Category Signals",
  "Forums & Expos - Thousands Of Professionals"
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
  "Operator inside the cleaning industry since 2006",
  "Builder of products, forums, trade shows and industry networks",
  "Industry analysis and category signals since 2018",
  "Connector across brands, suppliers, buyers and professionals"
];

const helpCards: {
  icon: IconName;
  title: string;
  text: string;
  cta: string;
  href: string;
  image: string;
}[] = [
  {
    icon: "radio",
    title: "Industry Signals",
    text: "Follow the latest market changes, product shifts and business opportunities.",
    cta: "Latest Industry Signals",
    href: "/insights",
    image: "/images/industry/home-hero-cleaning-forum-2025.jpg"
  },
  {
    icon: "search",
    title: "Sourcing Intelligence",
    text: "Understand suppliers, manufacturers and product opportunities before making sourcing decisions.",
    cta: "Submit Inquiry",
    href: "/sourcing",
    image: "/images/industry/home-supplier-components-2025.jpg"
  },
  {
    icon: "file",
    title: "Free Market Reports",
    text: "Get free cleaning industry reports and market insights.",
    cta: "Get Free Reports",
    href: "/reports",
    image: "/images/industry/reports-market-preview-products-2025.jpg"
  },
  {
    icon: "globe",
    title: "World Clean Expo",
    text: "Connect with manufacturers, brands, buyers and industry professionals.",
    cta: "Get Expo Updates",
    href: "/world-clean-expo",
    image: "/images/industry/home-expo-networking-2025.jpg"
  }
];

const trustSignals = [
  {
    stat: "Since 2006",
    title: "Inside The Cleaning Industry",
    text: "Front-line work across products, suppliers, customers and category shifts.",
    image: "/images/industry/home-industry-products-2025.jpg"
  },
  {
    stat: "Since 2018",
    title: "Publishing Industry Signals",
    text: "Long-running cleaning industry analysis helping professionals read category movement.",
    image: "/images/industry/about-denny-speaking-forum-2025.jpg"
  },
  {
    stat: "Forums & Expos",
    title: "Real Industry Connections",
    text: "Professional gatherings, trade show activity and direct industry conversations.",
    image: "/images/industry/home-expo-networking-2025.jpg"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Global Cleaning Industry Intelligence And Connections</p>
            <h1>
              Global Cleaning
              <span>Industry Intelligence</span>
            </h1>
            <strong className="hero-declaration">
              Built From 20 Years Inside The Cleaning Industry.
              <span>Not Just Watching It. Helping Build It.</span>
            </strong>
            <p className="hero-copy">
              World Clean Biz turns signals from products, suppliers, brands,
              customers, forums and trade shows into practical intelligence and
              meaningful industry connections.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/insights">
                Latest Industry Signals
              </Link>
              <Link className="button-secondary" href="/reports">
                Get Free Reports
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
              World Clean Biz is built from front-line cleaning industry
              experience across products, brands, suppliers, customers, forums
              and trade shows.
            </p>
            <p>
              Its purpose is simple: turn industry signals into intelligence,
              and intelligence into useful connections for manufacturers,
              brands, distributors, retailers, sourcing teams and industry
              professionals.
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
            <p className="eyebrow">The Person Behind The Industry Network</p>
            <h2>Built By Someone Inside The Industry</h2>
            <p>
              Denny has spent nearly two decades inside the cleaning industry,
              not only watching category changes, but helping build products,
              forums, trade shows and professional networks around them.
            </p>
            <ul className="feature-list denny-point-list">
              {dennyPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link className="button-secondary" href="/about">
              About Denny
            </Link>
          </div>
          <div className="denny-photo-panel">
            <img
              src="/images/industry/about-denny-speaking-forum-2025.jpg"
              alt="Denny speaking at a cleaning industry forum"
            />
            <div className="denny-photo-caption">
              <strong>Denny Connects The Industry</strong>
              <span>Manufacturers, brands, suppliers and industry professionals.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-signal-section">
        <div className="container">
          <Link
            className="featured-signal-editorial"
            href="/insights/maytronics-forty-years-of-robotic-pool-cleaners"
          >
            <div className="featured-signal-cover">
              <img
                src="/images/industry/sourcing-hero-expo-products-2026.jpg"
                alt="Robotic pool cleaner products at an industry exhibition"
              />
            </div>
            <div className="featured-signal-copy">
              <p className="eyebrow">Featured Signal</p>
              <h2>Maytronics And Forty Years Of Robotic Pool Cleaners</h2>
              <p>
                Maytronics built the Dolphin brand over decades, but the
                robotic pool cleaner category is now moving into a more
                competitive consumer electronics phase.
              </p>
              <span>Read Featured Signal</span>
            </div>
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
                World Clean Biz helps industry professionals turn signals into
                sourcing, market and business opportunities.
              </p>
            </div>
          </div>
          <div className="platform-grid">
            {helpCards.map((item) => (
              <Link className="platform-card compact-card home-help-card" href={item.href} key={item.title}>
                <div className="home-help-image">
                  <img src={item.image} alt={`${item.title} industry scene`} />
                </div>
                <div className="home-help-body">
                  <IconBadge name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span>{item.cta}</span>
                </div>
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
              <h2>Industry Footprint</h2>
              <p>
                World Clean Biz builds trust through real industry experience,
                visible activity and long-term category involvement.
              </p>
            </div>
          </div>
          <div className="grid-3">
            {trustSignals.map((item) => (
              <div className="card trust-signal-card" key={item.title}>
                <div className="trust-signal-image">
                  <img src={item.image} alt={`${item.title} visual proof`} />
                </div>
                <div className="trust-signal-body">
                  <span>{item.stat}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
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
                Latest Industry Signals
              </Link>
              <Link className="button-secondary" href="/reports">
                Get Free Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
