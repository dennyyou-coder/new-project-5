import type { Metadata } from "next";
import Link from "next/link";
import { InlineIcon, type IconName } from "@/components/Icon";
import { TALLY_FORMS } from "@/lib/tallyForms";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz on sourcing intelligence shaped by front-line cleaning industry product, supplier and market experience."
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
    result: "Today It's The Inventory That's Draining Your Cash Flow."
  },
  {
    number: "04",
    lead: "You Spend 20 Years Building Customer And Channel Relationships.",
    yet: "Yet",
    result: "Your Biggest Customer Is Walking Into Your Competitor's Booth."
  }
];

const industryChanges = [
  {
    then: "One Winning Product Could Build A Business.",
    today: "A Winning Product Can Become Inventory Within A Year."
  },
  {
    then: "Finding A Reliable Supplier Was The Advantage.",
    today: "Every Trade Show Has Hundreds Of Suppliers Selling Similar Products."
  },
  {
    then: "Most Competitors Were Familiar.",
    today: "A New Chinese Brand Can Reshape A Category In Just A Few Years."
  },
  {
    then: "20 Years Of Experience Made You The Expert.",
    today: "New Technologies Rewrite The Rules Faster Than Ever."
  },
  {
    then: "Following The Market Was Safe.",
    today: "By The Time Everyone Sees A Trend, The Opportunity Is Already Gone."
  }
];

const winnerSignals: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "globe",
    title: "E-Commerce Will Win.",
    description: "China Is Already There. The Rest Of The World Is Just A Few Years Behind."
  },
  {
    icon: "lightbulb",
    title: "China Is Becoming The Innovation Center.",
    description: "If You Don't Have R&D And Sourcing In China, You Will Fall Behind."
  },
  {
    icon: "trending",
    title: "Speed Will Beat Size.",
    description: "The Fastest Brands Will Win. Not Necessarily The Biggest Ones."
  },
  {
    icon: "bar-chart",
    title: "The Biggest Growth Story Hasn't Happened Yet.",
    description: "$40 Billion Today. $140 Billion In The Next Decade."
  },
  {
    icon: "users",
    title: "The Next Industry Giants May Not Exist Today.",
    description: "The Biggest Winners Of The Next 10 Years May Still Be Unknown."
  }
];

const productOpportunities: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  image: string;
}[] = [
  {
    title: "Pool Robots",
    description: "The Category Is Just Getting Started.",
    href: "/sourcing/pool-robots",
    icon: "waves",
    image: "/images/sourcing/pool-robots.png"
  },
  {
    title: "Lawn Robots",
    description: "The Next Outdoor Robotics Market.",
    href: "/sourcing/lawn-robots",
    icon: "sparkles",
    image: "/images/sourcing/lawn-robots.png"
  },
  {
    title: "Floor Washers",
    description: "Still Early Outside China.",
    href: "/sourcing/floor-washers",
    icon: "wind",
    image: "/images/sourcing/floor-washers.png"
  },
  {
    title: "Robotic Vacuums",
    description: "The Industry Is Entering A New Cycle.",
    href: "/sourcing/robotic-vacuums",
    icon: "target",
    image: "/images/sourcing/robotic-vacuums.png"
  },
  {
    title: "Commercial Cleaning",
    description: "Automation Is Just Beginning.",
    href: "/sourcing/commercial-cleaning",
    icon: "building",
    image: "/images/sourcing/commercial-cleaning.png"
  },
  {
    title: "Vacuum Cleaners",
    description: "A Mature Market Facing New Disruption.",
    href: "/sourcing/vacuum-cleaners",
    icon: "layers",
    image: "/images/sourcing/vacuum-cleaners.png"
  }
];

