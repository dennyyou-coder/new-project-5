import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz to find the next growth opportunity through cleaning industry intelligence, supplier context and market direction."
};

const heroCards = [
  {
    lead: "500+ Suppliers",
    yet: "YET",
    result: "The Same Products"
  },
  {
    lead: "12 Months Developing",
    yet: "YET",
    result: "A Better Product Already Ranks"
  },
  {
    lead: "Years Of Profit",
    yet: "YET",
    result: "Inventory Drains Cash"
  },
  {
    lead: "20 Years Of Relationships",
    yet: "YET",
    result: "Customers Walk To Competitors"
  }
];

const industryChanges = [
  {
    icon: "trophy",
    todayIcon: "calendar",
    then: "One Great Product Could Drive Growth For Years.",
    today: "A Product Advantage Can Disappear In Months."
  },
  {
    icon: "factory",
    todayIcon: "users",
    then: "Finding Suppliers Was The Challenge.",
    today: "500 Suppliers Offer Similar Products. Finding Something Different Is The Challenge."
  },
  {
    icon: "handshake",
    todayIcon: "search",
    then: "Winning A Distributor Meant Winning The Market.",
    today: "Customers Compare Hundreds Of Products Before They Talk To Anyone."
  },
  {
    icon: "user",
    todayIcon: "cpu",
    then: "Industry Experience Created Advantage.",
    today: "Technology Moves Faster Than Experience."
  },
  {
    icon: "trending",
    todayIcon: "calendar",
    then: "Following Trends Was Enough.",
    today: "By The Time Everyone Sees A Trend, The Opportunity Is Already Gone."
  }
] satisfies { icon: IconName; todayIcon: IconName; then: string; today: string }[];

const opportunityGroups = [
  {
    label: "Home Cleaning",
    items: ["Robotic Vacuums", "Floor Washers"]
  },
  {
    label: "Outdoor Cleaning",
    items: ["Pool Robots", "Lawn Robots"]
  },
  {
    label: "Commercial Cleaning",
    items: ["Automation", "Robotics"]
  },
  {
    label: "Emerging Opportunities",
    items: ["What's Next", "Future Categories"]
  }
];

const intelligenceSources = [
  {
    label: "Factory Network",
    detail: "Supplier movement, product upgrades and manufacturing capability."
  },
  {
    label: "Brand Network",
    detail: "What brands are testing, launching and asking factories to build."
  },
  {
    label: "Industry Forums",
    detail: "Signals from product conversations, panels and private discussions."
  },
  {
    label: "Trade Shows",
    detail: "Where products, competitors and category momentum become visible."
  },
  {
    label: "Global Intelligence Network",
    detail: "Connections across buyers, suppliers, distributors and media."
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
                  <em>{item.yet}</em>
                  <strong>{item.result}</strong>
                </div>
              ))}
            </div>
            <div className="sourcing-hero-bottom">
              <Link className="button" href="/contact">
                Talk With Denny <span aria-hidden="true">→</span>
              </Link>
              <div className="sourcing-hero-question">
                <span>The Industry Already Changed.</span>
                <strong>Did You?</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section sourcing-rule-section">
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
                  <div className="sourcing-rule-icon sourcing-rule-icon-muted">
                    <Icon name={item.icon} />
                  </div>
                  <div>
                    <span>Then</span>
                    <strong>{item.then}</strong>
                  </div>
                </div>
                <div className="sourcing-rule-arrow">→</div>
                <div className="sourcing-new-rule">
                  <div className="sourcing-rule-icon sourcing-rule-icon-blue">
                    <Icon name={item.todayIcon} />
                  </div>
                  <div>
                    <span>Today</span>
                    <strong>{item.today}</strong>
                  </div>
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

      <section className="section sourcing-opportunity-section">
        <div className="container">
          <div className="sourcing-opportunity-head">
            <div>
              <p className="eyebrow">Market Opportunity Map</p>
              <h2>The Next $140 Billion Opportunity</h2>
              <p>
                The cleaning industry is no longer one product category. It is
                becoming a connected landscape of home, outdoor, commercial and
                emerging opportunities.
              </p>
            </div>
          </div>
          <div className="sourcing-opportunity-landscape">
            <div className="sourcing-opportunity-center">
              <span>Growth Landscape</span>
              <strong>$140B</strong>
              <p>next-decade cleaning industry opportunity</p>
            </div>
            {opportunityGroups.map((group) => (
              <div className="sourcing-opportunity-node" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
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
              <p className="eyebrow">Authority Network</p>
              <h2>Why Denny Sees Signals Earlier</h2>
              <p>
                This is not about selling a service. It is about the source of
                intelligence: factories, brands, forums, trade shows and
                industry relationships feeding one connected view.
              </p>
            </div>
          </div>
          <div className="sourcing-advantage-map">
            <div className="sourcing-advantage-core">
              <span>Denny You</span>
              <strong>20+ Years</strong>
              <strong>9,000+ Network</strong>
              <strong>Forums</strong>
              <strong>Trade Shows</strong>
            </div>
            <div className="sourcing-advantage-list">
              {intelligenceSources.map((item) => (
                <div className="sourcing-advantage-row" key={item.label}>
                  <h3>{item.label}</h3>
                  <p>{item.detail}</p>
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
            <p className="eyebrow">Industry Authority</p>
            <h2>Denny You</h2>
            <div className="sourcing-authority-metrics">
              {aboutDenny.map((item) => (
                <div className="sourcing-authority-metric" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <p>
              Denny has spent more than 20 years inside the global cleaning
              industry, connecting brands, factories, distributors and product
              innovators across China and overseas markets.
            </p>
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
