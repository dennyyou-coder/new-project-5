import { siteVisualProps } from "@/lib/siteVisuals";
import type { Metadata } from "next";
import Link from "next/link";
import "../styles/wcb-expo.css";
import { TallyButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "WCB Expo 2026 | Suzhou",
  description:
    "Plan your visit to the 2026 WCB International Cleaning Appliance Expo, 18–20 November 2026 at Suzhou Shishan Convention Center in Suzhou, China.",
  alternates: { canonical: "/wcb-expo" },
  openGraph: {
    title: "2026 WCB International Cleaning Appliance Expo",
    description:
      "Meet cleaning appliance brands, manufacturers, supply-chain companies and industry professionals in Suzhou, China.",
    url: "/wcb-expo",
    images: ["/images/site-refresh/2026-09-products/expo-wide.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 WCB International Cleaning Appliance Expo",
    description: "18–20 November 2026 · Suzhou, China",
    images: ["/images/site-refresh/2026-09-products/expo-wide.webp"]
  }
};

const categories = [
  {
    title: "Robot Vacuums",
    image: "/images/site-refresh/2026-09-commercial/01-robot-vacuum.webp",
    alt: "Robot vacuum product category"
  },
  {
    title: "Floor Washers",
    image: "/images/site-refresh/2026-09-commercial/02-floor-washer.webp",
    alt: "Wet and dry floor washer product category"
  },
  {
    title: "Vacuum Cleaners",
    image: "/images/site-refresh/2026-09-commercial/06-vacuum-cleaner.webp",
    alt: "Cordless vacuum cleaner product category"
  },
  {
    title: "Pool Robots",
    image: "/images/site-refresh/2026-09-commercial/03-pool-robot.webp",
    alt: "Robotic pool cleaner product category"
  },
  {
    title: "Lawn Robots",
    image: "/images/site-refresh/2026-09-commercial/04-lawn-robot.webp",
    alt: "Robotic lawn mower product category"
  },
  {
    title: "Commercial Cleaning",
    image: "/images/site-refresh/2026-09-commercial/05-commercial-cleaning.webp",
    alt: "Commercial cleaning equipment category"
  },
  {
    title: "Components & Accessories",
    image: "/images/site-refresh/2026-09-commercial/15-components-detail.webp",
    alt: "Cleaning appliance components and accessories"
  }
];

const visitReasons = [
  {
    title: "See New Products Up Close",
    text: "Compare cleaning appliances, robotics and new product platforms in one focused setting.",
    image: "/images/industry/sourcing-hero-expo-products-2026.jpg",
    alt: "Cleaning appliances and robotics displayed at an industry exhibition"
  },
  {
    title: "Meet The Companies Building Them",
    text: "Speak directly with brands, complete-machine manufacturers and the teams behind new products.",
    image: "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
    alt: "Cleaning industry companies meeting around an exhibition booth"
  },
  {
    title: "Connect With The Supply Chain",
    text: "Find components, materials, technologies and manufacturing partners across the value chain.",
    image: "/images/industry/sourcing-product-components-2025.jpg",
    alt: "Cleaning appliance components and supply-chain technologies"
  },
  {
    title: "Hear Where The Industry Is Going",
    text: "Join focused discussions about product direction, channels, technology and market change.",
    image: "/images/industry/expo-forum-audience-2026.jpg",
    alt: "Audience at a cleaning industry forum"
  }
];

const gatheringImages = [
  {
    image: "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
    alt: "Cleaning appliance suppliers at a previous WCB industry gathering"
  },
  {
    image: "/images/industry/expo-business-matching-2026.jpg",
    alt: "Business matchmaking at a previous WCB industry gathering"
  },
  {
    image: "/images/industry/expo-forum-audience-2026.jpg",
    alt: "Forum audience at a previous WCB industry gathering"
  },
  {
    image: "/images/industry/home-expo-networking-2025.jpg",
    alt: "Industry networking at a previous WCB gathering"
  }
];

const supplyChain = [
  {
    number: "01",
    title: "Global Brands & Buyers",
    text: "People defining market needs, channel requirements and the next product opportunity.",
    image: "/images/industry/home-expo-networking-2025.jpg",
    alt: "Cleaning industry buyers and brands networking"
  },
  {
    number: "02",
    title: "Complete-Machine Manufacturers",
    text: "Companies building finished cleaning appliances for their own brands and partners.",
    image: "/images/industry/sourcing-hero-expo-products-2026.jpg",
    alt: "Complete cleaning appliances presented by manufacturers"
  },
  {
    number: "03",
    title: "OEM / ODM Partners",
    text: "Development and manufacturing teams turning product ideas into market-ready programs.",
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    alt: "Supplier and manufacturing teams discussing a product program"
  },
  {
    number: "04",
    title: "Components & Materials",
    text: "Core technologies, modules, tooling, materials and services behind every product.",
    image: "/images/industry/sourcing-product-components-2025.jpg",
    alt: "Components and materials used in cleaning appliances"
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
          <p className="wcb-expo-kicker">2026 WCB Expo Is Now In Preparation</p>
          <h1>
            <span>WCB EXPO</span>
            2026 WCB International Cleaning Appliance Expo
          </h1>
          <p className="wcb-expo-chinese">2026 WCB 国际清洁电器博览会</p>
          <p className="wcb-expo-hero-invite">We Invite You To Join Us In Suzhou</p>
          <p className="wcb-expo-hero-intro">
            The show is taking shape now. We welcome buyers, distributors, brands,
            manufacturers and industry professionals to see new products, meet the
            companies behind them and build new connections in Suzhou.
          </p>
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

      <section className="wcb-expo-status" aria-label="2026 WCB Expo status">
        <div className="wcb-expo-shell wcb-expo-status-grid">
          <article><span>Date</span><strong>18–20 November 2026</strong></article>
          <article><span>Venue</span><strong>Suzhou Shishan Convention Center</strong></article>
          <article><span>Current status</span><strong>Visitor Interest Open</strong></article>
          <article><span>Coverage</span><strong>7 Product &amp; Supply Categories</strong></article>
        </div>
      </section>

      <section className="wcb-expo-why" aria-labelledby="expo-why-title">
        <div className="wcb-expo-shell">
          <div className="wcb-expo-section-head">
            <p className="wcb-expo-section-label">WHY VISIT WCB EXPO?</p>
            <h2 id="expo-why-title">See More Of The Industry In One Visit</h2>
            <p>Move from online research to direct product comparison, practical conversations and new industry relationships.</p>
          </div>
          <div className="wcb-expo-why-grid">
            {visitReasons.map((reason) => (
              <article className="wcb-expo-why-card" key={reason.title}>
                <img src={reason.image} alt={reason.alt} loading="lazy" />
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              </article>
            ))}
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

      <section className="wcb-expo-gallery" aria-labelledby="expo-gallery-title">
        <div className="wcb-expo-shell">
          <div className="wcb-expo-section-head">
            <p className="wcb-expo-section-label">REAL WCB EVENT MOMENTS</p>
            <h2 id="expo-gallery-title">Scenes From Previous WCB Industry Gatherings</h2>
            <p>These photographs are from earlier WCB supply-chain events and show the focused industry conversations the 2026 Expo is building on.</p>
          </div>
          <div className="wcb-expo-gallery-grid">
            {gatheringImages.map((item) => (
              <figure key={item.image}>
                <img src={item.image} alt={item.alt} loading="lazy" />
              </figure>
            ))}
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
                <img {...siteVisualProps(category.image, "(max-width: 760px) 100vw, 33vw")} alt={category.alt} loading="lazy" />
                <strong>{category.title}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wcb-expo-supply" aria-labelledby="expo-supply-title">
        <div className="wcb-expo-shell">
          <div className="wcb-expo-section-head">
            <p className="wcb-expo-section-label">WHO YOU WILL MEET</p>
            <h2 id="expo-supply-title">Meet The People Behind The Products</h2>
            <p>Meet the companies shaping, developing, manufacturing and supplying the next generation of cleaning appliances.</p>
          </div>
          <div className="wcb-expo-supply-grid">
            {supplyChain.map((item) => (
              <article key={item.number}>
                <img src={item.image} alt={item.alt} loading="lazy" />
                <div>
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
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

      <section className="wcb-expo-visit wcb-expo-final-invitation" id="visitor-interest" aria-labelledby="expo-visit-title">
        <div className="wcb-expo-shell wcb-expo-visit-grid">
          <img
            src="/images/industry/expo-business-matching-2026.jpg"
            alt="Cleaning industry professionals meeting at a previous WCB gathering"
            loading="lazy"
          />
          <div>
            <p className="wcb-expo-section-label">PLAN YOUR VISIT</p>
            <h2 id="expo-visit-title">Join The Global Cleaning Appliance Industry In Suzhou</h2>
            <p>
              Tell us what products, suppliers or partnerships you want to explore.
              We will share relevant visitor and event updates as they become available.
            </p>
            <div className="wcb-expo-visit-meta">
              <strong>18–20 November 2026</strong>
              <span>Suzhou Shishan Convention Center · Suzhou, China</span>
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
