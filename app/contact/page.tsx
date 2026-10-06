import type { Metadata } from "next";
import Link from "next/link";
import "../styles/trust.css";
import { TallyButton } from "@/components/LeadForms";
import { IconBadge, InlineIcon } from "@/components/Icon";
import { CONTACT_INQUIRIES } from "@/lib/inquiryConversion";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact World Clean Biz for sourcing support, market information, industry connections, WCB Expo, media cooperation or business opportunities.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact World Clean Biz",
    description:
      "Choose the right channel for sourcing, Expo, media, or general cleaning industry inquiries.",
    url: "/contact",
    images: ["/images/site-refresh/about/about-hero-denny.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact World Clean Biz",
    description:
      "Choose the right channel for sourcing, Expo, media, or general cleaning industry inquiries.",
    images: ["/images/site-refresh/about/about-hero-denny.webp"],
  },
};

const inquiryContext = [
  "Your company and target market",
  "Product category or business objective",
  "Current project stage and timeline",
  "The decision, supplier or connection you need",
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero-contact contact-visual-refresh">
        <div className="container">
          <p className="eyebrow">Contact World Clean Biz</p>
          <h1>Work With World Clean Biz</h1>
          <p>
            Choose a cooperation area and tell us about your company, market and
            project.
          </p>
        </div>
      </section>

      <section className="section contact-inquiry-section" id="inquiry-form">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Inquiry Types</p>
              <h2>Business Cooperation</h2>
              <p>Four ways to work with WCB.</p>
            </div>
          </div>
          <div className="case-grid contact-help-grid refresh-business-grid">
            {CONTACT_INQUIRIES.map((item, index) => (
              <div id={item.value} key={item.value}>
                <TallyButton
                  className="case-card contact-help-card"
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
                    <em>{item.buttonLabel}</em>
                  </span>
                </TallyButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container refresh-contact-links">
        <Link href="/sourcing">Explore sourcing services</Link>
        <Link href="/wcb-expo">View WCB Expo information</Link>
      </div>
      <section className="contact-response-section">
        <div className="container contact-response-layout">
          <div className="contact-response-visual">
            <img
              alt="Denny You discussing cleaning industry sourcing with suppliers"
              src="/images/site-refresh/about/about-hero-denny.webp"
            />
            <div className="contact-response-identity">
              <strong>Denny You</strong>
              <span>Founder, World Clean Biz · Organizer, WCB Expo</span>
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
                <p>
                  Clear context helps World Clean Biz understand your objective
                  and route the request correctly.
                </p>
              </div>
            </div>
            <ul className="contact-context-list">
              {inquiryContext.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="contact-response-note">
              World Clean Biz reviews each relevant inquiry and routes it to the
              relevant team based on sourcing, Expo, media, or business intent.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