const intelligenceSources = [
  {
    label: "See What Most Companies Miss.",
    detail: "Before Everyone Starts Talking About It."
  },
  {
    label: "Understand Which Trends Actually Matter.",
    detail: "And Ignore The Ones That Don't."
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

const signalSources: { icon: IconName; label: string }[] = [
  { icon: "calendar", label: "Trade Shows Worldwide" },
  { icon: "message", label: "Industry Forums" },
  { icon: "factory", label: "Factory & Brand Connections" }
];

const deliveryPhotos = [
  {
    title: "Industry Signals",
    text: "Trade Shows / Supplier Discovery / Market Trends",
    image: "/images/industry/expo-hall-shenzhen-2026.jpg"
  },
  {
    title: "Product Development",
    text: "Concept / Design / Testing / Iteration",
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg"
  },
  {
    title: "Supply Chain Execution",
    text: "Manufacturing / Quality / Delivery",
    image: "/images/industry/sourcing-product-components-2025.jpg"
  }
];

const deliveryPoints: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "search",
    title: "Find Hot-Selling Products Faster",
    description: "Identify proven product opportunities earlier."
  },
  {
    icon: "dollar",
    title: "Build Exclusive Products",
    description: "Develop differentiated products with stronger margins."
  },
  {
    icon: "radar",
    title: "Turn Market Signals Into Product Ideas",
    description: "Transform industry intelligence into product direction."
  },
  {
    icon: "factory",
    title: "One-Stop Support From Idea To Production",
    description: "Move from concept to manufacturing faster."
  },
  {
    icon: "wrench",
    title: "Improve Quality And Reduce After-Sales Risk",
    description: "Strengthen supplier selection and quality control."
  },
  {
    icon: "newspaper",
    title: "Get Continuous New Product Updates",
    description: "Stay close to category shifts and supplier movement."
  },
  {
    icon: "globe",
    title: "Build Flexible Global Production Options",
    description: "Support production across multiple regions."
  },
  {
    icon: "boxes",
    title: "Control Competitiveness From The Component Supply Chain",
    description: "Create advantage from key components upward."
  }
];

const finalPoints: { icon: IconName; title: string; description?: string }[] = [
  {
    icon: "target",
    title: "Discover Opportunities Earlier"
  },
  {
    icon: "trending",
    title: "Understand Market Changes Earlier"
  },
  {
    icon: "package",
    title: "Build Better Products"
  },
  {
    icon: "handshake",
    title: "Access The Right Partners"
  }
];

