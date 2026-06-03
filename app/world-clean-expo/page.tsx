import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "World Clean Expo",
  description:
    "World Clean Expo is a future trade show and industry platform for global cleaning products, technologies and supply chains."
};

const whyHighlights = [
  "Industry Connections",
  "Product Discovery",
  "Technology Trends",
  "Market Intelligence",
  "Global Business Opportunities"
];

const exhibitorTypes = [
  "Cleaning Product Manufacturers",
  "Robot Cleaning Companies",
  "Pool Cleaning Suppliers",
  "Floor Care Brands",
  "Commercial Cleaning Equipment Companies",
  "Component Suppliers",
  "Technology Providers",
  "OEM & ODM Manufacturers"
];

const attendeeTypes = [
  "Importers",
  "Distributors",
  "Retailers",
  "Brand Owners",
  "Sourcing Teams",
  "Product Managers",
  "Investors",
  "Industry Media"
];

const connectionCards = [
  {
    title: "Products",
    text: "Discover new product categories and technologies."
  },
  {
    title: "Suppliers",
    text: "Connect with manufacturers and supply chain partners."
  },
  {
    title: "Buyers",
    text: "Meet buyers from different markets and channels."
  },
  {
    title: "Technology",
    text: "Explore innovations shaping the future of the industry."
  },
  {
    title: "Market Intelligence",
    text: "Understand trends, opportunities and industry developments."
  },
  {
    title: "Media Exposure",
    text: "Increase visibility across industry media and professional networks."
  },
  {
    title: "Business Opportunities",
    text: "Build new partnerships and growth opportunities."
  }
];

const platformElements = [
  "Industry Intelligence",
  "Product Discovery",
  "Supply Chain Connections",
  "Business Networking",
  "Market Opportunities"
];

const interestTypes = [
  "Exhibit",
  "Visit",
  "Sponsor",
  "Media Cooperation",
  "General Cooperation"
];

export default function WorldCleanExpoPage() {
  return (
    <>
      <section className="page-hero page-hero-expo">
        <div className="container">
          <p className="eyebrow">World Clean Expo</p>
          <h1>World Clean Expo</h1>
          <p>
            A future trade show and industry platform for global cleaning
            products, technologies and supply chains.
          </p>
          <p>
            The cleaning industry is becoming more global, more technical and
            more connected. World Clean Expo aims to bring together
            manufacturers, brands, buyers, suppliers and industry professionals
            from around the world.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#expo-interest">
              Share Expo Interest
            </Link>
            <Link className="button-secondary" href="/insights">
              Explore Industry Signals
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Why World Clean Expo</p>
            <h2>Why World Clean Expo</h2>
            <p>
              The cleaning industry is evolving rapidly. New technologies, new
              product categories, changing supply chains and global market
              opportunities are creating new challenges and opportunities for
              the industry.
            </p>
            <p>
              World Clean Expo is being built as a platform where industry
              professionals can connect, learn and discover new business
              opportunities.
            </p>
          </div>
          <div className="card">
            <ul className="feature-list">
              {whyHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Who Should Exhibit</p>
            <h2>Who Should Exhibit</h2>
            <p>
              If your company develops, manufactures or supplies products and
              technologies for the cleaning industry, World Clean Expo is
              designed to help connect you with buyers, partners and industry
              professionals.
            </p>
          </div>
          <div className="module-grid">
            {exhibitorTypes.map((item) => (
              <div className="module-chip" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Who Should Attend</p>
            <h2>Who Should Attend</h2>
            <p>
              World Clean Expo is designed for professionals looking to
              understand the market, discover suppliers, evaluate products and
              identify new business opportunities.
            </p>
          </div>
          <div className="module-grid">
            {attendeeTypes.map((item) => (
              <div className="module-chip" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">What The Expo Will Connect</p>
              <h2>What The Expo Will Connect</h2>
              <p>
                A practical platform for connecting cleaning products,
                suppliers, buyers, technologies, market intelligence, media
                exposure and business opportunities.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {connectionCards.map((item) => (
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
          <div className="image-panel image-panel-expo">
            <div>
              <p className="eyebrow">More Than An Expo</p>
              <h2>More Than An Expo</h2>
              <p>
                World Clean Expo is not intended to be just another trade show.
              </p>
            </div>
          </div>
          <div>
            <p>
              The goal is to create a platform that combines content, industry
              insights, product discovery, supply chain connections, business
              networking and face-to-face meetings.
            </p>
            <div className="module-grid expo-platform-grid">
              {platformElements.map((item) => (
                <div className="module-chip" key={item}>
                  {item}
                </div>
              ))}
            </div>
            <p>
              By connecting content, industry insights and face-to-face
              meetings, the platform aims to help industry professionals make
              better business decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft" id="expo-interest">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Share Expo Interest</p>
            <h2>Interested In World Clean Expo?</h2>
            <p>
              Tell us whether you are interested in exhibiting, visiting,
              sponsoring or collaborating.
            </p>
          </div>
          <form className="form expo-interest-form">
            <label>
              Name
              <input name="name" placeholder="Your name" required />
            </label>
            <label>
              Company
              <input name="company" placeholder="Company name" required />
            </label>
            <label>
              Email
              <input name="email" placeholder="name@company.com" type="email" required />
            </label>
            <label>
              Country
              <input name="country" placeholder="Country or region" required />
            </label>
            <label>
              Interest Type
              <select name="interestType" required>
                {interestTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea
                name="message"
                placeholder="Share your company, interest type, product category or cooperation idea."
                required
              />
            </label>
            <button className="button" type="submit">
              Share Expo Interest
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <h2>The Future Of The Cleaning Industry Will Be Built Together</h2>
              <p>
                Manufacturers, brands, buyers, suppliers and industry
                professionals all play a role in shaping the future of the
                cleaning industry. If you would like to be part of World Clean
                Expo, we'd love to hear from you.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="button" href="#expo-interest">
                Share Expo Interest
              </Link>
              <Link className="button-secondary" href="/insights">
                Explore Industry Signals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
