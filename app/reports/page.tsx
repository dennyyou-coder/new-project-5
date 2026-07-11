import type { Metadata } from "next";
import { ReportsLeadForm, TallyReportButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "Free Cleaning Industry Reports & Market Intelligence",
  description:
    "Choose free World Clean Biz reports on cleaning markets, product categories and China supply chains and receive them by email."
};

const upcomingReports = [
  {
    title: "Pool Robot Channels And Service Costs",
    reportId: "pool-robot-channels-service-costs",
    ctaLocation: "reports_card_pool_robots",
    image: "/images/sourcing/pool-robots.png",
    alt: "Pool cleaning robot in a swimming pool",
    audience: "For brands and distributors evaluating the pool robot category.",
    points: ["Channel structure", "Service cost drivers", "Buyer considerations"]
  },
  {
    title: "Robotic Lawn Mower Supply Chains",
    reportId: "robotic-lawn-mower-supply-chains",
    ctaLocation: "reports_card_lawn_mowers",
    image: "/images/sourcing/lawn-robots.png",
    alt: "Robotic lawn mower operating outdoors",
    audience: "For buyers tracking outdoor robotics and emerging suppliers.",
    points: ["Technology paths", "Supplier landscape", "Market entry questions"]
  },
  {
    title: "Commercial Cleaning Robot ROI Model",
    reportId: "commercial-cleaning-robot-roi",
    ctaLocation: "reports_card_commercial_robots",
    image: "/images/sourcing/commercial-cleaning.png",
    alt: "Commercial robotic cleaning equipment",
    audience: "For operators and distributors evaluating commercial automation.",
    points: ["Labor substitution", "Deployment economics", "Operational fit"]
  },
  {
    title: "China Cleaning Supplier Pack",
    reportId: "china-cleaning-supplier-pack",
    ctaLocation: "reports_card_supplier_pack",
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    alt: "Cleaning industry supplier meeting in China",
    audience: "For overseas buyers preparing to evaluate Chinese suppliers.",
    points: ["Supplier questions", "Quality checkpoints", "Sourcing preparation"]
  }
];

const intelligenceBenefits = [
  {
    number: "01",
    title: "Market Signals",
    text: "Understand where demand, technology and category attention are moving."
  },
  {
    number: "02",
    title: "Product Opportunities",
    text: "See product lines and commercial questions worth investigating earlier."
  },
  {
    number: "03",
    title: "China Supply Chains",
    text: "Read supplier and sourcing developments through an industry-specific lens."
  }
];

export default function ReportsPage() {
  return (
    <main className="reports-library-page">
      <section className="reports-library-hero" id="top">
        <div className="reports-container reports-library-hero-grid">
          <div>
            <p className="reports-kicker">World Clean Biz Intelligence Library</p>
            <h1>Free Cleaning Industry Reports</h1>
            <p className="reports-library-hero-intro">
              Choose the reports relevant to your market and receive them by
              email. New category and sourcing intelligence will be added as it
              becomes available.
            </p>
            <a className="reports-library-primary-button" href="#free-reports">
              Explore Free Reports
            </a>
            <ul className="reports-library-trust-list">
              <li>Free PDF reports</li>
              <li>Business and market intelligence</li>
              <li>New reports added regularly</li>
            </ul>
          </div>

          <div className="reports-library-hero-visual" aria-label="World Clean Biz report library">
            <img
              src="/images/reports/wcb-cleaning-industry-growth-map-cover.png"
              alt="World Clean Biz report cover: The Next Decade of Cleaning Growth"
            />
          </div>
        </div>
      </section>

      <section className="reports-library-section reports-library-catalog" id="free-reports">
        <div className="reports-container">
          <div className="reports-library-heading">
            <div>
              <p className="reports-kicker">Choose Your Intelligence</p>
              <h2>Free Reports For Cleaning Industry Decisions</h2>
            </div>
            <p>
              Get the current report now or register your interest in upcoming
              category briefs. You can select more than one report in the form.
            </p>
          </div>

          <article className="reports-library-featured-card">
            <div className="reports-library-featured-cover">
              <img
                src="/images/reports/wcb-cleaning-industry-growth-map-cover.png"
                alt="The Next Decade of Cleaning Growth report cover"
              />
            </div>
            <div className="reports-library-featured-copy">
              <span className="reports-library-status reports-library-status-available">
                Available Now
              </span>
              <p className="reports-kicker">Featured Report · 13 Pages</p>
              <h3>The Next Decade of Cleaning Growth</h3>
              <p>
                A practical view of how cleaning growth is spreading from indoor
                appliances into yard robots, pool robots and commercial cleaning,
                with context for overseas buyers reading China&apos;s supply chain.
              </p>
              <ul>
                <li>2026E market scenario and research boundaries</li>
                <li>Five cleaning product lines and representative players</li>
                <li>Buyer and supplier evaluation checklists</li>
              </ul>
              <TallyReportButton
                className="reports-library-card-button"
                ctaLocation="reports_card_current"
                reportId="next-decade-cleaning-growth"
              >
                Get This Report
              </TallyReportButton>
              <small>Free PDF · Delivered by email</small>
            </div>
          </article>

          <div className="reports-library-upcoming-heading">
            <div>
              <p className="reports-kicker">Coming Soon</p>
              <h2>Register Your Interest Early</h2>
            </div>
            <p>
              Tell us which topics matter to you. We will notify you when the
              selected report becomes available.
            </p>
          </div>

          <div className="reports-library-card-grid">
            {upcomingReports.map((report) => (
              <article className="reports-library-card" key={report.reportId}>
                <div className="reports-library-card-media">
                  <img src={report.image} alt={report.alt} />
                  <span className="reports-library-status">Coming Soon</span>
                </div>
                <div className="reports-library-card-body">
                  <h3>{report.title}</h3>
                  <p>{report.audience}</p>
                  <ul>
                    {report.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <TallyReportButton
                    className="reports-library-card-button reports-library-card-button-secondary"
                    ctaLocation={report.ctaLocation}
                    reportId={report.reportId}
                  >
                    Notify Me When Available
                  </TallyReportButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reports-library-section reports-library-value">
        <div className="reports-container">
          <div className="reports-library-heading reports-library-heading-light">
            <div>
              <p className="reports-kicker">Why World Clean Biz Reports</p>
              <h2>Intelligence Built For Better Business Decisions</h2>
            </div>
            <p>
              Reports combine market evidence with 20 years inside the cleaning
              industry and ongoing exposure to products, suppliers, brands and
              trade shows.
            </p>
          </div>
          <div className="reports-library-benefit-grid">
            {intelligenceBenefits.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="reports-library-author-row">
            <div aria-hidden="true">DY</div>
            <p>
              <strong>Reviewed by Denny You</strong>
              Founder, World Clean Biz · Inside the cleaning industry since 2006
            </p>
          </div>
        </div>
      </section>

      <section className="reports-library-final-cta">
        <div className="reports-container">
          <p className="reports-kicker">Build Your Report List</p>
          <h2>Choose The Reports You Want To Receive.</h2>
          <p>
            Select the current report and any upcoming topics relevant to your
            business. We will use your email only for report delivery and World
            Clean Biz industry intelligence updates.
          </p>
          <ReportsLeadForm />
          <small>Free reports · No spam · Unsubscribe at any time</small>
        </div>
      </section>
    </main>
  );
}
