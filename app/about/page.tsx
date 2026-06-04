import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "About",
  description:
    "About World Clean Biz, a global cleaning industry intelligence platform built by Denny You to help professionals understand markets, products, suppliers and opportunities."
};

const focusAreas = [
  "Industry Signals",
  "Market Intelligence",
  "Product Opportunities",
  "Supplier Context",
  "Trade Show Intelligence",
  "Global Industry Connections"
];

const recognitionCards = [
  {
    icon: "star",
    title: "Leading Industry Influencer",
    text: "One of the most recognized voices in China's cleaning products industry."
  },
  {
    icon: "badge",
    title: "Leading Industry Consultant",
    text: "Trusted by manufacturers, brands, distributors and industry decision makers."
  },
  {
    icon: "newspaper",
    title: "Industry Media Operator",
    text: "Long-term publisher of industry analysis, market observations and product insights."
  },
  {
    icon: "calendar",
    title: "Trade Show & Conference Organizer",
    text: "Connecting manufacturers, suppliers, buyers and industry professionals through events and industry platforms."
  }
] satisfies { icon: IconName; title: string; text: string }[];

const serveGroups = [
  "Brands",
  "Importers",
  "Distributors",
  "Retailers",
  "Manufacturers",
  "OEM / ODM Buyers",
  "Investors",
  "Industry Media"
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero-about">
        <div className="container">
          <p className="eyebrow">About World Clean Biz</p>
          <h1>About World Clean Biz</h1>
          <p>
            A global cleaning industry intelligence platform built to help
            industry professionals understand markets, products, suppliers and
            opportunities.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/insights">
              Explore Signals
            </Link>
            <Link className="button-secondary" href="/contact">
              Share Inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">What Is World Clean Biz</p>
            <h2>What Is World Clean Biz</h2>
            <p>
              World Clean Biz tracks industry signals, product trends, supplier
              developments, market opportunities and trade show intelligence
              across the global cleaning industry.
            </p>
            <p>
              The platform was created to help manufacturers, brands,
              distributors, buyers and industry professionals make better
              business decisions through better information.
            </p>
          </div>
          <div className="module-grid">
            {focusAreas.map((item) => (
              <div className="module-chip" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid-2">
          <div className="image-panel image-panel-about">
            <div>
              <p className="eyebrow">Built By Denny You</p>
              <h2>Built By Denny You</h2>
              <p>
                A cleaning industry operator, media voice and connector working
                across products, suppliers, buyers and industry platforms.
              </p>
            </div>
          </div>
          <div>
            <p>
              World Clean Biz was founded by Denny You, one of the most
              recognized industry voices in China's cleaning products sector.
            </p>
            <p>
              For more than 20 years, Denny has worked across manufacturing,
              product development, sourcing, industry media and trade shows
              within the global cleaning industry.
            </p>
            <p>
              Through years of industry research, factory visits, conferences,
              interviews and market analysis, he has built one of the most
              extensive professional networks in the cleaning industry supply
              chain.
            </p>
            <p>
              Today, Denny is widely recognized as one of the leading
              influencers and consultants in China's cleaning products industry.
              His work focuses on helping companies identify product
              opportunities, understand industry trends and make better
              business decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Industry Influence & Recognition</p>
              <h2>Industry Influence & Recognition</h2>
              <p>
                World Clean Biz is built on Denny's industry media, consulting,
                event and supply chain experience.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {recognitionCards.map((item) => (
              <div className="case-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">
              <InlineIcon name="network" />
              Industry Connector
            </p>
            <h2>Denny Connects The Industry</h2>
            <p>Most people only see one part of the cleaning industry.</p>
            <p>
              Manufacturers see factories. Brands see products. Distributors
              see channels. Retailers see customers.
            </p>
            <p>Denny connects them.</p>
            <p>
              For more than 20 years, he has worked with manufacturers, brands,
              suppliers, distributors, retailers, investors and industry leaders
              across the global cleaning industry.
            </p>
            <p>
              Through industry media, conferences, sourcing projects and trade
              shows, he continuously connects people, products, technologies
              and opportunities.
            </p>
            <p>
              This unique position provides access to information,
              relationships and market opportunities that are difficult to see
              from a single perspective. World Clean Biz was built on this
              network.
            </p>
          </div>
          <blockquote className="about-quote">
            <span>Manufacturers build products.</span>
            <span>Brands build markets.</span>
            <strong>Denny connects them.</strong>
          </blockquote>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                <InlineIcon name="users" />
                Who We Serve
              </p>
              <h2>Who We Serve</h2>
              <p>
                World Clean Biz is designed for professionals looking to
                understand the industry, discover opportunities and make better
                business decisions.
              </p>
            </div>
          </div>
          <div className="module-grid audience-chip-grid">
            {serveGroups.map((item) => (
              <div className="module-chip" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Why It Matters</p>
            <h2>Why It Matters</h2>
            <p>
              The cleaning industry is becoming more global, more technical and
              more competitive.
            </p>
            <p>
              New products, new technologies and new business models are
              creating opportunities across the industry.
            </p>
            <p>
              Better information helps companies make better decisions. World
              Clean Biz exists to help industry professionals stay informed,
              connected and prepared for what comes next.
            </p>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Trust Page</div>
            <h3>Better information helps companies make better decisions.</h3>
            <p>
              World Clean Biz connects industry signals, product opportunities,
              supplier context and global industry relationships.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <h2>Better Information Leads To Better Decisions</h2>
              <p>
                Explore industry signals, discover new opportunities and
                connect with the people shaping the future of the cleaning
                industry.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/insights">
                Explore Signals
              </Link>
              <Link className="button-secondary" href="/contact">
                Share Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
