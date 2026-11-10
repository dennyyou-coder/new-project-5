/**
 * Free WCB reports readers can request with their email. A report with a `file` is sent straight away
 * (the welcome email links to it); the others are "notify me" requests until the PDF exists.
 */

export type WcbReport = {
  id: string;
  title: string;
  pages?: number;
  cover?: string;
  /** Public path of the PDF, once it is published. */
  file?: string;
};

export const WCB_REPORTS: WcbReport[] = [
  {
    id: "next-decade-cleaning-growth",
    title: "The Next Decade of Cleaning Growth",
    pages: 13,
    cover: "/images/reports/wcb-cleaning-industry-growth-map-cover.webp",
    file: "/reports/wcb-cleaning-industry-growth-map-english-report.pdf"
  },
  { id: "pool-robot-channels-service-costs", title: "Pool Robot Channels And Service Costs" },
  { id: "robotic-lawn-mower-supply-chains", title: "Robotic Lawn Mower Supply Chains" },
  { id: "commercial-cleaning-robot-roi", title: "Commercial Cleaning Robot ROI Model" },
  { id: "china-cleaning-supplier-pack", title: "China Cleaning Supplier Pack" }
];

export const FEATURED_REPORT = WCB_REPORTS[0];

export function getReport(id: string | undefined) {
  return id ? WCB_REPORTS.find((report) => report.id === id) : undefined;
}

/** Where the welcome email's "Get your report" button points: the PDF itself, or nothing yet. */
export function reportDownloadUrl(id: string | undefined, origin: string) {
  const file = getReport(id)?.file;
  return file ? `${origin}${file}` : undefined;
}
