import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact World Clean Biz for sourcing, OEM, market reports, World Clean Expo, partnerships, and cooperation."
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Contact Denny You</h1>
          <p>
            Send a sourcing request, expo inquiry, market report request, or
            cooperation message.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Send an inquiry</h2>
            <p>
              First-phase contact is intentionally simple. The form opens an
              email draft to denny@worldcleanbiz.com with your inquiry details.
            </p>
            <ul className="feature-list">
              <li>For sourcing, include category, market, and target price range if available.</li>
              <li>For expo interest, mention exhibitor, visitor, sponsor, or partner inquiry.</li>
              <li>For reports, describe the category, region, or buyer question you need answered.</li>
            </ul>
            <div className="tag-list">
              <span className="tag">Sourcing / OEM</span>
              <span className="tag">World Clean Expo</span>
              <span className="tag">Market Report</span>
              <span className="tag">General Cooperation</span>
            </div>
          </div>
          <div className="card">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
