import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";
import { TALLY_FORMS } from "@/lib/tallyForms";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Share your cleaning industry question with World Clean Biz for sourcing support, market information, industry connections, World Clean Expo interest, media cooperation, or business opportunities."
};

const helpCards = [
  {
    icon: "factory",
    title: "Sourcing Inquiry",
    text: "For buyers looking for China-based suppliers, OEM/ODM partners, private label opportunities, or product sourcing support.",
    href: TALLY_FORMS.sourcing.url
  },
  {
    icon: "calendar",
    title: "Expo Inquiry",
    text: "For companies interested in exhibiting, visiting, partnering with, or promoting cleaning industry trade shows and events.",
    href: TALLY_FORMS.expo.url
  },
  {
    icon: "newspaper",
    title: "Media Inquiry",
    text: "For interviews, press releases, market insights, editorial collaboration, and industry news submissions.",
    href: TALLY_FORMS.contact.url
  },
  {
    icon: "message",
    title: "General Inquiry",
    text: "For other business questions, partnership ideas, or general communication with World Clean Biz.",
    href: TALLY_FORMS.contact.url
  }
] satisfies { icon: IconName; title: string; text: string; href: string }[];

const inquiryRoutes = [
  {
    label: "Product / Supplier",
    title: "Sourcing Inquiry",
    text: "Share product category, target market, supplier criteria and timeline.",
    href: TALLY_FORMS.sourcing.url
  },
  {
    label: "Event / Network",
    title: "Expo Updates",
    text: "Receive World Clean Expo updates for visiting, exhibiting or partnership.",
    href: TALLY_FORMS.expo.url
  },
  {
    label: "General / Media",
    title: "Contact World Clean Biz",
    text: "Send media, report, partnership or general business questions.",
    href: TALLY_FORMS.contact.url
  }
] satisfies { label: string; title: string; text: string; href: string }[];

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
              Submit Inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="section contact-inquiry-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Inquiry Types</p>
              <h2>Choose the Right Channel</h2>
              <p>
                Start with the entry that best matches your need.
              </p>
            </div>
          </div>
          <div className="case-grid contact-help-grid">
            {helpCards.map((item) => (
              <Link
                className="case-card contact-help-card"
                href={item.href}
                key={item.title}
                target="_blank"
              >
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>Submit Inquiry →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft" id="inquiry-form">
        <div className="container contact-form-layout">
          <div className="contact-form-copy">
            <p className="eyebrow">
              <InlineIcon name="send" />
              Inquiry Form
            </p>
            <h2>Send The Right Context First</h2>
            <p>
              Choose the form that best matches your request. Each submission
              goes through Tally and is saved in Airtable for follow-up.
            </p>
            <div
              className="contact-form-image"
              aria-label="Cleaning industry business discussion"
            />
          </div>
          <div className="contact-form-panel">
            <div className="contact-route-head">
              <p className="eyebrow">Choose A Route</p>
              <h3>What do you want to discuss?</h3>
            </div>
            <div className="contact-route-list">
              {inquiryRoutes.map((item) => (
                <Link
                  className="contact-route-card"
                  href={item.href}
                  key={item.title}
                  target="_blank"
                >
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </Link>
              ))}
            </div>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
