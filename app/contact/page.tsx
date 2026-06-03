import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact World Clean Biz for cleaning industry information, sourcing context, market reports, World Clean Expo, media, partnerships, and cooperation."
};

const inquiryPaths = [
  "Industry topic or article suggestion",
  "Sourcing or supplier context question",
  "Market report or category research request",
  "World Clean Expo, media, or partnership interest"
];

const inquiryExamples = [
  {
    title: "Article or topic suggestion",
    text: "Example: Please cover European floor care demand, distributor changes, or a product category update."
  },
  {
    title: "Sourcing intelligence request",
    text: "Example: We need context on robot vacuum suppliers for a mid-range private label program."
  },
  {
    title: "Market report request",
    text: "Example: We want a focused note on commercial cleaning equipment demand in a target region."
  },
  {
    title: "Expo or media cooperation",
    text: "Example: We are interested in exhibitor, sponsor, visitor, or editorial cooperation."
  }
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero-contact">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Share Your Cleaning Industry Question</h1>
          <p>
            Send a focused question about sourcing, product categories, market
            reports, World Clean Expo, media cooperation or industry
            collaboration.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Submit a focused industry question</h2>
            <p>
              The first-phase contact system is intentionally simple. The form
              opens an email draft to denny@worldcleanbiz.com with your inquiry
              details, so the conversation can start with useful context.
            </p>
            <ul className="feature-list">
              {inquiryPaths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="tag-list">
              <span className="tag">Industry Information</span>
              <span className="tag">Sourcing / OEM</span>
              <span className="tag">World Clean Expo</span>
              <span className="tag">Market Report</span>
              <span className="tag">Media Cooperation</span>
            </div>
          </div>
          <div className="card">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Inquiry Examples</p>
              <h2>Examples of useful questions to send</h2>
              <p>
                A clear question makes it easier to connect your request with
                the right information, report direction, or cooperation path.
              </p>
            </div>
          </div>
          <div className="case-grid">
            {inquiryExamples.map((item) => (
              <div className="case-card" key={item.title}>
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
