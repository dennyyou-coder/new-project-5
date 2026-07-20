import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";
import { TallyButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "World Clean Expo 2026 | Exhibit, Visit & Connect",
  description:
    "Discover cleaning products, suppliers and business opportunities at World Clean Expo 2026 in Suzhou, China. Register your exhibitor or visitor interest.",
  alternates: { canonical: "/world-clean-expo" },
  openGraph: {
    title: "World Clean Expo 2026 | Exhibit, Visit & Connect",
    description:
      "Discover products, meet cleaning industry partners and register your exhibitor or visitor interest.",
    url: "/world-clean-expo",
    images: ["/images/site-refresh/real/exhibition-hall.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "World Clean Expo 2026 | Exhibit, Visit & Connect",
    description:
      "Discover products, meet cleaning industry partners and register your exhibitor or visitor interest.",
    images: ["/images/site-refresh/real/exhibition-hall.webp"]
  }
};

const reasons: { icon: IconName; image: string; title: string; text: string }[] = [
  {
    icon: "sparkles",
    image: "/images/site-refresh/real/exhibition-hall.webp",
    title: "See New Categories Taking Shape",
    text: "Explore robotics, smart floor care, pool cleaning, outdoor equipment and commercial automation in one industry setting."
  },
  {
    icon: "search",
    image: "/images/site-refresh/real/product-detail.webp",
    title: "Find Products And Partners Faster",
    text: "Bring product discovery, supplier conversations and market feedback into a focused cleaning industry platform."
  },
  {
    icon: "handshake",
    image: "/images/site-refresh/real/business-office.webp",
    title: "Turn Meetings Into Opportunities",
    text: "Connect manufacturers, brands, buyers and distributors around real product and market opportunities."
  }
];

const exhibitorBenefits: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "users",
    title: "Meet Potential Buyers",
    text: "Present your products to importers, distributors, brands, retailers and cleaning industry decision-makers."
  },
  {
    icon: "megaphone",
    title: "Show What Makes You Different",
    text: "Give new products, technology and OEM/ODM capabilities a clearer industry stage."
  },
  {
    icon: "globe",
    title: "Build International Connections",
    text: "Start conversations with overseas channels and potential business partners before and during the show."
  }
];

const visitorBenefits: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "telescope",
    title: "Discover New Products Earlier",
    text: "See emerging cleaning categories and product directions before they become crowded."
  },
  {
    icon: "factory",
    title: "Compare Suppliers In One Place",
    text: "Meet manufacturers and solution providers across multiple cleaning product categories."
  },
  {
    icon: "trending",
    title: "Understand Where The Market Is Moving",
    text: "Use products, forums and industry conversations to sharpen your next business decision."
  }
];

const categories = [
  ["expo-category-robot-vacuum", "Robotic Vacuums"],
  ["expo-category-floor-washer", "Floor Washers"],
  ["expo-category-pool-cleaner", "Pool Cleaning Robots"],
  ["expo-category-lawn-robot", "Outdoor & Lawn Robots"],
  ["expo-category-commercial", "Commercial Cleaning"],
  ["expo-category-components", "Components & Technology"]
];

const connectionAreas: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "package",
    title: "Product Discovery",
    text: "See products, technologies and category directions across the cleaning industry."
  },
  {
    icon: "handshake",
    title: "Business Matching",
    text: "Share what you sell or what you need so relevant introductions can be considered."
  },
  {
    icon: "message",
    title: "Industry Forums",
    text: "Follow discussions around products, channels, technology and market development."
  },
  {
    icon: "network",
    title: "Industry Connections",
    text: "Meet suppliers, brands, buyers, distributors, media and industry professionals."
  }
];

function IntentButtons({ location }: { location: "hero" | "footer" }) {
  return (
    <div className="expo-intent-actions">
      <TallyButton
        className="button expo-button-primary"
        ctaLocation={
          location === "hero" ? "wce_hero_exhibitor" : "wce_footer_exhibitor"
        }
        form="expo"
        inquiryIntent="exhibitor_interest"
        inquiryType="expo_exhibitor"
      >
        I Want To Exhibit
      </TallyButton>
      <TallyButton
        className="button-secondary expo-button-secondary"
        ctaLocation={
          location === "hero" ? "wce_hero_visitor" : "wce_footer_visitor"
        }
        form="expo"
        inquiryIntent="visitor_interest"
        inquiryType="expo_visitor"
      >
        I Want To Visit
      </TallyButton>
    </div>
  );
}

