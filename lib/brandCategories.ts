import type { BrandProfile } from "@/lib/brands";

export type BrandCategorySlug =
  | "power-tools"
  | "lawn-garden-equipment"
  | "pool-equipment-pool-care"
  | "floorcare-home-cleaning"
  | "commercial-industrial-cleaning"
  | "home-appliances-small-appliances";

export type BrandCategory = {
  slug: BrandCategorySlug;
  name: string;
  title: string;
  description: string;
  brandSlugs: string[];
  primaryBrandSlugs: string[];
};

export const BRAND_CATEGORIES: BrandCategory[] = [
  {
    slug: "power-tools",
    name: "Power Tools",
    title: "Power Tools Brand Intelligence",
    description:
      "Verified profiles of power-tool brands for professional buyers, distributors and industry teams evaluating cordless platforms, jobsite systems, channels and supply-chain boundaries.",
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
      "metabo",
      "milwaukee",
      "ryobi",
      "skil",
      "worx"
    ],
    primaryBrandSlugs: [
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
      "metabo",
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
    brandSlugs: [
      "aiper",
      "black-decker",
      "bosch-power-tools",
      "craftsman",
      "dewalt",
      "dreame",
      "ecovacs",
      "eufy",
      "greenworks",
      "hikoki",
      "husqvarna",
      "kobalt",
      "makita",
      "mammotion",
      "mova",
      "roborock",
      "ryobi",
      "segway-navimow",
      "skil",
      "stihl",
      "sunseeker",
      "worx"
    ],
    primaryBrandSlugs: [
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
    brandSlugs: [
      "aiper",
      "aquabot",
      "beatbot",
      "fluidra",
      "hayward",
      "mammotion",
      "maytronics",
      "mova",
      "pentair",
      "polaris",
      "wybot"
    ],
    primaryBrandSlugs: [
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
    brandSlugs: [
      "aeg",
      "bissell",
      "black-decker",
      "bosch-home-appliances",
      "dewalt",
      "dirt-devil",
      "dji-romo",
      "dreame",
      "dyson",
      "ecovacs",
      "electrolux",
      "eufy",
      "eureka",
      "haier-home-appliances",
      "hoover",
      "irobot",
      "karcher",
      "lg-home-appliances",
      "midea",
      "miele",
      "mova",
      "narwal",
      "oreck",
      "philips-home-appliances",
      "roborock",
      "ryobi",
      "samsung-home-appliances",
      "shark",
      "tineco",
      "vax"
    ],
    primaryBrandSlugs: [
      "bissell",
      "dirt-devil",
      "dji-romo",
      "dreame",
      "dyson",
      "ecovacs",
      "eufy",
      "eureka",
      "hoover",
      "irobot",
      "mova",
      "narwal",
      "oreck",
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
    brandSlugs: ["ecovacs", "karcher", "nilfisk", "oreck"],
    primaryBrandSlugs: ["karcher", "nilfisk"]
  },
  {
    slug: "home-appliances-small-appliances",
    name: "Home Appliances & Small Appliances",
    title: "Home Appliances & Small Appliances Brand Intelligence",
    description:
      "Verified profiles of home-appliance and small-appliance brands for buyers assessing ownership, trademark and operating-company boundaries, product portfolios, manufacturing networks, channels and after-sales responsibility.",
    brandSlugs: [
      "aeg",
      "bosch-home-appliances",
      "electrolux",
      "fisher-paykel",
      "ge-appliances",
      "haier-home-appliances",
      "lg-home-appliances",
      "midea",
      "miele",
      "philips-home-appliances",
      "samsung-home-appliances"
    ],
    primaryBrandSlugs: [
      "aeg",
      "bosch-home-appliances",
      "electrolux",
      "fisher-paykel",
      "ge-appliances",
      "haier-home-appliances",
      "lg-home-appliances",
      "midea",
      "miele",
      "philips-home-appliances",
      "samsung-home-appliances"
    ]
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
  return BRAND_CATEGORIES.find((category) => category.primaryBrandSlugs.includes(slug));
}

export function getBrandCategoriesForProfile(slug: string): BrandCategory[] {
  const primaryCategory = getBrandCategoryForProfile(slug);
  const categories = BRAND_CATEGORIES.filter((category) => category.brandSlugs.includes(slug));

  if (!primaryCategory) return categories;

  return [
    primaryCategory,
    ...categories.filter((category) => category.slug !== primaryCategory.slug)
  ];
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
    lastModified: "2026-08-05"
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
  const primarySlugs = BRAND_CATEGORIES.flatMap((category) => category.primaryBrandSlugs);
  const duplicatedPrimarySlugs = primarySlugs.filter(
    (slug, index) => primarySlugs.indexOf(slug) !== index
  );
  const duplicatedCategorySlugs = BRAND_CATEGORIES.flatMap((category) =>
    category.brandSlugs.filter(
      (slug, index) => category.brandSlugs.indexOf(slug) !== index
    ).map((slug) => `${category.slug}:${slug}`)
  );
  const missingSlugs = profileSlugs.filter((slug) => !assignedSlugs.includes(slug));
  const missingPrimarySlugs = profileSlugs.filter((slug) => !primarySlugs.includes(slug));
  const unknownSlugs = assignedSlugs.filter((slug) => !profileSlugs.includes(slug));
  const unknownPrimarySlugs = primarySlugs.filter((slug) => !profileSlugs.includes(slug));
  const misplacedPrimarySlugs = BRAND_CATEGORIES.flatMap((category) =>
    category.primaryBrandSlugs
      .filter((slug) => !category.brandSlugs.includes(slug))
      .map((slug) => `${category.slug}:${slug}`)
  );
  const errors: string[] = [];

  if (duplicatedPrimarySlugs.length > 0) {
    errors.push(`Primary brand category assignment is duplicated: ${[...new Set(duplicatedPrimarySlugs)].join(", ")}.`);
  }
  if (duplicatedCategorySlugs.length > 0) {
    errors.push(`Brand category membership is duplicated: ${[...new Set(duplicatedCategorySlugs)].join(", ")}.`);
  }
  if (missingSlugs.length > 0) {
    errors.push(`Brand category assignment is missing: ${missingSlugs.join(", ")}.`);
  }
  if (missingPrimarySlugs.length > 0) {
    errors.push(`Primary brand category assignment is missing: ${missingPrimarySlugs.join(", ")}.`);
  }
  if (unknownSlugs.length > 0) {
    errors.push(`Brand category assignment references an unknown profile: ${[...new Set(unknownSlugs)].join(", ")}.`);
  }
  if (unknownPrimarySlugs.length > 0) {
    errors.push(`Primary brand category assignment references an unknown profile: ${[...new Set(unknownPrimarySlugs)].join(", ")}.`);
  }
  if (misplacedPrimarySlugs.length > 0) {
    errors.push(`Primary brand category is not included in category membership: ${misplacedPrimarySlugs.join(", ")}.`);
  }

  return errors;
}
