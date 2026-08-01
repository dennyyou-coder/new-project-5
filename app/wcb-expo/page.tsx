import type { Metadata } from "next";
import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "2026 WCB International Cleaning Appliance Expo",
  description:
    "Plan your visit to the 2026 WCB International Cleaning Appliance Expo, 18–20 November 2026 at Suzhou Shishan Convention Center in Suzhou, China.",
  alternates: { canonical: "/wcb-expo" },
  openGraph: {
    title: "2026 WCB International Cleaning Appliance Expo",
    description:
      "Meet cleaning appliance brands, manufacturers, supply-chain companies and industry professionals in Suzhou, China.",
    url: "/wcb-expo",
    images: ["/images/expo/wcb-expo-2026-hero.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 WCB International Cleaning Appliance Expo",
    description: "18–20 November 2026 · Suzhou, China",
    images: ["/images/expo/wcb-expo-2026-hero.png"]
  }
};

const categories = [
  {
    title: "Robot Vacuums",
    image: "/images/expo/expo-category-robotic-vacuums.png",
    alt: "Robot vacuum product category"
  },
  {
    title: "Floor Washers",
    image: "/images/expo/expo-category-floor-washers.png",
    alt: "Wet and dry floor washer product category"
  },
  {
    title: "Vacuum Cleaners",
    image: "/images/sourcing/vacuum-cleaners.png",
    alt: "Cordless vacuum cleaner product category"
  },
  {
    title: "Pool Robots",
    image: "/images/expo/expo-category-pool-cleaners.png",
    alt: "Robotic pool cleaner product category"
  },
  {
    title: "Lawn Robots",
    image: "/images/expo/expo-category-lawn-robots.png",
    alt: "Robotic lawn mower product category"
  },
  {
    title: "Commercial Cleaning",
    image: "/images/expo/expo-category-commercial-cleaning.png",
    alt: "Commercial cleaning equipment category"
  },
  {
    title: "Components & Accessories",
    image: "/images/expo/expo-category-components-technology.png",
    alt: "Cleaning appliance components and accessories"
  }
];

const supplyChain = [
  {
    number: "01",
    title: "Global Brands & Buyers",
    text: "People defining market needs, channel requirements and the next product opportunity."
  },
  {
    number: "02",
    title: "Complete-Machine Manufacturers",
    text: "Companies building finished cleaning appliances for their own brands and partners."
  },
  {
    number: "03",
    title: "OEM / ODM Partners",
    text: "Development and manufacturing teams turning product ideas into market-ready programs."
  },
  {
    number: "04",
    title: "Components & Materials",
    text: "Core technologies, modules, tooling, materials and services behind every product."
  }
];

const programs = [
  {
    title: "Industry Forums",
    text: "Hear focused discussions on products, technology, channels and the next cleaning-industry cycle.",
    image: "/images/industry/expo-forum-audience-2026.jpg",
    alt: "Cleaning industry forum audience"
  },
  {
    title: "Procurement Matchmaking",
    text: "Create more relevant conversations between qualified buyers, brands, factories and supply-chain partners.",
    image: "/images/industry/expo-business-matching-2026.jpg",
    alt: "Cleaning industry procurement matchmaking meeting"
  },
  {
    title: "New Product Launches",
    text: "See new cleaning appliances, product platforms and enabling technologies in one focused setting.",
    image: "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
    alt: "New cleaning products displayed at an industry exhibition"
  }
];

