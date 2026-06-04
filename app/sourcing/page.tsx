import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz to find the next growth opportunity through cleaning industry intelligence, supplier context and market direction."
};

const heroCards = [
  {
    lead: "You Meet 500+ Suppliers At Every Trade Show.",
    yet: "Yet You Fly Home With The Same Products You Saw Last Year."
  },
  {
    lead: "You Spend 12 Months Developing A New Product.",
    yet: "Yet A Better Product Is Already Ranking On Amazon Before You Even Launch."
  },
  {
    lead: "Your Best-Selling Product Generated Profits For Years.",
    yet: "Yet Today It's The Inventory That's Draining Your Cash Flow."
  },
  {
    lead: "You Spend 20 Years Building Customer And Channel Relationships.",
    yet: "Yet Your Biggest Customer Is Walking Into Your Competitor's Booth."
  }
];

const industryChanges = [
  [
    "E-Commerce Will Win.",
    "China Is Already There.",
    "The Rest Of The World Is Just A Few Years Behind."
  ],
  [
    "China Is The New Innovation Center.",
    "If You Don't Have R&D And Sourcing In China,",
    "You Will Fall Behind."
  ],
  [
    "Speed Will Beat Size.",
    "The Fastest Brands Will Win.",
    "Not Necessarily The Biggest Ones."
  ],
  [
    "The Biggest Growth Story Hasn't Happened Yet.",
    "$40 Billion Today.",
    "$140 Billion In The Next Decade."
  ],
  [
    "The Next Industry Giants Haven't Been Built Yet.",
    "The Biggest Winners Of The Next 10 Years",
    "May Not Exist Today."
  ]
];

const opportunities = [
  {
    title: "Robotic Vacuums",
    text: "The Category That Started The Smart Cleaning Revolution."
  },
  {
    title: "Floor Washers",
    text: "One Of China's Fastest Growing Cleaning Categories. Now Expanding Globally."
  },
  {
    title: "Pool Cleaning Robots",
    text: "Still Early. Growing Fast."
  },
  {
    title: "Lawn Robots",
    text: "The Next Major Outdoor Robotics Category."
  },
  {
    title: "Commercial Cleaning Automation",
    text: "A Multi-Billion Dollar Market Just Beginning To Transform."
  },
  {
    title: "What's Next?",
    text: "The Opportunities Most Companies Haven't Seen Yet."
  }
];

const dennyValues = [
  {
    title: "See Opportunities Earlier.",
    text: "Before They Become Crowded."
  },
  {
    title: "Understand Market Direction.",
    text: "Before Competitors Do."
  },
  {
    title: "Access China's Best Innovation Ecosystem.",
    text: "Without Building A Large Team."
  },
  {
    title: "Avoid Expensive Product Mistakes.",
    text: "Before They Become Inventory."
  },
  {
    title: "Save Months Of Research.",
    text: "And Years Of Trial And Error."
  }
];

const aboutDenny = [
  "20+ Years In The Cleaning Industry",
  "9,000+ Industry Professionals",
  "Industry Forums & Events",
  "Global Cleaning Network",
  "Founder Of World Clean Biz"
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
          <div className="sourcing-hero-panel">
            <p className="eyebrow">Sourcing</p>
            <h1>
              You&apos;ve Been In The Industry For 20 Years.
              <span>So Why Does It Feel Like You&apos;re Falling Behind?</span>
            </h1>
            <div className="sourcing-hero-card-grid">
              {heroCards.map((item) => (
                <div className="sourcing-hero-card" key={item.lead}>
                  <p>{item.lead}</p>
                  <strong>{item.yet}</strong>
                </div>
              ))}
            </div>
            <div className="sourcing-core-message">
              <span>We Don&apos;t Help You Source Products.</span>
              <strong>We Help You Find The Next Growth Opportunity.</strong>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Talk With Denny
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head sourcing-centered-head">
            <div>
              <p className="eyebrow">Industry Reality</p>
              <h2>The Industry Already Changed.</h2>
              <p>The Rules That Worked 10 Years Ago No Longer Work Today.</p>
            </div>
          </div>
          <div className="sourcing-change-grid">
            {industryChanges.map((lines) => (
              <div className="sourcing-change-card" key={lines[0]}>
                {lines.map((line, index) =>
                  index === 0 ? (
                    <h3 key={line}>{line}</h3>
                  ) : (
                    <p key={line}>{line}</p>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head sourcing-centered-head">
            <div>
              <p className="eyebrow">Opportunity Map</p>
              <h2>The Next $140 Billion Opportunity</h2>
              <p>The Cleaning Industry Is Growing Faster Than Most People Realize.</p>
            </div>
          </div>
          <div className="sourcing-opportunity-map">
            {opportunities.map((item) => (
              <div className="sourcing-opportunity-card" key={item.title}>
                <span />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head sourcing-centered-head">
            <div>
              <p className="eyebrow">Why Denny</p>
              <h2>Why Companies Work With Denny</h2>
              <p>
                The value is not another supplier list. The value is knowing
                which opportunity deserves attention before the market becomes crowded.
              </p>
            </div>
          </div>
          <div className="sourcing-denny-value-grid">
            {dennyValues.map((item) => (
              <div className="case-card sourcing-denny-value-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container sourcing-denny-layout">
          <div className="sourcing-denny-image" aria-label="Industry forum and trade show discussion placeholder" />
          <div className="sourcing-denny-copy">
            <p className="eyebrow">About Denny</p>
            <h2>Denny You</h2>
            <p>
              Denny has spent more than 20 years inside the global cleaning
              industry, connecting brands, factories, distributors and product
              innovators across China and overseas markets.
            </p>
            <div className="sourcing-about-list">
              {aboutDenny.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band sourcing-final-cta">
          <div>
            <p className="eyebrow">Talk With Denny</p>
            <h2>The Industry Is Moving Faster Than Ever.</h2>
            <p>
              The question is simple. Will you see the next opportunity before
              everyone else?
            </p>
            <ul className="sourcing-cta-list">
              {finalPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="sourcing-outcome">
              More Opportunities. More Profit. Less Guesswork.
            </strong>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Talk With Denny
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
