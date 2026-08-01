import type { BrandProfile } from "@/lib/brands";

export type BrandCategorySlug =
  | "power-tools"
  | "lawn-garden-equipment"
  | "pool-equipment-pool-care"
  | "floorcare-home-cleaning"
  | "commercial-industrial-cleaning";

export type BrandCategory = {
  slug: BrandCategorySlug;
  name: string;
  title: string;
  description: string;
  buyerFocus: string;
  brandSlugs: string[];
};

export const BRAND_CATEGORIES: BrandCategory[] = [
  {
    slug: "power-tools",
    name: "Power Tools",
    title: "Power Tools Brand Intelligence",
    description:
      "Verified profiles of power-tool brands for professional buyers, distributors and industry teams evaluating cordless platforms, jobsite systems, channels and supply-chain boundaries.",
    buyerFocus: "Cordless systems · Professional tools · Accessories · Dust management",
    brandSlugs: [
      "black-decker",
      "bosch-power-tools",
      "craftsman",
      "dewalt",
      "dremel",
      "festool",
      "flex",
      "hikoki",
      "hilti",
      "kobalt",
      "makita",
      "milwaukee",
      "ryobi",
      "skil"
    ]
  },
  {
    slug: "lawn-garden-equipment",
    name: "Lawn & Garden Equipment",
    title: "Lawn & Garden Equipment Brand Intelligence",
    description:
      "Verified profiles of lawn and garden equipment brands, with buyer-relevant coverage of robotic mowing, battery platforms, dealer channels and regional service responsibility.",
    buyerFocus: "Robotic mowers · Outdoor power equipment · Battery platforms · Dealer support",
    brandSlugs: [
      "eufy",
      "greenworks",
      "husqvarna",
      "mammotion",
      "segway-navimow",
      "stihl",
      "sunseeker",
      "worx"
    ]
  },
  {
    slug: "pool-equipment-pool-care",
    name: "Pool Equipment & Pool Care",
    title: "Pool Equipment & Pool Care Brand Intelligence",
    description:
      "Verified profiles of pool-equipment and pool-care brands for buyers assessing robotic cleaners, pumps, filtration, water treatment, automation and service-channel boundaries.",
    buyerFocus: "Pool robots · Pumps and filtration · Water treatment · Automation",
    brandSlugs: [
      "aiper",
      "aquabot",
      "beatbot",
      "fluidra",
      "hayward",
      "maytronics",
      "pentair",
      "polaris",
      "wybot"
    ]
  },
  {
    slug: "floorcare-home-cleaning",
    name: "Floorcare & Home Cleaning",
    title: "Floorcare & Home Cleaning Brand Intelligence",
    description:
      "Verified profiles of floorcare and home-cleaning brands, covering robot vacuums, floor washers, vacuum systems, home appliances and their ownership, channels and supply-chain evidence.",
    buyerFocus: "Robot vacuums · Floor washers · Vacuum systems · Home appliances",
    brandSlugs: [
      "aeg",
      "bissell",
      "bosch-home-appliances",
      "dirt-devil",
      "dji-romo",
      "dreame",
      "dyson",
      "ecovacs",
      "electrolux",
      "eureka",
      "hoover",
      "irobot",
      "midea",
      "miele",
      "mova",
      "narwal",
      "oreck",
      "philips-home-appliances",
      "roborock",
      "shark",
      "tineco",
      "vax"
    ]
  },
  {
    slug: "commercial-industrial-cleaning",
    name: "Commercial & Industrial Cleaning",
    title: "Commercial & Industrial Cleaning Brand Intelligence",
    description:
      "Verified profiles of commercial and industrial cleaning brands, focused on floorcare systems, autonomous equipment, pressure washing and professional distribution models.",
    buyerFocus: "Scrubbers and sweepers · Industrial vacuums · Autonomous cleaning · Service networks",
    brandSlugs: ["karcher", "nilfisk"]
  }
];

export type BrandCategoryPageData = {
  category: BrandCategory;
  profiles: BrandProfile[];
};

export function getBrandCategory(slug: string): BrandCategory | undefined {
  return BRAND_CATEGORIES.find((category) => category.slug === slug);
}

export function getBrandCategoryForProfile(slug: string): BrandCategory | undefined {
  return BRAND_CATEGORIES.find((category) => category.brandSlugs.includes(slug));
}

export function getBrandCategoryPageData(
  slug: string,
  profiles: BrandProfile[]
): BrandCategoryPageData | undefined {
  const category = getBrandCategory(slug);
  if (!category) return undefined;

  return {
    category,
    profiles: profiles.filter((profile) => category.brandSlugs.includes(profile.slug))
  };
}

export function getPublishedBrandCategories(profiles: BrandProfile[]): BrandCategoryPageData[] {
  return BRAND_CATEGORIES.map((category) => ({
    category,
    profiles: profiles.filter((profile) => category.brandSlugs.includes(profile.slug))
  })).filter(({ profiles }) => profiles.length > 0);
}

export function buildBrandCategoryStaticParams(profiles: BrandProfile[]) {
  return getPublishedBrandCategories(profiles).map(({ category }) => ({ slug: category.slug }));
}

export function buildBrandCategorySitemapEntries(
  profiles: BrandProfile[],
  siteUrl: string
) {
  return getPublishedBrandCategories(profiles).map(({ category }) => ({
    url: `${siteUrl}/brands/${category.slug}`,
    lastModified: "2026-08-01"
  }));
}

export function buildBrandCategorySchemas(
  data: BrandCategoryPageData,
  siteUrl: string
): object[] {
  const pageUrl = `${siteUrl}/brands/${data.category.slug}`;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: data.category.title,
    numberOfItems: data.profiles.length,
    itemListElement: data.profiles.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: profile.name,
      url: `${siteUrl}/brands/${profile.slug}`
    }))
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": pageUrl,
      name: data.category.title,
      description: data.category.description,
      url: pageUrl,
      mainEntity: itemList
    },
    itemList,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Brand Intelligence",
          item: `${siteUrl}/brands`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: data.category.name,
          item: pageUrl
        }
      ]
    }
  ];
}

export function validateBrandCategoryAssignments(profiles: readonly unknown[]): string[] {
  const profileSlugs = profiles
    .filter((profile): profile is { slug: unknown } => (
      typeof profile === "object" && profile !== null && "slug" in profile
    ))
    .map((profile) => profile.slug)
    .filter((slug): slug is string => typeof slug === "string");
  const assignedSlugs = BRAND_CATEGORIES.flatMap((category) => category.brandSlugs);
  const duplicatedSlugs = assignedSlugs.filter(
    (slug, index) => assignedSlugs.indexOf(slug) !== index
  );
  const missingSlugs = profileSlugs.filter((slug) => !assignedSlugs.includes(slug));
  const unknownSlugs = assignedSlugs.filter((slug) => !profileSlugs.includes(slug));
  const errors: string[] = [];

  if (duplicatedSlugs.length > 0) {
    errors.push(`Brand category assignment is duplicated: ${[...new Set(duplicatedSlugs)].join(", ")}.`);
  }
  if (missingSlugs.length > 0) {
    errors.push(`Brand category assignment is missing: ${missingSlugs.join(", ")}.`);
  }
  if (unknownSlugs.length > 0) {
    errors.push(`Brand category assignment references an unknown profile: ${[...new Set(unknownSlugs)].join(", ")}.`);
  }

  return errors;
}
