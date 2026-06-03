import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About World Clean Biz, a trusted information home for global cleaning industry professionals."
};

const trustPoints = [
  "Focused tracking across vacuums, floor care, robots, pool cleaning, commercial cleaning, and related categories",
  "Supplier-side understanding from manufacturing, sourcing, and product conversations",
  "Buyer-side thinking for brands, importers, distributors, retailers, and product teams",
  "Industry content built for practical decisions instead of generic commentary"
];

const served = [
  "Buyers looking for cleaning product, category, or supplier information",
  "Brands planning OEM, ODM, private label, or channel expansion",
  "Distributors and importers watching category opportunities",
  "Manufacturers, event partners, media, and industry organizations exploring global cooperation"
];

const platformRoles = [
  {
    title: "Information",
    text: "Track industry news, category movement, company updates, and trade show signals."
  },
  {
    title: "Context",
    text: "Connect market signals with buyer needs, supplier capability, and channel change."
  },
  {
    title: "Opportunity",
    text: "Help readers discover sourcing direction, report topics, expo interest, and cooperation paths."
  }
];

const operatingPrinciples = [
  {
    title: "Industry-first perspective",
    text: "Content is organized around what cleaning professionals need to understand, not around generic marketing claims."
  },
  {
    title: "Connected context",
    text: "A product trend is connected to suppliers, buyers, regions, channels, events, and business timing."
  },
  {
    title: "Practical next step",
    text: "Each page should help readers decide what to read, ask, compare, or investigate next."
  }
];

const futureVision = [
  "A searchable cleaning industry knowledge base",
  "Regional and category market briefings",
  "Supplier and buyer signal tracking",
  "Trade show intelligence and World Clean Expo development",
  "Media, report, and partnership cooperation paths"
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero-about">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1>About the information home for the global cleaning industry</h1>
          <p>
            World Clean Biz is built for cleaning industry professionals who
            need reliable information, market context, sourcing direction, and
            cooperation opportunities in one place.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Platform Role</p>
              <h2>What World Clean Biz is designed to become</h2>
              <p>
                The platform starts with useful information, then connects that
                information to market context and practical industry
                opportunities.
              </p>
            </div>
          </div>
          <div className="platform-grid platform-role-grid">
            {platformRoles.map((item) => (
              <div className="platform-card" key={item.title}>
                <div className="platform-icon" aria-hidden="true">
                  {item.title.slice(0, 1)}
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="container grid-2">
          <div className="highlight-panel">
            <div className="module-kicker">Platform</div>
            <h3>About World Clean Biz</h3>
            <p>
              World Clean Biz is a global cleaning industry information
              platform. It publishes market insights, product category analysis,
              sourcing context, report notes, and exhibition observations for
              professionals who make real business decisions.
            </p>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Founder voice</div>
            <h3>About Denny You</h3>
            <p>
              Denny You follows cleaning industry information, supplier
              resources, buyer demand, and market opportunities, helping global
              professionals better understand where the industry is moving and
              how to connect with the right opportunities.
            </p>
          </div>
          <div className="card">
            <h3>Who We Serve</h3>
            <ul className="feature-list">
              {served.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Why Trust Us</h3>
            <ul className="feature-list">
              {trustPoints.map((item) => (
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
              <p className="eyebrow">Operating Principles</p>
              <h2>How the platform should think</h2>
              <p>
                World Clean Biz should feel like an industry center: focused,
                useful, connected, and practical for real professionals.
              </p>
            </div>
          </div>
          <div className="platform-grid">
            {operatingPrinciples.map((item) => (
              <div className="platform-card" key={item.title}>
                <div className="platform-icon" aria-hidden="true">
                  {item.title.slice(0, 1)}
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div className="image-panel image-panel-about">
            <div>
              <p className="eyebrow">Future Vision</p>
              <h2>A global center for cleaning industry knowledge</h2>
              <p>
                The long-term vision is to help global professionals find
                trustworthy information faster and connect it with useful
                business decisions.
              </p>
            </div>
          </div>
          <div className="card">
            <h3>Platform roadmap themes</h3>
            <ul className="feature-list">
              {futureVision.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <h2>Use World Clean Biz as a practical industry starting point</h2>
              <p>
                For sourcing questions, market report interest, expo
                cooperation, media requests, or content collaboration, contact
                Denny You with a clear industry question.
              </p>
            </div>
            <div>
              <Link className="button" href="/contact">
                Contact Denny You
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
