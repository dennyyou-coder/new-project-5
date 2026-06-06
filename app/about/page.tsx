import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "About World Clean Biz",
  description:
    "World Clean Biz is a global cleaning industry intelligence platform built from Denny You's front-line experience across products, brands, suppliers, forums and trade shows."
};

const stats = [
  {
    value: "Since 2006",
    label: "Front-Line Industry Operator"
  },
  {
    value: "Since 2018",
    label: "Industry Analysis And Category Signals"
  },
  {
    value: "500-Person",
    label: "Industry Forums Organized"
  },
  {
    value: "Forums & Trade Shows",
    label: "Professional Networks Built"
  }
];

const networkPhotos = [
  {
    className: "about-photo-forum",
    label: "Industry Forum"
  },
  {
    className: "about-photo-speaking",
    label: "Denny Speaking"
  },
  {
    className: "about-photo-panel",
    label: "Panel Discussion"
  },
  {
    className: "about-photo-network",
    label: "Industry Networking"
  }
];

const authorityCards: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "factory",
    title: "Operator",
    text: "Inside the industry since 2006, working directly with products, customers, suppliers and markets."
  },
  {
    icon: "package",
    title: "Builder",
    text: "Helping build products, forums, trade shows, industry conversations and professional networks."
  },
  {
    icon: "radio",
    title: "Influencer",
    text: "Publishing industry analysis since 2018 and helping professionals understand where the industry is moving."
  },
  {
    icon: "handshake",
    title: "Connector",
    text: "Connecting brands, suppliers, buyers, researchers, media and industry professionals across the cleaning ecosystem."
  }
];

export default function AboutPage() {
  return (
    <>
      <section className="about-v1-hero">
        <div className="container about-v1-hero-grid">
          <div className="about-v1-hero-copy">
            <p className="eyebrow">About Denny You</p>
            <h1>20 Years Inside The Cleaning Industry. Not Just Watching It. Helping Build It.</h1>
            <p>
              Denny You has worked across products, global customers,
              suppliers, brands, forums and trade shows since 2006.
            </p>
            <div className="about-v1-founder">
              Operator. Builder. Influencer. Connector.
            </div>
            <div className="hero-actions">
              <Link className="button" href="/reports">
                Get Free Reports
              </Link>
              <Link className="button-secondary" href="/contact">
                Submit Inquiry
              </Link>
            </div>
          </div>
          <div className="about-v1-hero-photo" aria-label="Industry forum audience">
            <span>Industry forum network</span>
          </div>
        </div>
      </section>

      <section className="section about-v1-mission">
        <div className="container about-v1-narrow">
          <p className="eyebrow">Why This Exists</p>
          <h2>World Clean Biz exists because the cleaning industry is changing faster than ever.</h2>
          <div className="about-v1-mission-copy">
            <p>New categories are emerging.</p>
            <p>Chinese manufacturers are becoming global brands.</p>
            <p>Supply chains are evolving.</p>
            <p>Distribution channels are shifting.</p>
            <p>
              Yet much of the industry's most valuable information remains
              fragmented.
            </p>
            <p>
              World Clean Biz is built to turn those signals into intelligence,
              and intelligence into meaningful industry connections.
            </p>
            <p>
              The platform comes from Denny's years inside products, brands,
              suppliers, customers, forums and trade shows.
            </p>
          </div>
        </div>
      </section>

      <section className="about-v1-feature-photo">
        <div className="container">
          <div className="about-v1-wide-photo">
            <span>Industry Forum</span>
          </div>
        </div>
      </section>

      <section className="section about-v1-built">
        <div className="container about-v1-built-grid">
          <div className="about-v1-speaking-photo" aria-label="Denny speaking at an industry forum">
            <span>Denny at industry forums</span>
          </div>
          <div>
            <p className="eyebrow">Why Denny</p>
            <h2>Because he has spent nearly two decades inside the industry.</h2>
            <p>
              Denny is not a desk analyst looking at the cleaning industry from
              the outside. Since 2006, he has worked on the front line with
              products, customers, suppliers and markets.
            </p>
            <p>
              He has served international customers, participated in product
              and category growth, and watched multiple cleaning brands move
              from small teams into major global competitors.
            </p>
            <p>
              Since 2018, he has published widely read industry analysis
              covering robotic vacuums, floor cleaners, cordless vacuums, pool
              cleaners, lawn robots, and the companies behind them.
            </p>
            <p>
              He also shares cleaning industry insights with professional
              research and investment audiences, but his authority starts from
              the product, customer and market front line.
            </p>
            <div className="about-v1-stat-grid">
              {stats.map((item) => (
                <div className="about-v1-stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft about-v1-cover">
        <div className="container">
          <div className="about-v1-section-head">
            <p className="eyebrow">Authority Layer</p>
            <h2>Operator. Builder. Influencer. Connector.</h2>
            <p>
              Denny's authority comes from facts and field experience, not
              empty titles.
            </p>
          </div>
          <div className="about-v1-cover-grid">
            {authorityCards.map((item) => (
              <div className="about-v1-cover-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-v1-network">
        <div className="container">
          <div className="about-v1-section-head">
            <p className="eyebrow">Beyond Content</p>
            <h2>Helping build industry conversations, forums and trade show networks.</h2>
            <p>
              From 500-person industry forums to professional trade show
              networks, Denny has spent years helping cleaning professionals
              meet, compare signals and build useful business connections.
            </p>
          </div>
          <div className="about-v1-photo-grid">
            {networkPhotos.map((item) => (
              <div className={`about-v1-photo ${item.className}`} key={item.label}>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-v1-expo-section">
        <div className="container">
          <div className="about-v1-expo">
            <div>
              <p className="eyebrow">
                <InlineIcon name="globe" />
                World Clean Expo
              </p>
              <h2>From Industry Signals To Industry Connection</h2>
              <p>
                The same industry network behind World Clean Biz also supports
                World Clean Expo.
              </p>
              <p>
                World Clean Expo is designed to connect global buyers, cleaning
                brands, Chinese manufacturers, component suppliers, and industry
                service providers in one focused industry event.
              </p>
              <Link className="button-secondary" href="/world-clean-expo">
                Get Expo Updates
              </Link>
            </div>
            <div className="about-v1-expo-image" aria-label="World Clean Expo industry event">
              <span>World Clean Expo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-v1-cta-section">
        <div className="container about-v1-cta">
          <div>
            <p className="eyebrow">Stay Connected to the Industry</p>
            <h2>Get industry updates, supplier insights, market analysis, and World Clean Expo news.</h2>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/reports">
              Get Free Reports
            </Link>
            <Link className="button-secondary" href="/contact">
              Submit Inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
