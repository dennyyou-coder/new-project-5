import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
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
      }
    ];
  }
};

export default nextConfig;
