import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the terms governing World Clean Biz industry content, reports, sourcing opportunities and website use.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <main className="trust-page trust-legal-page">
      <section className="trust-hero trust-legal-hero">
        <div className="container trust-hero-inner">
          <p className="eyebrow">WORLD CLEAN BIZ</p>
          <h1>Terms of Use</h1>
          <p className="trust-hero-lead">
            These terms explain the boundaries that apply when you use World
            Clean Biz content, reports, sourcing information and business
            connection services.
          </p>
          <p className="trust-effective-date">Effective: July 12, 2026</p>
        </div>
      </section>

      <section className="section trust-legal-section">
        <div className="container trust-content">
          <article>
            <span>01</span>
            <h2>Using This Website</h2>
            <p>
              By using this website, you agree to use it lawfully and in a way
              that does not interfere with the website, other users or World
              Clean Biz operations. The site is designed primarily for business
              and cleaning industry audiences.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Industry Content And Estimates</h2>
            <p>
              Articles, reports, market sizes, forecasts and industry views may
              draw on public information, professional discussions and World
              Clean Biz estimates. Markets change, sources may be incomplete
              and published information may not remain current.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>No Professional Advice</h2>
            <p>
              Website content is general business information and is not
              investment, legal, tax, certification or other professional
              advice. You should obtain appropriate independent advice before
              making decisions that require it.
            </p>
          </article>
          <article>
            <span>04</span>
            <h2>Sourcing, Reports And Expo Opportunities</h2>
            <p>
              Product availability, pricing, minimum order quantities, timing,
              samples, testing, certification, quality activities and other
              commercial terms must be confirmed in writing for the specific
              project. Expo participation and business matching opportunities
              are also subject to the applicable event information and written
              arrangements.
            </p>
          </article>
          <article>
            <span>05</span>
            <h2>Intellectual Property</h2>
            <p>
              World Clean Biz branding, original editorial work, reports and
              page materials are protected by applicable intellectual property
              rules. Normal browsing and reasonable internal business reference
              are permitted. Large-scale copying, resale or republication
              requires prior permission.
            </p>
          </article>
          <article>
            <span>06</span>
            <h2>Acceptable Use</h2>
            <p>
              You must not submit unlawful, harmful or deliberately misleading
              information, attempt unauthorized access, interfere with site
              operation, misuse contact channels or use automated methods that
              place an unreasonable burden on the service.
            </p>
          </article>
          <article>
            <span>07</span>
            <h2>Third-Party Services And Links</h2>
            <p>
              Forms, analytics, linked websites and other third-party services
              are operated under their own terms and practices. A link or
              integration does not make World Clean Biz responsible for a third
              party&apos;s content, availability or conduct.
            </p>
          </article>
          <article>
            <span>08</span>
            <h2>Availability And Disclaimer</h2>
            <p>
              The website is provided on an as-available basis. We may correct,
              update, suspend or remove content and features. We do not promise
              uninterrupted access or that general website information is
              complete, error-free or suitable for every business purpose.
            </p>
          </article>
          <article>
            <span>09</span>
            <h2>Limitation Of Responsibility</h2>
            <p>
              To the extent permitted by applicable law, World Clean Biz is not
              responsible for indirect or consequential loss arising from use
              of the website or decisions based solely on general site content.
              Responsibilities for a paid or written project are determined by
              the applicable project agreement.
            </p>
          </article>
          <article>
            <span>10</span>
            <h2>Changes And Contact</h2>
            <p>
              These terms may be updated as the website and services develop.
              Questions about these terms can be submitted through the
              {" "}<Link href="/contact">Contact page</Link>.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
