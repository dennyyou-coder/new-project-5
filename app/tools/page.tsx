import type { Metadata } from "next";
import { CollectionSchema } from "@/components/seo/CollectionSchema";
import Link from "next/link";
import { WCB_TOOLS, WCB_TRACKERS } from "@/lib/tools/catalog";
import { ToolScreen } from "@/components/tools/ToolScreen";
import "../styles/tools.css";

export const metadata: Metadata = {
  title: "Free Tools and Trackers for Appliance and Power Tool Companies",
  description:
    "Free tools for appliance and power tool companies: landed cost, container loading, retail-to-FOB pricing, battery shipping, compliance, recalls and FCC radar.",
  alternates: { canonical: "/tools" }
};

export default function ToolsPage() {
  return (
    <div className="tool-page">
      <section className="tool-hero">
        <div className="container">
          <p className="tool-crumbs">World Clean Biz</p>
          <h1>Tools and trackers</h1>
          <p className="tool-hero-lead">
            Free calculators for the decisions appliance, cleaning and power tool companies make every week, and trackers that keep watch on recalls, new FCC filings and the trade rules that change what it costs to sell.
          </p>
        </div>
      </section>
      <section className="tool-body">
        <div className="container">
          <h2 className="tool-hub-title">Calculators and checklists</h2>
          <div className="tool-cards tool-cards--hub">
            {WCB_TOOLS.map((tool, index) => (
              <Link key={tool.id} className="tool-card tool-card--preview" href={tool.href}>
                <ToolScreen id={tool.id} />
                <span className="tool-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="tool-card-audience">{tool.audience}</span>
                <strong>{tool.title}</strong>
                <span>{tool.summary}</span>
                <span className="tool-card-go">Open the tool →</span>
              </Link>
            ))}
          </div>
          <h2 className="tool-hub-title">Industry radar</h2>
          <div className="tool-cards tool-cards--hub">
            {WCB_TRACKERS.map((tracker) => (
              <Link key={tracker.id} className="tool-card" href={tracker.href}>
                <span className="tool-card-audience">{tracker.cadence}</span>
                <strong>{tracker.title}</strong>
                <span>{tracker.summary}</span>
                <span className="tool-card-go">Open the tracker →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CollectionSchema name="Tools and trackers" description="Free calculators, checklists and trackers for appliance, cleaning and power tool companies." path="/tools" items={[...WCB_TOOLS, ...WCB_TRACKERS].map((item) => ({ name: item.title, url: item.href }))} />
    </div>
  );
}
