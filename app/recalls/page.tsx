import type { Metadata } from "next";
import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { RadarHero } from "@/components/radar/RadarHero";
import { RecallList } from "@/components/radar/RecallList";
import { SECTORS } from "@/lib/radar/classify";
import { RECALLS_UPDATED, getRecalls, shortDate } from "@/lib/radar/data";
import "../styles/tools.css";
import "../styles/radar.css";

export const metadata: Metadata = {
  title: "Product Recall Tracker: Appliances, Cleaning and Power Tools (US and EU)",
  description:
    "Every 2026 US CPSC and EU Safety Gate recall of vacuums, pressure washers, kitchen and home appliances, heaters, hair dryers, power tools and garden machinery, with hazards, units and country of manufacture.",
  alternates: { canonical: "/recalls" }
};

export default function RecallsPage() {
  const recalls = getRecalls();
  const china = recalls.filter((recall) => recall.madeIn?.includes("China")).length;
  const withOrigin = recalls.filter((recall) => recall.madeIn).length;
  const us = recalls.filter((recall) => recall.source === "CPSC").length;
  return (
    <div className="tool-page radar-page">
      <RadarHero
        title="Product recall tracker"
        lead="Recalls and safety alerts for cleaning appliances, home appliances and power tools in the US and the EU, from the official notices. Know what failed, why, and where it was made."
        updated={shortDate(RECALLS_UPDATED)}
        sources="US CPSC and EU Safety Gate"
      />
      <section className="tool-body">
        <div className="container">
          <div className="radar-stats">
            <div><strong>{recalls.length}</strong><span>recalls and alerts in 2026</span></div>
            <div><strong>{Math.round((china / Math.max(withOrigin, 1)) * 100)}%</strong><span>made in China, where the notice says</span></div>
            {SECTORS.map((sector) => (
              <div key={sector.value}><strong>{recalls.filter((recall) => recall.sector === sector.value).length}</strong><span>{sector.label.toLowerCase()}</span></div>
            ))}
            <div><strong>{us} / {recalls.length - us}</strong><span>US / EU</span></div>
          </div>
          <div className="radar-layout">
            <RecallList recalls={recalls} />
            <aside className="radar-aside">
              <div className="radar-card">
                <h2>Recall alerts by email</h2>
                <p>New recalls in your categories, in the WCB weekly brief every Friday.</p>
                <TallyButton className="radar-button" ctaLocation="recalls_alerts" form="newsletter">Get the weekly brief</TallyButton>
              </div>
              <div className="radar-card">
                <h2>Selling into the US or EU?</h2>
                <p>Check the certifications your product needs and the deadlines coming up.</p>
                <Link href="/tools/export-compliance-checklist">Export compliance checklist →</Link>
                <Link href="/rules-calendar">Trade and product rules calendar →</Link>
              </div>
              <div className="radar-card radar-method">
                <h2>How this list is built</h2>
                <p>
                  Each week WCB pulls the US Consumer Product Safety Commission recalls and the EU Safety Gate weekly report, keeps cleaning appliances, home appliances and power tools, and checks each one before it is published. Every entry links to the official notice. Hazards are quoted from the notice.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
