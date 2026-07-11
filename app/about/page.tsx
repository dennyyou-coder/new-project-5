import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";
import { TallyButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "About Denny You | Cleaning Industry Entrepreneur & Connector",
  description:
    "Meet Denny You, founder of World Clean Biz, organizer of World Clean Expo and a cleaning industry entrepreneur connected across products, supply chains, buyers and markets.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Denny You | World Clean Biz",
    description:
      "Inside the cleaning industry since 2006, connecting products, supply chains, buyers, capital and industry opportunities.",
    url: "/about",
    images: ["/images/site-refresh/about/about-hero-denny.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Denny You | World Clean Biz",
    description:
      "Inside the cleaning industry since 2006, connecting products, supply chains, buyers, capital and industry opportunities.",
    images: ["/images/site-refresh/about/about-hero-denny.webp"]
  }
};

const trustFacts: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "factory",
    title: "Inside The Cleaning Industry Since 2006",
    text: "Front-line experience across products, customers, factories, suppliers and global markets."
  },
  {
    icon: "newspaper",
    title: "For A Decade, An Industry Voice",
    text: "Ten years of sharing cleaning industry analysis, making Denny one of the industry’s best-known professional voices."
  },
  {
    icon: "rocket",
    title: "Hardware Entrepreneur",
    text: "A cleaning industry hardware entrepreneur whose ventures have raised tens of millions in funding."
  },
  {
    icon: "users",
    title: "Organizer Of World Clean Expo",
    text: "Building an industry platform that connects products, companies, buyers, experts, capital and media."
  }
];

const networkGroups: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "factory",
    title: "Manufacturers",
    text: "Cleaning equipment factories, product developers and production resources."
  },
  {
    icon: "cog",
    title: "Core Suppliers",
    text: "Components, molds, technology, testing and supporting supply-chain partners."
  },
  {
    icon: "globe",
    title: "International Brands",
    text: "Brands, retailers and cross-border sellers serving global markets."
  },
  {
    icon: "handshake",
    title: "Buyers & Distributors",
    text: "Importers, distributors and channel partners looking for products and opportunities."
  },
  {
    icon: "bar-chart",
    title: "Investors & Media",
    text: "Securities firms, investment banks, investors and industry media tracking market change."
  },
  {
    icon: "message",
    title: "Experts & Industry Leaders",
    text: "Operators, speakers and professionals shaping cleaning industry conversations."
  }
];

const businessPillars = [
  {
    eyebrow: "READ THE MARKET",
    title: "Industry Intelligence",
    text: "Articles and reports that help companies understand category movement, product opportunities and China supply-chain signals.",
    image: "/images/site-refresh/system/market-intelligence.webp",
    href: "/reports",
    cta: "Explore Market Reports"
  },
  {
    eyebrow: "TURN SIGNALS INTO PRODUCTS",
    title: "Product & Sourcing Opportunities",
    text: "Product judgment, supplier access and project execution for overseas brands, importers and distributors.",
    image: "/images/site-refresh/system/product-engineering.webp",
    href: "/sourcing",
    cta: "Explore Sourcing"
  },
  {
    eyebrow: "CONNECT THE INDUSTRY",
    title: "World Clean Expo & Business Connections",
    text: "A platform for products, companies, buyers, forums and commercial conversations across the cleaning industry.",
    image: "/images/site-refresh/system/expo-concept.webp",
    href: "/world-clean-expo",
    cta: "Explore World Clean Expo"
  }
];

const judgementFlow: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "radar",
    title: "Early Industry Signals",
    text: "Products, factories, components, capital and overseas channel feedback reveal where change is beginning."
  },
  {
    icon: "lightbulb",
    title: "Commercial Judgment",
    text: "Experience helps separate a meaningful category shift from a short-lived novelty."
  },
  {
    icon: "network",
    title: "The Right Connections",
    text: "A broad professional network helps bring the right product, supplier, buyer or expert into the conversation."
  },
  {
    icon: "check",
    title: "Team Execution",
    text: "The World Clean Biz team turns direction into research, quotations, samples, coordination and delivery."
  }
];

const journey = [
  {
    marker: "SINCE 2006",
    title: "Industry Operator & Product Builder",
    text: "Worked inside cleaning products, customers, supply chains and global-market projects."
  },
  {
    marker: "FOR A DECADE",
    title: "Industry Analysis & Influence",
    text: "Shared cleaning industry articles and views with professionals, securities firms and investment banks."
  },
  {
    marker: "ENTREPRENEUR",
    title: "Hardware Business & Capital Experience",
    text: "Built cleaning industry hardware ventures and raised tens of millions in funding."
  },
  {
    marker: "TODAY",
    title: "World Clean Biz & World Clean Expo",
    text: "Connecting intelligence, products, supply chains, buyers and industry relationships on a global platform."
  }
];

