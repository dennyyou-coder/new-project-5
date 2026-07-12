export type ProductDirection = {
  id: "RM-01" | "RM-02" | "RM-03" | "RM-04" | "RM-05" | "RM-06";
  name: string;
  positioning: string;
  lawnContext: string;
  markets: string[];
  channels: string[];
  technologyDirection: string;
  opportunity: string;
  verificationRisk: string;
  image: string;
  imageAlt: string;
};

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
  directions?: ProductDirection[];
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
    imageAlt: "Robotic lawn mower sourcing and manufacturer evaluation",
    directions: [
      { id: "RM-01", name: "Compact Vision", positioning: "A compact, installation-light direction for brands serving smaller private gardens.", lawnContext: "Small and structured residential lawns", markets: ["UK", "Europe"], channels: ["Retail", "Ecommerce"], technologyDirection: "Camera-led navigation direction", opportunity: "Lower setup friction can make the category easier for first-time consumers to adopt.", verificationRisk: "Edge accuracy, obstacle recognition and performance under changing light need careful validation.", image: "/images/sourcing/lawn-robots/rm-01-compact-vision.png", imageAlt: "Concept compact vision robotic lawn mower on a small residential lawn" },
      { id: "RM-02", name: "RTK Platform", positioning: "A boundary-wire-free platform direction for medium and larger residential lawns.", lawnContext: "Medium to large open lawns", markets: ["United States", "Europe"], channels: ["Specialist retail", "Direct-to-consumer"], technologyDirection: "RTK positioning with supporting sensors", opportunity: "Boundary-free setup supports a stronger premium story and faster installation.", verificationRisk: "Signal stability, tree cover, map recovery and installation workflow must be tested in the target market.", image: "/images/sourcing/lawn-robots/rm-02-rtk-platform.png", imageAlt: "Concept RTK robotic lawn mower on a large residential lawn" },
      { id: "RM-03", name: "AWD Slope", positioning: "A higher-traction direction for buyers targeting slopes and more difficult terrain.", lawnContext: "Slopes, uneven ground and complex gardens", markets: ["Europe", "North America"], channels: ["Premium dealers", "Specialist ecommerce"], technologyDirection: "Four-wheel-drive mobility platform", opportunity: "Terrain capability creates a clearer reason to buy than another general-purpose mower.", verificationRisk: "Traction claims, rollover safety, turf damage, cleaning and long-term drivetrain reliability require evidence.", image: "/images/sourcing/lawn-robots/rm-03-awd-slope.png", imageAlt: "Concept all-wheel-drive robotic lawn mower on sloped terrain" },
      { id: "RM-04", name: "Value Wire", positioning: "A mature boundary-wire direction for buyers prioritizing stability and controlled cost.", lawnContext: "Simple residential lawns with planned installation", markets: ["Europe", "Global value markets"], channels: ["Mass retail", "Private label"], technologyDirection: "Established boundary-wire platform", opportunity: "A proven architecture can reduce product and service complexity for entry programs.", verificationRisk: "Installation burden, app quality, repairability and margin after service costs must still be assessed.", image: "/images/sourcing/lawn-robots/rm-04-value-wire.png", imageAlt: "Concept value boundary-wire robotic lawn mower in a suburban garden" },
      { id: "RM-05", name: "Large-Area Professional", positioning: "A professional platform direction for estates, facilities and specialist dealer networks.", lawnContext: "Large properties and professionally maintained grounds", markets: ["United States", "Europe"], channels: ["Professional dealers", "Project sales"], technologyDirection: "Large-area multi-sensor platform", opportunity: "Professional use cases can support higher value when service and uptime are part of the offer.", verificationRisk: "Coverage efficiency, fleet oversight, safety, parts supply and dealer service capability matter more than specifications alone.", image: "/images/sourcing/lawn-robots/rm-05-large-area-professional.png", imageAlt: "Concept professional robotic lawn mower on a large estate lawn" },
      { id: "RM-06", name: "Compact Retail", positioning: "A shelf-friendly direction for brands testing robotic mowing through retail and ecommerce.", lawnContext: "Compact lawns and first-time robot mower households", markets: ["UK", "Europe", "Selected urban markets"], channels: ["Retail", "Ecommerce"], technologyDirection: "Compact consumer platform", opportunity: "Approachable design and simpler category entry can help retailers test demand.", verificationRisk: "The product still needs credible mowing quality, setup simplicity and after-sales economics to avoid becoming a novelty.", image: "/images/sourcing/lawn-robots/rm-06-compact-retail.png", imageAlt: "Concept compact retail robotic lawn mower in a modern small garden" }
    ]
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
