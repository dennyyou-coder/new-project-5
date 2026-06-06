import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";
import { ExpoLeadForm } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "World Clean Expo 2026 | Global Cleaning Industry Updates",
  description:
    "Get World Clean Expo 2026 updates from a cleaning industry platform built on years of forums, trade shows, product signals and professional networks."
};

const visitReasons: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "sparkles",
    title: "New Categories Are Emerging",
    text: "Outdoor robotics, pool cleaning and smart floor care are creating new demand signals."
  },
  {
    icon: "factory",
    title: "Supply Chains Are Evolving",
    text: "Manufacturers are moving from simple production toward faster product innovation."
  },
  {
    icon: "trending",
    title: "Global Buyers Need Better Discovery",
    text: "Buyers need clearer ways to find suppliers, product categories and market opportunities."
  },
  {
    icon: "target",
    title: "Industry Conversations Matter More",
    text: "Forums and market discussions help turn product shifts into business decisions."
  },
  {
    icon: "message",
    title: "Product Innovation Is Accelerating",
    text: "New brands, new components and smarter products are reaching global channels faster."
  },
  {
    icon: "globe",
    title: "Connections Create Opportunities",
    text: "The right industry connections can turn signals into sourcing, partnerships and growth."
  }
];

const industrySignals = [
  {
    title: "Outdoor Robotics Is Accelerating",
    text: "Pool cleaning and lawn robotics are becoming the next major growth categories."
  },
  {
    title: "China Is Moving Upstream",
    text: "Factories are becoming innovators, not just manufacturers."
  },
  {
    title: "New Brands Are Emerging Faster",
    text: "E-commerce, private label and category specialists are changing traditional markets."
  },
  {
    title: "Global Buyers Need Better Discovery",
    text: "Buyers need better ways to find products, suppliers and category opportunities."
  }
];

const productCategories = [
  {
    name: "Robotic Vacuums",
    imageClass: "expo-category-robot-vacuum"
  },
  {
    name: "Floor Washers",
    imageClass: "expo-category-floor-washer"
  },
  {
    name: "Pool Cleaners",
    imageClass: "expo-category-pool-cleaner"
  },
  {
    name: "Lawn Robots",
    imageClass: "expo-category-lawn-robot"
  },
  {
    name: "Commercial Cleaning",
    imageClass: "expo-category-commercial"
  },
  {
    name: "Components & Technology",
    imageClass: "expo-category-components"
  }
];

const audienceTypes = [
  {
    title: "Brands",
    text: "Spot category shifts, supplier moves and product directions earlier."
  },
  {
    title: "Manufacturers",
    text: "Understand buyer demand and where global channels are moving."
  },
  {
    title: "Importers & Distributors",
    text: "Find new suppliers, categories and product opportunities worth tracking."
  },
  {
    title: "Retailers",
    text: "Follow categories with future shelf and channel potential."
  },
  {
    title: "Amazon Sellers",
    text: "Identify products and trends before categories become crowded."
  },
  {
    title: "Sourcing Teams",
    text: "Compare product directions, factories and supply chain signals."
  },
  {
    title: "Investors",
    text: "Track category growth before it reaches mainstream attention."
  },
  {
    title: "Media",
    text: "Follow the companies and technologies shaping the next decade of cleaning."
  }
];

const gatheringGroups = [
  "Manufacturers",
  "Brands",
  "Suppliers",
  "Distributors",
  "Retailers",
  "Investors",
  "Media"
];

const gatheringFeatures: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "globe",
    title: "Global Connections",
    text: "Bring international buyers, suppliers, brands and industry professionals into one shared platform."
  },
  {
    icon: "message",
    title: "Industry Forums",
    text: "Turn product shifts, market signals and technology trends into focused industry conversations."
  },
  {
    icon: "handshake",
    title: "Business Matching",
    text: "Create more useful paths between product discovery, sourcing needs and future partnerships."
  },
  {
    icon: "package",
    title: "Product Discovery",
    text: "Make new cleaning categories, technologies and supply chain capabilities easier to see."
  }
];

const updateBenefits: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "radio",
    title: "Monthly Industry Signals",
    text: "Category shifts, brand moves, channel changes and product direction from the cleaning industry."
  },
  {
    icon: "file",
    title: "Market Reports & Analysis",
    text: "Selected reports and market notes that help you understand where opportunities are forming."
  },
  {
    icon: "calendar",
    title: "World Clean Expo Updates",
    text: "Visitor registration timing, forum agenda, exhibitor news and product highlights for World Clean Expo."
  },
  {
    icon: "handshake",
    title: "Business & Sourcing Opportunities",
    text: "Updates on suppliers, buyers, product categories and possible industry connections."
  }
];

const dennyTags = [
  "Since 2006",
  "Product Signals",
  "Forums",
  "Trade Shows",
  "Industry Connections"
];

