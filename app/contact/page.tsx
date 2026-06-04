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
    icon: "radio",
    title: "Industry Information",
    text: "Market trends, category questions, industry developments and product signals."
  },
  {
    icon: "factory",
    title: "Sourcing / OEM",
    text: "Product sourcing, OEM, ODM, private label and China supplier questions."
  },
  {
    icon: "file",
    title: "Market Reports",
    text: "Category research, market intelligence and report requests."
  },
  {
    icon: "calendar",
    title: "World Clean Expo",
    text: "Exhibiting, visiting, sponsorship and event cooperation."
  },
  {
    icon: "megaphone",
    title: "Media & Cooperation",
    text: "Interviews, partnerships, content cooperation and industry collaboration."
  }
] satisfies { icon: IconName; title: string; text: string }[];

const reachOutReasons = [
  {
    icon: "badge",
    title: "Industry Knowledge",
    text: "20+ years of cleaning industry experience across products, factories, brands and supply chains."
  },
  {
    icon: "network",
    title: "Global Industry Network",
    text: "Connections with manufacturers, suppliers, brands, buyers and industry professionals."
  },
  {
    icon: "target",
    title: "Business Opportunities",
    text: "Support for product opportunities, sourcing projects, market information and industry collaboration."
  }
] satisfies { icon: IconName; title: string; text: string }[];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero-contact">
        <div className="container">
          <p className="eyebrow">Inquiry</p>
          <h1>Share Your Cleaning Industry Question</h1>
          <p>
            Whether you're looking for sourcing support, market information,
            industry connections or business opportunities, we'd love to hear
            from you.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#inquiry-form">
              Send Your Inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Inquiry Types</p>
              <h2>What Can We Help With?</h2>
              <p>
                Choose the direction that best matches your question, project
                or cooperation idea.
              </p>
            </div>
          </div>
          <div className="case-grid contact-help-grid">
            {helpCards.map((item) => (
              <div className="case-card contact-help-card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
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
              Tell us what you are exploring. The more specific your question,
              the easier it is for us to understand how we can help.
            </p>
            <p className="meta">
              Please include your product category, target market, expected
              quantity or business goal if relevant.
            </p>
          </div>
          <div className="contact-form-panel">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why Reach Out</p>
              <h2>Why Reach Out?</h2>
              <p>
                World Clean Biz connects industry knowledge, supplier context
                and business opportunities across the cleaning industry.
              </p>
            </div>
          </div>
          <div className="grid-3">
            {reachOutReasons.map((item) => (
              <div className="card" key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div className="grid-2">
            <div>
              <IconBadge name="message" />
              <h2>Every Great Business Opportunity Starts With A Conversation.</h2>
              <p>
                Tell us what you're exploring. We'll help you find the right
                direction.
              </p>
            </div>
            <div>
              <Link className="button" href="#inquiry-form">
                Send Your Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