export default function WorldCleanExpoPage() {
  return (
    <div className="expo-conversion-page">
      <section className="expo-hero">
        <div className="container expo-hero-grid">
          <div className="expo-hero-copy">
            <p className="eyebrow">WORLD CLEAN EXPO 2026</p>
            <h1>Discover Products. Meet Partners. Find What Comes Next.</h1>
            <p>
              A cleaning industry platform connecting new products, Chinese
              supply chains, global buyers and business opportunities.
            </p>
            <div className="expo-hero-meta" aria-label="Event details">
              <span>November 18–20, 2026</span>
              <span>Suzhou Shishan International Convention Center</span>
              <span>China</span>
            </div>
            <IntentButtons location="hero" />
            <p className="expo-intent-note">
              Leave your interest now to receive the relevant registration,
              participation and event updates.
            </p>
          </div>
          <div className="expo-hero-visual" aria-label="Busy cleaning industry exhibition">
            <div className="expo-visual-note">
              <span>One Industry. Two Ways To Take Part.</span>
              <strong>Exhibit your products or discover your next business opportunity.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section expo-reasons-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">WHY WORLD CLEAN EXPO</p>
              <h2>More Than A Show Floor. A Place To Make Better Business Decisions.</h2>
              <p>
                The cleaning industry is changing quickly. World Clean Expo
                brings product discovery, supplier access and business
                conversations into one focused platform.
              </p>
            </div>
          </div>
          <div className="expo-track-grid">
            {reasons.map((item) => (
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

      <section className="section section-soft expo-paths-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">CHOOSE YOUR PATH</p>
              <h2>What Do You Want To Achieve At World Clean Expo?</h2>
              <p>Choose the path that matches your business objective.</p>
            </div>
          </div>
          <div className="expo-path-grid">
            <article className="expo-path-card expo-path-card-primary">
              <div className="expo-path-image expo-path-image-exhibitor" />
              <div className="expo-path-content">
                <p className="eyebrow">For Exhibitors</p>
                <h2>Put Your Products In Front Of The Right Industry Audience.</h2>
                <div className="expo-path-benefits">
                  {exhibitorBenefits.map((item) => (
                    <div key={item.title}>
                      <InlineIcon name={item.icon} />
                      <span><strong>{item.title}</strong>{item.text}</span>
                    </div>
                  ))}
                </div>
                <TallyButton
                  className="button"
                  ctaLocation="wce_path_exhibitor"
                  form="expo"
                  inquiryIntent="exhibitor_interest"
                  inquiryType="expo_exhibitor"
                >
                  Request Exhibitor Information
                </TallyButton>
              </div>
            </article>

            <article className="expo-path-card">
              <div className="expo-path-image expo-path-image-visitor" />
              <div className="expo-path-content">
                <p className="eyebrow">For Buyers &amp; Visitors</p>
                <h2>Find Products, Suppliers And Market Signals Worth Acting On.</h2>
                <div className="expo-path-benefits">
                  {visitorBenefits.map((item) => (
                    <div key={item.title}>
                      <InlineIcon name={item.icon} />
                      <span><strong>{item.title}</strong>{item.text}</span>
                    </div>
                  ))}
                </div>
                <TallyButton
                  className="button"
                  ctaLocation="wce_path_visitor"
                  form="expo"
                  inquiryIntent="visitor_interest"
                  inquiryType="expo_visitor"
                >
                  Get Visitor Registration Updates
                </TallyButton>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section expo-categories-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">PRODUCT CATEGORIES</p>
              <h2>See The Cleaning Products Shaping The Next Market Cycle.</h2>
              <p>
                Follow established categories, fast-growing segments and the
                technologies changing how cleaning work gets done.
              </p>
            </div>
          </div>
          <div className="expo-category-grid">
            {categories.map(([className, title]) => (
              <article className={`expo-category-card ${className}`} key={title}>
                <strong>{title}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section expo-meeting-section">
        <div className="container expo-meeting-layout">
          <div className="expo-meeting-copy">
            <p className="eyebrow">FROM DISCOVERY TO CONNECTION</p>
            <h2>Products Bring People In. The Right Conversations Create Value.</h2>
            <p>
              World Clean Expo is designed around the commercial moments that
              matter: seeing what is new, meeting relevant people and creating
              the next conversation.
            </p>
            <div className="expo-gathering-list">
              <span>Manufacturers</span><span>Brands</span><span>Buyers</span>
              <span>Distributors</span><span>Industry Experts</span>
            </div>
          </div>
          <div className="expo-gathering-grid">
            {connectionAreas.map((item) => (
              <article className="expo-gathering-card" key={item.title}>
                <InlineIcon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section expo-organizer-section">
        <div className="container expo-organizer-layout">
          <div className="expo-organizer-visual">
            <img
              src="/images/industry/about-denny-speaking-forum-2025.jpg"
              alt="Denny You speaking to cleaning industry professionals"
            />
            <div><span>DENNY YOU</span><strong>Founder, World Clean Biz<br />Organizer, World Clean Expo</strong></div>
          </div>
          <div className="expo-organizer-copy">
            <p className="eyebrow">ORGANIZER &amp; INDUSTRY NETWORK</p>
            <h2>Business Matching Built On Real Industry Relationships.</h2>
            <p>
              Denny You, founder of World Clean Biz and organizer of World Clean
              Expo, has worked inside the cleaning industry since 2006. His
              professional network spans manufacturers, suppliers, brands,
              buyers, investors and media.
            </p>
            <ul>
              <li>A decade of cleaning industry articles and analysis</li>
              <li>Product, hardware entrepreneurship and supply-chain experience</li>
              <li>Connections across the people who build, buy, fund and shape the industry</li>
            </ul>
            <Link href="/about">About Denny &amp; World Clean Biz →</Link>
          </div>
        </div>
      </section>

      <section className="section expo-final-section" id="expo-interest">
        <div className="container expo-final-conversion">
          <div>
            <p className="eyebrow">WORLD CLEAN EXPO 2026</p>
            <h2>Tell Us How You Want To Take Part.</h2>
            <p>
              Select your interest and we will send the relevant exhibitor,
              visitor registration and event updates as they become available.
            </p>
            <div className="expo-final-meta">
              <span>November 18–20, 2026</span>
              <span>Suzhou Shishan International Convention Center</span>
              <span>China</span>
            </div>
          </div>
          <IntentButtons location="footer" />
        </div>
      </section>
    </div>
  );
}
