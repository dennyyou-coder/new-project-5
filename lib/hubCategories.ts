import type { BrandCategorySlug } from "@/lib/brandCategories";

// Category hubs shared by the navigation, /categories pages and filters.
// Membership is derived from fields the content already has. Only content
// that cannot be classified this way should set `hub_categories` in its
// frontmatter, using the slugs below.

export const HUB_CATEGORY_SLUGS = [
  "robot-vacuums",
  "vacuum-cleaners",
  "floor-washers",
  "pool-robots",
  "robotic-mowers",
  "commercial-cleaning",
  "window-robots",
  "small-appliances",
  "power-tools-outdoor"
] as const;

export type HubCategorySlug = (typeof HUB_CATEGORY_SLUGS)[number];
export type HubCategoryGroup = "core-cleaning" | "adjacent-industries";

type HubRules = {
  /** Normalized article categories (lib/categories.ts). */
  articleCategories?: string[];
  /** Article tags, matched case-insensitively. */
  articleTags?: string[];
  /** News `category` values. */
  newsCategories?: string[];
  /** Whole words or phrases matched case-insensitively in news titles. */
  newsTitleTerms?: string[];
  /** `category` values in content/product-models.json. */
  productCategories?: string[];
  /** Brand directory categories (lib/brandCategories.ts). */
  brandCategories?: BrandCategorySlug[];
  /**
   * Company profiles whose own product portfolio covers the hub but that have
   * no model in the product library yet (for example Husqvarna Automower).
   */
  brandSlugs?: string[];
};

export type HubCategory = {
  slug: HubCategorySlug;
  name: string;
  group: HubCategoryGroup;
  intro: string;
  color: string;
  rules: HubRules;
  /**
   * Analysis articles listed first under "Essential reading", chosen by Google
   * Search clicks: Search Console pages report for 2026-08-04 to 2026-11-03
   * (last 3 months, all pages). Only set where the data shows a clear lead.
   */
  searchPicks?: string[];
};

export const HUB_CATEGORY_GROUPS: { slug: HubCategoryGroup; label: string }[] = [
  { slug: "core-cleaning", label: "Core cleaning" },
  { slug: "adjacent-industries", label: "Adjacent industries" }
];

