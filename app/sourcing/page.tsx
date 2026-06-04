import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz to discover better cleaning product opportunities, stronger suppliers, higher-margin products, and global cleaning industry connections."
};

const trustMetrics = [
  "20+ Years Industry Experience",
  "9,000+ Industry Professionals",
  "Global Industry Network",
  "Industry Events & Intelligence"
];

const painPoints = [
  "Too Many Suppliers.",
  "Too Few Opportunities.",
  "Every Trade Show Looks The Same.",
  "Competitors Launch Faster.",
  "Margins Keep Shrinking.",
  "High After-Sales. Low Profit."
];

const reasons = [
  {
    icon: "star",
    title: "Industry Leader, Influencer & Trusted Advisor",
    text: "Denny connects brands, suppliers and markets across the global cleaning industry."
  },
  {
    icon: "target",
    title: "Discover Opportunities Earlier",
    text: "Identify emerging categories, market shifts and product opportunities before competitors."
  },
  {
    icon: "dollar",
    title: "Build Products With Better Margins",
    text: "Create differentiated products with stronger pricing and healthier profitability."
  },
  {
    icon: "lightbulb",
    title: "Know What To Build, Not Just What To Buy",
    text: "Decide which products are worth building before buying from factories."
  },
  {
    icon: "factory",
    title: "Access The Factories Behind Leading Brands",
    text: "Connect with manufacturers producing for leading cleaning brands."
  },
  {
    icon: "wrench",
    title: "Upgrade Products, Reduce Costs & Increase Competitiveness",
    text: "Use better components, technologies and manufacturing innovation."
  },
  {
    icon: "check",
    title: "Reduce After-Sales Costs & Improve Customer Satisfaction",
    text: "Build more reliable products and reduce costly returns."
  },
  {
    icon: "rocket",
    title: "Focus On Sales. We Handle The Rest.",
    text: "Let your team focus on growth while execution is managed."
  }
] satisfies { icon: IconName; title: string; text: string }[];

const strategicReasons = reasons.slice(0, 4);
const executionReasons = reasons.slice(4);

const ctaPoints = [
  "Discover where the next opportunity is emerging",
  "Understand what leading brands are building",
  "Access the factories behind successful products",
  "Build products with higher margins and lower after-sales rates"
];

const productCategories = [
  {
    title: "Robotic Vacuums",
    text: "Smart cleaning robots, docking systems and product upgrade opportunities.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Floor Washers",
    text: "Wet dry floor cleaners, floor care systems and household cleaning innovation.",
    image:
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Pool Cleaning Robots",
    text: "Cordless pool cleaners, robotic pool systems and seasonal category opportunities.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Robotic Lawn Mowers",
    text: "Outdoor robotic products, navigation upgrades and emerging channel signals.",
    image:
      "https://images.unsplash.com/photo-1599686302990-d6a59e0d1f6c?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Commercial Cleaning Equipment",
    text: "Floor scrubbers, professional vacuums and equipment for facility operations.",
    image:
      "https://source.unsplash.com/INDGbj_ojG4/900x520"
  },
  {
    title: "Cleaning Chemicals",
    text: "Category positioning, private label paths and supplier-side formulation context.",
    image:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Private Label Opportunities",
    text: "OEM, ODM and brand-ready product directions for specific market needs.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Emerging Categories",
    text: "New cleaning technologies, product shifts and opportunities before they become obvious.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=900&auto=format&fit=crop"
  }
];

export default function SourcingPage() {
  return (
    <>
      <section className="sourcing-compact-intro">
        <div className="container sourcing-hero-grid">
          <div>
            <p className="eyebrow">Sourcing</p>
            <h1>Everyone Can Find Suppliers. Few Can Find The Next Amazon Best Seller.</h1>
            <p>
              Most companies don&apos;t need more suppliers. They need better opportunities.
            </p>
            <ul className="sourcing-pain-list">
              {painPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="sourcing-statement">
              We don&apos;t help you source products. We help you make more money.
            </div>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Talk With Denny
              </Link>
            </div>
          </div>
          <div className="sourcing-opportunity-visual" aria-label="International trade show aisles and supplier booths">
            <div className="sourcing-visual-caption">
              <span>Trade Show Signal</span>
              <strong>Too many suppliers. Too few obvious opportunities.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container sourcing-denny-layout">
          <div className="sourcing-denny-image" aria-label="Industry forum and business networking placeholder" />
          <div className="sourcing-denny-copy">
            <p className="eyebrow">Why Companies Work With Denny</p>
            <h2>Denny Connects Products, Suppliers And Markets</h2>
            <p>
              Denny is one of the leading influencers and industry consultants
              in the global cleaning industry.
            </p>
            <p>
              For more than 20 years, he has connected manufacturers, brands,
              distributors, retailers, suppliers and industry professionals
              across the industry.
            </p>
            <p>
              His value is not helping companies source products. His value is
              helping companies discover opportunities, build stronger
              products and create more profitable businesses.
            </p>
            <div className="sourcing-trust-row">
              {trustMetrics.map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">8 Reasons Companies Work With Denny</p>
              <h2>Better products, stronger suppliers and clearer business direction</h2>
              <p>
                Denny helps companies move beyond factory comparison and focus
                on product opportunities, margins, reliability and long-term
                growth.
              </p>
            </div>
          </div>
          <div className="sourcing-reason-block">
            <div className="sourcing-reason-label">Strategic Advantages</div>
            <div className="sourcing-reason-grid">
              {strategicReasons.map((item) => (
                <div className="case-card sourcing-reason-card" key={item.title}>
                  <IconBadge name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="sourcing-reason-block">
            <div className="sourcing-reason-label">Execution Advantages</div>
            <div className="sourcing-reason-grid">
              {executionReasons.map((item, index) => (
                <div className={`case-card sourcing-reason-card sourcing-execution-card sourcing-execution-card-${index + 1}`} key={item.title}>
                  <IconBadge name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Product Categories</p>
              <h2>Explore Product Opportunities</h2>
              <p>
                Discover products and opportunities across the global cleaning
                industry.
              </p>
            </div>
          </div>
          <div className="sourcing-category-grid">
            {productCategories.map((item) => (
              <Link className="sourcing-category-card" href="/contact" key={item.title}>
                <img src={item.image} alt={`${item.title} category`} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <strong>Discuss category →</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band sourcing-final-cta">
          <div>
            <p className="eyebrow">Discuss Your Project</p>
            <h2>Looking For The Next Best Seller?</h2>
            <ul className="sourcing-cta-list">
              {ctaPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <strong className="sourcing-outcome">
              More Opportunities. More Profit. Less Guesswork.
            </strong>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Talk With Denny
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
