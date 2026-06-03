import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Market intelligence for cleaning industry decisions, including focused notes, category research, and regional demand signals."
};

const reports = [
  "Category Reports",
  "Regional Reports",
  "Buyer & Channel Notes"
];

const popularTopics = [
  "Robot Vacuums",
  "Floor Care",
  "Pool Cleaning",
  "Commercial Cleaning",
  "Europe",
  "North America",
  "Middle East",
  "Private Label"
];

const useCases = [
  "Understand category demand before sourcing",
  "Evaluate regional market opportunities",
  "Prepare distributor or buyer discussions",
  "Support product planning and positioning"
];

const reportMethod = [
  "Start from a clear category, region, or buyer question",
  "Collect visible market signals and supply-side context",
  "Translate findings into decisions readers can act on"
];

const sampleReports = [
  {
    title: "Global Robot Vacuum Market Brief",
    meta: "Category intelligence",
    text: "A practical view of navigation upgrades, base station demand, premium pricing, and supplier readiness."
  },
  {
    title: "Europe Floor Care Demand Outlook",
    meta: "Regional market note",
    text: "Signals from distributor channels, energy efficiency expectations, and professional floor care needs."
  },
  {
    title: "Commercial Cleaning Equipment Signals",
    meta: "B2B demand report",
    text: "Facility cleaning, labor-saving tools, service contractors, and procurement timing across key markets."
  },
  {
    title: "China Cleaning Supply Chain Map",
    meta: "Supplier landscape",
    text: "OEM and ODM capability, component shifts, export readiness, and factory specialization by category."
  }
];

const reportInputs = [
  "Category and product scope",
  "Target region or buyer channel",
  "Key decision to support",
  "Known suppliers or competitors",
  "Timeline and depth required"
];

export default function MarketReportsPage() {
  return (
    <>
      <section className="page-hero page-hero-reports">
        <div className="container">
          <p className="eyebrow">Market Reports</p>
          <h1>Market Intelligence for Cleaning Industry Decisions</h1>
          <p>
            Focused market notes, category research and regional demand signals
            for cleaning industry professionals.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Report areas inside the intelligence platform</h2>
            <p>
              Practical market context for category planning, regional review,
              buyer discussions and sourcing direction.
            </p>
            <div className="tag-list">
              {reports.map((report) => (
                <span className="tag" key={report}>
                  {report}
                </span>
              ))}
            </div>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Research requests</div>
            <h3>Request a Market Note</h3>
            <p>
              Ask for a category, region, buyer channel, or supplier landscape
              note tailored to a specific industry or business question.
            </p>
            <p>
              <Link className="button" href="/contact">
                Request a Market Note
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Popular Report Topics</p>
              <h2>Popular topics for focused market notes</h2>
              <p>
                Common starting points for category, regional and buyer-channel
                questions.
              </p>
            </div>
          </div>
          <div className="tag-list topic-cloud">
            {popularTopics.map((topic) => (
              <span className="tag topic-tag" key={topic}>
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Use Cases</p>
              <h2>Turn market noise into decision context</h2>
              <p>
                Each report should connect market signals with product,
                sourcing, channel, event or media decisions.
              </p>
            </div>
          </div>
          <div className="grid-2">
            {useCases.map((item) => (
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
              <p className="eyebrow">Sample Report Library</p>
              <h2>Example report formats for a global cleaning industry center</h2>
              <p>
                These sample cards show how market reports can become practical
                business tools instead of abstract documents.
              </p>
            </div>
          </div>
          <div className="report-card-grid">
            {sampleReports.map((item) => (
              <div className="report-card" key={item.title}>
                <div className="meta">{item.meta}</div>
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
            <p className="eyebrow">Research Method</p>
            <h2>Reports should answer a real industry question</h2>
            <p>
              The goal is not to publish heavy documents for their own sake.
              The goal is to turn category movement, regional demand, and
              channel signals into useful context for cleaning professionals.
            </p>
          </div>
          <div className="card">
            <ul className="feature-list">
              {reportMethod.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container grid-2">
          <div className="image-panel image-panel-reports">
            <div>
              <p className="eyebrow">Custom Research Inputs</p>
              <h2>Better questions create better reports</h2>
              <p>
                A focused request helps turn a broad category into a useful
                report that supports product, sourcing, channel, or media
                decisions.
              </p>
            </div>
          </div>
          <div className="card">
            <h3>Include these details</h3>
            <ul className="feature-list">
              {reportInputs.map((item) => (
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
              <h2>Request a Market Note</h2>
              <p>
                Share a category, region, buyer channel, supplier landscape, or
                product trend question that needs practical cleaning industry
                context.
              </p>
            </div>
            <div>
              <Link className="button" href="/contact">
                Request a Market Note
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
