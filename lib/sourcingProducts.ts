export type SourcingProduct = {
  slug: "lawn-robots" | "pool-robots";
  productCategory: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  buyerProblems: string[];
  services: string[];
  evaluationPoints: string[];
  marketNotes: string[];
  relatedArticleSlugs: string[];
  image: string;
  imageAlt: string;
};

export const sourcingProducts: Record<SourcingProduct["slug"], SourcingProduct> = {
  "lawn-robots": {
    slug: "lawn-robots",
    productCategory: "robotic_lawn_mower",
    title: "Robotic Lawn Mower Manufacturers & Sourcing in China",
    metaDescription: "Find and evaluate robotic lawn mower manufacturers in China with support for supplier matching, product direction, sampling, quality risk and execution.",
    eyebrow: "Robotic Lawn Mower Sourcing",
    intro: "The category is expanding quickly, but navigation systems, terrain performance, installation, safety and after-sales readiness vary widely. World Clean Biz helps buyers evaluate the product and the supplier behind it.",
    buyerProblems: ["Too many suppliers present similar specifications", "Real-world terrain performance is difficult to compare", "Installation and after-sales requirements differ by market", "A fast-moving category can make product decisions obsolete quickly"],
    services: ["Product direction and supplier landscape review", "Manufacturer discovery and capability screening", "Specification, sample and differentiation review", "Quality-risk and execution support before production"],
    evaluationPoints: ["Navigation and boundary technology", "Slope, obstacle and terrain performance", "Safety, weather resistance and theft protection", "App stability, installation and service readiness", "Production experience, testing and spare-parts support"],
    marketNotes: ["North American buyers need products suited to larger and more varied lawns.", "European and UK buyers often place greater weight on installation, safety, noise and channel service.", "A global launch plan should separate market requirements instead of using one specification everywhere."],
    relatedArticleSlugs: ["robotic-lawn-mower-manufacturers-china", "robotic-mowers-2026-breakthrough", "amazon-first-stop-for-backyard-robotics"],
    image: "/images/sourcing/lawn-robots.png",
    imageAlt: "Robotic lawn mower sourcing and manufacturer evaluation"
  },
  "pool-robots": {
    slug: "pool-robots",
    productCategory: "robotic_pool_cleaner",
    title: "Robotic Pool Cleaner Manufacturers & Sourcing in China",
    metaDescription: "Find and evaluate robotic pool cleaner manufacturers in China with support for supplier matching, product direction, sampling, quality risk and execution.",
    eyebrow: "Robotic Pool Cleaner Sourcing",
    intro: "Pool robots are moving into broader retail channels, but cleaning coverage, filtration, waterproof reliability and service capability are not easy to judge from a quotation. World Clean Biz helps buyers compare the complete product and supplier system.",
    buyerProblems: ["Product appearance can hide major performance differences", "Waterproof reliability and long-term durability are hard to validate", "Channel requirements vary across specialist retail and ecommerce", "Parts, warranty and service can determine the real product cost"],
    services: ["Category and product opportunity review", "Manufacturer discovery and capability screening", "Specification, sample and differentiation review", "Quality-risk and execution support before production"],
    evaluationPoints: ["Pool coverage, navigation and wall-climbing performance", "Filtration, debris handling and cleaning-cycle design", "Waterproofing, motors, cables and battery reliability", "Testing standards and production consistency", "Warranty, replacement parts and service readiness"],
    marketNotes: ["North American buyers need clear positioning across pool types, sizes and retail channels.", "European and UK buyers may require different product, compliance and service preparation.", "Premium positioning depends on reliability and ownership experience, not only cleaning specifications."],
    relatedArticleSlugs: ["robotic-pool-cleaner-manufacturers-china", "aiper-fluidra-pool-robotics-alliance", "maytronics-robotic-pool-cleaner-reinvention"],
    image: "/images/sourcing/pool-robots.png",
    imageAlt: "Robotic pool cleaner sourcing and manufacturer evaluation"
  }
};
