import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz to discover better cleaning product opportunities, stronger suppliers, higher-margin products, and global cleaning industry connections."
};

const coreValues = [
  {
    icon: "target",
    title: "Discover Opportunities Earlier",
    text: "Find emerging categories and market opportunities before competitors."
  },
  {
    icon: "dollar",
    title: "Build Products With Better Margins",
    text: "Develop differentiated products with stronger pricing and long-term competitiveness."
  },
  {
    icon: "factory",
    title: "Access Proven Supply Chains",
    text: "Work with manufacturers trusted by leading brands and reduce costly sourcing mistakes."
  }
] satisfies { icon: IconName; title: string; text: string }[];

const trustMetrics = [
  "20+ Years Industry Experience",
  "9,000+ Industry Professionals",
  "Global Industry Network",
  "Industry Events & Intelligence"
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
    text: "Most sourcing companies help you buy products. Denny helps you decide which products are worth building."
  },
  {
    icon: "factory",
    title: "Access The Factories Behind Leading Brands",
    text: "Work with manufacturers producing for some of the world's leading cleaning brands."
  },
  {
    icon: "wrench",
    title: "Upgrade Products, Reduce Costs & Increase Competitiveness",
    text: "Leverage the latest technologies, components and manufacturing innovations."
  },
  {
    icon: "check",
    title: "Reduce After-Sales Costs & Improve Customer Satisfaction",
    text: "Build more reliable products, reduce returns and improve customer experience."
  },
  {
    icon: "rocket",
    title: "Focus On Sales. We Handle The Rest.",
    text: "From product definition to shipment, Denny helps manage the process so your team can focus on growth."
  }
] satisfies { icon: IconName; title: string; text: string }[];

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
        <div className="container">
          <p className="eyebrow">Sourcing</p>
          <h1>
            Source Better Products.
            <br />
            Build Better Business.
          </h1>
          <p>
            Leverage Denny&apos;s industry network, supplier relationships and
            market intelligence to discover products, manufacturers and
            opportunities that create long-term business value.
          </p>
          <div className="sourcing-statement">
            We don&apos;t help you source products. We help you make more money.
          </div>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Contact Denny
            </Link>
            <Link className="button button-secondary" href="/contact">
              Discuss Your Project
            </Link>
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
            <div className="sourcing-value-grid">
              {coreValues.map((item) => (
                <div className="sourcing-value-card" key={item.title}>
                  <IconBadge name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
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
          <div className="sourcing-reason-grid">
            {reasons.map((item) => (
              <div className="case-card sourcing-reason-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band sourcing-final-cta">
          <div>
            <p className="eyebrow">Discuss Your Project</p>
            <h2>Want To Discover The Next Winning Product?</h2>
            <p>
              Want to know where the next opportunity is emerging? Want to
              understand what leading brands are building and who is
              manufacturing it? Want to build products with higher margins,
              lower after-sales rates and stronger long-term growth? Let&apos;s
              talk.
            </p>
            <strong className="sourcing-outcome">
              Better Products. Better Suppliers. Better Business.
            </strong>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Contact Denny
            </Link>
            <Link className="button button-secondary" href="/contact">
              Discuss Your Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
