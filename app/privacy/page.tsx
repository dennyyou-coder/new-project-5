import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | World Clean Biz",
  description:
    "Learn how World Clean Biz handles website analytics, report requests, subscriptions and business inquiry information.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <main className="trust-page trust-legal-page">
      <section className="trust-hero trust-legal-hero">
        <div className="container trust-hero-inner">
          <p className="eyebrow">WORLD CLEAN BIZ</p>
          <h1>Privacy Policy</h1>
          <p className="trust-hero-lead">
            This policy explains what information may be processed when you
            browse World Clean Biz, request reports, subscribe for updates or
            submit a business inquiry.
          </p>
          <p className="trust-effective-date">Effective: July 12, 2026</p>
        </div>
      </section>

      <section className="section trust-legal-section">
        <div className="container trust-content">
          <article>
            <span>01</span>
            <h2>Information You Provide</h2>
            <p>
              You may choose to provide your name, company, email address,
              target market, role, product interests, business objective and
              other details included in a form or message. Please only provide
              information that is relevant to your request.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Information Collected Through The Website</h2>
            <p>
              The website may process technical and usage information such as
              device and browser type, approximate location, referring source,
              pages viewed and interactions with buttons or forms. Google
              Analytics helps us understand aggregate website use. Tally
              provides the forms used for report, sourcing, Expo and general
              business requests.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>How We Use Information</h2>
            <p>
              Information is used to respond to requests, provide selected
              materials, route inquiries to the appropriate workflow, improve
              the website and services, understand audience needs and protect
              the website against misuse.
            </p>
          </article>
          <article>
            <span>04</span>
            <h2>Service Providers And International Processing</h2>
            <p>
              We use service providers, including website hosting, Google
              Analytics and Tally, to operate the site and process requests.
              These providers may process information in locations different
              from your own and apply their own privacy and security practices.
            </p>
          </article>
          <article>
            <span>05</span>
            <h2>How We Share Information</h2>
            <p>
              World Clean Biz does not sell your personal information. We may
              share information with service providers or relevant project
              partners when necessary to operate the website, respond to your
              request, develop a requested business opportunity, comply with
              applicable obligations or protect legitimate rights.
            </p>
          </article>
          <article>
            <span>06</span>
            <h2>Retention And Security</h2>
            <p>
              We keep information for a reasonable period based on the purpose
              of the request, ongoing business needs and applicable obligations.
              Reasonable operational and technical measures are used to protect
              information, but no online system can guarantee absolute security.
            </p>
          </article>
          <article>
            <span>07</span>
            <h2>Your Choices And Requests</h2>
            <p>
              You may browse without submitting a form and may choose not to
              provide optional information. To ask a reasonable question about
              information you submitted, use the <Link href="/contact">Contact page</Link>.
            </p>
          </article>
          <article>
            <span>08</span>
            <h2>Business Audience And Children</h2>
            <p>
              World Clean Biz is intended for business and industry audiences.
              The website is not directed to children, and we do not knowingly
              seek personal information from children.
            </p>
          </article>
          <article>
            <span>09</span>
            <h2>Policy Updates</h2>
            <p>
              This policy may be updated as the website, services or applicable
              requirements change. The effective date above shows the current
              published version.
            </p>
          </article>
          <article>
            <span>10</span>
            <h2>Contact</h2>
            <p>
              For privacy questions connected with World Clean Biz, submit a
              general business message through our <Link href="/contact">Contact page</Link>.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
