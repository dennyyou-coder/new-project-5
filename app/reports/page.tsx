import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 Global Cleaning Industry Report",
  description:
    "Get early insights on product opportunities, market trends, supplier signals and the future of the global cleaning industry."
};

const metrics = [
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Suppliers Tracked" },
  { value: "300+", label: "Brands Monitored" }
];

const insideItems = [
  {
    title: "Product Opportunities",
    text: "The categories attracting the most attention and investment.",
    points: ["Pool Cleaning Robots", "Lawn Robots", "Commercial Cleaning"]
  },
  {
    title: "Market Trends",
    text: "Where global demand is moving and why.",
    points: ["US Market", "Europe Market", "Emerging Regions"]
  },
  {
    title: "Supplier Signals",
    text: "Manufacturing and sourcing shifts worth watching.",
    points: ["Manufacturing Shifts", "ODM Landscape", "Cost Trends"]
  },
  {
    title: "Brand Landscape",
    text: "Which brands are gaining momentum across markets.",
    points: ["Leading Brands", "Fast Growing Brands", "New Entrants"]
  }
];

const comingSoonReports = [
  "Pool Robots Outlook",
  "Lawn Robots Outlook",
  "Robot Vacuums Outlook",
  "Supplier Guide"
];

export default function ReportsPage() {
  return (
    <main className="reports-page reports-v1-page">
      <section className="reports-v1-hero">
        <div className="reports-container reports-v1-hero-grid">
          <div className="reports-v1-hero-copy">
            <p className="reports-kicker">Global Cleaning Industry</p>
            <h1>2026 Global Cleaning Industry Report</h1>
            <p>
              Get early insights on product opportunities, market trends,
              supplier signals, and the future of the global cleaning industry.
            </p>
            <div className="reports-v1-metrics" aria-label="Report credibility">
              {metrics.map((item) => (
                <span key={item.label}>
                  <strong>{item.value}</strong>
                  {item.label}
                </span>
              ))}
            </div>
            <form className="reports-v1-hero-form">
              <label htmlFor="reports-v1-email">Email address</label>
              <div>
                <input
                  id="reports-v1-email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                />
                <button type="submit">Unlock Free Report</button>
              </div>
              <p>Enter your email to receive the download link.</p>
            </form>
          </div>

          <div className="reports-v1-cover-wrap">
            <article className="reports-v1-cover" aria-label="2026 Global Cleaning Industry Report cover">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=900&auto=format&fit=crop"
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
            <h2>20 Years In The Cleaning Industry</h2>
          </div>
          <ul>
            <li>Organizer of World Clean Expo</li>
            <li>Industry Researcher & Analyst</li>
            <li>Connected with suppliers, brands and manufacturers</li>
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
            Unlock Free Report
          </Link>
        </div>
      </section>

      <section className="reports-v1-section reports-v1-lead-section" id="get-report">
        <div className="reports-container reports-v1-lead-band">
          <div>
            <p className="reports-kicker">Ready To Download?</p>
            <h2>Unlock the free report by email.</h2>
            <p>
              Enter your details and receive the report download link by email.
            </p>
          </div>
          <form className="reports-v1-lead-form">
            <label>
              Name
              <input name="name" placeholder="Your name" />
            </label>
            <label>
              Email
              <input
                name="email"
                placeholder="name@company.com"
                required
                type="email"
              />
            </label>
            <label>
              Company
              <input name="company" placeholder="Company name" />
            </label>
            <label>
              Country
              <input name="country" placeholder="Country or region" />
            </label>
            <button type="submit">Unlock Free Report</button>
          </form>
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
              Get the 2026 report first, then receive future updates as new
              category reports are released.
            </p>
          </div>
          <div className="reports-v1-coming-grid">
            {comingSoonReports.map((report) => (
              <article key={report}>
                <h3>{report}</h3>
                <span>Coming Next</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
