import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Cleaning industry market reports covering categories, regions, buyer trends, and channel intelligence."
};

const reports = [
  "Vacuum Cleaner Reports",
  "Robot Vacuum Reports",
  "Floor Care Reports",
  "Pool Cleaning Reports",
  "Commercial Cleaning Reports",
  "Regional Market Reports",
  "Buyer & Channel Reports"
];

const useCases = [
  "Understand category demand before sourcing",
  "Evaluate regional market opportunities",
  "Prepare distributor or buyer discussions",
  "Support product planning and positioning"
];

export default function MarketReportsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Market Reports</p>
          <h1>Cleaning industry reports for market and sourcing decisions</h1>
          <p>
            Category reports, regional market notes, and buyer trend research
            built from ongoing industry observation.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Report areas</h2>
            <p>
              First-phase reports can be used as lead magnets for buyers,
              suppliers, distributors, and partners interested in category
              opportunities.
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
            <div className="module-kicker">Lead magnet in phase 1</div>
            <h3>Request custom research</h3>
            <p>
              Ask for a category, region, buyer channel, or supplier landscape
              report tailored to your business question.
            </p>
            <p>
              <Link className="button" href="/contact">
                Request Report
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Use Cases</p>
              <h2>Reports should help business decisions</h2>
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
    </>
  );
}
