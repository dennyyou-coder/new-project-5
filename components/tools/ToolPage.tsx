import Link from "next/link";
import type { ReactNode } from "react";
import { WCB_TOOLS, type ToolId } from "@/lib/tools/catalog";

export type ToolSource = { label: string; href?: string };

/** Shared frame for a tool page: short hero, the tool, method and sources, and the other tools. */
export function ToolPage({
  id,
  title,
  lead,
  updated,
  children,
  method,
  sources
}: {
  id: ToolId;
  title: string;
  lead: string;
  updated: string;
  children: ReactNode;
  method: ReactNode;
  sources: ToolSource[];
}) {
  const tool = WCB_TOOLS.find((item) => item.id === id)!;
  // Four other tools keep the two-column grid even.
  const others = WCB_TOOLS.filter((item) => item.id !== id).slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://worldcleanbiz.com${tool.href}`,
    description: tool.summary,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "World Clean Biz", url: "https://worldcleanbiz.com" }
  };
  return (
    <div className="tool-page">
      <section className="tool-hero">
        <div className="container">
          <p className="tool-crumbs">
            <Link href="/tools">Tools and trackers</Link> <span aria-hidden="true">/</span> {tool.audience}
          </p>
          <h1>{title}</h1>
          <p className="tool-hero-lead">{lead}</p>
          <p className="tool-updated">Free · no sign-up · data checked {updated}</p>
        </div>
      </section>
      <section className="tool-body">
        <div className="container">{children}</div>
      </section>
      <section className="tool-method">
        <div className="container tool-method-inner">
          <div>
            <h2>How it works</h2>
            {method}
          </div>
          <div>
            <h2>Sources</h2>
            <ul className="tool-sources">
              {sources.map((source) => (
                <li key={source.label}>
                  {source.href ? (
                    source.href.startsWith("/") ? <Link href={source.href}>{source.label}</Link> : <a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a>
                  ) : (
                    source.label
                  )}
                </li>
              ))}
            </ul>
            <p className="tool-disclaimer">A guide to help you plan, not legal, tax or customs advice. Spotted something out of date? <Link href="/contact">Tell us</Link>.</p>
          </div>
        </div>
      </section>
      <section className="tool-more">
        <div className="container">
          <h2>More WCB tools</h2>
          <div className="tool-cards">
            {others.map((item) => (
              <Link key={item.id} className="tool-card" href={item.href}>
                <span className="tool-card-audience">{item.audience}</span>
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
