import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inquiry Received",
  description:
    "See what happens after a World Clean Biz sourcing, Expo, report or business inquiry.",
  alternates: { canonical: "/inquiry-received" },
  robots: { index: false, follow: true }
};

const process = [
  {
    number: "01",
    title: "Review",
    text: "We review the company, market, objective and context you shared."
  },
  {
    number: "02",
    title: "Route",
    text: "Your request is directed to the right sourcing, Expo, reports or business workflow."
  },
  {
    number: "03",
    title: "Respond",
    text: "A team member follows up with the most relevant next step or any questions we need to clarify."
  }
];

const nextSteps = [
  {
    eyebrow: "PRODUCT & SUPPLY CHAIN",
    title: "Explore Sourcing",
    text: "Review product opportunity, OEM/ODM and China-side execution support.",
    href: "/sourcing"
  },
  {
    eyebrow: "INDUSTRY CONNECTIONS",
    title: "Explore World Clean Expo",
    text: "See the exhibitor, visitor and business connection opportunities taking shape.",
    href: "/world-clean-expo"
  },
  {
    eyebrow: "MARKET INTELLIGENCE",
    title: "Explore Market Reports",
    text: "Use selected research to sharpen product and market decisions.",
    href: "/reports"
  }
];

export default function InquiryReceivedPage() {
  return (
    <main className="trust-page trust-received-page">
      <section className="trust-hero trust-received-hero">
        <div className="container trust-hero-inner">
          <span className="trust-status-mark" aria-hidden="true">✓</span>
          <p className="eyebrow">INQUIRY RECEIVED</p>
          <h1>Your Inquiry Is In The Right Place.</h1>
          <p className="trust-hero-lead">
            If you have just completed a World Clean Biz form, your information
            will be reviewed and routed according to the business objective you
            selected.
          </p>
          <Link className="button-secondary" href="/">
            Return To World Clean Biz
          </Link>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container">
          <div className="trust-section-heading">
            <p className="eyebrow">WHAT HAPPENS NEXT</p>
            <h2>One Inquiry. A Clear Human Review.</h2>
            <p>
              Relevant B2B requests normally receive initial human contact
              within eight hours. More complex requests may require additional
              context before a useful direction can be prepared.
            </p>
          </div>
          <div className="trust-process-grid">
            {process.map((step) => (
              <article key={step.title}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section trust-section trust-section-soft">
        <div className="container">
          <div className="trust-section-heading">
            <p className="eyebrow">CONTINUE EXPLORING</p>
            <h2>Use The Platform While We Review Your Request.</h2>
          </div>
          <div className="trust-next-grid">
            {nextSteps.map((item) => (
              <Link href={item.href} key={item.title}>
                <span>{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <strong>Continue →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
