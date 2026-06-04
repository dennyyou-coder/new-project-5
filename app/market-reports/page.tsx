import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Market Reports",
  description:
    "Free market reports, category insights and opportunity analysis for cleaning industry buyers, brands, distributors and professionals."
};

const featuredHighlights: { icon: IconName; label: string }[] = [
  { icon: "trending", label: "Market Growth Trends" },
  { icon: "badge", label: "Leading Brands" },
  { icon: "factory", label: "Supplier Landscape" },
  { icon: "target", label: "Product Opportunities" },
  { icon: "telescope", label: "Future Outlook" }
];

const popularReports = [
  {
    icon: "file",
    title: "European Pool Cleaner Market Overview",
    text: "A focused look at pool cleaner demand, product categories, buyer channels and regional opportunity signals."
  },
  {
    icon: "file",
    title: "Global Robot Vacuum Market Outlook",
    text: "Understand category movement, navigation trends, premium features, supplier shifts and product opportunities."
  },
  {
    icon: "file",
    title: "Floor Care Market Trends",
    text: "Track floor washer, scrubber, carpet cleaner and commercial floor care signals across key buyer channels."
  },
  {
    icon: "file",
    title: "Private Label Opportunities In Cleaning Products",
    text: "Explore product categories, OEM and ODM paths, supplier context and private label opportunities."
  }
] satisfies { icon: IconName; title: string; text: string }[];

const learnItems: { icon: IconName; label: string }[] = [
  { icon: "trending", label: "Market Size & Growth" },
  { icon: "activity", label: "Category Trends" },
  { icon: "badge", label: "Leading Brands" },
  { icon: "factory", label: "Supplier Landscape" },
  { icon: "network", label: "Channel Developments" },
  { icon: "cpu", label: "Technology Shifts" },
  { icon: "target", label: "Private Label Opportunities" },
  { icon: "boxes", label: "Emerging Product Categories" }
];

const audienceItems: { icon: IconName; label: string }[] = [
  { icon: "users", label: "Brands" },
  { icon: "users", label: "Importers" },
  { icon: "users", label: "Distributors" },
  { icon: "users", label: "Retailers" },
  { icon: "users", label: "Product Managers" },
  { icon: "users", label: "Investors" },
  { icon: "users", label: "OEM / ODM Buyers" }
];

export default function MarketReportsPage() {
  return (
    <>
      <section className="page-hero page-hero-reports">
        <div className="container">
          <p className="eyebrow">Market Reports</p>
          <h1>Market Intelligence For Better Business Decisions</h1>
          <p>
            Free market reports, category insights and opportunity analysis for
            buyers, brands, distributors and cleaning industry professionals.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#free-report">
              Get Free Report
            </Link>
            <Link className="button-secondary" href="/contact">
              Request Market Note
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="featured-report-card">
            <div>
              <p className="eyebrow">
                <InlineIcon name="file" />
                Featured Report
              </p>
              <h2>2026 Global Pool Cleaning Market Overview</h2>
              <p>
                Understand market trends, leading brands, supplier landscape,
                product opportunities and future growth drivers.
              </p>
              <ul className="feature-list report-highlight-list">
                {featuredHighlights.map((item) => (
                  <li key={item.label}>
                    <InlineIcon name={item.icon} />
                    {item.label}
                  </li>
                ))}
              </ul>
              <Link className="button" href="#free-report">
                Get Free Report
              </Link>
            </div>
            <div className="image-panel image-panel-reports">
              <div>
                <p className="eyebrow">Free Industry Report</p>
                <h3>Pool cleaning opportunity signals for 2026</h3>
                <p>
                  Built for industry professionals who need earlier market
                  context before product and sourcing decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Popular Reports</p>
              <h2>Free reports for cleaning industry opportunity discovery</h2>
              <p>
                Start with a report, then turn useful market context into a
                sourcing question, category decision or business conversation.
              </p>
            </div>
          </div>
          <div className="report-card-grid">
            {popularReports.map((report) => (
              <div className="report-card" key={report.title}>
                <IconBadge name={report.icon} />
                <h3>{report.title}</h3>
                <p>{report.text}</p>
                <Link href="#free-report">Get Free Report</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">What You'll Learn</p>
            <h2>Signals that help buyers and brands see opportunities earlier</h2>
            <p>
              These reports are designed to organize market movement, category
              trends, supplier context and product opportunities into useful
              business intelligence.
            </p>
          </div>
          <div className="module-grid">
            {learnItems.map((item) => (
              <div className="module-chip" key={item.label}>
                <InlineIcon name={item.icon} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Who These Reports Are For</p>
              <h2>Built For Industry Decision Makers</h2>
              <p>
                Free market intelligence for people making product, sourcing,
                channel, investment and category decisions.
              </p>
            </div>
          </div>
          <div className="module-grid audience-chip-grid">
            {audienceItems.map((item) => (
              <div className="module-chip" key={item.label}>
                <InlineIcon name={item.icon} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="free-report">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">
              <InlineIcon name="mail" />
              Get Instant Access
            </p>
            <h2>Receive the report directly in your inbox</h2>
            <p>
              Enter your details below and receive the report directly in your
              inbox.
            </p>
            <p className="meta">
              This report is provided free of charge for industry professionals.
            </p>
          </div>
          <form className="form report-capture-form">
            <label>
              Name
              <input name="name" placeholder="Your name" required />
            </label>
            <label>
              Company
              <input name="company" placeholder="Company name" required />
            </label>
            <label>
              Email
              <input name="email" placeholder="name@company.com" type="email" required />
            </label>
            <label>
              Country
              <input name="country" placeholder="Country or region" required />
            </label>
            <button className="button" type="submit">
              Send Me The Report
            </button>
          </form>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container cta-band market-note-band">
          <div className="grid-2">
            <div>
              <p className="eyebrow">
                <InlineIcon name="clipboard" />
                Custom Market Request
              </p>
              <h2>Need Information About A Specific Market?</h2>
              <p>
                Looking for information about a specific category, country or
                product opportunity? Tell us what you are exploring and we may
                prepare a future market note.
              </p>
            </div>
            <div>
              <Link className="button" href="/contact">
                Request Market Note
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <IconBadge name="trending" />
              <h2>The Best Opportunities Are Usually Identified Early</h2>
              <p>
                Most companies discover opportunities after everyone is already
                talking about them. The most successful companies discover them
                before the market notices. Get the latest market intelligence
                and stay ahead of the industry.
              </p>
            </div>
            <div>
              <Link className="button" href="#free-report">
                Get Free Report
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