export const HUB_CATEGORIES: HubCategory[] = [
  {
    slug: "robot-vacuums",
    name: "Robot vacuums",
    group: "core-cleaning",
    intro: "Robot vacuums and mopping robots: launches, companies, technology and the supply chain behind them.",
    color: "#2f5bd3",
    searchPicks: ["ecovacs-x5-hybrid-dreame-triform-market", "is-dreame-owned-by-xiaomi"],
    rules: {
      articleTags: ["robot vacuum", "robot vacuums", "robotic vacuum", "robot vacuum cleaner"],
      newsCategories: ["Robot Vacuums"],
      newsTitleTerms: ["robot vacuum", "robot vacuums", "robotic vacuum"],
      productCategories: ["Robot vacuums"]
    }
  },
  {
    slug: "vacuum-cleaners",
    name: "Vacuum cleaners",
    group: "core-cleaning",
    intro: "Cordless, upright and wet-dry vacuum cleaners and the brands competing in them.",
    color: "#7a4cc2",
    searchPicks: ["shark-powerdetect-speed-vs-dyson-v16-piston-animal", "who-makes-kenmore-vacuum-cleaners-cleva-transformco"],
    rules: {
      articleCategories: ["Vacuum"],
      articleTags: ["vacuum cleaner", "vacuum cleaners", "cordless vacuum", "cordless vacuums", "stick vacuum", "wet dry vacuum"],
      newsTitleTerms: ["cordless vacuum", "stick vacuum", "vacuum cleaner", "wet-dry vacuum"],
      productCategories: ["Cordless vacuums"]
    }
  },
  {
    slug: "floor-washers",
    name: "Floor washers",
    group: "core-cleaning",
    intro: "Hard floor washers and wet-dry floor cleaners for the home.",
    color: "#0f8a8a",
    rules: {
      articleTags: ["hard floor washer", "hard floor washers", "floor washer", "floor washers", "wet dry floor cleaner", "wet-dry floor cleaner"],
      newsCategories: ["Floor Washers"],
      newsTitleTerms: ["floor washer", "wet-dry floor cleaner", "wet dry floor cleaner"],
      productCategories: ["Floor washers"]
    }
  },
  {
    slug: "pool-robots",
    name: "Pool robots",
    group: "core-cleaning",
    intro: "Robotic pool cleaners, pool equipment groups and the companies entering the category.",
    color: "#1b8fd1",
    searchPicks: ["who-makes-wybot-pool-cleaners-wybotics-wangyuan", "maytronics-robotic-pool-cleaner-reinvention"],
    rules: {
      articleCategories: ["Pool Cleaning"],
      articleTags: ["robotic pool cleaner", "robotic pool cleaners", "pool robot", "pool robots"],
      newsCategories: ["Pool Cleaning"],
      newsTitleTerms: ["pool robot", "pool cleaner", "pool cleaning robot"],
      productCategories: ["Pool robots"],
      brandCategories: ["pool-equipment-pool-care"]
    }
  },
  {
    slug: "robotic-mowers",
    name: "Robotic mowers",
    group: "core-cleaning",
    intro: "Robotic lawn mowers: navigation, launches, channels and the brands moving into the yard.",
    color: "#3f8f3a",
    searchPicks: [
      "husqvarna-robotic-mowers-after-eu-anti-dumping",
      "who-makes-mova-robot-mowers-dreame-group",
      "sunseeker-vs-mammotion-robot-mowers"
    ],
    rules: {
      articleCategories: ["Robotic Mowers"],
      articleTags: ["robotic mower", "robotic mowers", "robot lawn mower", "robot lawn mowers", "robot mower", "robot mowers"],
      newsCategories: ["Robot Mowers", "Robotic Mowers", "Robotic Mowing", "Robotic Lawn Mowers", "Robotic Mowing & Outdoor Equipment"],
      newsTitleTerms: ["robot mower", "robotic mower", "robot lawn mower", "robotic lawn mower"],
      productCategories: ["Robot mowers"],
      brandSlugs: ["husqvarna", "worx", "gardena", "greenworks", "lawnmaster", "toro", "roborock", "pudu-robotics"]
    }
  },
  {
    slug: "commercial-cleaning",
    name: "Commercial cleaning",
    group: "core-cleaning",
    intro: "Commercial and industrial cleaning equipment, cleaning robots for buildings and the groups that make them.",
    color: "#a35a12",
    rules: {
      articleCategories: ["Commercial Cleaning"],
      articleTags: ["commercial cleaning", "commercial cleaning robots", "scrubber dryer", "floor scrubber"],
      newsCategories: ["Commercial Cleaning", "Commercial Robotics"],
      brandCategories: ["commercial-industrial-cleaning"]
    }
  },
  {
    slug: "window-robots",
    name: "Window robots",
    group: "core-cleaning",
    intro: "Window-cleaning robots and the brands that make them.",
    color: "#4a6b8a",
    rules: {
      articleTags: ["window cleaning robot", "window cleaning robots", "window robot", "window robots"],
      newsTitleTerms: ["window cleaning robot", "window robot"],
      productCategories: ["Window robots"]
    }
  },
  {
    slug: "small-appliances",
    name: "Small appliances",
    group: "adjacent-industries",
    intro: "Small domestic appliances and the home-appliance groups that also sell cleaning products.",
    color: "#b23a5b",
    rules: {
      articleTags: ["small appliances", "small appliance", "kitchen appliances"],
      brandCategories: ["home-appliances-small-appliances"]
    }
  },
  {
    slug: "power-tools-outdoor",
    name: "Power tools & outdoor",
    group: "adjacent-industries",
    intro: "Power tools, battery platforms and outdoor power equipment from the groups that also build cleaning products.",
    color: "#c2410c",
    searchPicks: ["who-makes-parkside-tools-lidl-suppliers", "who-owns-greenworks-globe-stihl"],
    rules: {
      articleTags: ["power tools", "power tool", "outdoor power equipment", "pressure washer", "pressure washers"],
      newsCategories: ["Power Tools & Outdoor Equipment", "Garden Equipment", "Outdoor Cleaning & Lawn Care"],
      brandCategories: ["power-tools", "lawn-garden-equipment"]
    }
  }
];

