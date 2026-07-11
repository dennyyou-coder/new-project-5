export type BlogCtaType = "sourcing" | "reports" | "expo" | "newsletter";

export type BlogCtaDefinition = {
  type: BlogCtaType;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  form: "sourcing" | "reports" | "expo" | "newsletter";
  reportId?: string;
};

const CTA_BY_TYPE: Record<BlogCtaType, BlogCtaDefinition> = {
  sourcing: {
    type: "sourcing",
    eyebrow: "Sourcing Support",
    title: "Turn Product Research Into A Qualified Supplier Brief",
    description:
      "Share your category, target market and supplier requirements with World Clean Biz.",
    buttonLabel: "Start A Sourcing Inquiry",
    form: "sourcing"
  },
  reports: {
    type: "reports",
    eyebrow: "Market Intelligence",
    title: "Continue With The World Clean Biz Industry Report",
    description:
      "Get the current report on cleaning industry growth, categories and supplier signals.",
    buttonLabel: "Get The Report",
    form: "reports",
    reportId: "next-decade-cleaning-growth"
  },
  expo: {
    type: "expo",
    eyebrow: "World Clean Expo",
    title: "Follow The Next Cleaning Industry Platform",
    description:
      "Receive visitor registration, exhibitor, forum and business matching updates.",
    buttonLabel: "Get Expo Updates",
    form: "expo"
  },
  newsletter: {
    type: "newsletter",
    eyebrow: "Blog Updates",
    title: "Get New Cleaning Industry Articles First",
    description:
      "Receive new articles, market signals and industry notes when they are published.",
    buttonLabel: "Subscribe To Blog Updates",
    form: "newsletter"
  }
};

const SOURCING_CATEGORIES = new Set([
  "Buyer Guide",
  "Sourcing Guide",
  "Sourcing"
]);

const REPORT_CATEGORIES = new Set([
  "Market Signals",
  "Industry",
  "Supply Chain",
  "Supply Chain Analysis",
  "Commercial Cleaning"
]);

export function getBlogCta(category: string): BlogCtaDefinition {
  if (SOURCING_CATEGORIES.has(category)) return CTA_BY_TYPE.sourcing;
  if (REPORT_CATEGORIES.has(category)) return CTA_BY_TYPE.reports;
  if (category === "Trade Shows") return CTA_BY_TYPE.expo;
  return CTA_BY_TYPE.newsletter;
}

export function createBlogCtaContext({
  category,
  slug,
  location
}: {
  category: string;
  slug: string;
  location: string;
}) {
  return {
    article_category: category,
    article_slug: slug,
    cta_location: location,
    cta_type: getBlogCta(category).type
  };
}
