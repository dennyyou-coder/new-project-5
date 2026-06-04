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
  {
    oldRule: "Offline channels define winners.",
    newRule: [
      "E-Commerce Will Win.",
      "China Is Already There.",
      "The Rest Of The World Is Just A Few Years Behind."
    ]
  },
  {
    oldRule: "Innovation follows mature overseas markets.",
    newRule: [
      "China Is The New Innovation Center.",
      "If You Don't Have R&D And Sourcing In China,",
      "You Will Fall Behind."
    ]
  },
  {
    oldRule: "The biggest companies control the category.",
    newRule: [
      "Speed Will Beat Size.",
      "The Fastest Brands Will Win.",
      "Not Necessarily The Biggest Ones."
    ]
  },
  {
    oldRule: "Cleaning is a stable, slow-growth market.",
    newRule: [
      "The Biggest Growth Story Hasn't Happened Yet.",
      "$40 Billion Today.",
      "$140 Billion In The Next Decade."
    ]
  },
  {
    oldRule: "The category leaders are already decided.",
    newRule: [
      "The Next Industry Giants Haven't Been Built Yet.",
      "The Biggest Winners Of The Next 10 Years",
      "May Not Exist Today."
    ]
  }
];

const opportunityGroups = [
  {
    group: "Home Cleaning",
    signal: "Smart cleaning moves from single products into connected home systems.",
    items: [
      {
        title: "Robotic Vacuums",
        text: "The Category That Started The Smart Cleaning Revolution."
      },
      {
        title: "Floor Washers",
        text: "One Of China's Fastest Growing Cleaning Categories. Now Expanding Globally."
      }
    ]
  },
  {
    group: "Outdoor Cleaning",
    signal: "Outdoor maintenance is becoming the next robotics frontier.",
    items: [
      {
        title: "Pool Cleaning Robots",
        text: "Still Early. Growing Fast."
      },
      {
        title: "Lawn Robots",
        text: "The Next Major Outdoor Robotics Category."
      }
    ]
  },
  {
    group: "Commercial Cleaning",
    signal: "Labor pressure and facility standards are pushing automation into professional environments.",
    items: [
      {
        title: "Commercial Cleaning Automation",
        text: "A Multi-Billion Dollar Market Just Beginning To Transform."
      }
    ]
  },
  {
    group: "Emerging Opportunities",
    signal: "The next wave will come from categories most companies are not tracking yet.",
    items: [
      {
        title: "What's Next?",
        text: "The Opportunities Most Companies Haven't Seen Yet."
      }
    ]
  }
];

const dennyValues = [
  {
    title: "See What Most Companies Miss",
    text: "Signals from factories, brands, trade shows, channels and China innovation before they become obvious."
  },
  {
    title: "Understand Which Trends Actually Matter",
    text: "Separate real market direction from temporary product noise and supplier claims."
  },
  {
    title: "Know Which Products Are Worth Building",
    text: "Evaluate whether an opportunity can become a profitable product business."
  },
  {
    title: "Access The Factories Behind Leading Brands",
    text: "Use industry relationships to understand who is capable, who is moving and who is worth watching."
  },
  {
    title: "Avoid Building The Wrong Product",
    text: "Reduce the risk of spending a year on a product that becomes inventory instead of profit."
  }
];

const aboutDenny = [
  {
    value: "20+",
    label: "Years In The Industry"
  },
  {
    value: "9,000+",
    label: "Industry Professionals"
  },
  {
    value: "500+",
    label: "Factory Visits"
  },
  {
    value: "Global",
    label: "Cleaning Network"
  },
  {
    value: "Founder",
    label: "World Clean Biz"
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
          <div className="sourcing-report-head">
            <div>
              <p className="eyebrow">Industry Reality</p>
              <h2>The Industry Already Changed.</h2>
            </div>
            <p>The Rules That Worked 10 Years Ago No Longer Work Today.</p>
          </div>
          <div className="sourcing-rule-table">
            <div className="sourcing-rule-header">
              <span>Old Rule</span>
              <span>New Rule</span>
            </div>
            {industryChanges.map((item) => (
              <div className="sourcing-rule-row" key={item.oldRule}>
                <div className="sourcing-old-rule">{item.oldRule}</div>
                <div className="sourcing-new-rule">
                  {item.newRule.map((line, index) =>
                    index === 0 ? (
                      <strong key={line}>{line}</strong>
                    ) : (
                      <span key={line}>{line}</span>
                    )
                  )}
                </div>
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
          <div className="sourcing-market-map">
            <div className="sourcing-market-center">
              <span>Opportunity Map</span>
              <strong>$140B</strong>
              <p>Next-decade cleaning industry growth potential</p>
            </div>
            {opportunityGroups.map((group) => (
              <div className="sourcing-market-group" key={group.group}>
                <h3>{group.group}</h3>
                <p>{group.signal}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
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
          <div className="sourcing-advantage-map">
            <div className="sourcing-advantage-core">
              <span>Denny Connects</span>
              <strong>Factories</strong>
              <strong>Brands</strong>
              <strong>Markets</strong>
              <strong>Events</strong>
            </div>
            <div className="sourcing-advantage-list">
              {dennyValues.map((item) => (
                <div className="sourcing-advantage-row" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container sourcing-authority-layout">
          <div className="sourcing-denny-image" aria-label="Industry forum and trade show discussion placeholder" />
          <div>
            <p className="eyebrow">About Denny</p>
            <h2>Denny You</h2>
            <p>
              Denny has spent more than 20 years inside the global cleaning
              industry, connecting brands, factories, distributors and product
              innovators across China and overseas markets.
            </p>
            <div className="sourcing-authority-metrics">
              {aboutDenny.map((item) => (
                <div className="sourcing-authority-metric" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band sourcing-final-cta sourcing-action-cta">
          <div>
            <p className="eyebrow">Action</p>
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