const venueTags = ["Exhibition", "Forum", "Business Matching", "Networking"];

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
            <h1>Where The Global Cleaning Industry Meets</h1>
            <p>
              Built on years of industry forums, professional trade shows and
              real cleaning industry networks.
            </p>
            <p>
              Stay updated on emerging products, market trends, industry forums
              and World Clean Expo 2026.
            </p>
            <div className="expo-hero-meta" aria-label="Event details">
              <span>November 2026</span>
              <span>Suzhou</span>
              <span>China</span>
            </div>
            <div className="hero-actions">
              <Link className="button" href="#expo-updates">
                Get Expo Updates
              </Link>
              <Link className="button-secondary" href="#why-visit">
                Why It Matters
              </Link>
            </div>
          </div>
          <div className="expo-hero-visual" aria-label="International trade show floor">
            <div className="expo-visual-note">
              <span>Global Industry Updates</span>
              <strong>Industry signals, exhibitor news, forum updates and market opportunities.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="why-visit">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why This Matters</p>
              <h2>Why This Expo Matters</h2>
              <p>
                The cleaning industry is evolving faster than ever. New
                products, new brands and new supply chains are reshaping the
                market worldwide.
              </p>
            </div>
          </div>
          <div className="expo-track-grid">
            {visitReasons.map((item) => (
              <div className="card expo-track-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Industry Snapshot</p>
              <h2>The Industry Is Changing Fast</h2>
              <p>
                New technologies and business models are creating the next
                generation of cleaning brands.
              </p>
            </div>
          </div>
          <div className="expo-snapshot-grid">
            {industrySignals.map((item) => (
              <div className="expo-snapshot-card" key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">What You Will Get</p>
              <h2>What You Will Get</h2>
              <p>
                Subscribe once and receive the updates that help you track
                industry opportunities before, during and after World Clean
                Expo.
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
              <p className="eyebrow">Product Categories</p>
              <h2>Explore Product Categories</h2>
              <p>
                Follow the categories and technologies shaping the next stage
                of cleaning industry growth.
              </p>
            </div>
          </div>
          <div className="expo-category-grid">
            {productCategories.map((item) => (
              <div className={`expo-category-card ${item.imageClass}`} key={item.name}>
                <strong>{item.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Who Should Follow</p>
              <h2>Built For The Entire Industry</h2>
              <p>
                World Clean Expo updates are designed for professionals who
                want to understand products, suppliers, markets and future
                opportunities.
              </p>
            </div>
          </div>
          <div className="expo-audience-grid">
            {audienceTypes.map((item) => (
              <div className="expo-audience-card" key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section expo-meeting-section">
        <div className="container expo-meeting-layout">
          <div className="expo-meeting-copy">
            <p className="eyebrow">Building A Global Meeting Point</p>
            <h2>Building A Global Meeting Point For The Cleaning Industry</h2>
            <p>
              World Clean Expo is the next step after years of industry
              forums, product conversations and professional trade show
              networks. It is designed as a place where product discovery,
              industry forums, buyer demand and supply chain capability can
              meet in one global setting.
            </p>
            <div className="expo-gathering-list" aria-label="Industry groups">
              {gatheringGroups.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="expo-gathering-grid">
            {gatheringFeatures.map((item) => (
              <div className="expo-gathering-card" key={item.title}>
                <InlineIcon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2 expo-agenda-layout">
          <div>
            <p className="eyebrow">Why World Clean Expo</p>
            <h2>Built By Industry Insiders</h2>
            <p>
              World Clean Expo is built by people who understand the cleaning
              industry from inside, not just from exhibitor lists.
            </p>
            <p>
              Since 2006, Denny has worked across products, customers,
              suppliers, media, forums and industry events, connecting cleaning
              industry signals with real business conversations.
            </p>
            <p>
              World Clean Expo combines industry insights, sourcing context,
              forums and exhibitions into one focused platform for the global
              cleaning industry.
            </p>
            <div className="tag-list expo-denny-tags">
              {dennyTags.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="image-panel image-panel-expo">
            <div>
              <p className="eyebrow">Global Meeting Point</p>
              <h2>The Cleaning Industry Needs A Place To Connect</h2>
              <p>
                Products, suppliers, buyers, forums and market signals brought
                together for global industry professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section expo-capture-section" id="expo-updates">
        <div className="container grid-2 expo-interest-layout">
          <div className="expo-capture-copy">
            <p className="eyebrow">Expo Updates</p>
            <h2>Get Expo Updates</h2>
            <p>
              Leave your email to receive exhibitor news, visitor registration
              updates, forum agenda, market reports and business opportunities
              from the global cleaning industry.
            </p>
            <strong>Be the first to know when visitor registration opens.</strong>
            <span>Join the global cleaning industry community.</span>
          </div>
          <ExpoLeadForm roles={roleOptions} />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container expo-venue-panel">
          <div>
            <p className="eyebrow">Venue</p>
            <h2>Join Us In Suzhou</h2>
            <p>Suzhou International Expo Center</p>
            <p>November 2026 · Suzhou, China</p>
          </div>
          <div className="tag-list">
            {venueTags.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section expo-final-section">
        <div className="container cta-band expo-final-cta">
          <div>
            <p className="eyebrow">World Clean Expo 2026</p>
            <h2>See What's Next In Cleaning</h2>
            <p>The future of the global cleaning industry starts here.</p>
          </div>
          <div className="hero-actions">
            <Link className="button" href="#expo-updates">
              Get Expo Updates
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
