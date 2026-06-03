import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "World Clean Expo",
  description:
    "World Clean Expo intelligence covering trade show signals, exhibitor movement, buyer interests, and future event opportunities."
};

const expoItems = [
  "About World Clean Expo",
  "Why Exhibit",
  "Buyer & Visitor Profile",
  "Product Categories",
  "Sponsorship Opportunities",
  "Exhibitor Interest",
  "Visitor / Buyer Interest"
];

const audiences = [
  "Cleaning equipment brands and manufacturers",
  "Distributors, importers, and professional buyers",
  "Technology and component suppliers",
  "Media, associations, and industry partners"
];

const expoSignals = [
  "Which product categories deserve attention",
  "What exhibitors and buyers want to connect around",
  "Which media, sponsor, and partner topics are emerging",
  "How event information can serve the wider cleaning industry"
];

const expoPillars = [
  {
    title: "Exhibitor Intelligence",
    text: "Track categories, product launches, supplier positioning, and brand participation signals."
  },
  {
    title: "Buyer & Visitor Planning",
    text: "Understand who attends, what they need, and which product categories deserve attention."
  },
  {
    title: "Media & Sponsorship",
    text: "Map story angles, cooperation topics, event coverage, and partnership opportunities."
  },
  {
    title: "Category Showcase",
    text: "Organize vacuum, robot, floor care, pool, commercial, and cleaning technology topics."
  }
];

const whyExpo = [
  {
    title: "A global event intelligence layer",
    text: "World Clean Expo can organize category movement, exhibitor signals, buyer interests, and media topics before a physical event is defined."
  },
  {
    title: "A bridge between information and cooperation",
    text: "The platform connects cleaning equipment brands, manufacturers, suppliers, distributors, buyers, and industry partners around practical business questions."
  },
  {
    title: "A future event asset for the industry",
    text: "The first phase builds demand understanding and cooperation interest without making unconfirmed claims about dates, venues, exhibitors, or visitor numbers."
  }
];

const shouldAttend = [
  "Distributors and importers looking for category signals",
  "Professional buyers comparing cleaning equipment directions",
  "Retail and channel teams watching product movement",
  "Media and analysts following global cleaning industry topics"
];

const shouldExhibit = [
  "Cleaning equipment brands and manufacturers",
  "OEM / ODM and private label suppliers",
  "Component, technology, and supply chain companies",
  "Service providers, media partners, and industry organizations"
];

const expoJourney = [
  "Collect exhibitor, buyer, media, and sponsor interest",
  "Map product categories and event information needs",
  "Publish trade show intelligence and cooperation topics",
  "Prepare future event structure when demand becomes clear"
];

export default function WorldCleanExpoPage() {
  return (
    <>
      <section className="page-hero page-hero-expo">
        <div className="container">
          <p className="eyebrow">World Clean Expo</p>
          <h1>World Clean Expo Intelligence</h1>
          <p>
            Trade show signals, exhibitor movement, buyer interests and event
            opportunities for the global cleaning industry.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>A future event asset inside World Clean Biz</h2>
            <p>
              World Clean Expo organizes trade show intelligence, exhibitor
              signals, buyer interests, product categories and partnership
              opportunities before any event structure is confirmed.
            </p>
            <div className="tag-list">
              {expoItems.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Early interest</div>
            <h3>Share Expo Interest</h3>
            <p>
              Use the contact form for exhibitor interest, visitor and buyer
              interest, sponsorship, media cooperation, or industry partnership
              discussion.
            </p>
            <p>
              <Link className="button" href="/contact">
                Share Expo Interest
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why World Clean Expo</p>
              <h2>A future event platform built from industry signals</h2>
              <p>
                World Clean Expo is designed as a future global event platform
                for cleaning equipment brands, manufacturers, distributors,
                suppliers, media, and industry professionals.
              </p>
            </div>
          </div>
          <div className="grid-3">
            {whyExpo.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div className="card">
            <div className="module-kicker">Who Should Attend</div>
            <h3>For buyers, distributors, media, and industry observers</h3>
            <ul className="feature-list">
              {shouldAttend.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <div className="module-kicker">Who Should Exhibit</div>
            <h3>For brands, suppliers, and cooperation partners</h3>
            <ul className="feature-list">
              {shouldExhibit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Audience</p>
              <h2>Who the expo intelligence channel connects</h2>
              <p>
                The first version maps audience interest and cooperation topics
                before dates, locations or scale are confirmed.
              </p>
            </div>
          </div>
          <div className="grid-2">
            {audiences.map((item) => (
              <div className="card" key={item}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Expo Pillars</p>
              <h2>What World Clean Expo can organize for the industry</h2>
              <p>
                The first version should help the industry see event
                information, category focus, buyer interest, and cooperation
                paths in one place.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {expoPillars.map((item) => (
              <div className="case-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Expo Signals</p>
            <h2>What this channel should help the industry understand</h2>
            <p>
              The first version maps questions and opportunities before any
              full event structure is introduced.
            </p>
          </div>
          <div className="card">
            <ul className="feature-list">
              {expoSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container grid-2">
          <div className="image-panel image-panel-expo">
            <div>
              <p className="eyebrow">Expo Roadmap</p>
              <h2>From information channel to future event platform</h2>
              <p>
                World Clean Expo can grow step by step, beginning with useful
                trade show intelligence and cooperation interest.
              </p>
            </div>
          </div>
          <div className="card">
            <h3>First-stage roadmap</h3>
            <ul className="feature-list">
              {expoJourney.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <h2>Share Expo Interest</h2>
              <p>
                Send exhibitor, buyer, sponsor, media, or partnership interest
                so World Clean Biz can understand future event demand and trade
                show information needs.
              </p>
            </div>
            <div>
              <Link className="button" href="/contact">
                Share Expo Interest
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
