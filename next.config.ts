import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: "/insights",
        destination: "/blog",
        permanent: true
      },
      {
        source: "/market-reports",
        destination: "/reports",
        permanent: true
      },
      {
        source: "/insights/a-century-of-cleaning-appliances",
        destination: "/blog/hundred-years-of-cleaning-appliance-history",
        permanent: true
      },
      {
        source: "/insights/dyson-hard-floor-washer-exposure",
        destination: "/blog/dyson-hard-floor-washer-exposed",
        permanent: true
      },
      {
        source: "/insights/karcher-hidden-champion-cleaning",
        destination: "/blog/karcher-hidden-champion-in-cleaning-appliances",
        permanent: true
      },
      {
        source: "/insights/survival-under-xiaomi-ecosystem-pressure",
        destination: "/blog/survival-guide-under-xiaomi-ecosystem-pressure",
        permanent: true
      },
      {
        source: "/insights/who-will-be-eliminated-in-cordless-vacuums",
        destination: "/blog/who-will-be-eliminated-in-the-cordless-vacuum-cleaner-era",
        permanent: true
      },
      {
        source: "/insights/bissell-tineco-patent-fight-hard-floor-washers",
        destination: "/blog/bissell-vs-tineco-patent-details",
        permanent: true
      },
      {
        source: "/insights/batteries-vacuums-power-tools",
        destination: "/blog/lithium-batteries-in-vacuums-and-power-tools",
        permanent: true
      },
      {
        source: "/insights/sharkninja-road-to-10-billion-dollar-sales",
        destination: "/blog/sharkninja-road-to-10-billion-dollars",
        permanent: true
      },
      {
        source: "/insights/sharkninja-road-to-ten-billion-dollars",
        destination: "/blog/sharkninja-road-to-10-billion-dollars",
        permanent: true
      },
      {
        source: "/insights/sharkninja-ten-billion-growth-path",
        destination: "/blog/sharkninja-road-to-10-billion-dollars",
        permanent: true
      },
      {
        source: "/insights/kingclean-chairman-ni-formal-interview",
        destination: "/blog/kingclean-chairman-ni-formal-interview",
        permanent: true
      },
      {
        source: "/insights/robot-vacuum-crossroads-category-shift",
        destination: "/blog/robot-vacuum-industry-at-crossroads",
        permanent: true
      },
      {
        source: "/insights/cordless-vacuum-industry-hidden-risks",
        destination: "/blog/hidden-risks-in-cordless-vacuum-development",
        permanent: true
      },
      {
        source: "/insights/amazon-as-the-first-signal-for-garden-robots",
        destination: "/blog/amazon-first-stop-for-backyard-robotics",
        permanent: true
      },
      {
        source: "/insights/china-cleaning-supply-chain-update",
        destination: "/blog/how-to-understand-complete-supply-chain-transfer",
        permanent: true
      },
      {
        source: "/insights/commercial-cleaning-equipment-demand-signals",
        destination: "/blog/nilfisk-2018-annual-report-commercial-cleaning",
        permanent: true
      },
      {
        source: "/insights/deerma-and-the-limits-of-value-for-money-cleaning-appliances",
        destination: "/blog/deerma-floorcare-value-for-money-limit",
        permanent: true
      },
      {
        source: "/insights/dji-wang-tao-and-the-robot-vacuum-market",
        destination: "/blog/robot-vacuum-industry-faces-dji-wang-tao",
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
        destination: "/blog/maytronics-robotic-pool-cleaner-reinvention",
        permanent: true
      },
      {
        source: "/insights/maytronics-vs-chinese-robotic-pool-cleaner-brands",
        destination: "/blog/pool-robotics-new-competitive-table",
        permanent: true
      },
      {
        source: "/insights/private-label-cleaning-products-sourcing-context",
        destination: "/sourcing",
        permanent: true
      },
      {
        source: "/insights/robot-vacuum-market-trends-2026",
        destination: "/blog/robot-vacuum-industry-at-crossroads",
        permanent: true
      },
      {
        source: "/insights/trade-show-intelligence-for-cleaning-brands",
        destination: "/blog/do-you-still-need-trade-shows-if-you-know-the-suppliers",
        permanent: true
      },
      {
        source: "/insights/i-want-to-build-an-ifa-style-show",
        destination: "/blog/why-china-needs-a-cleaning-appliance-ifa",
        permanent: true
      },
      {
        source: "/insights/vactronics-from-odm-to-pool-robot-brand",
        destination: "/blog/pool-robotics-new-competitive-table",
        permanent: true
      },
      {
        source: "/insights/who-will-lead-the-robot-lawn-mower-market",
        destination: "/blog/robotic-mower-new-king-2026",
        permanent: true
      },
      {
        source: "/insights/why-chinese-cleaning-appliance-companies-should-study-sharkninja",
        destination: "/blog/what-sharkninja-makes-us-think-about",
        permanent: true
      },
      {
        source: "/insights/will-maytronics-become-the-next-irobot",
        destination: "/blog/maytronics-robotic-pool-cleaner-reinvention",
        permanent: true
      },
      {
        source: "/insights/will-robot-lawn-mowers-follow-the-robot-vacuum-overseas-path",
        destination: "/blog/robotic-mowers-2026-breakthrough",
        permanent: true
      },
      {
        source: "/insights/:path*",
        destination: "/blog/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
