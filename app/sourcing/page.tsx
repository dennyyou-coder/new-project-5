import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Product opportunity and sourcing support for cleaning industry buyers, covering product decisions, supplier access, market opportunities, OEM, private label, and cleaning product development."
};

const buyerAdvantages = [
  {
    icon: "network",
    title: "Deep Industry Access Few Others Have",
    text: "World Clean Biz is built by Denny You, one of the most recognized voices in the global cleaning industry. Through industry media, conferences, factory visits and trade shows, he tracks product launches, technology shifts, supplier movements and market opportunities."
  },
  {
    icon: "radar",
    title: "Industry Intelligence Before Everyone Else",
    text: "Every year we speak with manufacturers, brands, distributors, retailers and industry decision makers across the cleaning industry. Most sourcing companies only see factories. We see the entire ecosystem."
  },
  {
    icon: "badge",
    title: "20+ Years in the Cleaning Industry",
    text: "Our team has spent more than two decades inside the cleaning industry, covering products, technologies, factories, costs, certifications and market trends across major cleaning categories."
  },
  {
    icon: "target",
    title: "Find Winning Products Earlier",
    text: "Instead of guessing what may sell next, buyers gain access to products, technologies and category opportunities already proving successful in the market."
  },
  {
    icon: "rocket",
    title: "Launch 3-6 Months Faster",
    text: "With direct access to manufacturers, suppliers and industry networks, we help buyers identify products, evaluate suppliers and start projects faster than building everything from scratch."
  },
  {
    icon: "lightbulb",
    title: "Product Development Capabilities Similar to Leading Brands",
    text: "We help evaluate product concepts, features, technologies, positioning and differentiation so buyers can build products that stand out, not products that look the same as everyone else's."
  },
  {
    icon: "boxes",
    title: "Access More Than 50 Product Opportunities Every Year",
    text: "Each year we review dozens of new products, supplier innovations and emerging technologies, giving buyers a continuous pipeline of opportunities."
  },
  {
    icon: "trending",
    title: "Make More Profit With Better Product Decisions",
    text: "The difference between a successful product and an average product can be worth hundreds of thousands of dollars. Better products, better suppliers and faster execution create stronger long-term growth."
  }
] satisfies { icon: IconName; title: string; text: string }[];

const opportunityQuestions = [
  "Which products are growing fastest",
  "Which technologies are becoming mainstream",
  "Which suppliers are worth talking to",
  "Which opportunities competitors haven't discovered yet",
  "Which categories are worth entering",
  "Which products can generate meaningful profit"
];

const sourceCategories = [
  {
    icon: "wind",
    title: "Vacuum Cleaners",
    text: "Cordless stick vacuums, canister vacuums, upright vacuums, wet and dry vacuums and specialty cleaning products."
  },
  {
    icon: "bot",
    title: "Robot Vacuums",
    text: "Robot vacuum cleaners, robot vacuum and mop combinations, navigation systems and related accessories."
  },
  {
    icon: "sparkles",
    title: "Floor Care Products",
    text: "Floor washers, wet dry floor cleaners, carpet cleaners and related cleaning solutions."
  },
  {
    icon: "waves",
    title: "Pool Cleaning Products",
    text: "Robotic pool cleaners, cordless pool cleaners, above-ground and in-ground pool cleaning systems."
  },
  {
    icon: "building",
    title: "Commercial Cleaning Equipment",
    text: "Commercial vacuum cleaners, floor scrubbers and professional cleaning solutions."
  },
  {
    icon: "cog",
    title: "Components & Accessories",
    text: "Motors, batteries, brushes, filters, electronics and key cleaning product components."
  }
] satisfies { icon: IconName; title: string; text: string }[];

const workStepIcons: IconName[] = ["send", "search", "factory", "package", "check"];

const workSteps = [
  "Share your product idea, category or sourcing goal.",
  "We evaluate market opportunities, supplier landscape and product potential.",
  "We identify suitable manufacturers and product options.",
  "We coordinate quotations, samples and supplier communication.",
  "We support product development, sourcing discussions and project follow-up."
];

