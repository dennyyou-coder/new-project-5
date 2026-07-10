import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";
import { ExpoLeadForm, TallyButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "World Clean Expo 2026 | Global Cleaning Industry Updates",
  description:
    "Get World Clean Expo 2026 updates on visitor registration, exhibitor news, forum agenda, product categories and business matching opportunities."
};

const whyExpo: { icon: IconName; image: string; title: string; text: string }[] = [
  {
    icon: "sparkles",
    image: "/images/industry/world-clean-expo-global-tech-2026.png",
    title: "New Cleaning Categories Are Emerging",
    text: "Robotics, smart floor care, pool cleaning and commercial automation are creating new product opportunities."
  },
  {
    icon: "globe",
    image: "/images/industry/expo-business-matching-2026.jpg",
    title: "Global Buyers Need Better Discovery",
    text: "Buyers need a clearer way to find suppliers, product directions, category signals and market opportunities."
  },
  {
    icon: "handshake",
    image: "/images/industry/expo-forum-audience-2026.jpg",
    title: "The Industry Needs A Real Meeting Point",
    text: "World Clean Expo is built to connect products, suppliers, buyers, forums and industry conversations."
  }
];

const updateBenefits: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "calendar",
    title: "Visitor Registration Updates",
    text: "Know when registration opens and how to plan your visit."
  },
  {
    icon: "package",
    title: "Exhibitor And Product Highlights",
    text: "Follow important suppliers, categories and product directions before the show."
  },
  {
    icon: "message",
    title: "Forum Agenda And Industry Signals",
    text: "Receive updates on forum topics, speakers and market discussions."
  },
  {
    icon: "handshake",
    title: "Business Matching Opportunities",
    text: "Get selected updates on buyer, supplier and partnership opportunities."
  }
];

const audienceGroups = [
  {
    title: "Buyers / Importers / Distributors",
    text: "Find product categories, suppliers and business opportunities worth tracking."
  },
  {
    title: "Manufacturers / Suppliers",
    text: "Understand buyer demand, product direction and global channel movement."
  },
  {
    title: "Brands / Retailers / Amazon Sellers",
    text: "Track category shifts before the market becomes crowded."
  },
  {
    title: "Investors / Media / Industry Professionals",
    text: "Follow the companies, products and conversations shaping the next cleaning industry cycle."
  }
];

const roleOptions = [
  "Brand",
  "Importer / Distributor",
  "Retailer",
  "Amazon Seller",
  "Manufacturer",
  "Investor",
  "Media",
  "Other"
];

export default function WorldCleanExpoPage() {
  return (
    <>
      <section className="expo-hero">
        <div className="container expo-hero-grid">
          <div className="expo-hero-copy">
            <p className="eyebrow">WORLD CLEAN EXPO 2026</p>
            <h1>Follow The Next Global Cleaning Industry Platform</h1>
            <p>
              Get updates on visitor registration, exhibitor news, forum
              agenda, product categories and business matching opportunities.
            </p>
            <div className="expo-hero-meta" aria-label="Event details">
              <span>November 2026</span>
              <span>Suzhou International Expo Center</span>
              <span>China</span>
            </div>
            <div className="hero-actions">
              <TallyButton
                className="button"
                ctaLocation="wce_hero_visitor"
                form="expo"
              >
                Get Expo Updates
              </TallyButton>
              <Link className="button-secondary" href="#expo-updates">
                What You Will Receive
              </Link>
            </div>
          </div>
          <div className="expo-hero-visual" aria-label="International trade show floor">
            <div className="expo-visual-note">
              <span>World Clean Expo Updates</span>
              <strong>Visitor registration, exhibitor news, forum agenda and business matching.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="why-visit">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why It Matters</p>
              <h2>Why World Clean Expo Matters</h2>
              <p>
                The cleaning industry is changing quickly. World Clean Expo is
                designed to help professionals see new products, supplier
                movement and industry opportunities earlier.
              </p>
            </div>
          </div>
          <div className="expo-track-grid expo-simple-grid">
            {whyExpo.map((item) => (
              <article className="expo-visual-card" key={item.title}>
                <img src={item.image} alt="" />
                <div>
                  <IconBadge name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft" id="expo-updates">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">What You Will Receive</p>
              <h2>Get The Updates That Matter Before The Show</h2>
              <p>
                Subscribe once and receive the practical information needed to
                follow World Clean Expo before, during and after the event.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {updateBenefits.map((item) => (
              <div className="case-card expo-value-card" key={item.title}>
                <InlineIcon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Who Should Follow</p>
              <h2>Built For Cleaning Industry Professionals</h2>
              <p>
                World Clean Expo updates are for people who need to track
                products, suppliers, buyers, markets and industry conversations.
              </p>
            </div>
          </div>
          <div className="expo-audience-grid expo-audience-simple-grid">
            {audienceGroups.map((item) => (
              <div className="expo-audience-card" key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section expo-capture-section">
        <div className="container grid-2 expo-interest-layout">
          <div className="expo-capture-copy">
            <p className="eyebrow">Expo Updates</p>
            <h2>Get World Clean Expo Updates</h2>
            <p>
              Leave your email to receive visitor registration timing,
              exhibitor news, forum agenda, selected product highlights and
              business matching opportunities.
            </p>
            <strong>Be the first to know when visitor registration opens.</strong>
            <span>November 2026 · Suzhou · China</span>
            <div className="expo-capture-scenes" aria-label="World Clean Expo scenes">
              <img src="/images/industry/expo-hall-shenzhen-2026.jpg" alt="" />
              <img src="/images/industry/about-forum-audience-2025.jpg" alt="" />
              <img src="/images/industry/sourcing-supplier-meeting-2026.jpg" alt="" />
            </div>
          </div>
          <ExpoLeadForm roles={roleOptions} />
        </div>
      </section>
    </>
  );
}