const hubBySlug = new Map(HUB_CATEGORIES.map((hub) => [hub.slug, hub]));

export function getHubCategory(slug: string): HubCategory | undefined {
  return hubBySlug.get(slug as HubCategorySlug);
}

export function isHubCategorySlug(value: string): value is HubCategorySlug {
  return hubBySlug.has(value as HubCategorySlug);
}

const lower = (value: string) => value.trim().toLowerCase();

function hasTerm(text: string, term: string) {
  const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}s?([^a-z0-9]|$)`).test(text);
}

/** Explicit `hub_categories` frontmatter values, keeping only known slugs. */
export function explicitHubCategories(value: unknown): HubCategorySlug[] {
  const values = Array.isArray(value) ? value : typeof value === "string" && value ? [value] : [];
  return values.map((item) => lower(String(item))).filter(isHubCategorySlug);
}

function collect(test: (rules: HubRules) => boolean, explicit: HubCategorySlug[] = []) {
  const found = new Set<HubCategorySlug>(explicit);
  for (const hub of HUB_CATEGORIES) {
    if (test(hub.rules)) found.add(hub.slug);
  }
  return HUB_CATEGORY_SLUGS.filter((slug) => found.has(slug));
}

export function hubCategoriesForInsight(article: {
  category: string;
  tags: readonly unknown[];
  hubCategories?: readonly HubCategorySlug[];
}): HubCategorySlug[] {
  const tags = new Set(article.tags.map((tag) => lower(String(tag))));
  return collect(
    (rules) =>
      Boolean(rules.articleCategories?.includes(article.category)) ||
      Boolean(rules.articleTags?.some((tag) => tags.has(tag))),
    [...(article.hubCategories ?? [])]
  );
}

export function hubCategoriesForNews(article: {
  category: string;
  title: string;
  hubCategories?: readonly HubCategorySlug[];
}): HubCategorySlug[] {
  const title = article.title.toLowerCase();
  return collect(
    (rules) =>
      Boolean(rules.newsCategories?.includes(article.category)) ||
      Boolean(rules.newsTitleTerms?.some((term) => hasTerm(title, term))),
    [...(article.hubCategories ?? [])]
  );
}

export function hubCategoriesForProduct(product: { category: string }): HubCategorySlug[] {
  return collect((rules) => Boolean(rules.productCategories?.includes(product.category)));
}

/** `brandCategorySlugs` are the profile's memberships in lib/brandCategories.ts. */
export function hubCategoriesForBrand(brandCategorySlugs: readonly string[]): HubCategorySlug[] {
  return collect((rules) =>
    Boolean(rules.brandCategories?.some((slug) => brandCategorySlugs.includes(slug)))
  );
}

/**
 * The category name readers see for a product-library category. The product
 * data keeps its own values (for example "Robot mowers"); every page shows the
 * hub name ("Robotic mowers") so Categories, Products and Companies use one
 * set of names.
 */
export function productCategoryLabel(category: string): string {
  const hub = HUB_CATEGORIES.find((item) => item.rules.productCategories?.includes(category));
  return hub?.name ?? category;
}

/** Product-library category values that are shown under a different hub name, keyed by the old value. */
export function productCategoryAliases(): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const hub of HUB_CATEGORIES) {
    for (const category of hub.rules.productCategories ?? []) {
      if (category !== hub.name) aliases[category] = hub.name;
    }
  }
  return aliases;
}
