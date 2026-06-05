import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz to find the next growth opportunity through cleaning industry intelligence, supplier context and market direction."
};

const heroCards = [
  {
    number: "01",
    lead: "You Meet 500+ Suppliers At Every Trade Show.",
    yet: "Yet",
    result: "You Fly Home With The Same Products You Saw Last Year."
  },
  {
    number: "02",
    lead: "You Spend 12 Months Developing A New Product.",
    yet: "Yet",
    result: "A Better Product Is Already Ranking On Amazon Before You Even Launch."
  },
  {
    number: "03",
    lead: "Your Best-Selling Product Generated Profits For Years.",
    yet: "Yet",
    result: "Today It&apos;s The Inventory That&apos;s Draining Your Cash Flow."
  },
  {
    number: "04",
    lead: "You Spend 20 Years Building Customer And Channel Relationships.",
    yet: "Yet",
    result: "Your Biggest Customer Is Walking Into Your Competitor&apos;s Booth."
  }
];

const industryChanges = [
  {
    then: "One Winning Product Could Build A Business.",
    today: "A Winning Product Can Become Inventory Within A Year."
  },
  {
    then: "Finding A Reliable Supplier Was The Advantage.",
    today:
      "Every Trade Show Has Hundreds Of Suppliers Selling Similar Products. The Advantage Is Finding What Others Haven&apos;t Seen Yet."
  },
  {
    then: "Most Competitors Were Familiar.",
    today: "A New Chinese Brand Can Reshape An Entire Category In Just A Few Years."
  },
  {
    then: "20 Years Of Experience Made You The Expert.",
    today: "New Technologies Can Rewrite The Rules Overnight."
  },
  {
    then: "Following The Market Was A Safe Strategy.",
    today: "By The Time The Market Sees A Trend, The Opportunity Is Already Gone."
  }
];

const winnerSignals = [
  "E-Commerce Will Win.",
  "China Is Becoming The Innovation Center.",
  "Speed Will Beat Size.",
  "The Biggest Growth Story Hasn&apos;t Happened Yet.",
  "The Next Industry Giants May Not Exist Today."
];

const productOpportunities = [
  {
    title: "Pool Robots",
    description: "Automation is moving from indoor cleaning into outdoor maintenance categories.",
    href: "/sourcing/pool-robots",
    className: "sourcing-product-pool"
  },
  {
    title: "Lawn Robots",
    description: "Outdoor robotics is becoming a new category frontier for cleaning-adjacent brands.",
    href: "/sourcing/lawn-robots",
    className: "sourcing-product-lawn"
  },
  {
    title: "Floor Washers",
    description: "Floor care is shifting toward wet cleaning, smarter formats and faster replacement cycles.",
    href: "/sourcing/floor-washers",
    className: "sourcing-product-floor"
  },
  {
    title: "Robotic Vacuums",
    description: "Home cleaning robotics continues to shape consumer expectations and retail competition.",
    href: "/sourcing/robotic-vacuums",
    className: "sourcing-product-robot"
  },
  {
    title: "Commercial Cleaning",
    description: "Labor pressure and productivity needs are creating demand for commercial automation.",
    href: "/sourcing/commercial-cleaning",
    className: "sourcing-product-commercial"
  },
  {
    title: "Vacuum Cleaners",
    description: "A mature category is still being reshaped by channels, price pressure and product upgrades.",
    href: "/sourcing/vacuum-cleaners",
    className: "sourcing-product-vacuum"
  }
];

const intelligenceSources = [
  {
    label: "See What Most Companies Miss.",
    detail: "Before Everyone Starts Talking About It."
  },
  {
    label: "Understand Which Trends Actually Matter.",
    detail: "And Ignore The Ones That Don&apos;t."
  },
  {
    label: "Know Which Products Are Worth Building.",
    detail: "Before Spending A Year Building The Wrong One."
  },
  {
    label: "Access The Factories Behind Leading Brands.",
    detail: "Without Spending Years Building The Network Yourself."
  },
  {
    label: "See The Market Earlier.",
    detail: "Because Timing Matters More Than Ever."
  }
];

const finalPoints = [
  "Discover Opportunities Earlier",
  "Understand Market Changes Earlier",
  "Build Better Products",
  "Access The Right Partners"
];

