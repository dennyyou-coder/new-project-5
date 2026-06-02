import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "OEM, ODM, private label, supplier matching, and sourcing support for global cleaning industry buyers."
};

const categories = [
  "Vacuum Cleaners",
  "Robot Vacuums",
  "Floor Care",
  "Pool Cleaning",
  "Commercial Cleaning",
  "Distributor Opportunities",
  "Supplier Matching"
];

const process = [
  "Define product category, target market, and buyer requirements",
  "Match suitable supplier profiles and product directions",
  "Review OEM, ODM, private label, and inventory opportunities",
  "Support follow-up communication and market positioning"
];

const buyerQuestions = [
  "Which product category fits my target market?",
  "Should I choose OEM, ODM, private label, or inventory purchasing?",
  "What supplier profile is suitable for my channel?",
  "How can I reduce quality, compliance, and after-sales risk?"
];

export default function SourcingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Sourcing</p>
          <h1>Cleaning product sourcing support for global buyers</h1>
          <p>
            OEM, ODM, private label, supplier matching, distributor
            opportunities, and inventory opportunities across cleaning
            categories.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>What buyers can source</h2>
            <p>
              World Clean Biz helps buyers, brands, distributors, and sourcing
              teams understand product options and supplier paths in the
              cleaning industry.
            </p>
            <div className="tag-list">
              {categories.map((category) => (
                <span className="tag" key={category}>
                  {category}
                </span>
              ))}
            </div>
            <ul className="feature-list">
              <li>Product direction review before supplier contact.</li>
              <li>Supplier matching based on category, channel, and positioning.</li>
              <li>Support for OEM, ODM, private label, and special purchasing opportunities.</li>
            </ul>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">For global buyers</div>
            <h3>Submit a sourcing request</h3>
            <p>
              Share the product category, target market, expected positioning,
              volume range, and any supplier requirements.
            </p>
            <p>
              <Link className="button" href="/contact">
                Request Sourcing Support
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Buyer Questions</p>
              <h2>Good sourcing starts before factory comparison</h2>
              <p>
                The goal is not only to find factories. The goal is to match
                product, supplier, market, and channel correctly.
              </p>
            </div>
          </div>
          <div className="grid-2">
            {buyerQuestions.map((question) => (
              <div className="card" key={question}>
                <h3>{question}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Process</p>
              <h2>A practical sourcing path</h2>
            </div>
          </div>
          <div className="grid-2">
            {process.map((item, index) => (
              <div className="card" key={item}>
                <div className="meta">Step {index + 1}</div>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <h2>Ready to discuss a sourcing project?</h2>
              <p>
                Send a short message with your category, target market, and
                expected business model.
              </p>
            </div>
            <div>
              <Link className="button" href="/contact">
                Contact Denny You
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
