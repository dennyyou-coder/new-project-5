export const CONTENT_CLASSES = ["editorial", "search"] as const;
export type ContentClass = (typeof CONTENT_CLASSES)[number];

export const GUIDE_TYPES = [
  "buying",
  "ownership",
  "comparison",
  "sourcing",
  "maintenance",
  "explainer"
] as const;
export type GuideType = (typeof GUIDE_TYPES)[number];

export const GUIDE_TYPE_CONFIG = [
  {
    type: "buying",
    label: "Buying Guides",
    description: "Choose products, features and service models with clearer trade-offs.",
    href: "/guides/buying"
  },
  {
    type: "ownership",
    label: "Brand Ownership",
    description: "Understand the companies, brands and manufacturing relationships behind the market.",
    href: "/guides/ownership"
  },
  {
    type: "comparison",
    label: "Product Comparisons",
    description: "Compare product architecture, ownership cost, support and channel fit.",
    href: "/guides/comparison"
  },
  {
    type: "sourcing",
    label: "OEM & Sourcing",
    description: "Evaluate suppliers, manufacturing cost, compliance and distribution readiness.",
    href: "/guides/sourcing"
  },
  {
    type: "maintenance",
    label: "Maintenance & Troubleshooting",
    description: "Solve ownership, service and product-care problems.",
    href: "/guides/maintenance"
  },
  {
    type: "explainer",
    label: "Technology & Market Explainers",
    description: "Understand product technologies, market structures and industry terminology.",
    href: "/guides/explainer"
  }
] as const satisfies ReadonlyArray<{
  type: GuideType;
  label: string;
  description: string;
  href: `/guides/${GuideType}`;
}>;

export function isContentClass(value: string): value is ContentClass {
  return CONTENT_CLASSES.includes(value as ContentClass);
}

export function isGuideType(value: string): value is GuideType {
  return GUIDE_TYPES.includes(value as GuideType);
}
