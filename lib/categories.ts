export const CATEGORIES = [
  "Pool Cleaning",
  "Floorcare",
  "Vacuum",
  "Robotic Mowers",
  "Commercial Cleaning",
  "Supply Chain",
  "Industry",
  "Trade Shows",
  "Sourcing",
  "Market Signals"
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_ALIASES: Record<string, Category> = {
  Pool: "Pool Cleaning",
  "Pool Robot": "Pool Cleaning",
  "Pool Robots": "Pool Cleaning",
  "Pool Cleaner": "Pool Cleaning",
  "Pool Cleaners": "Pool Cleaning",
  "Pool Cleaning": "Pool Cleaning",
  Floorcare: "Floorcare",
  "Floor Care": "Floorcare",
  "Floor-care": "Floorcare",
  "Robot Vacuum": "Floorcare",
  "Robot Vacuums": "Floorcare",
  "Cleaning Appliances": "Floorcare",
  Vacuum: "Vacuum",
  Vacuums: "Vacuum",
  "Power Tools": "Industry",
  "Robotic Mower": "Robotic Mowers",
  "Robotic Mowers": "Robotic Mowers",
  "Commercial Cleaning": "Commercial Cleaning",
  "Trade & Supply Chain": "Supply Chain",
  "Supply Chain": "Supply Chain",
  "Company Analysis": "Industry",
  Strategy: "Industry",
  "Industry Strategy": "Industry",
  Industry: "Industry",
  "Industry Events": "Trade Shows",
  Expo: "Trade Shows",
  Exhibition: "Trade Shows",
  "Exhibition News": "Trade Shows",
  "Trade Show": "Trade Shows",
  "Trade Shows": "Trade Shows",
  "Expo Intelligence": "Trade Shows",
  "Sourcing Intelligence": "Sourcing",
  "Sourcing Context": "Sourcing",
  Sourcing: "Sourcing",
  "Backyard Robotics": "Market Signals",
  "Market Trends": "Market Signals",
  "Product Trends": "Market Signals",
  "Market Signals": "Market Signals"
};

export function normalizeCategory(category?: string): Category {
  const value = category?.trim();

  if (!value) {
    return "Industry";
  }

  return CATEGORY_ALIASES[value] || "Industry";
}
