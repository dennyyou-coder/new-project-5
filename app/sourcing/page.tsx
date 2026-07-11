import type { Metadata } from "next";
import Link from "next/link";
import { InlineIcon } from "@/components/Icon";
import { TallyButton } from "@/components/LeadForms";
import { SOURCING_CATEGORIES } from "@/lib/inquiryConversion";

export const metadata: Metadata = {
  title: "Cleaning Product Sourcing",
  description:
    "Explore cleaning product categories, supplier direction and sourcing support with World Clean Biz.",
  alternates: { canonical: "/sourcing" },
  openGraph: {
    title: "Cleaning Product Sourcing | World Clean Biz",
    description:
      "Turn a product brief into clearer category direction, supplier options and practical next steps.",
    url: "/sourcing",
    images: ["/images/industry/sourcing-supplier-meeting-2026.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Product Sourcing | World Clean Biz",
    description:
      "Turn a product brief into clearer category direction, supplier options and practical next steps.",
    images: ["/images/industry/sourcing-supplier-meeting-2026.jpg"]
  }
};

const sourcingNeeds = [
  {
    number: "01",
    title: "Find The Right Product Direction",
    text: "Compare category movement, product features and market signals before committing resources."
  },
  {
    number: "02",
    title: "Identify Relevant Supplier Options",
    text: "Narrow a crowded supplier landscape around your market, product stage and commercial priorities."
  },
  {
    number: "03",
    title: "Reduce Early Sourcing Risk",
    text: "Surface questions around differentiation, quality and execution before they become expensive."
  }
];

const deliveryPillars = [
  {
    image: "/images/industry/expo-hall-shenzhen-2026.jpg",
    title: "Category Intelligence",
    text: "Read product, supplier and trade-show signals to understand where a category is moving."
  },
  {
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    title: "Product & Supplier Direction",
    text: "Connect your target market and product brief with more relevant options and questions."
  },
  {
    image: "/images/industry/sourcing-product-components-2025.jpg",
    title: "Execution Support",
    text: "Clarify possible next steps for evaluation, development and supplier conversations."
  }
];

const processSteps = [
  {
    number: "01",
    title: "Submit Your Brief",
    text: "Share your company, target market, product category, stage and current sourcing objective."
  },
  {
    number: "02",
    title: "Initial Review",
    text: "World Clean Biz reviews the request against its industry scope, context and available resources."
  },
  {
    number: "03",
    title: "Direction & Connections",
    text: "Where there is a fit, we clarify useful category direction, supplier options or industry connections."
  },
  {
    number: "04",
    title: "Next-Step Cooperation",
    text: "A relevant opportunity can move into a focused discussion, evaluation or defined support project."
  }
];

export default function SourcingPage() {
  return (
    <div className="sourcing-v4-page">
      <section className="sourcing-v4-hero">
        <div className="sourcing-v3-container sourcing-v4-hero-grid">
          <div>
            <p className="sourcing-v3-kicker">Cleaning Product Sourcing</p>
            <h1>Move From A Broad Search To A Better Sourcing Decision.</h1>
            <p className="sourcing-v4-lead">
              World Clean Biz helps cleaning industry buyers and businesses
              clarify product direction, identify relevant supplier options
              and prepare better next steps.
            </p>
            <div className="sourcing-v4-actions">
              <TallyButton
                className="sourcing-v3-button"
                ctaLocation="sourcing_hero"
                form="sourcing"
              >
                Start A Sourcing Inquiry
              </TallyButton>
              <a href="#categories">Explore Product Categories</a>
            </div>
            <p className="sourcing-v4-boundary">
              Built for focused B2B product, supplier, OEM/ODM and private
              label inquiries in the cleaning industry.
            </p>
          </div>
          <figure className="sourcing-v4-hero-image">
            <img
              src="/images/industry/sourcing-supplier-meeting-2026.jpg"
              alt="Cleaning industry buyers discussing sourcing with suppliers"
            />
            <figcaption>Industry context before supplier conversations.</figcaption>
          </figure>
        </div>
      </section>

      <section className="sourcing-v4-section sourcing-v4-needs">
        <div className="sourcing-v3-container">
          <div className="sourcing-v4-heading">
            <p className="sourcing-v3-kicker">Where We Add Value</p>
            <h2>A Better Brief Creates A Better Search.</h2>
          </div>
          <div className="sourcing-v4-need-grid">
            {sourcingNeeds.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sourcing-v4-section sourcing-v4-categories" id="categories">
        <div className="sourcing-v3-container">
          <div className="sourcing-v4-heading">
            <p className="sourcing-v3-kicker">Product Categories</p>
            <h2>Start With The Category You Are Working On.</h2>
            <p>
              Choose a category to open a focused sourcing inquiry. The form
              will carry the selected category into your request.
            </p>
          </div>
          <div className="sourcing-v3-product-grid">
            {SOURCING_CATEGORIES.map((item) => (
              <TallyButton
                className="sourcing-v3-product-card"
                ctaLocation={item.ctaLocation}
                form="sourcing"
                key={item.value}
                productCategory={item.value}
                trackClick
              >
                <span className="sourcing-v3-product-image">
                  <img src={item.image} alt={`${item.title} product category`} />
                </span>
                <span className="sourcing-v3-product-copy">
                  <span>
                    <InlineIcon name={item.icon} />
                    <strong>{item.title}</strong>
                  </span>
                  <em>{item.description}</em>
                  <span>Discuss {item.title} →</span>
                </span>
              </TallyButton>
            ))}
          </div>
        </div>
      </section>

      <section className="sourcing-v4-section sourcing-v4-capabilities">
        <div className="sourcing-v3-container">
          <div className="sourcing-v4-heading">
            <p className="sourcing-v3-kicker">How We Can Help</p>
            <h2>From Market Context To Practical Next Steps.</h2>
          </div>
          <div className="sourcing-v4-capability-grid">
            {deliveryPillars.map((item) => (
              <article key={item.title}>
                <img src={item.image} alt="" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sourcing-v4-section sourcing-v4-process">
        <div className="sourcing-v3-container">
          <div className="sourcing-v4-heading">
            <p className="sourcing-v3-kicker">How It Works</p>
            <h2>A Clear Path From Inquiry To Next Step.</h2>
          </div>
          <ol>
            {processSteps.map((item) => (
              <li key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sourcing-v4-section sourcing-v4-trust">
        <div className="sourcing-v3-container sourcing-v4-trust-grid">
          <img
            src="/images/industry/about-denny-speaking-forum-2025.jpg"
            alt="Denny You speaking at a cleaning industry forum"
          />
          <div>
            <p className="sourcing-v3-kicker">Industry-Led Review</p>
            <h2>Context Built Inside The Cleaning Industry Since 2006.</h2>
            <p>
              Denny You, founder of World Clean Biz, works across cleaning
              products, suppliers, trade shows, industry content and business
              connections. Each relevant inquiry is reviewed in that industry
              context—not treated as a generic supplier-directory search.
            </p>
            <Link href="/about">About Denny & World Clean Biz →</Link>
          </div>
        </div>
      </section>

      <section className="sourcing-v3-cta sourcing-v4-final">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Start With Context</p>
          <h2>Tell Us What You Are Trying To Source.</h2>
          <p>
            Include your company, target market, product category, current
            project stage and the supplier or decision you need help with.
          </p>
          <TallyButton
            className="sourcing-v3-button"
            ctaLocation="sourcing_footer"
            form="sourcing"
          >
            Start A Sourcing Inquiry
          </TallyButton>
        </div>
      </section>
    </div>
  );
}