const buyerRequests = [
  "I need a private label robot vacuum.",
  "I want to launch a cordless pool cleaner.",
  "I need a reliable OEM supplier in China.",
  "I want to compare multiple factories before making a decision.",
  "I need new product ideas for my market.",
  "I want a sourcing office in China without building a local team.",
  "I want to find the next growth category before competitors."
];

export default function SourcingPage() {
  return (
    <>
      <section className="page-hero page-hero-sourcing">
        <div className="container">
          <p className="eyebrow">China Sourcing Office</p>
          <h1>Make More Money With Better Product Decisions</h1>
          <p>
            Most sourcing companies help you find factories. We help you find
            the next million-dollar product.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              Start My Sourcing Project
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="sourcing-lead">
            <h2>The biggest mistake buyers make is not choosing the wrong supplier.</h2>
            <p>It is choosing the wrong product.</p>
            <div className="highlight-panel">
              <p>
              A better factory might save you 5%. The right product can
              increase your sales by 500%.
              </p>
            </div>
            <p>
              That is why we start with market opportunities, product trends
              and industry intelligence before discussing suppliers.
            </p>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Product Opportunity First</div>
            <h3>The goal is not to buy products.</h3>
            <p>The goal is to build profitable product businesses.</p>
            <Link className="button" href="/contact">
              Start My Sourcing Project
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why Buyers Work With Us</p>
              <h2>Industry access, product judgment and supplier context</h2>
              <p>
                Buyers work with us because we see more than factories. We see
                product signals, supplier movement, technology shifts and market
                opportunities across the cleaning industry.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {buyerAdvantages.map((item) => (
              <div className="case-card sourcing-advantage-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">What Makes Us Different</p>
            <h2>Find the right opportunity before comparing suppliers</h2>
            <p>
              Most sourcing companies help you compare suppliers. We help you
              identify the right opportunity before comparing suppliers.
            </p>
            <p>
              Many buyers come to us not because they need a factory. They come
              to us because they want to know what to build next.
            </p>
          </div>
          <div className="card">
            <h3>Buyer questions we help answer</h3>
            <ul className="feature-list">
              {opportunityQuestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">What We Source</p>
              <h2>Cleaning product categories with business potential</h2>
              <p>
                Finding a factory is easy. Finding the right product at the
                right time is much harder.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {sourceCategories.map((item) => (
              <div className="case-card" key={item.title}>
                <IconBadge name={item.icon} />
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
              <p className="eyebrow">How We Work</p>
              <h2>From product idea to sourcing project</h2>
              <p>
                We start with product potential, then move into supplier
                identification, quotation, samples and project follow-up.
              </p>
            </div>
          </div>
          <div className="grid-2">
            {workSteps.map((item, index) => (
              <div className="card" key={item}>
                <IconBadge name={workStepIcons[index]} />
                <div className="meta">Step {index + 1}</div>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid-2">
          <div className="image-panel image-panel-sourcing">
            <div>
              <p className="eyebrow">Typical Buyer Requests</p>
              <h2>Buyers come to us when product direction matters</h2>
              <p>
                The right product can create years of growth. The wrong product
                can waste months of supplier comparison.
              </p>
            </div>
          </div>
          <div className="card">
            <ul className="feature-list">
              {buyerRequests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <IconBadge name="trophy" />
              <p className="eyebrow">Start My Sourcing Project</p>
              <h2>Your Next Million-Dollar Product Starts Here</h2>
              <p>
                Most buyers spend their time comparing suppliers. The most
                successful buyers spend their time identifying the right
                opportunity. Share your target market, product category or
                business goal. Let us help you discover the next product worth
                building before the market gets crowded.
              </p>
              <p className="meta">
                Product Category / Target Market / Expected Quantity / Business Goal
              </p>
            </div>
            <div>
              <Link className="button" href="/contact">
                Start My Sourcing Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
