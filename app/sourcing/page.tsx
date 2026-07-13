import type { Metadata } from "next";
import Link from "next/link";
import { InlineIcon, type IconName } from "@/components/Icon";
import { TallyButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "Sourcing",
  description:
    "Work with Denny You and World Clean Biz on sourcing intelligence shaped by front-line cleaning industry product, supplier and market experience.",
  alternates: { canonical: "/sourcing" },
  openGraph: {
    title: "Cleaning Product Opportunities & China Sourcing",
    description:
      "Choose a cleaning product opportunity, compare the available platforms and turn the direction into a qualified sourcing brief.",
    url: "/sourcing",
    images: ["/images/sourcing/pool-robots.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Product Opportunities & China Sourcing",
    description:
      "Choose a cleaning product opportunity, compare the available platforms and turn the direction into a qualified sourcing brief.",
    images: ["/images/sourcing/pool-robots.png"]
  }
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

const deliveryPillars = [
  {
    imageTitle: "Industry Signals",
    imageText: "Trade Shows / Supplier Discovery / Market Trends",
    image: "/images/industry/expo-hall-shenzhen-2026.jpg",
    title: "Opportunity Discovery",
    points: [
      "Find categories and products worth sourcing before they become crowded",
      "Track product and supplier movement from industry events and market signals"
    ]
  },
  {
    imageTitle: "Product Development",
    imageText: "Concept / Design / Testing / Iteration",
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    title: "Product Direction",
    points: [
      "Turn market signals into product ideas, features and differentiation",
      "Avoid building another commodity product",
      "Read component and supplier signals before product decisions"
    ]
  },
  {
    imageTitle: "Supply Chain Execution",
    imageText: "Manufacturing / Quality / Delivery",
    image: "/images/industry/sourcing-product-components-2025.jpg",
    title: "Execution Support",
    points: [
      "Connect sourcing direction with supplier evaluation and execution options",
      "Reduce quality and after-sales risk before committing to production",
      "Explore flexible production paths across supplier resources"
    ]
  }
];

const dennyJourney = [
  {
    year: "2006",
    title: "Industry Operator",
    text: "Worked on products, customers and supply chains from inside the cleaning industry."
  },
  {
    year: "2009",
    title: "Product Builder",
    text: "Helped develop and support cleaning product businesses for global markets."
  },
  {
    year: "2017",
    title: "Industry Author & Influencer",
    text: "Started publishing category analysis followed by industry professionals."
  },
  {
    year: "2019",
    title: "Industry Forum Organizer",
    text: "Hosted forums connecting cleaning brands, manufacturers and suppliers."
  },
  {
    year: "2020",
    title: "Investor & Analyst Speaker",
    text: "Shared industry insights with investors, financial firms and venture capital audiences."
  },
  {
    year: "2025+",
    title: "World Clean Expo & Global Network",
    text: "Building a platform connecting buyers, suppliers, brands and market signals."
  }
];

const dennyProof = [
  {
    title: "20+ Years In The Industry",
    text: "Helped Build Multiple Best-Selling Cleaning Products"
  },
  {
    title: "9,000+ Industry Professionals",
    text: "Across Brands, Suppliers, Buyers And Investors"
  },
  {
    title: "World Clean Expo Network",
    text: "Connecting Product Signals, Suppliers And Industry Opportunities"
  }
];

const dennyPhotos = [
  {
    label: "Public Speaking",
    image: "/images/industry/about-denny-speaking-forum-2025.jpg",
    alt: "Denny speaking at a cleaning industry forum"
  },
  {
    label: "2025 Cleaning Forum",
    image: "/images/industry/about-forum-audience-2025.jpg",
    alt: "Cleaning industry forum audience"
  },
  {
    label: "World Clean Expo",
    image: "/images/industry/expo-hall-shenzhen-2026.jpg",
    alt: "World Clean Expo exhibition floor"
  },
  {
    label: "Supplier Meeting",
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    alt: "Supplier meeting at a cleaning industry exhibition"
  },
  {
    label: "Factory Visit",
    image: "/images/industry/sourcing-product-components-2025.jpg",
    alt: "Cleaning product components during a factory visit"
  },
  {
    label: "Industry Meetup",
    image: "/images/industry/about-forum-stage-2025.jpg",
    alt: "Cleaning industry meetup stage"
  }
];

export default function SourcingPage() {
  return (
    <div className="sourcing-v3-page">
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
            <p className="sourcing-v3-hero-note">
              Share your product category, target market and sourcing goal.
              Denny will review whether World Clean Biz can help.
            </p>
            <TallyButton className="sourcing-v3-button" ctaLocation="sourcing_hero" form="sourcing">
              Start A Sourcing Inquiry
            </TallyButton>
          </div>
        </div>
      </section>

      <section className="section-editorial sourcing-v3-section sourcing-v3-reality">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-title-block">
            <p className="sourcing-v3-kicker">Market Reality</p>
            <h2>The Industry Already Changed.</h2>
            <p>
              The old way of sourcing is no longer enough when products,
              suppliers and competitors move this fast.
            </p>
          </div>
          <div className="sourcing-v3-change-list sourcing-v3-reality-visual-grid">
            {industryChanges.map((item, index) => (
              <article className="sourcing-v3-reality-card" key={item.then}>
                <div>
                  <small>Then</small>
                  <strong>{item.then}</strong>
                </div>
                <em aria-hidden="true">→</em>
                <div>
                  <small>Today</small>
                  <strong>{item.today}</strong>
                </div>
              </article>
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
      </section>

      <section className="section-editorial sourcing-v3-section sourcing-v3-opportunity">
        <div className="sourcing-v3-container">
          <div className="sourcing-v3-title-block">
            <p className="sourcing-v3-kicker">Opportunity Map</p>
            <h2>Categories Worth Watching Before You Source</h2>
            <p>
              These are the cleaning product categories where supplier
              movement, product innovation and overseas demand are changing
              quickly.
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
                  <span>View Category →</span>
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
              We help you move from category judgement to supplier direction,
              product decisions and execution support.
            </p>
          </div>
          <div className="sourcing-v3-capability-map">
            {deliveryPillars.map((pillar) => (
              <article className="sourcing-v3-capability-card" key={pillar.title}>
                <div className="sourcing-v3-capability-image">
                  <img src={pillar.image} alt={`${pillar.imageTitle} in the cleaning industry`} />
                  <div>
                    <strong>{pillar.imageTitle}</strong>
                    <span>{pillar.imageText}</span>
                  </div>
                </div>
                <h3>{pillar.title}</h3>
                <ul>
                  {pillar.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="sourcing-v3-mid-cta">
            <p>Have a product or supplier question?</p>
            <TallyButton className="sourcing-v3-button" ctaLocation="sourcing_delivery" form="sourcing">
              Start A Sourcing Inquiry
            </TallyButton>
          </div>
        </div>
      </section>

      <section className="section-authority sourcing-v3-section sourcing-v3-denny-proof-section">
        <div className="sourcing-v3-container sourcing-v3-denny-proof-grid">
          <div className="sourcing-v3-denny-proof-copy">
            <p className="home-v8-eyebrow">Inside The Industry Since 2006</p>
            <div className="home-v8-denny-id">
              <img src="/images/industry/about-denny-speaking-forum-2025.jpg" alt="Denny speaking at an industry forum" />
              <div>
                <strong>Denny You</strong>
                <span>Founder, World Clean Biz</span>
              </div>
            </div>
            <h2>Why Denny Can Help You Make Better Sourcing Decisions</h2>
            <div className="home-v8-denny-copy">
              <p>
                Denny has worked inside the cleaning industry since 2006,
                across products, suppliers, trade shows, forums and market
                conversations.
              </p>
              <p>
                He helps companies judge which categories are worth entering,
                which suppliers deserve attention, and how to avoid building
                another commodity product.
              </p>
            </div>
            <ul className="home-v8-denny-highlights">
              {dennyProof.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="home-v8-denny-gallery">
            {dennyPhotos.map((photo) => (
              <figure className="home-v8-denny-photo" key={photo.label}>
                <img src={photo.image} alt={photo.alt} />
                <figcaption>{photo.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-authority sourcing-v3-section sourcing-v3-journey-section">
        <div className="sourcing-v3-container">
          <div className="about-v1-journey">
            <div className="about-v1-journey-head">
              <p className="eyebrow">From Operator To Industry Connector</p>
              <h2>Denny&apos;s Industry Journey</h2>
              <p>
                A 20-year path across products, suppliers, content, forums,
                investors and World Clean Expo.
              </p>
            </div>
            <div className="about-v1-journey-line" aria-hidden="true" />
            <div className="about-v1-journey-grid">
              {dennyJourney.map((item) => (
                <article className="about-v1-journey-card" key={item.year}>
                  <span>{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-action sourcing-v3-cta" id="start-a-sourcing-inquiry">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Next Step</p>
          <div className="sourcing-v3-cta-head">
            <h2>
              Tell Denny What You Are Trying To Source.
            </h2>
            <p>
              Share your category, target market, product stage and supplier
              challenge. Denny will review where World Clean Biz can help.
            </p>
          </div>
          <TallyButton className="sourcing-v3-button" ctaLocation="sourcing_final" form="sourcing">
            Start A Sourcing Inquiry
          </TallyButton>
        </div>
      </section>
    </div>
  );
}
