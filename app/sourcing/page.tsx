import type { Metadata } from "next";
import Link from "next/link";
import { InlineIcon, type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz on sourcing intelligence shaped by front-line cleaning industry product, supplier and market experience."
};

const heroCards = [
  {
    number: "01",
    lead: "Meet 500+ Suppliers At Every Trade Show.",
    yet: "Yet",
    result: "Fly Home With The Same Products You Saw Last Year."
  },
  {
    number: "02",
    lead: "Spend 12 Months Developing A New Product.",
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
    lead: "Spend 20 Years Building Customer And Channel Relationships.",
    yet: "Yet",
    result: "Your Biggest Customer Is Walking Into Your Competitor's Booth."
  }
];

const industryChanges = [
  {
    then: "One winning product could build a business.",
    today: "A winning product can become inventory within a year."
  },
  {
    then: "Finding a reliable supplier was the advantage.",
    today:
      "Every trade show has hundreds of suppliers selling similar products. The advantage is finding what others haven&apos;t seen yet."
  },
  {
    then: "Most competitors were familiar.",
    today: "A new Chinese brand can reshape an entire category in just a few years."
  },
  {
    then: "20 years of experience made you the expert.",
    today: "New technologies can rewrite the rules overnight."
  },
  {
    then: "Following the market was a safe strategy.",
    today: "By the time the market sees a trend, the opportunity is already gone."
  }
];

const winnerSignals: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "globe",
    title: "E-commerce will win.",
    description: "China is already there. The rest of the world is just a few years behind."
  },
  {
    icon: "lightbulb",
    title: "China is becoming the innovation center.",
    description: "If you do not have R&D and sourcing in China, you will fall behind."
  },
  {
    icon: "trending",
    title: "Speed will beat size.",
    description: "The fastest brands will win. Not necessarily the biggest ones."
  },
  {
    icon: "bar-chart",
    title: "The biggest growth story has not happened yet.",
    description: "$40B today. $140B in the next decade."
  },
  {
    icon: "users",
    title: "The next industry giants may not exist today.",
    description: "The biggest winners of the next 10 years may not exist today."
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
    description: "One of the fastest-growing cleaning categories globally. Premium positioning and strong international demand.",
    href: "/sourcing/pool-robots",
    icon: "waves",
    image: "/images/sourcing/pool-robots.png"
  },
  {
    title: "Lawn Robots",
    description: "Potentially the largest opportunity of the next decade. Still early, with rapid adoption across Europe.",
    href: "/sourcing/lawn-robots",
    icon: "sparkles",
    image: "/images/sourcing/lawn-robots.png"
  },
  {
    title: "Floor Washers",
    description: "Already transformed China. Global growth is only beginning across home and commercial formats.",
    href: "/sourcing/floor-washers",
    icon: "wind",
    image: "/images/sourcing/floor-washers.png"
  },
  {
    title: "Robotic Vacuums",
    description: "Largest category. Fast innovation cycle. Global competition is intense and still evolving.",
    href: "/sourcing/robotic-vacuums",
    icon: "target",
    image: "/images/sourcing/robotic-vacuums.png"
  },
  {
    title: "Commercial Cleaning",
    description: "Automation is reshaping the industry as labor pressure creates demand for better productivity.",
    href: "/sourcing/commercial-cleaning",
    icon: "building",
    image: "/images/sourcing/commercial-cleaning.png"
  },
  {
    title: "Vacuum Cleaners",
    description: "Mature category. Still evolving globally through channel pressure and product upgrades.",
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
  { icon: "calendar", label: "20+ Years In The Industry" },
  { icon: "calendar", label: "Trade Shows Worldwide" },
  { icon: "users", label: "9,000+ Industry Professionals" },
  { icon: "message", label: "Industry Forums" },
  { icon: "factory", label: "Factory & Brand Connections" }
];

const finalPoints: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "target",
    title: "Discover Opportunities Earlier",
    description: "Find what others overlook."
  },
  {
    icon: "trending",
    title: "Understand Market Changes Earlier",
    description: "Stay ahead of the curve."
  },
  {
    icon: "package",
    title: "Build Better Products",
    description: "Make smarter product decisions."
  },
  {
    icon: "handshake",
    title: "Access The Right Partners",
    description: "Connect with the right factories and innovators."
  }
];

export default function SourcingPage() {
  return (
    <main className="sourcing-v3-page">
      <section className="sourcing-v3-hero">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-hero-copy">
            <p className="sourcing-v3-kicker">Sourcing</p>
            <h1>
              Sourcing Intelligence
              <span>From The Front Line.</span>
              <strong>
                Supplier Access Is Not Enough
                <br />
                Without Better Judgement.
              </strong>
            </h1>
            <p className="sourcing-v3-hero-subcopy">
              Sourcing is no longer just finding suppliers.
              <span>It requires judgement on products, factories, timing and market direction.</span>
            </p>
            <div className="sourcing-v3-hero-rows">
              {heroCards.map((item) => (
                <div className="sourcing-v3-hero-row" key={item.lead}>
                  <span>{item.number}</span>
                  <p>
                    <strong>
                      <span>You</span> {item.lead}
                    </strong>
                    <em>
                      <span>{item.yet}</span>{" "}
                      <span>{item.result}</span>
                    </em>
                  </p>
                </div>
              ))}
            </div>
            <div className="sourcing-v3-hero-close">
              <span>The advantage is knowing what still matters.</span>
              <strong>Before the window closes.</strong>
            </div>
            <Link className="sourcing-v3-button" href="/contact">
              Submit Inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="sourcing-v3-section sourcing-v3-reality">
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
                    <span>Before</span>
                    <strong>{item.then}</strong>
                  </div>
                  <span aria-hidden="true">→</span>
                  <div>
                    <span>After</span>
                    <strong>{item.today}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="sourcing-v3-winners">
            <div className="sourcing-v3-section-head">
              <p className="sourcing-v3-kicker">What The Winners Already Know</p>
              <h2>The companies that move first are already acting on these signals.</h2>
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

      <section className="sourcing-v3-section sourcing-v3-opportunity">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-title-block">
            <p className="sourcing-v3-kicker">Opportunity Map</p>
            <h2>The Next $140 Billion Product Opportunity</h2>
            <p>Not Every Category Will Win. These Are The Markets We Are Watching Closely.</p>
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

      <section className="sourcing-v3-section sourcing-v3-denny">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-denny-grid">
            <div className="sourcing-v3-sources">
              <p className="sourcing-v3-kicker">Why Denny Sees It Earlier</p>
              <h2>Most Companies Need More Than Supplier Lists.</h2>
              <p>
                They need judgement from someone who has worked with products,
                customers, suppliers and markets from the front line.
              </p>
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

      <section className="sourcing-v3-cta">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Next Step</p>
          <div className="sourcing-v3-cta-head">
            <h2>
              The Next Opportunity Starts With Better Sourcing Intelligence.
              <span>Send The Right Context First.</span>
            </h2>
          </div>
          <ul>
            {finalPoints.map((point) => (
              <li key={point.title}>
                <InlineIcon name={point.icon} />
                <span>
                  <strong>{point.title}</strong>
                  <em>{point.description}</em>
                </span>
              </li>
            ))}
          </ul>
          <Link className="sourcing-v3-button" href="/contact">
            Submit Inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
