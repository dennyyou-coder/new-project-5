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
    then: "One Great Product Could Drive Growth For Years.",
    today: "A Product Advantage Can Disappear In Months."
  },
  {
    then: "Finding Suppliers Was The Challenge.",
    today: "500 Suppliers Offer Similar Products. Finding Something Different Is The Challenge."
  },
  {
    then: "Winning A Distributor Meant Winning The Market.",
    today: "Customers Compare Hundreds Of Products Before They Talk To Anyone."
  },
  {
    then: "Industry Experience Created Advantage.",
    today: "Technology Moves Faster Than Experience."
  },
  {
    then: "Following Trends Was Enough.",
    today: "By The Time Everyone Sees A Trend, The Opportunity Is Already Gone."
  }
];

const directionCards = [
  {
    title: "E-Commerce Will Win.",
    text: "China is already there. The rest of the world is just a few years behind.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "China Is The New Innovation Center.",
    text: "If you don't have R&D and sourcing in China, you will fall behind.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "Speed Will Beat Size.",
    text: "The fastest brands will win. Not necessarily the biggest ones.",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "The Biggest Growth Story Hasn't Happened Yet.",
    text: "$40 Billion today. $140 Billion in the next decade.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop"
  },
  {
    title: "The Next Industry Giants Haven't Been Built Yet.",
    text: "The biggest winners of the next 10 years may not exist today.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=900&auto=format&fit=crop"
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
            <p className="sourcing-hero-subcopy">
              Experience used to be your advantage. But the industry has changed.
            </p>
            <div className="sourcing-hero-card-grid">
              {heroCards.map((item, index) => (
                <div className="sourcing-hero-card" key={item.lead}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
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
              <p className="eyebrow">The Industry Already Changed</p>
              <h2>The Industry Already Changed.</h2>
            </div>
            <p>The Rules That Worked 10 Years Ago No Longer Work Today.</p>
          </div>
          <div className="sourcing-rule-table">
            {industryChanges.map((item, index) => (
              <div className="sourcing-rule-row" key={item.then}>
                <div className="sourcing-old-rule">
                  <span>Then</span>
                  <strong>{item.then}</strong>
                </div>
                <div className="sourcing-rule-arrow">→</div>
                <div className="sourcing-new-rule">
                  <span>Today</span>
                  <strong>{item.today}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="sourcing-report-quote">
            <strong>More Suppliers. More Products. More Competition.</strong>
            <span>The winners aren&apos;t working harder. They&apos;re seeing what&apos;s next earlier.</span>
          </div>
        </div>
      </section>

      <section className="section sourcing-direction-section">
        <div className="container">
          <div className="sourcing-direction-head">
            <div>
              <p className="eyebrow">Where The Industry Is Heading</p>
              <h2>Where The Industry Is Heading.</h2>
              <p>
                These are the changes I believe will reshape the cleaning
                industry over the next 10 years.
              </p>
            </div>
          </div>
          <div className="sourcing-direction-card-row">
            {directionCards.map((item, index) => (
              <div className="sourcing-direction-card" key={item.title}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <img src={item.image} alt={`${item.title} visual`} />
              </div>
            ))}
          </div>
          <div className="sourcing-direction-quote">
            <span>“</span>
            <strong>
              The world is changing fast. The opportunity belongs to those who
              <em> see it earlier.</em>
            </strong>
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