export default function SourcingPage() {
  return (
    <main className="sourcing-v3-page">
      <section className="section-hero sourcing-v3-hero">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-hero-copy">
            <p className="sourcing-v3-kicker">Sourcing</p>
            <h1>
              You&apos;ve Been In The Industry For 20 Years.
              <strong>
                So Why Does It Feel Like
                <br />
                You&apos;re Falling Behind?
              </strong>
            </h1>
            <p className="sourcing-v3-hero-subcopy">
              Experience used to be your advantage.
              <span>But the industry has changed.</span>
            </p>
            <div className="sourcing-v3-hero-rows">
              {heroCards.map((item) => (
                <div className="sourcing-v3-hero-row" key={item.lead}>
                  <span>{item.number}</span>
                  <p>
                    <strong>{item.lead}</strong>
                    <em>
                      <span>{item.yet}</span>{" "}
                      <span>{item.result}</span>
                    </em>
                  </p>
                </div>
              ))}
            </div>
            <div className="sourcing-v3-hero-close">
              <span>The Industry Already Changed.</span>
              <strong>Did You?</strong>
            </div>
            <Link
              className="sourcing-v3-button"
              href={TALLY_FORMS.sourcing.url}
              target="_blank"
            >
              Talk With Denny Now
            </Link>
          </div>
        </div>
      </section>

      <section className="section-editorial sourcing-v3-section sourcing-v3-reality">
        <div className="sourcing-v3-container sourcing-v3-reality-grid">
          <div className="sourcing-v3-change">
            <div className="sourcing-v3-section-head">
              <p className="sourcing-v3-kicker">Market Reality</p>
              <h2>The Industry Already Changed.</h2>
              <p>
                The Rules That Worked 10 Years Ago
                <span>No Longer Work Today.</span>
              </p>
            </div>
            <div className="sourcing-v3-change-list">
              {industryChanges.map((item) => (
                <div className="sourcing-v3-change-row" key={item.then}>
                  <div>
                    <span>Then</span>
                    <strong>{item.then}</strong>
                  </div>
                  <span aria-hidden="true">→</span>
                  <div>
                    <span>Today</span>
                    <strong>{item.today}</strong>
                  </div>
                </div>
              ))}
            </div>
            <div className="sourcing-v3-reality-close">
              <p>More Suppliers.</p>
              <p>More Products.</p>
              <p>More Competition.</p>
              <strong>The Difference Is No Longer Access.</strong>
              <strong>The Difference Is Insight.</strong>
            </div>
          </div>
          <aside className="sourcing-v3-winners">
            <div className="sourcing-v3-section-head">
              <h2>What The Winners Already Know</h2>
            </div>
            <ul>
              {winnerSignals.map((item) => (
                <li key={item.title}>
                  <InlineIcon name={item.icon} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section-editorial sourcing-v3-section sourcing-v3-opportunity">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-title-block">
            <p className="sourcing-v3-kicker">Opportunity Map</p>
            <h2>The Next $140 Billion Product Opportunity</h2>
            <p>
              Not Every Category Will Win.
              <span>These Are The Markets We Are Watching Closely.</span>
            </p>
          </div>
          <div className="sourcing-v3-product-grid">
            {productOpportunities.map((item) => (
              <Link className="sourcing-v3-product-card" href={item.href} key={item.title}>
                <span className="sourcing-v3-product-image">
                  <img src={item.image} alt={`${item.title} product category`} />
                </span>
                <span className="sourcing-v3-product-copy">
                  <span>
                    <InlineIcon name={item.icon} />
                    <strong>{item.title}</strong>
                  </span>
                  <em>{item.description}</em>
                  <span>Explore →</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-authority sourcing-v3-section sourcing-v3-deliver">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-title-block">
            <p className="sourcing-v3-kicker">What We Can Deliver</p>
            <h2>From Market Insight To Product Execution</h2>
            <p>
              We help you turn industry signals into better products, stronger
              supply chains and more competitive market positions.
            </p>
          </div>
          <div className="sourcing-v3-photo-strip">
            {deliveryPhotos.map((item) => (
              <article className="sourcing-v3-photo-card" key={item.title}>
                <img src={item.image} alt={`${item.title} in the cleaning industry`} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="sourcing-v3-deliver-grid">
            {deliveryPoints.map((item, index) => (
              <article className="sourcing-v3-deliver-card" key={item.title}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <InlineIcon name={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-authority sourcing-v3-section sourcing-v3-denny">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-denny-grid">
            <div className="sourcing-v3-sources">
              <p className="sourcing-v3-kicker">Industry Judgement</p>
              <h2>Why Denny Sees It Earlier</h2>
              <p>
                Most Companies Need More Than Supplier Lists.
                <span>They Need Better Judgement.</span>
              </p>
              <div className="sourcing-v3-authority-card">
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
              </div>
              <ul>
                {signalSources.map((item) => (
                  <li key={item.label}>
                    <InlineIcon name={item.icon} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sourcing-v3-judgement-list">
              {intelligenceSources.map((item, index) => (
                <div className="sourcing-v3-judgement-row" key={item.label}>
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

      <section className="section-action sourcing-v3-cta">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Next Step</p>
          <div className="sourcing-v3-cta-head">
            <h2>
              Your Next Product Opportunity
              <span>May Already Be Moving.</span>
              <span>Let&apos;s Find It Before Everyone Else.</span>
            </h2>
            <p>
              Talk with Denny about your market, product category and sourcing
              needs. We will help you identify where the next opportunity may
              come from.
            </p>
          </div>
          <ul>
            {finalPoints.map((point) => (
              <li key={point.title}>
                <InlineIcon name={point.icon} />
                <span>
                  <strong>{point.title}</strong>
                  {point.description ? <em>{point.description}</em> : null}
                </span>
              </li>
            ))}
          </ul>
          <Link
            className="sourcing-v3-button"
            href={TALLY_FORMS.sourcing.url}
            target="_blank"
          >
            Talk With Denny Now
          </Link>
        </div>
      </section>
    </main>
  );
}