export default function WcbExpoPage() {
  return (
    <div className="wcb-expo-page">
      <section className="wcb-expo-hero">
        <div className="wcb-expo-shell wcb-expo-hero-content">
          <p className="wcb-expo-kicker">WCB EXPO · SUZHOU 2026</p>
          <h1>
            <span>WCB EXPO</span>
            2026 WCB International Cleaning Appliance Expo
          </h1>
          <p className="wcb-expo-chinese">2026 WCB 国际清洁电器博览会</p>
          <div className="wcb-expo-event-facts" aria-label="Event date and venue">
            <strong>18–20 November 2026</strong>
            <span>Suzhou Shishan Convention Center</span>
            <span>Suzhou, China</span>
          </div>
          <div className="wcb-expo-hero-actions">
            <TallyButton
              ctaLocation="wcb_expo_hero_visit"
              form="expo"
              inquiryIntent="visitor_interest"
              inquiryType="expo_visitor"
            >
              Plan Your Visit
            </TallyButton>
            <Link className="wcb-expo-secondary-link" href="#exhibitor-interest">
              Exhibiting &amp; Partnerships
            </Link>
          </div>
        </div>
      </section>

      <section className="wcb-expo-proof" aria-labelledby="expo-proof-title">
        <div className="wcb-expo-shell wcb-expo-proof-grid">
          <div className="wcb-expo-proof-copy">
            <p className="wcb-expo-section-label">BUILT FROM REAL INDUSTRY GATHERINGS</p>
            <h2 id="expo-proof-title">A Focused Meeting Point For The Cleaning Appliance Industry</h2>
            <p>
              WCB brings together product companies and the supply chain behind them.
              The 2026 expo builds on two prior WCB supply-chain events in Suzhou.
            </p>
          </div>
          <div className="wcb-expo-editions" aria-label="Organizer records from prior events">
            <article>
              <span>November 2025</span>
              <strong>WCB Supply-Chain Event</strong>
            </article>
            <article>
              <span>March 2026</span>
              <strong>WCB Supply-Chain Event</strong>
            </article>
          </div>
          <div className="wcb-expo-proof-numbers">
            <article><strong>100+</strong><span>Exhibitors at each event</span></article>
            <article><strong>1,000+</strong><span>Visitors at each event</span></article>
            <p>Source: organizer records from the two prior WCB supply-chain events.</p>
          </div>
        </div>
      </section>

      <section className="wcb-expo-categories" aria-labelledby="expo-categories-title">
        <div className="wcb-expo-shell">
          <div className="wcb-expo-section-head wcb-expo-section-head-light">
            <p className="wcb-expo-section-label">ONE INDUSTRY · ONE PLACE</p>
            <h2 id="expo-categories-title">Everything In Cleaning Appliances</h2>
            <p>Compare established categories, fast-moving robotics and the technologies connecting them.</p>
          </div>
          <div className="wcb-expo-category-grid">
            {categories.map((category) => (
              <article className="wcb-expo-category-card" key={category.title}>
                <img src={category.image} alt={category.alt} loading="lazy" />
                <strong>{category.title}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wcb-expo-supply" aria-labelledby="expo-supply-title">
        <div className="wcb-expo-shell">
          <div className="wcb-expo-section-head">
            <p className="wcb-expo-section-label">THE COMPLETE VALUE CHAIN</p>
            <h2 id="expo-supply-title">From Market Demand To The Components Inside The Product</h2>
            <p>Meet the companies shaping, developing, manufacturing and supplying the next generation of cleaning appliances.</p>
          </div>
          <div className="wcb-expo-supply-grid">
            {supplyChain.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wcb-expo-programs" aria-labelledby="expo-programs-title">
        <div className="wcb-expo-shell">
          <div className="wcb-expo-section-head wcb-expo-section-head-light">
            <p className="wcb-expo-section-label">MORE THAN A SHOW FLOOR</p>
            <h2 id="expo-programs-title">Programs Built Around Better Industry Decisions</h2>
          </div>
          <div className="wcb-expo-program-grid">
            {programs.map((program) => (
              <article key={program.title}>
                <img src={program.image} alt={program.alt} loading="lazy" />
                <div>
                  <h3>{program.title}</h3>
                  <p>{program.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wcb-expo-organizer" aria-labelledby="expo-organizer-title">
        <div className="wcb-expo-shell wcb-expo-organizer-grid">
          <img
            src="/images/industry/about-denny-speaking-forum-2025.jpg"
            alt="Denny You speaking to cleaning industry professionals"
            loading="lazy"
          />
          <div>
            <p className="wcb-expo-section-label">ORGANIZER &amp; INDUSTRY NETWORK</p>
            <h2 id="expo-organizer-title">Industry Access Built Over Time</h2>
            <p>
              Denny You, founder of World Clean Biz and organizer of WCB Expo,
              has worked inside the cleaning industry since 2006. His network
              connects manufacturers, suppliers, brands, buyers, investors and media.
            </p>
            <Link href="/about">About Denny and World Clean Biz</Link>
          </div>
        </div>
      </section>

      <section className="wcb-expo-visit" id="visitor-interest" aria-labelledby="expo-visit-title">
        <div className="wcb-expo-shell wcb-expo-visit-grid">
          <div>
            <p className="wcb-expo-section-label">PLAN YOUR VISIT</p>
            <h2 id="expo-visit-title">Meet The Cleaning Appliance Industry In Suzhou</h2>
            <p>
              Tell us what products, suppliers or partnerships you want to explore.
              We will share relevant visitor and event updates as they become available.
            </p>
            <div className="wcb-expo-visit-meta">
              <strong>18–20 November 2026</strong>
              <span>Suzhou Shishan Convention Center · Suzhou, China</span>
            </div>
          </div>
          <TallyButton
            ctaLocation="wcb_expo_visit_interest"
            form="expo"
            inquiryIntent="visitor_interest"
            inquiryType="expo_visitor"
          >
            Register Visitor Interest
          </TallyButton>
        </div>
      </section>

      <section className="wcb-expo-exhibit" id="exhibitor-interest">
        <div className="wcb-expo-shell wcb-expo-exhibit-grid">
          <div>
            <p className="wcb-expo-section-label">FOR EXHIBITORS &amp; PARTNERS</p>
            <h2>Present Your Products To A Focused Industry Audience</h2>
            <p>Request current participation, booth and partnership information from the organizing team.</p>
          </div>
          <TallyButton
            className="button-secondary"
            ctaLocation="wcb_expo_exhibitor_interest"
            form="expo"
            inquiryIntent="exhibitor_interest"
            inquiryType="expo_exhibitor"
          >
            Request Exhibitor Information
          </TallyButton>
        </div>
      </section>
    </div>
  );
}
