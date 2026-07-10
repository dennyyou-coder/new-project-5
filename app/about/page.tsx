import type { Metadata } from "next";
import { IconBadge, type IconName } from "@/components/Icon";
import { TallyButton, TallyReportButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "About Denny You | World Clean Biz",
  description:
    "Denny You helps cleaning industry professionals read category movement earlier, find the right resources and make better business decisions."
};

const proofCards: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "factory",
    title: "20+ Years Inside The Industry",
    text: "Worked across products, customers, suppliers and markets since 2006."
  },
  {
    icon: "package",
    title: "Product & Supplier Front Line",
    text: "Helped build and support cleaning product businesses for global markets."
  },
  {
    icon: "message",
    title: "Industry Forums & Networks",
    text: "Organized forums and built professional cleaning industry conversations."
  },
  {
    icon: "handshake",
    title: "Trusted By Industry Professionals",
    text: "Followed by brands, suppliers, investors and cleaning professionals."
  }
];

const proofPhotos = [
  {
    image: "/images/industry/about-denny-speaking-forum-2025.jpg",
    label: "Denny Speaking"
  },
  {
    image: "/images/industry/about-forum-audience-2025.jpg",
    label: "Forum Audience"
  },
  {
    image: "/images/industry/about-panel-discussion-2025.jpg",
    label: "Panel Discussion"
  },
  {
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    label: "Supplier Meeting"
  },
  {
    image: "/images/industry/expo-business-matching-2026.jpg",
    label: "Business Matching"
  }
];

const dennyJourney = [
  {
    year: "2006",
    title: "Industry Operator",
    text: "Worked inside cleaning products, customers and supply chains."
  },
  {
    year: "2009",
    title: "Product Builder",
    text: "Supported cleaning product businesses for global markets."
  },
  {
    year: "2017",
    title: "Industry Author",
    text: "Started publishing category analysis for cleaning professionals."
  },
  {
    year: "2019",
    title: "Forum Organizer",
    text: "Hosted forums connecting brands, manufacturers and suppliers."
  },
  {
    year: "2020",
    title: "Investor & Analyst Speaker",
    text: "Shared industry views with financial and venture audiences."
  },
  {
    year: "2025+",
    title: "World Clean Expo",
    text: "Building a global platform for cleaning industry connections."
  }
];

export default function AboutPage() {
  return (
    <>
      <section className="about-v1-hero">
        <div className="container about-v1-hero-grid">
          <div className="about-v1-hero-copy">
            <p className="eyebrow">About Denny You</p>
            <h1>20 Years Inside The Cleaning Industry.</h1>
            <p>
              Denny helps companies read category movement earlier, find the
              right industry resources and make better business decisions.
            </p>
            <div className="about-v1-founder">
              Operator. Product Builder. Forum Organizer. Industry Connector.
            </div>
            <div className="hero-actions">
              <TallyButton
                className="button"
                ctaLocation="about_hero_contact"
                form="contact"
              >
                Talk With Denny
              </TallyButton>
              <TallyReportButton
                className="button-secondary"
                ctaLocation="about_hero_reports"
              />
            </div>
          </div>
          <div className="about-v1-hero-photo" aria-label="Denny speaking at an industry forum">
            <span>Denny Speaking</span>
          </div>
        </div>
      </section>

      <section className="section about-v1-cover">
        <div className="container">
          <div className="about-v1-section-head">
            <p className="eyebrow">Why Denny Can Help</p>
            <h2>Industry judgement built from front-line experience.</h2>
            <p>
              Denny&apos;s value comes from years of working with products,
              suppliers, customers, forums and market conversations inside the
              cleaning industry.
            </p>
          </div>
          <div className="about-v1-cover-grid">
            {proofCards.map((item) => (
              <div className="about-v1-cover-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-proof-section">
        <div className="container">
          <div className="about-v1-section-head">
            <p className="eyebrow">Industry Proof</p>
            <h2>Proof From The Industry Front Line</h2>
            <p>
              Forums, supplier meetings, panels and industry conversations give
              Denny a direct view of where cleaning industry opportunities are
              moving.
            </p>
          </div>
          <div className="about-proof-gallery">
            {proofPhotos.map((photo, index) => (
              <figure className={index === 0 ? "is-featured" : ""} key={photo.label}>
                <img src={photo.image} alt="" />
                <figcaption>{photo.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="about-v1-journey-section">
        <div className="container">
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

      <section className="section about-v1-cta-section">
        <div className="container about-v1-cta">
          <div>
            <p className="eyebrow">Next Step</p>
            <h2>Want Denny&apos;s View On Your Market?</h2>
            <p>
              Talk with Denny or get his free industry reports first.
            </p>
          </div>
          <div className="hero-actions">
            <TallyButton
              className="button"
              ctaLocation="about_footer_contact"
              form="contact"
            >
              Talk With Denny
            </TallyButton>
            <TallyReportButton
              className="button-secondary"
              ctaLocation="about_footer_reports"
            />
          </div>
        </div>
      </section>
    </>
  );
}
