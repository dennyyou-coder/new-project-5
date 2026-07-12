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
      { id: "RM-01", name: "Mass-Market Vision", positioning: "An installation-light platform for smaller lawns, first-time robotic mower buyers and channels that cannot depend on professional setup.", lawnContext: "Small residential lawns", markets: ["UK", "Europe"], channels: ["Retail", "Ecommerce"], technologyDirection: "Camera-led navigation for mass adoption", opportunity: "Removing the boundary-wire visit can open robotic mowing beyond early adopters and premium dealer channels.", verificationRisk: "Prove edge cutting, obstacle recognition, changing-light performance and consumer-led setup in ordinary gardens.", image: "/images/sourcing/lawn-robots/rm-01-compact-vision.png", imageAlt: "Concept compact vision robotic lawn mower on a small residential lawn" },
      { id: "RM-02", name: "RTK Step-Up", positioning: "A higher-value, boundary-free platform for medium and larger lawns where coverage and zone control justify a step up from entry products.", lawnContext: "Medium to large open lawns", markets: ["United States", "Europe"], channels: ["Specialist retail", "Direct-to-consumer"], technologyDirection: "RTK positioning with supporting sensors", opportunity: "RTK earns a premium when larger-area coverage, editable zones and faster installation are visible to the customer.", verificationRisk: "Test signal loss, tree and building interference, map recovery, antenna placement and the complete installation journey.", image: "/images/sourcing/lawn-robots/rm-02-rtk-platform.png", imageAlt: "Concept RTK robotic lawn mower on a large residential lawn" },
      { id: "RM-03", name: "AWD Terrain Specialist", positioning: "A premium platform for sloped, uneven gardens that standard robotic mowers struggle to serve consistently.", lawnContext: "Slopes and complex terrain", markets: ["Europe", "North America"], channels: ["Premium dealers", "Specialist ecommerce"], technologyDirection: "Four-wheel-drive mobility platform", opportunity: "Terrain capability solves a visible problem and gives dealers a stronger trade-up story than marginal specification gains.", verificationRisk: "Require evidence for usable slope performance, rollover safety, turf protection, wet-ground behavior and drivetrain durability.", image: "/images/sourcing/lawn-robots/rm-03-awd-slope.png", imageAlt: "Concept all-wheel-drive robotic lawn mower on sloped terrain" },
      { id: "RM-04", name: "Proven Value Platform", positioning: "A mature boundary-wire route for buyers competing on dependable mowing and controlled product cost rather than installation novelty.", lawnContext: "Simple lawns with planned installation", markets: ["Europe", "Value-led markets"], channels: ["Mass retail", "Private label"], technologyDirection: "Established boundary-wire architecture", opportunity: "Predictable operation and accessible pricing can matter more than eliminating the initial installation step.", verificationRisk: "Model installation support, app quality, repairability, spare parts, returns and service cost—not only the factory quotation.", image: "/images/sourcing/lawn-robots/rm-04-value-wire.png", imageAlt: "Concept value boundary-wire robotic lawn mower in a suburban garden" },
      { id: "RM-05", name: "Large-Area Service Platform", positioning: "A professional route for estates and maintained grounds where coverage, uptime and service support matter most.", lawnContext: "Estates and maintained grounds", markets: ["United States", "Europe"], channels: ["Professional dealers", "Project sales"], technologyDirection: "Large-area multi-sensor platform", opportunity: "Higher product and service value is possible when the offer reduces labor and gives operators confidence in uptime.", verificationRisk: "Verify coverage efficiency, remote oversight, multi-zone behavior, field repair, parts lead times and dealer service capability.", image: "/images/sourcing/lawn-robots/rm-05-large-area-professional.png", imageAlt: "Concept professional robotic lawn mower on a large estate lawn" },
      { id: "RM-06", name: "Retail Category Starter", positioning: "A compact platform for testing robotic mowing without the price, logistics and service burden of a flagship model.", lawnContext: "Compact lawns and first-time households", markets: ["UK", "Europe", "Urban markets"], channels: ["Retail", "Ecommerce"], technologyDirection: "Compact consumer retail platform", opportunity: "A focused use case and simpler logistics can lower the retailer's risk of opening the category.", verificationRisk: "Prove mowing quality, setup completion, packaging resilience, return economics and after-sales support; compact cannot mean disposable.", image: "/images/sourcing/lawn-robots/rm-06-compact-retail.png", imageAlt: "Concept compact retail robotic lawn mower in a modern small garden" }
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
    imageAlt: "Robotic pool cleaner sourcing and manufacturer evaluation",
    directions: [
      { id: "RM-01", name: "Cordless Retail Starter", positioning: "A simple cordless platform for above-ground pools and first-time robot buyers.", lawnContext: "Above-ground and compact pools", markets: ["North America", "Europe"], channels: ["Retail", "Ecommerce"], technologyDirection: "Cordless consumer platform", opportunity: "A clear entry use case can make pool robotics easier to merchandise than a full-featured premium cleaner.", verificationRisk: "Verify cycle completion, retrieval, filtration, charging safety and return economics in real debris conditions.", image: "/images/sourcing/pool-robots/rm-01-cordless-retail-concept.png", imageAlt: "Illustrative cordless robotic pool cleaner for compact residential pools" },
      { id: "RM-02", name: "Wall-Climbing Step-Up", positioning: "A higher-value platform for in-ground pools where wall and waterline cleaning create a visible trade-up.", lawnContext: "In-ground residential pools", markets: ["North America", "Europe"], channels: ["Specialist dealer", "Ecommerce"], technologyDirection: "Multi-surface cleaning platform", opportunity: "The product earns a premium when coverage and ownership convenience are clear, not merely when more modes appear on the box.", verificationRisk: "Test wall transition, waterline behaviour, pool-shape coverage and recovery after interrupted cycles.", image: "/images/sourcing/pool-robots/rm-02-wall-climbing-concept.png", imageAlt: "Illustrative wall-climbing robotic pool cleaner in an in-ground pool" },
      { id: "RM-03", name: "Cordless Premium Platform", positioning: "A premium cordless route for buyers seeking less cable friction and stronger perceived ownership convenience.", lawnContext: "Premium residential pools", markets: ["United States", "Europe"], channels: ["Specialist dealer", "Private label"], technologyDirection: "Cordless premium architecture", opportunity: "Cordless positioning can create a persuasive premium story when runtime, retrieval and durability support it.", verificationRisk: "Prove battery ageing, waterproof integrity, charging reliability and usable cleaning time across pool conditions.", image: "/images/sourcing/pool-robots/rm-01-cordless-retail-concept.png", imageAlt: "Illustrative cordless robotic pool cleaner for a premium residential pool" },
      { id: "RM-04", name: "Proven Corded Value", positioning: "A dependable corded platform for buyers prioritising mature operation and controlled product cost.", lawnContext: "Standard residential pools", markets: ["Europe", "Value-led markets"], channels: ["Retail", "Private label"], technologyDirection: "Established corded architecture", opportunity: "A proven platform can still win where reliability, serviceability and accessible price matter more than novelty.", verificationRisk: "Model cable tangling, motor life, filtration maintenance, spare parts and warranty exposure—not only the factory quote.", image: "/images/sourcing/pool-robots/rm-02-wall-climbing-concept.png", imageAlt: "Illustrative pool cleaner platform in a standard residential pool" },
      { id: "RM-05", name: "Large-Pool Service Platform", positioning: "A specialist route for larger residential or light-commercial pools where uptime and service capability matter most.", lawnContext: "Large and high-use pools", markets: ["United States", "Middle East", "Europe"], channels: ["Professional / project sales", "Specialist dealer"], technologyDirection: "High-capacity service platform", opportunity: "Higher product and service value is possible when the offer reduces manual labour and downtime for pool operators.", verificationRisk: "Verify coverage efficiency, filter capacity, duty cycle, field repair and parts lead time before scaling.", image: "/images/sourcing/pool-robots/rm-02-wall-climbing-concept.png", imageAlt: "Illustrative robotic pool cleaner for high-use pools" },
      { id: "RM-06", name: "Ecommerce Value Platform", positioning: "A focused platform for online-led buyers who need a clear claim, manageable logistics and a credible ownership experience.", lawnContext: "Value-conscious pool owners", markets: ["North America", "Europe"], channels: ["Ecommerce", "Retail"], technologyDirection: "Online-first value platform", opportunity: "A narrow, well-supported use case can reduce the channel risk of opening the category online.", verificationRisk: "Prove packaging resilience, onboarding, support demand, returns and replacement-part availability before committing to volume.", image: "/images/sourcing/pool-robots/rm-01-cordless-retail-concept.png", imageAlt: "Illustrative robotic pool cleaner for an ecommerce value platform" }
    ]
  }
};
