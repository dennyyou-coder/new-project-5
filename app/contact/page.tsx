import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { IconBadge, InlineIcon, type IconName } from "@/components/Icon";

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
    href: "/contact?type=sourcing#inquiry-form"
  },
  {
    icon: "calendar",
    title: "Expo Inquiry",
    text: "For companies interested in exhibiting, visiting, partnering with, or promoting cleaning industry trade shows and events.",
    href: "/contact?type=expo#inquiry-form"
  },
  {
    icon: "newspaper",
    title: "Media Inquiry",
    text: "For interviews, press releases, market insights, editorial collaboration, and industry news submissions.",
    href: "/contact?type=media#inquiry-form"
  },
  {
    icon: "message",
    title: "General Inquiry",
    text: "For other business questions, partnership ideas, or general communication with World Clean Biz.",
    href: "/contact?type=general#inquiry-form"
  }
] satisfies { icon: IconName; title: string; text: string; href: string }[];

const expertiseStats = [
  {
    value: "Since 2006",
    label: "Inside the Cleaning Industry"
  },
  {
    value: "Real Network",
    label: "Products, Sourcing, Media, Forums and Expo"
  },
  {
    value: "Industry Route",
    label: "The Right Context To The Right Channel"
  }
] satisfies { value: string; label: string }[];

const resourceCards = [
  {
    icon: "factory",
    title: "Sourcing Context",
    text: "Supplier, product category, OEM/ODM, and private label conversations."
  },
  {
    icon: "calendar",
    title: "Expo Connection",
    text: "Trade show, exhibiting, visiting, sponsorship, and event cooperation inquiries."
  },
  {
    icon: "radio",
    title: "Industry Information",
    text: "Market signals, editorial cooperation, interviews, and industry news submissions."
  }
] satisfies { icon: IconName; title: string; text: string }[];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero-contact">
        <div className="container">
          <p className="eyebrow">Contact World Clean Biz</p>
          <h1>Choose the Right Channel for Your Cleaning Industry Inquiry</h1>
          <p>
            Tell us what you are looking for. Your inquiry will be routed
            through a real cleaning industry network built from years of
            product, sourcing, media, forum and expo experience.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#inquiry-form">
              Submit Inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Inquiry Types</p>
              <h2>Choose the Right Channel</h2>
              <p>
                Start with the entry that matches your need. The form will use
                that category so your message goes in the right direction.
              </p>
            </div>
          </div>
          <div className="case-grid contact-help-grid">
            {helpCards.map((item) => (
              <Link
                className="case-card contact-help-card"
                href={item.href}
                key={item.title}
              >
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>Submit Inquiry</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft" id="inquiry-form">
        <div className="container grid-2">
          <div>
            <p className="eyebrow">
              <InlineIcon name="send" />
              Inquiry Form
            </p>
            <h2>Send Your Inquiry</h2>
            <p>
              Share the business context behind your request. A specific note
              helps us understand whether this is sourcing, expo, media,
              market information, or another cooperation opportunity.
            </p>
            <p className="meta">
              Useful details include product category, target market, expected
              quantity, event name, website, timeline, or business goal.
            </p>
          </div>
          <div className="contact-form-panel">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-expertise">
            <div>
              <p className="eyebrow">
                <InlineIcon name="badge" />
                Real Industry Network
              </p>
              <h2>Your Inquiry Goes Through A Real Cleaning Industry Network</h2>
              <p>
                World Clean Biz connects cleaning industry needs with the
                right sourcing, expo, media, market information or business
                context.
              </p>
            </div>
            <div className="contact-expertise-media">
              <div className="contact-expertise-photo">
                <img
                  src="/images/industry/about-denny-portrait-event.jpg"
                  alt="Denny You at a cleaning industry event"
                />
                <span>Industry network</span>
              </div>
              <div className="contact-expertise-grid">
                {expertiseStats.map((item) => (
                  <div className="contact-expertise-stat" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="contact-expertise-note">
                Specific context helps route each inquiry to the right channel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">World Clean Biz</p>
              <h2>Connecting Cleaning Industry Needs With The Right Resources</h2>
              <p>
                World Clean Biz connects global cleaning industry professionals
                with China sourcing opportunities, trade events, market
                information, and media collaboration.
              </p>
            </div>
          </div>
          <div className="grid-3">
            {resourceCards.map((item) => (
              <div className="card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
