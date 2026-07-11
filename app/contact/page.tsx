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

const responseSteps = [
  {
    title: "Prepare The Right Context",
    text: "Share your company, market, product category and the decision or opportunity you are working on."
  },
  {
    title: "Your Inquiry Is Routed By Intent",
    text: "Sourcing, Expo, media and general requests follow separate paths so the right context is reviewed first."
  },
  {
    title: "Follow-Up Depends On Fit",
    text: "World Clean Biz reviews the information provided and follows up when the request fits its industry scope and available resources."
  }
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
            {CONTACT_INQUIRIES.map((item) => (
              <TallyButton
                className="case-card contact-help-card"
                ctaLocation={item.ctaLocation}
                form={item.form}
                inquiryType={item.value}
                key={item.value}
                trackClick
              >
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

      <section className="section section-soft contact-response-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                <InlineIcon name="send" />
                What Happens Next
              </p>
              <h2>Send The Right Context First</h2>
              <p>A focused inquiry helps World Clean Biz understand where it can add value.</p>
            </div>
          </div>
          <div className="case-grid contact-response-grid">
            {responseSteps.map((step) => (
              <article className="case-card" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
