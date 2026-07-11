import type { Metadata } from "next";
import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { IconBadge, InlineIcon } from "@/components/Icon";
import { CONTACT_INQUIRIES } from "@/lib/inquiryConversion";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Share your cleaning industry question with World Clean Biz for sourcing support, market information, industry connections, World Clean Expo interest, media cooperation, or business opportunities.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact World Clean Biz",
    description: "Choose the right channel for sourcing, Expo, media, or general cleaning industry inquiries.",
    url: "/contact",
    images: ["/images/industry/sourcing-supplier-meeting-2026.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact World Clean Biz",
    description: "Choose the right channel for sourcing, Expo, media, or general cleaning industry inquiries.",
    images: ["/images/industry/sourcing-supplier-meeting-2026.jpg"]
  }
};

const inquiryContext = [
  "Your company and target market",
  "Product category or business objective",
  "Current project stage and timeline",
  "The decision, supplier or connection you need"
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero-contact">
        <div className="container">
          <p className="eyebrow">Contact World Clean Biz</p>
          <h1>
            A Million-Dollar Opportunity
            <br />
            May Start With The Right Conversation.
          </h1>
          <p>
            Tell us what you are looking for. World Clean Biz helps connect
            your inquiry with the right sourcing, expo, media, market
            intelligence, or industry opportunity.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#inquiry-form">
              Choose An Inquiry Type
            </Link>
          </div>
        </div>
      </section>

      <section className="section contact-inquiry-section" id="inquiry-form">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Inquiry Types</p>
              <h2>Choose the Right Channel</h2>
              <p>Start with the entry that best matches your need.</p>
            </div>
          </div>
          <div className="case-grid contact-help-grid">
            {CONTACT_INQUIRIES.map((item, index) => (
              <TallyButton
                className={`case-card contact-help-card${index === 0 ? " contact-help-card-primary" : ""}`}
                ctaLocation={item.ctaLocation}
                form={item.form}
                inquiryType={item.value}
                key={item.value}
                trackClick
              >
                <span className="contact-help-card-number">0{index + 1}</span>
                <IconBadge name={item.icon} />
                <span className="contact-help-card-copy">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                  <em>{item.buttonLabel} →</em>
                </span>
              </TallyButton>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-response-section">
        <div className="container contact-response-layout">
          <div className="contact-response-visual">
            <img
              alt="Denny You discussing cleaning industry sourcing with suppliers"
              src="/images/industry/sourcing-supplier-meeting-2026.jpg"
            />
            <div className="contact-response-identity">
              <strong>Denny You</strong>
              <span>Founder, World Clean Biz</span>
              <small>Inside the cleaning industry since 2006</small>
            </div>
          </div>
          <div className="contact-response-copy">
            <div className="section-head">
              <div>
                <p className="eyebrow">
                  <InlineIcon name="send" />
                  What Happens Next
                </p>
                <h2>What To Include In Your Inquiry</h2>
                <p>Clear context helps World Clean Biz understand your objective and route the request correctly.</p>
              </div>
            </div>
            <ul className="contact-context-list">
              {inquiryContext.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="contact-response-note">
              World Clean Biz reviews every relevant industry inquiry and routes it according to sourcing, Expo, media, or business intent.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
