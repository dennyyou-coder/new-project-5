import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: "/insights/anker-floorcare-strategy-problem",
        destination: "/insights/anker-cleaning-appliance-strategy-analysis",
        permanent: true
      },
      {
        source: "/insights/a-century-of-cleaning-appliances",
        destination: "/insights/hundred-years-of-cleaning-appliance-history",
        permanent: true
      },
      {
        source: "/insights/dyson-hard-floor-washer-exposure",
        destination: "/insights/dyson-hard-floor-washer-exposed",
        permanent: true
      },
      {
        source: "/insights/karcher-hidden-champion-cleaning",
        destination: "/insights/karcher-hidden-champion-in-cleaning-appliances",
        permanent: true
      },
      {
        source: "/insights/survival-under-xiaomi-ecosystem-pressure",
        destination: "/insights/survival-guide-under-xiaomi-ecosystem-pressure",
        permanent: true
      },
      {
        source: "/insights/who-will-be-eliminated-in-cordless-vacuums",
        destination: "/insights/who-will-be-eliminated-in-the-cordless-vacuum-cleaner-era",
        permanent: true
      },
      {
        source: "/insights/bissell-tineco-patent-fight-hard-floor-washers",
        destination: "/insights/bissell-vs-tineco-patent-details",
        permanent: true
      },
      {
        source: "/insights/batteries-vacuums-power-tools",
        destination: "/insights/lithium-batteries-in-vacuums-and-power-tools",
        permanent: true
      },
      {
        source: "/insights/sharkninja-road-to-10-billion-dollar-sales",
        destination: "/insights/sharkninja-road-to-10-billion-dollars",
        permanent: true
      },
      {
        source: "/insights/sharkninja-road-to-ten-billion-dollars",
        destination: "/insights/sharkninja-road-to-10-billion-dollars",
        permanent: true
      },
      {
        source: "/insights/sharkninja-ten-billion-growth-path",
        destination: "/insights/sharkninja-road-to-10-billion-dollars",
        permanent: true
      },
      {
        source: "/insights/kingclean-chairman-ni-formal-interview",
        destination: "/insights/interview-with-kingclean-chairman-ni",
        permanent: true
      },
      {
        source: "/insights/robot-vacuum-crossroads-category-shift",
        destination: "/insights/robot-vacuum-industry-at-crossroads",
        permanent: true
      },
      {
        source: "/insights/cordless-vacuum-industry-hidden-risks",
        destination: "/insights/hidden-risks-in-cordless-vacuum-development",
        permanent: true
      },
      {
        source: "/insights/amazon-as-the-first-signal-for-garden-robots",
        destination: "/insights/amazon-first-stop-for-backyard-robotics",
        permanent: true
      },
      {
        source: "/insights/china-cleaning-supply-chain-update",
        destination: "/insights/how-to-understand-complete-supply-chain-transfer",
        permanent: true
      },
      {
        source: "/insights/commercial-cleaning-equipment-demand-signals",
        destination: "/insights/nilfisk-2018-annual-report-commercial-cleaning",
        permanent: true
      },
      {
        source: "/insights/deerma-and-the-limits-of-value-for-money-cleaning-appliances",
        destination: "/insights/deerma-floorcare-value-for-money-limit",
        permanent: true
      },
      {
        source: "/insights/dji-wang-tao-and-the-robot-vacuum-market",
        destination: "/insights/robot-vacuum-industry-faces-dji-wang-tao",
        permanent: true
      },
      {
        source: "/insights/europe-floor-care-demand-update",
        destination: "/blog",
        permanent: true
      },
      {
        source: "/insights/global-cleaning-industry-center-vision",
        destination: "/world-clean-expo",
        permanent: true
      },
      {
        source: "/insights/maytronics-forty-years-of-robotic-pool-cleaners",
        destination: "/insights/maytronics-robotic-pool-cleaner-reinvention",
        permanent: true
      },
      {
        source: "/insights/maytronics-vs-chinese-robotic-pool-cleaner-brands",
        destination: "/insights/pool-robotics-new-competitive-table",
        permanent: true
      },
      {
        source: "/insights/private-label-cleaning-products-sourcing-context",
        destination: "/sourcing",
        permanent: true
      },
      {
        source: "/insights/robot-vacuum-market-trends-2026",
        destination: "/insights/robot-vacuum-industry-at-crossroads",
        permanent: true
      },
      {
        source: "/insights/trade-show-intelligence-for-cleaning-brands",
        destination: "/insights/do-you-still-need-trade-shows-if-you-know-the-suppliers",
        permanent: true
      },
      {
        source: "/insights/vactronics-from-odm-to-pool-robot-brand",
        destination: "/insights/pool-robotics-new-competitive-table",
        permanent: true
      },
      {
        source: "/insights/who-will-lead-the-robot-lawn-mower-market",
        destination: "/insights/robotic-mower-new-king-2026",
        permanent: true
      },
      {
        source: "/insights/why-chinese-cleaning-appliance-companies-should-study-sharkninja",
        destination: "/insights/what-sharkninja-makes-us-think-about",
        permanent: true
      },
      {
        source: "/insights/will-maytronics-become-the-next-irobot",
        destination: "/insights/maytronics-robotic-pool-cleaner-reinvention",
        permanent: true
      },
      {
        source: "/insights/will-robot-lawn-mowers-follow-the-robot-vacuum-overseas-path",
        destination: "/insights/robotic-mowers-2026-breakthrough",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
