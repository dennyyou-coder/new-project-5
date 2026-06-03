import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Sourcing intelligence for cleaning buyers covering product categories, supplier types, OEM paths, private label options, and sourcing risks."
};

const sourcingIntelligenceTopics = [
  "Buyer Questions",
  "Supplier Signals",
  "Category Context",
  "OEM / ODM Paths",
  "Private Label Considerations",
  "Risk Checks"
];

const process = [
  "Clarify category, target market, channel, and buyer requirements",
  "Understand available supplier types and product directions",
  "Compare OEM, ODM, private label, and purchasing paths",
  "Prepare better questions before factory comparison or negotiation"
];

const buyerQuestions = [
  "Which product category fits my target market?",
  "Should I choose OEM, ODM, private label, or inventory purchasing?",
  "What supplier profile is suitable for my channel?",
  "How can I reduce quality, compliance, and after-sales risk?"
];

const sourcingSignals = [
  "Product positioning and category maturity",
  "Supplier capability and cooperation model",
  "Market fit, compliance risk, and after-sales expectation",
  "Channel demand, pricing pressure, and timing"
];

const sourcingScenarios = [
  {
    title: "Retail buyer building a robot vacuum line",
    text: "Clarify price tier, navigation expectation, wet cleaning feature set, after-sales model, and supplier type."
  },
  {
    title: "Distributor comparing floor care equipment",
    text: "Review category maturity, spare parts needs, local service requirements, and commercial buyer use cases."
  },
  {
    title: "Brand exploring private label cleaning appliances",
    text: "Map OEM and ODM options, packaging expectations, compliance questions, and channel positioning."
  },
  {
    title: "Importer reviewing special purchasing opportunities",
    text: "Check product fit, market timing, inventory risk, specification gaps, and negotiation priorities."
  }
];

const supplierProfiles = [
  "OEM factories with export-ready production systems",
  "ODM partners with existing product platforms",
  "Component and technology suppliers",
  "Specialized category manufacturers",
  "Inventory and project purchasing sources",
  "Channel partners for distribution cooperation"
];

export default function SourcingPage() {
  return (
    <>
      <section className="page-hero page-hero-sourcing">
        <div className="container">
          <p className="eyebrow">Sourcing Intelligence</p>
          <h1>Sourcing Intelligence for Cleaning Buyers</h1>
          <p>
            Understand product categories, supplier types, OEM paths, private
            label options and sourcing risks before supplier comparison.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Sourcing starts before supplier comparison</h2>
            <p>
              World Clean Biz helps buyers clarify category movement, supplier
              models, channel fit and risk signals before the factory shortlist.
            </p>
            <div className="tag-list">
              {sourcingIntelligenceTopics.map((category) => (
                <span className="tag" key={category}>
                  {category}
                </span>
              ))}
            </div>
            <ul className="feature-list">
              <li>Review product direction before contacting suppliers.</li>
              <li>Match supplier profiles with category, channel, and positioning needs.</li>
              <li>Support OEM, ODM, private label, and special purchasing opportunities.</li>
            </ul>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Sourcing Inquiry</div>
            <h3>Need sourcing context before contacting suppliers?</h3>
            <p>
              Share your product category, target market, channel and sourcing
              question. We help clarify the right direction before supplier
              comparison.
            </p>
            <p>
              <Link className="button" href="/contact">
                Share Sourcing Inquiry
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Sourcing Intelligence</p>
              <h2>Not a supplier directory. A decision context layer.</h2>
              <p>
                A cleaner way to frame buyer questions, supplier signals,
                category context and sourcing risk.
              </p>
            </div>
          </div>
          <div className="platform-grid">
            {sourcingIntelligenceTopics.map((item) => (
              <div className="platform-card compact-card" key={item}>
                <div className="platform-icon" aria-hidden="true">
                  {item.slice(0, 1)}
                </div>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Buyer Questions</p>
              <h2>Good sourcing starts with better questions</h2>
              <p>
                The goal is to understand product, supplier, market, channel
                and risk level before cost negotiation begins.
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
              <p className="eyebrow">Decision Signals</p>
              <h2>Signals to clarify before supplier outreach</h2>
              <p>
                These signals affect product choice, partner fit, risk and
                timing.
              </p>
            </div>
          </div>
          <div className="grid-2">
            {sourcingSignals.map((item) => (
              <div className="card" key={item}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Example Scenarios</p>
              <h2>What sourcing intelligence can look like in practice</h2>
              <p>
                These sample cases show the type of information a buyer may
                need before supplier comparison becomes useful.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {sourcingScenarios.map((item) => (
              <div className="case-card" key={item.title}>
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
              <p className="eyebrow">Process</p>
              <h2>A practical inquiry path</h2>
              <p>
                The first-stage process keeps the discussion simple, but gives
                enough structure to understand whether a request is ready for
                deeper supplier or market review.
              </p>
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
      <section className="section section-soft">
        <div className="container grid-2">
          <div className="image-panel image-panel-sourcing">
            <div>
              <p className="eyebrow">Supplier Landscape</p>
              <h2>From product idea to supplier profile</h2>
              <p>
                The right supplier is not only a factory with a price. It is a
                match between category, capability, channel, service model, and
                risk tolerance.
              </p>
            </div>
          </div>
          <div className="card">
            <h3>Supplier profiles to map</h3>
            <ul className="feature-list">
              {supplierProfiles.map((item) => (
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
              <h2>Need sourcing context before contacting suppliers?</h2>
              <p>
                Share your product category, target market, channel and
                sourcing question. We help clarify the right direction before
                supplier comparison.
              </p>
            </div>
            <div>
              <Link className="button" href="/contact">
                Share Sourcing Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
