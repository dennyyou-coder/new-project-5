"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { WCB_TOOLS, type ToolId } from "@/lib/tools/catalog";
import { trackTool } from "./ToolParts";
import "@/app/styles/tools.css";

// The calculators load only when a reader opens one, so the homepage stays light.
const loading = () => <p className="tool-dialog-loading">Loading the tool…</p>;
const LandedCostCalculator = dynamic(() => import("./LandedCostCalculator").then((m) => m.LandedCostCalculator), { ssr: false, loading });
const ComplianceChecklist = dynamic(() => import("./ComplianceChecklist").then((m) => m.ComplianceChecklist), { ssr: false, loading });
const RoiCalculator = dynamic(() => import("./RoiCalculator").then((m) => m.RoiCalculator), { ssr: false, loading });

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Each tool has its own colour and a picture of what it is about: a container ship, a certification shield, money coming back. */
const TOOL_LOOK: Record<ToolId, { title: string; line: string; color: string; icon: ReactNode }> = {
  "landed-cost": {
    title: "Landed cost calculator",
    line: "US, EU and UK duties, fees and VAT on your shipment",
    color: "#2457d6",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
        <path d="M5 13V8h4v5M9 10h4v3M13 7h4v6" />
        <path d="M3 13h18l-2.2 5H5.2z" />
        <path d="M2 21c1.3 0 1.3-1 2.7-1s1.3 1 2.6 1 1.4-1 2.7-1 1.4 1 2.7 1 1.3-1 2.6-1 1.4 1 2.7 1 1.3-1 2.6-1" />
      </svg>
    )
  },
  "export-compliance": {
    title: "Export compliance checklist",
    line: "FCC, CE, UKCA and the 2027 deadlines for your product",
    color: "#14855a",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
        <path d="M12 2.8 4.5 5.6v5.9c0 4.6 3.1 8.2 7.5 9.7 4.4-1.5 7.5-5.1 7.5-9.7V5.6z" />
        <path d="m8.6 12 2.4 2.4 4.6-4.8" />
      </svg>
    )
  },
  "cleaning-robot-roi": {
    title: "Robot payback calculator",
    line: "Hours freed and months to pay back a floor robot",
    color: "#d9661f",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
        <path d="M20 3.8v4.4h-4.4" />
        <path d="M12 7v10" />
        <path d="M14.6 9.4c-.4-.9-1.3-1.4-2.6-1.4-1.5 0-2.6.8-2.6 1.9 0 2.7 5.3 1.5 5.3 4.3 0 1.1-1.1 1.9-2.7 1.9-1.3 0-2.3-.6-2.7-1.6" />
      </svg>
    )
  }
};

function ToolBody({ id }: { id: ToolId }) {
  if (id === "landed-cost") return <LandedCostCalculator />;
  if (id === "export-compliance") return <ComplianceChecklist today={new Date().toISOString().slice(0, 10)} />;
  return <RoiCalculator />;
}

/** Homepage tool cards. A click opens the tool in a dialog over the homepage; the card stays a real link for new tabs and crawlers. */
export function HomeToolCards() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<ToolId | null>(null);
  const tool = open ? WCB_TOOLS.find((item) => item.id === open)! : null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    document.documentElement.classList.toggle("tool-dialog-lock", Boolean(open));
  }, [open]);

  function launch(event: MouseEvent<HTMLAnchorElement>, id: ToolId) {
    // Let modified clicks (new tab, new window) through to the full page.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setOpen(id);
    trackTool("tool_open", id, { surface: "home_dialog" });
  }

  return (
    <>
      {WCB_TOOLS.map((item) => {
        const look = TOOL_LOOK[item.id];
        return (
          <a key={item.id} className="home-b-tool" href={item.href} onClick={(event) => launch(event, item.id)} aria-haspopup="dialog">
            <span className="home-b-tool-icon" style={{ background: look.color }} aria-hidden="true">{look.icon}</span>
            <span className="home-b-tool-copy">
              <span className="home-b-biz-kicker">Free tool</span>
              <strong>{look.title}</strong>
              <span>{look.line}</span>
            </span>
            <span className="home-b-tool-go" aria-hidden="true">→</span>
          </a>
        );
      })}
      <dialog
        ref={dialog}
        className="tool-dialog"
        aria-labelledby="tool-dialog-title"
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(null);
        }}
      >
        {tool ? (
          <div className="tool-dialog-inner">
            <div className="tool-dialog-head">
              <span className="tool-dialog-icon" style={{ background: TOOL_LOOK[tool.id].color }} aria-hidden="true">{TOOL_LOOK[tool.id].icon}</span>
              <div>
                <h2 id="tool-dialog-title">{tool.title}</h2>
                <p>{tool.summary}</p>
              </div>
              <Link className="tool-dialog-full" href={tool.href}>Full page</Link>
              <button type="button" className="tool-dialog-close" onClick={() => setOpen(null)} aria-label="Close">×</button>
            </div>
            <div className="tool-dialog-body tool-page">
              <ToolBody id={tool.id} />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
