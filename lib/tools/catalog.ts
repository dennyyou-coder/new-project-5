/** WCB industry tools: the /tools hub, sitemap and the results email share this list. */

export type ToolId = "landed-cost" | "export-compliance" | "cleaning-robot-roi" | "container-loading" | "retail-to-fob" | "battery-shipping";

export type WcbTool = {
  id: ToolId;
  href: string;
  title: string;
  /** Short name for buttons and the email subject. */
  short: string;
  summary: string;
  audience: string;
  /** Shown in the homepage "For business" row. */
  home?: boolean;
};

export const WCB_TOOLS: WcbTool[] = [
  {
    id: "landed-cost",
    href: "/tools/landed-cost-calculator",
    title: "Landed cost and tariff calculator",
    short: "landed cost",
    summary: "Factory price to landed cost in the US, EU or UK: Section 301 duties, EU and UK duty, customs fees and import VAT.",
    audience: "Exporters and importers",
    home: true
  },
  {
    id: "export-compliance",
    href: "/tools/export-compliance-checklist",
    title: "Export compliance checklist",
    short: "compliance checklist",
    summary: "The certifications and rules a robot vacuum, cordless vacuum, pool robot or robotic mower needs in the US, EU and UK, with the dates that matter.",
    audience: "Manufacturers and brands",
    home: true
  },
  {
    id: "cleaning-robot-roi",
    href: "/tools/cleaning-robot-roi-calculator",
    title: "Cleaning robot payback calculator",
    short: "robot payback",
    summary: "How many cleaning hours a commercial floor robot frees up, what it saves each year and how many months it takes to pay back.",
    audience: "Facility managers and dealers",
    home: true
  },
  {
    id: "container-loading",
    href: "/tools/container-loading-calculator",
    title: "Container loading calculator",
    short: "container loading",
    summary: "How many cartons and units fit in a 20GP, 40GP or 40HQ, whether space or weight runs out first, and the sea freight per unit.",
    audience: "Exporters and buyers"
  },
  {
    id: "retail-to-fob",
    href: "/tools/retail-to-fob-price-calculator",
    title: "Retail price to FOB calculator",
    short: "retail to FOB",
    summary: "Work back from a shelf price on Amazon or in a retail chain to the highest factory price that still leaves the brand its margin, or forward from FOB to retail.",
    audience: "Brands and factories"
  },
  {
    id: "battery-shipping",
    href: "/tools/lithium-battery-shipping-checker",
    title: "Lithium battery shipping checker",
    short: "battery shipping",
    summary: "Watt-hours, the UN number and what air and sea freight need for a cordless vacuum, floor washer or power tool battery under the 2026 rules.",
    audience: "Exporters and logistics teams"
  }
];

export const getTool = (id: string) => WCB_TOOLS.find((tool) => tool.id === id);

export const CURRENCIES = { USD: "$", EUR: "€", GBP: "£", CNY: "¥" } as const;
export type Currency = keyof typeof CURRENCIES;

export function money(value: number, currency: Currency = "USD", digits = 0) {
  const sign = value < 0 ? "-" : "";
  return `${sign}${CURRENCIES[currency]}${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function fixed(value: number, digits = 1) {
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** Trackers: lists WCB keeps up to date from official sources, shown with the tools on /tools. */
export type WcbTracker = { id: "recalls" | "launch-radar" | "rules-calendar"; href: string; title: string; summary: string; cadence: string };

export const WCB_TRACKERS: WcbTracker[] = [
  {
    id: "recalls",
    href: "/recalls",
    title: "Product recall tracker",
    summary: "US and EU recalls of cleaning appliances, home appliances and power tools, with the hazard, the units and where they were made.",
    cadence: "Updated weekly"
  },
  {
    id: "launch-radar",
    href: "/launch-radar",
    title: "Launch radar: FCC filings",
    summary: "New FCC authorizations from robot, appliance and tool makers, often the first public sign of a product coming to the US.",
    cadence: "Updated weekly"
  },
  {
    id: "rules-calendar",
    href: "/rules-calendar",
    title: "Trade and product rules calendar",
    summary: "Tariff deadlines, FCC rules and EU regulations coming into force, with days to go.",
    cadence: "Updated as rules change"
  }
];
