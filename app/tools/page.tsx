import type { Metadata } from "next";
import Link from "next/link";
import { WCB_TOOLS } from "@/lib/tools/catalog";
import "../styles/tools.css";

export const metadata: Metadata = {
  title: "Free Tools for the Cleaning Appliance Industry",
  description:
    "Free WCB tools for cleaning appliance exporters, brands and buyers: a landed cost and US tariff calculator, an export compliance checklist for the US, EU and UK, and a cleaning robot payback calculator.",
  alternates: { canonical: "/tools" }
};

export default function ToolsPage() {
  return (
    <div className="tool-page">
      <section className="tool-hero">
        <div className="container">
          <p className="tool-crumbs">World Clean Biz</p>
          <h1>Industry tools</h1>
          <p className="tool-hero-lead">
            Free calculators and checklists for the decisions cleaning appliance companies make every week: what a shipment really costs to land, what a product needs before it can be sold, and when a cleaning robot pays for itself.
          </p>
        </div>
      </section>
      <section className="tool-body">
        <div className="container tool-cards tool-cards--hub">
          {WCB_TOOLS.map((tool, index) => (
            <Link key={tool.id} className="tool-card" href={tool.href}>
              <span className="tool-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="tool-card-audience">{tool.audience}</span>
              <strong>{tool.title}</strong>
              <span>{tool.summary}</span>
              <span className="tool-card-go">Open the tool →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