export default function AboutPage() {
  return (
    <div className="about-network-page">
      <section className="about-network-hero">
        <div className="container about-network-hero-grid">
          <div className="about-network-hero-copy">
            <p className="eyebrow">ABOUT DENNY YOU</p>
            <h1>Inside The Cleaning Industry Since 2006. Connected Across The Entire Value Chain.</h1>
            <p>
              Denny You is the founder of World Clean Biz and organizer of
              World Clean Expo—an industry entrepreneur, product builder and
              professional voice connecting products, supply chains, buyers,
              capital and market opportunities.
            </p>
            <div className="about-network-hero-tags">
              <span>Industry Entrepreneur</span>
              <span>World Clean Expo Organizer</span>
              <span>Product &amp; Market Judgment</span>
            </div>
            <div className="hero-actions">
              <TallyButton
                className="button"
                ctaLocation="about_hero_sourcing"
                form="sourcing"
                inquiryIntent="about_product_opportunity"
                inquiryType="sourcing"
              >
                Discuss Product Opportunities
              </TallyButton>
              <Link className="button-secondary" href="#world-clean-biz">
                See How World Clean Biz Helps
              </Link>
            </div>
          </div>
          <div className="about-network-hero-visual">
            <img
              src="/images/site-refresh/about/about-hero-denny.webp"
              alt="Denny You speaking at a cleaning industry forum"
            />
            <div>
              <span>DENNY YOU</span>
              <strong>Founder, World Clean Biz<br />Organizer, World Clean Expo</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-network-trust">
        <div className="container">
          <div className="about-network-heading">
            <p className="eyebrow">EXPERIENCE, INFLUENCE &amp; EXECUTION</p>
            <h2>Industry Credibility Built Through Real Work.</h2>
          </div>
          <div className="about-network-trust-grid">
            {trustFacts.map((item) => (
              <article key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-network-reach">
        <div className="container about-network-reach-layout">
          <div className="about-network-reach-copy">
            <p className="eyebrow">AN INDUSTRY-WIDE PROFESSIONAL NETWORK</p>
            <h2>Connected To The People Who Build, Buy, Fund And Shape The Industry.</h2>
            <p>
              As the organizer of World Clean Expo, Denny has built one of the
              cleaning industry’s most extensive professional networks across
              manufacturers, suppliers, brands, buyers, distributors,
              investors, experts and media.
            </p>
            <div className="about-network-reach-image">
              <img src="/images/site-refresh/system/business-roundtable.webp" alt="International cleaning industry business discussion" />
            </div>
          </div>
          <div className="about-network-group-grid">
            {networkGroups.map((item) => (
              <article key={item.title}>
                <InlineIcon name={item.icon} />
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-network-business" id="world-clean-biz">
        <div className="container">
          <div className="about-network-heading">
            <p className="eyebrow">WHAT WORLD CLEAN BIZ DOES</p>
            <h2>One Industry Platform. Three Ways To Create Business Value.</h2>
            <p>
              World Clean Biz combines intelligence, product opportunities and
              industry connections so companies can see earlier and act with
              better resources.
            </p>
          </div>
          <div className="about-network-pillar-grid">
            {businessPillars.map((item) => (
              <article key={item.title}>
                <img src={item.image} alt="" />
                <div>
                  <p className="eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link href={item.href}>{item.cta} <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-network-judgment">
        <div className="container">
          <div className="about-network-heading about-network-heading-light">
            <p className="eyebrow">WHY THE NETWORK MATTERS</p>
            <h2>Information Becomes More Valuable When It Leads To The Right Decision And The Right People.</h2>
          </div>
          <div className="about-network-flow">
            {judgementFlow.map((item, index) => (
              <article key={item.title}>
                <span className="about-network-flow-number">0{index + 1}</span>
                <InlineIcon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-network-story">
        <div className="container about-network-story-layout">
          <div className="about-network-story-photo">
            <img src="/images/site-refresh/system/product-engineering.webp" alt="Cleaning product engineering and execution" />
            <div>Products · Suppliers · Markets · Connections</div>
          </div>
          <div>
            <p className="eyebrow">PERSONAL JUDGMENT. TEAM EXECUTION.</p>
            <h2>Denny Reviews. The Team Executes.</h2>
            <p>
              Denny reviews the product direction, commercial fit and key
              industry resources. The World Clean Biz team manages research,
              quotations, samples, supplier coordination, quality and delivery.
            </p>
            <ul>
              <li>Industry insight for securities firms and investment banks</li>
              <li>Currently supporting cross-border sellers and international brands</li>
              <li>Direct access to product, supplier and industry conversations</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section about-network-journey">
        <div className="container">
          <div className="about-network-heading">
            <p className="eyebrow">THE JOURNEY</p>
            <h2>From Industry Operator To Platform Builder.</h2>
          </div>
          <div className="about-network-journey-grid">
            {journey.map((item) => (
              <article key={item.marker}>
                <span>{item.marker}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-network-final">
        <div className="container">
          <div className="about-network-heading">
            <p className="eyebrow">START WITH WHAT YOU NEED</p>
            <h2>Use The World Clean Biz Platform For Your Next Decision.</h2>
          </div>
          <div className="about-network-final-grid">
            <article>
              <span>01</span><h3>Find Product Opportunities</h3>
              <p>Discover products, suppliers and OEM/ODM directions for your market.</p>
              <Link className="button" href="/sourcing">Explore Sourcing</Link>
            </article>
            <article>
              <span>02</span><h3>Read Market Intelligence</h3>
              <p>Receive industry reports covering markets, categories and supply chains.</p>
              <Link className="button" href="/reports">Get Free Market Reports</Link>
            </article>
            <article>
              <span>03</span><h3>Connect Through World Clean Expo</h3>
              <p>Follow exhibitor, visitor and business matching opportunities.</p>
              <Link className="button" href="/world-clean-expo">Follow World Clean Expo</Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
