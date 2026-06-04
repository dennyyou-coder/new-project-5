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
    lead: "You Meet 500+ Suppliers At Every Trade Show.",
    yet: "YET",
    result: "You Fly Home With The Same Products You Saw Last Year."
  },
  {
    lead: "You Spend 12 Months Developing A New Product.",
    yet: "YET",
    result: "A Better Product Is Already Ranking On Amazon Before You Even Launch."
  },
  {
    lead: "Your Best-Selling Product Generated Profits For Years.",
    yet: "YET",
    result: "Today It&apos;s The Inventory That&apos;s Draining Your Cash Flow."
  },
  {
    lead: "You Spend 20 Years Building Customer And Channel Relationships.",
    yet: "YET",
    result: "Your Biggest Customer Is Walking Into Your Competitor&apos;s Booth."
  }
];

const industryChanges = [
  {
    icon: "trophy",
    todayIcon: "calendar",
    then: "One Winning Product Could Build A Business.",
    today: "A Winning Product Can Become Inventory Within A Year."
  },
  {
    icon: "factory",
    todayIcon: "users",
    then: "Finding A Reliable Supplier Was The Advantage.",
    today:
      "Every Trade Show Has Hundreds Of Suppliers Selling Similar Products. The Advantage Is Finding What Others Haven&apos;t Seen Yet."
  },
  {
    icon: "handshake",
    todayIcon: "search",
    then: "Most Competitors Were Familiar.",
    today: "A New Chinese Brand Can Reshape An Entire Category In Just A Few Years."
  },
  {
    icon: "user",
    todayIcon: "cpu",
    then: "20 Years Of Experience Made You The Expert.",
    today: "New Technologies Can Rewrite The Rules Overnight."
  },
  {
    icon: "trending",
    todayIcon: "calendar",
    then: "Following The Market Was A Safe Strategy.",
    today: "By The Time The Market Sees A Trend, The Opportunity Is Already Gone."
  }
] satisfies { icon: IconName; todayIcon: IconName; then: string; today: string }[];

const opportunityGroups = [
  {
    label: "E-Commerce Will Win.",
    items: ["China Is Already There.", "The Rest Of The World Is Just A Few Years Behind."]
  },
  {
    label: "China Is The New Innovation Center.",
    items: ["If You Don&apos;t Have R&D And Sourcing In China,", "You Will Fall Behind."]
  },
  {
    label: "Speed Will Beat Size.",
    items: ["The Fastest Brands Will Win.", "Not Necessarily The Biggest Ones."]
  },
  {
    label: "The Biggest Growth Story Hasn&apos;t Happened Yet.",
    items: ["$40 Billion Today.", "$140 Billion In The Next Decade."]
  },
  {
    label: "The Next Industry Giants Haven&apos;t Been Built Yet.",
    items: ["The Biggest Winners Of The Next 10 Years", "May Not Exist Today."]
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
    value: "Events",
    label: "Industry Forums & Events"
  },
  {
    value: "Global",
    label: "Cleaning Network"
  },
  {
    value: "Network",
    label: "Factory & Brand Connections"
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
                  <strong dangerouslySetInnerHTML={{ __html: item.result }} />
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
                    <strong dangerouslySetInnerHTML={{ __html: item.today }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sourcing-report-quote">
            <strong>More Suppliers. More Products. More Competition.</strong>
            <span>The Difference Is No Longer Access. The Difference Is Insight.</span>
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
                The Cleaning Industry Is Growing Faster Than Most People Realize.
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
                <h3 dangerouslySetInnerHTML={{ __html: group.label }} />
                <ul>
                  {group.items.map((item) => (
                    <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
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
              <h2>Why Companies Work With Denny</h2>
              <p>
                Most Companies Need More Than Supplier Lists. They Need Better
                Judgement.
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
            <h2>20+ Years Inside The Global Cleaning Industry.</h2>
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
