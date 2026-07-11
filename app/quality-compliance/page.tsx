import type { Metadata } from "next";
import { TallyButton } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "Quality & Compliance | Cleaning Product Sourcing",
  description:
    "Understand how World Clean Biz coordinates product requirements, supplier evaluation, samples, quality activities and market-specific compliance work.",
  alternates: { canonical: "/quality-compliance" }
};

const stages = [
  {
    number: "01",
    title: "Define",
    text: "Clarify the target market, intended use, written specifications, commercial priorities and the risks that matter most."
  },
  {
    number: "02",
    title: "Evaluate",
    text: "Compare product routes, suppliers, components, manufacturing capability and practical project fit."
  },
  {
    number: "03",
    title: "Confirm",
    text: "Use samples, written specifications, packaging requirements and agreed criteria to establish the project baseline."
  },
  {
    number: "04",
    title: "Monitor",
    text: "Coordinate production, agreed inspection activity, issue follow-up and changes that could affect the approved baseline."
  },
  {
    number: "05",
    title: "Document",
    text: "Organize the testing, compliance, inspection and delivery documents agreed for the product and target market."
  }
];

const responsibilities = [
  {
    title: "World Clean Biz Coordination",
    text: "We help define the project, organize information, coordinate suppliers and manage the quality activities agreed in writing."
  },
  {
    title: "Supplier Responsibility",
    text: "The supplier remains responsible for manufacturing, materials, process control and the accuracy of information it provides."
  },
  {
    title: "Testing Partner Responsibility",
    text: "Independent laboratories and certification bodies remain responsible for their tests, reports and issued documents."
  },
  {
    title: "Buyer Responsibility",
    text: "The buyer confirms the target market, intended use and the final import, sale, labeling and local compliance requirements."
  }
];

export default function QualityCompliancePage() {
  return (
    <main className="trust-page trust-quality-page">
      <section className="trust-hero trust-quality-hero">
        <div className="container trust-hero-inner">
          <p className="eyebrow">QUALITY &amp; COMPLIANCE</p>
          <h1>Quality Starts With Clear Requirements.</h1>
          <p className="trust-hero-lead">
            A reliable sourcing project begins before production. World Clean
            Biz helps turn market needs into written product requirements,
            coordinated checkpoints and clearer responsibilities across the
            project.
          </p>
          <TallyButton
            className="button"
            ctaLocation="quality_compliance_cta"
            form="sourcing"
            inquiryIntent="quality_compliance"
            inquiryType="sourcing"
            trackClick
          >
            Discuss Quality Requirements
          </TallyButton>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container">
          <div className="trust-section-heading">
            <p className="eyebrow">FROM REQUIREMENT TO DELIVERY</p>
            <h2>Five Stages For A Better-Controlled Project.</h2>
            <p>
              The exact scope changes by product, order and target market. The
              operating principle remains consistent: define the requirement,
              confirm the baseline and document the agreed work.
            </p>
          </div>
          <div className="trust-process-grid trust-quality-process">
            {stages.map((stage) => (
              <article key={stage.title}>
                <span>{stage.number}</span>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section trust-section trust-section-soft">
        <div className="container">
          <div className="trust-section-heading">
            <p className="eyebrow">RESPONSIBILITY BY ROLE</p>
            <h2>Clear Roles Create Better Outcomes.</h2>
            <p>
              Quality and compliance are shared across the commercial and
              technical chain. Clear ownership reduces assumptions and makes
              project decisions easier to verify.
            </p>
          </div>
          <div className="trust-responsibility-grid">
            {responsibilities.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section trust-boundary-section">
        <div className="container trust-boundary-grid">
          <div>
            <p className="eyebrow">IMPORTANT BOUNDARY</p>
            <h2>Requirements Depend On The Product And Market.</h2>
          </div>
          <div>
            <p>
              Testing, certification, inspection, labeling and documentation
              requirements vary by product, intended use, sales channel and
              destination market. The applicable scope must be agreed in
              writing for each project.
            </p>
            <p>
              World Clean Biz coordinates the agreed process but does not
              replace the responsibilities of manufacturers, independent
              laboratories, certification bodies, importers or local advisers.
            </p>
          </div>
        </div>
      </section>

      <section className="section trust-cta-section">
        <div className="container trust-cta">
          <div>
            <p className="eyebrow">START WITH THE TARGET MARKET</p>
            <h2>Define The Requirements Before Choosing The Product.</h2>
            <p>
              Share the product category, destination market and project stage.
              We will help identify the questions that need to be answered first.
            </p>
          </div>
          <TallyButton
            className="button"
            ctaLocation="quality_compliance_cta"
            form="sourcing"
            inquiryIntent="quality_compliance"
            inquiryType="sourcing"
            trackClick
          >
            Discuss Quality Requirements
          </TallyButton>
        </div>
      </section>
    </main>
  );
}
