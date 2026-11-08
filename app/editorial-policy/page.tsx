import type { Metadata } from "next";
import Link from "next/link";
import "../styles/trust.css";

export const metadata: Metadata = {
  title: "Editorial Standards",
  description: "How World Clean Biz sources, verifies, labels and corrects its news and analysis on the cleaning industry, and how it keeps editorial and commercial work apart.",
  alternates: { canonical: "/editorial-policy" }
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <>
        World Clean Biz covers the global cleaning industry for people who work in it: brands, manufacturers, component suppliers, distributors and buyers. Analysis is written by the founder and editor, <Link href="/authors/denny-you">Denny You</Link>. News is produced by the <Link href="/authors/wcb-editorial">WCB news desk</Link> and approved by the editor before it is published.
      </>
    )
  },
  {
    title: "Sources",
    body: "We report from primary sources wherever they exist: company announcements and product pages, financial filings and results releases, regulators' documents (such as the FCC and the European Commission) and official trade-show material. Each story lists its sources, and figures are given as the company or authority states them, with the period they cover."
  },
  {
    title: "Verification and labelling",
    body: "Facts are checked against the original document before publication. When a fact comes from a single secondary source, or a company's claim cannot be checked independently (for example \"world's first\" or laboratory results), we say so in the text. Reported but unconfirmed figures are labelled as unconfirmed. Each news story shows the date of the event and the date WCB published it, and any later update is dated."
  },
  {
    title: "Corrections",
    body: (
      <>
        If we get something wrong we correct it in the story and note the change with the update date. Significant corrections say what was changed. To report an error, send a message through the <Link href="/contact">Contact page</Link> with the page address and the correction; we aim to review it within two working days.
      </>
    )
  },
  {
    title: "Independence",
    body: "Coverage decisions are editorial. Companies cannot pay to be covered, to change a story or to be placed higher in rankings or lists. WCB also runs WCB Expo and business services; companies that exhibit or work with WCB receive no different editorial treatment. If WCB ever publishes paid content, it will be clearly labelled as sponsored or partner content and kept apart from news and analysis."
  },
  {
    title: "Use of tools",
    body: "We use software tools, including AI tools, to help with research, translation and drafting. They do not decide what we publish: every story is checked against its sources and approved by the editor before publication, and the editor is responsible for what appears on the site."
  },
  {
    title: "Images",
    body: "We use official company images, photographs from events we attend, public-domain material and openly licensed photographs, credited as their licences require. Product renders are not presented as photographs of real use, and images are not altered to change what they show."
  }
];

export default function EditorialPolicyPage() {
  return (
    <div className="trust-page trust-legal-page">
      <section className="trust-hero trust-legal-hero">
        <div className="container trust-hero-inner">
          <p className="eyebrow">World Clean Biz</p>
          <h1>Editorial Standards</h1>
          <p className="trust-hero-lead">How we source, check, label and correct our news and analysis, and how we keep editorial work separate from WCB&apos;s commercial activities.</p>
          <p className="trust-effective-date">Effective: November 7, 2026</p>
        </div>
      </section>
      <section className="section trust-legal-section">
        <div className="container trust-content">
          {SECTIONS.map((section, index) => (
            <article key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