export default function SourcingPage() {
  return (
    <>
      <section className="sourcing-hero-final">
        <div className="container">
          <div className="sourcing-hero-layout">
            <div className="sourcing-hero-panel">
              <div>
                <p className="eyebrow">Sourcing</p>
                <h1>
                  You&apos;ve Been In The Industry
                  <span>For 20 Years.</span>
                  <span>
                    So Why Does It Feel Like
                    <br />
                    You&apos;re Falling Behind?
                  </span>
                </h1>
                <p className="sourcing-hero-intro">
                  Experience used to be your advantage.
                  <span>But the industry has changed.</span>
                </p>
              </div>
              <div className="sourcing-hero-card-grid">
                {heroCards.map((item) => (
                  <div className="sourcing-hero-card" key={item.lead}>
                    <span>{item.number}</span>
                    <p>{item.lead}</p>
                    <em>{item.yet}</em>
                    <strong dangerouslySetInnerHTML={{ __html: item.result }} />
                  </div>
                ))}
              </div>
              <div className="sourcing-hero-question">
                <span>The Industry Already Changed.</span>
                <strong>Did You?</strong>
              </div>
              <div className="sourcing-hero-bottom">
                <Link className="button" href="/contact">
                  Talk With Denny
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section sourcing-rule-section">
        <div className="container">
          <div className="sourcing-report-head">
            <div>
              <p className="eyebrow">Market Reality</p>
              <h2>The Industry Already Changed.</h2>
            </div>
            <p>
              The Rules That Worked 10 Years Ago
              <span>No Longer Work Today.</span>
            </p>
          </div>
          <div className="sourcing-rule-table">
            {industryChanges.map((item) => (
              <div className="sourcing-rule-row" key={item.then}>
                <div className="sourcing-old-rule">
                  <div>
                    <span>Then</span>
                    <strong>{item.then}</strong>
                  </div>
                </div>
                <div className="sourcing-rule-arrow">→</div>
                <div className="sourcing-new-rule">
                  <div>
                    <span>Today</span>
                    <strong dangerouslySetInnerHTML={{ __html: item.today }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sourcing-report-quote">
            <strong>
              More Suppliers.
              <span>More Products.</span>
              <span>More Competition.</span>
            </strong>
            <p>
              The Difference Is No Longer Access.
              <span>The Difference Is Insight.</span>
            </p>
          </div>
          <div className="sourcing-winners">
            <p className="eyebrow">What The Winners Already Know</p>
            <ul>
              {winnerSignals.map((item) => (
                <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section sourcing-opportunity-section">
        <div className="container">
          <div className="sourcing-opportunity-head">
            <div>
              <p className="eyebrow">Opportunity Map</p>
              <h2>The Next $140 Billion Product Opportunity</h2>
              <p>
                Not Every Category Will Win.
                <span>These Are The Markets We Are Watching Closely.</span>
              </p>
            </div>
          </div>
          <div className="sourcing-product-grid">
            {productOpportunities.map((item) => (
              <Link className="sourcing-product-item" href={item.href} key={item.title}>
                <span className={`sourcing-product-image ${item.className}`} aria-hidden="true" />
                <span>
                  <strong>{item.title}</strong>
                  <em>{item.description}</em>
                  <span>Explore →</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section sourcing-denny-section">
        <div className="container">
          <div className="section-head sourcing-denny-head">
            <div>
              <p className="eyebrow">Why Denny Sees It Earlier</p>
              <h2>Why Denny Sees It Earlier</h2>
            </div>
          </div>
          <div className="sourcing-denny-v2">
            <div className="sourcing-denny-profile">
              <div className="sourcing-denny-photo" aria-hidden="true" />
              <strong>Denny You</strong>
              <dl>
                <div>
                  <dt>20+ Years</dt>
                  <dd>Inside The Global Cleaning Industry</dd>
                </div>
                <div>
                  <dt>9,000+</dt>
                  <dd>Industry Professionals</dd>
                </div>
                <div>
                  <dt>Founder</dt>
                  <dd>Of World Clean Biz</dd>
                </div>
              </dl>
              <p>
                Denny has spent more than 20 years inside the global cleaning
                industry, connecting brands, factories, distributors and
                innovators across China and overseas markets.
              </p>
            </div>
            <div className="sourcing-denny-signals">
              {intelligenceSources.map((item, index) => (
                <div className="sourcing-denny-signal" key={item.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section sourcing-cta-section">
        <div className="container cta-band sourcing-final-cta sourcing-action-cta">
          <div>
            <p className="eyebrow">Next Step</p>
            <h2>
              The Next Industry Giant Is Being Built Right Now.
              <span>Will You Be Part Of It?</span>
            </h2>
            <ul className="sourcing-cta-list">
              {finalPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <Link className="button" href="/contact">
              Talk With Denny
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
