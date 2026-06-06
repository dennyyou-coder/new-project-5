import type { Metadata } from "next";
import Link from "next/link";
import { ReportsLeadForm } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "2026 Global Cleaning Industry Report",
  description:
    "Get field-informed cleaning industry intelligence on product opportunities, category movement, supplier signals and market trends."
};

const metrics = [
  { value: "01", label: "Product Opportunities" },
  { value: "02", label: "Market Trends" },
  { value: "03", label: "Supplier Signals" }
];

const insideItems = [
  {
    label: "Report Includes",
    title: "Product Opportunities",
    text: "The categories attracting the most attention and investment.",
    points: ["Pool Cleaning Robots", "Lawn Robots", "Commercial Cleaning"]
  },
  {
    label: "Market Coverage",
    title: "Market Trends",
    text: "Where global demand is moving and why.",
    points: ["US Market", "Europe Market", "Emerging Regions"]
  },
  {
    label: "Sourcing Context",
    title: "Supplier Signals",
    text: "Manufacturing and sourcing shifts worth watching.",
    points: ["Manufacturing Shifts", "ODM Landscape", "Cost Trends"]
  },
  {
    label: "Competitive View",
    title: "Brand Landscape",
    text: "Which brands are gaining momentum across markets.",
    points: ["Leading Brands", "Fast Growing Brands", "New Entrants"]
  }
];

const previewPages = [
  {
    title: "Market Map Preview",
    text: "Category movement and opportunity signals across cleaning segments.",
    type: "map",
    rows: ["Robotic Cleaning", "Outdoor Automation", "Commercial Equipment"]
  },
  {
    title: "Brand Landscape Preview",
    text: "A view of established brands, fast movers and new entrants.",
    type: "chart",
    rows: ["Established Leaders", "Fast Growing Brands", "New Entrants"]
  },
  {
    title: "Supplier Signals Preview",
    text: "Manufacturing, ODM and sourcing shifts worth watching.",
    type: "table",
    rows: ["Manufacturing Shifts", "ODM Landscape", "Cost Trends"]
  }
];

const comingSoonReports = [
  { title: "Pool Robots Outlook", expected: "Q3 2026" },
  { title: "Lawn Robots Outlook", expected: "Q3 2026" },
  { title: "Robot Vacuums Outlook", expected: "Q4 2026" },
  { title: "Supplier Guide", expected: "Q4 2026" }
];

export default function ReportsPage() {
  return (
    <main className="reports-page reports-v1-page">
      <section className="reports-v1-hero" id="top">
        <div className="reports-container reports-v1-hero-grid">
          <div className="reports-v1-hero-copy">
            <p className="reports-kicker">Global Cleaning Industry</p>
            <h1>2026 Global Cleaning Industry Report</h1>
            <p>
              Field-informed intelligence on product opportunities, category
              movement, supplier signals and the future of the global cleaning
              industry.
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
            <article className="reports-v1-cover" aria-label="2026 Global Cleaning Industry Report cover">
              <img
                src="/images/reports/reports-category-outlook.png"
                alt=""
              />
              <div>
                <span>PDF Report</span>
                <strong>2026 Global Cleaning Industry Report</strong>
                <ul>
                  <li>Product Opportunities</li>
                  <li>Market Trends</li>
                  <li>Supplier Signals</li>
                </ul>
                <small>Product Opportunities / Market Trends / Supplier Signals</small>
                <em>Free Download / 2026 Edition</em>
              </div>
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
            <h2>Built From Front-Line Industry Signals</h2>
          </div>
          <ul>
            <li>Inside The Industry Since 2006</li>
            <li>Industry Analysis Since 2018</li>
            <li>Products, Suppliers, Brands And Forums Tracked</li>
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
          <Link className="reports-v1-inline-cta" href="#get-report">
            Get Free Reports
          </Link>
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
              A quick look at selected preview pages built from product
              signals, supplier observations, category movement and trade show
              activity.
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
              Download the 2026 report today and join our industry intelligence list.
              <br />
              Future briefs will focus on field-informed category outlooks,
              supplier guides and market updates as they are released.
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
          <h2>Unlock the full report by email.</h2>
          <p>
            Enter your work email to receive the download link and future
            cleaning industry intelligence updates.
          </p>
          <ReportsLeadForm />
          <small>Free PDF / No spam / Industry updates only</small>
        </div>
      </section>
    </main>
  );
}
