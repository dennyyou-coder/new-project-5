import type { Metadata } from "next";
import { ReportsLeadForm, TallyReportButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "The Next Decade of Cleaning Growth Report",
  description:
    "Download the World Clean Biz report on cleaning industry growth across indoor cleaning, yard robots, pool robots, commercial cleaning and China supply-chain capability."
};

const metrics = [
  { value: "13", label: "Pages" },
  { value: "5", label: "Product Lines" },
  { value: "2026E", label: "Scenario Base" }
];

const insideItems = [
  {
    label: "Market Evidence",
    title: "The Trillion-Yuan Scenario",
    text: "A sourced view of the long-term smart cleaning appliance opportunity and the boundaries of WCB's scenario extrapolation.",
    points: ["RMB 247.5B 2026E base", "RMB 992.6B 2036E scenario", "No forced category summation"]
  },
  {
    label: "Product Lines",
    title: "Where Growth Is Spreading",
    text: "The report separates the market into indoor cleaning, yard cleaning, pool cleaning, commercial cleaning and home cleaning systems.",
    points: ["Indoor cleaning base", "Yard and pool growth", "Commercial ROI logic"]
  },
  {
    label: "Representative Players",
    title: "Brand and Category Map",
    text: "Representative brands are used to explain product-line structure, not to imply market ranking or recommendation.",
    points: ["Robot vacuum leaders", "Mower robot players", "Pool and commercial specialists"]
  },
  {
    label: "Sourcing Context",
    title: "Buyer and Supplier Checklists",
    text: "The final sections turn market judgment into sourcing questions, supplier-pack requirements and WCB service context.",
    points: ["Certification and QC", "After-sales responsibility", "Supplier communication"]
  }
];

const previewPages = [
  {
    title: "Market Evidence",
    text: "A sourced scenario view of smart cleaning appliance growth and the limits of headline market-size interpretation.",
    type: "map",
    rows: ["2026E scenario base", "2036E extrapolation", "Research boundaries"]
  },
  {
    title: "Product-Line Map",
    text: "A practical map of indoor, yard, pool and commercial cleaning opportunities.",
    type: "chart",
    rows: ["Indoor cleaning", "Yard cleaning", "Pool cleaning"]
  },
  {
    title: "Buyer Checklist",
    text: "Questions overseas buyers should ask before evaluating cleaning product suppliers.",
    type: "table",
    rows: ["Product-line fit", "Certification coverage", "Spare parts and service"]
  }
];

const comingSoonReports = [
  { title: "Pool Robot Channels And Service Costs", expected: "Next brief" },
  { title: "Robotic Lawn Mower Supply Chains", expected: "Next brief" },
  { title: "Commercial Cleaning Robot ROI Model", expected: "Next brief" },
  { title: "China Cleaning Supplier Pack", expected: "Next brief" }
];

export default function ReportsPage() {
  return (
    <main className="reports-page reports-v1-page">
      <section className="reports-v1-hero" id="top">
        <div className="reports-container reports-v1-hero-grid">
          <div className="reports-v1-hero-copy">
            <p className="reports-kicker">Global Cleaning Industry</p>
            <h1>The Next Decade of Cleaning Growth</h1>
            <p>
              A World Clean Biz report on how growth is spreading from indoor
              cleaning into yard robots, pool robots and commercial cleaning,
              and what overseas buyers should understand about China&apos;s
              cleaning supply chain.
            </p>
            <div className="reports-v1-metrics" aria-label="Report credibility">
              {metrics.map((item) => (
                <span key={item.label}>
                  <strong>{item.value}</strong>
                  {item.label}
                </span>
              ))}
            </div>
            <ReportsLeadForm />
          </div>

          <div className="reports-v1-cover-wrap">
            <article className="reports-v1-cover reports-v1-cover-full" aria-label="The Next Decade of Cleaning Growth report cover">
              <img
                src="/images/reports/wcb-cleaning-industry-growth-map-cover.png"
                alt="World Clean Biz report cover: The Next Decade of Cleaning Growth"
              />
            </article>
          </div>
        </div>
      </section>

      <section className="reports-v1-author-section">
        <div className="reports-container reports-v1-author-strip">
          <div className="reports-v1-author-mark" aria-hidden="true">
            DY
          </div>
          <div>
            <p className="reports-kicker">Compiled by Denny You</p>
            <h2>Built For Buyers Reading The Cleaning Supply Chain</h2>
          </div>
          <ul>
            <li>Inside The Industry Since 2006</li>
            <li>Industry Analysis Since 2018</li>
            <li>Products, Suppliers, Brands And Trade Shows Tracked</li>
          </ul>
        </div>
      </section>

      <section className="reports-v1-section">
        <div className="reports-container">
          <div className="reports-v1-section-head">
            <p className="reports-kicker">Inside The Report</p>
            <h2>What&apos;s Inside The Report</h2>
          </div>
          <div className="reports-v1-inside-grid">
            {insideItems.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <TallyReportButton
            className="reports-v1-inline-cta"
            ctaLocation="reports_inline"
            reportId="next-decade-cleaning-growth"
          >
            Get The Report
          </TallyReportButton>
        </div>
      </section>

      <section className="reports-v1-section reports-v2-preview-section">
        <div className="reports-container">
          <div className="reports-v1-section-head reports-v1-section-head-row">
            <div>
              <p className="reports-kicker">Report Preview</p>
              <h2>Preview The Report</h2>
            </div>
            <p>
              The report is written as a practical market map, not a generic
              trend deck. It combines sourced data, representative product
              lines and sourcing questions.
            </p>
          </div>
          <div className="reports-v2-preview-grid">
            {previewPages.map((page, index) => (
              <article className={`reports-v2-preview-card reports-v2-preview-${page.type}`} key={page.title}>
                <div>
                  <span>Preview {String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true">World Clean Biz Preview</i>
                  <strong>{page.title}</strong>
                  <p>{page.text}</p>
                  <ul>
                    {page.rows.map((row) => (
                      <li key={row}>{row}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reports-v1-section">
        <div className="reports-container">
          <div className="reports-v1-section-head reports-v1-section-head-row">
            <div>
              <p className="reports-kicker">Coming Soon</p>
              <h2>Upcoming Intelligence Briefs</h2>
            </div>
            <p>
              Download this report today and join the WCB industry intelligence list.
              <br />
              Future briefs will go deeper into category-specific sourcing,
              service models and buyer decision frameworks.
            </p>
          </div>
          <div className="reports-v1-coming-grid">
            {comingSoonReports.map((report) => (
              <article key={report.title}>
                <h3>{report.title}</h3>
                <span>Coming Next</span>
                <p>
                  Expected:
                  <strong>{report.expected}</strong>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reports-v2-final-cta">
        <div className="reports-container" id="get-report">
          <p className="reports-kicker">Ready To Download?</p>
          <h2>Get the full WCB report by email.</h2>
          <p>
            Complete the short form to select the report you want and receive
            the PDF link, plus future cleaning industry intelligence updates
            from World Clean Biz.
          </p>
          <ReportsLeadForm />
          <small>Free PDF / No spam / Industry updates only</small>
        </div>
      </section>
    </main>
  );
}
