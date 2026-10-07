export type WcbVideo = {
  key: string;
  videoId: string;
  title: string;
  description: string;
  duration: string;
  poster: string;
  category: string;
  articleSlugs: readonly string[];
};

// Curated from the public @WCBdenny channel, checked 2026-10-07.
// Keep the homepage selection independent of the larger video library.
export const homeVideos: readonly WcbVideo[] = [
  {
    articleSlugs: ["ninebot-smart-mobility-navimow"],
    key: "ninebot",
    videoId: "kCa9-2gsSVE",
    title: "Segway-Ninebot: From Mobility to Robot Mowers",
    description:
      "From smart mobility to Navimow: the products and business behind Ninebot’s expansion.",
    category: "Company Analysis",
    duration: "7:15",
    poster: "https://i.ytimg.com/vi/kCa9-2gsSVE/hq720.jpg",
  },
  {
    articleSlugs: ["who-owns-bissell-family-sanitaire"],
    key: "bissell",
    videoId: "7oKIOV_-S2c",
    title: "BISSELL: CrossWave and Five Generations",
    description:
      "CrossWave, the BISSELL family story and the evolution of its cleaning business.",
    category: "Company Analysis",
    duration: "10:48",
    poster: "https://i.ytimg.com/vi/7oKIOV_-S2c/hq720.jpg",
  },
  {
    articleSlugs: ["is-roborock-owned-by-xiaomi"],
    key: "roborock",
    videoId: "CXv_J_ffXS0",
    title: "Roborock: From Xiaomi to Global Markets",
    description:
      "Roborock’s development from its Xiaomi beginnings to the global floorcare market.",
    category: "Company Analysis",
    duration: "8:02",
    poster: "https://i.ytimg.com/vi/CXv_J_ffXS0/hq720.jpg",
  },
];

const additionalVideos: readonly WcbVideo[] = [
  {
    articleSlugs: ["lawn-mowing-history"],
    key: "mower-evolution", videoId: "AUdDPeaIo1Y",
    title: "The Evolution of Robotic Lawn Mowers",
    description: "The development of robotic lawn mowers and the technology behind the category.",
    duration: "8:34", category: "Product & Technology",
    poster: "https://i.ytimg.com/vi/AUdDPeaIo1Y/hq720.jpg",
  },
  {
    articleSlugs: ["karcher-family-business-alfred-irene-hartmut-jenner"],
    key: "karcher", videoId: "bLE2w14Y2pA",
    title: "Karcher: A Family Business in Cleaning",
    description: "The family business behind Karcher and its place in the cleaning industry.",
    duration: "9:21", category: "Company Analysis",
    poster: "https://i.ytimg.com/vi/bLE2w14Y2pA/hq720.jpg",
  },
  {
    articleSlugs: ["who-owns-ecovacs-tineco-manufacturing", "who-owns-tineco-ecovacs-group"],
    key: "ecovacs-tineco", videoId: "b8rTgZxlHhw",
    title: "ECOVACS & Tineco: Two Paths in Cleaning",
    description: "Two approaches to cleaning appliances through ECOVACS and Tineco.",
    duration: "6:18", category: "Company Analysis",
    poster: "https://i.ytimg.com/vi/b8rTgZxlHhw/hq720.jpg",
  },
  {
    articleSlugs: ["ifa-2026-cleaning-products-company-roundup"],
    key: "ifa-2026", videoId: "afJgsZCUTzY",
    title: "IFA 2026: Cleaning Product Roundup",
    description: "A roundup of cleaning products presented at IFA 2026.",
    duration: "8:57", category: "Product & Technology",
    poster: "https://i.ytimg.com/vi/afJgsZCUTzY/hq720.jpg",
  },
  {
    articleSlugs: ["ifa-2026-cleaning-products-company-roundup"],
    key: "dreame-ifa", videoId: "ercw82qN65U",
    title: "Dreame's Four Business Divisions at IFA",
    description: "A look at Dreame's four business divisions through its IFA presentation.",
    duration: "6:53", category: "Company Analysis",
    poster: "https://i.ytimg.com/vi/ercw82qN65U/hq720.jpg",
  },
  {
    articleSlugs: ["european-appliance-retail-channels"],
    key: "europe-retail", videoId: "CtsiyS0OPbs",
    title: "Europe's Major Appliance Retail Channels",
    description: "An overview of the major retail channels for appliances in Europe.",
    duration: "9:09", category: "Markets & Channels",
    poster: "https://i.ytimg.com/vi/CtsiyS0OPbs/hq720.jpg",
  },
  {
    articleSlugs: ["us-appliance-tool-retailers"],
    key: "us-retail", videoId: "uyv1l7QNQCc",
    title: "18 US Appliance and Tool Retailers",
    description: "A guide to 18 retailers in the US appliance and tool market.",
    duration: "9:08", category: "Markets & Channels",
    poster: "https://i.ytimg.com/vi/uyv1l7QNQCc/hq720.jpg",
  },
  {
    articleSlugs: ["philips-health-technology-versuni-home-appliances"],
    key: "philips", videoId: "vIN74oA5PuA",
    title: "Philips: A Century of Brands and Appliances",
    description: "Philips' history and the evolution of its brands and appliance business.",
    duration: "6:13", category: "Company Analysis",
    poster: "https://i.ytimg.com/vi/vIN74oA5PuA/hq720.jpg",
  },
  {
    articleSlugs: ["groupe-seb-global-household-business"],
    key: "groupe-seb", videoId: "7lZKu5ES9HM",
    title: "Groupe SEB: The Multi-Brand Business",
    description: "The brands and appliance business within Groupe SEB.",
    duration: "8:48", category: "Company Analysis",
    poster: "https://i.ytimg.com/vi/7lZKu5ES9HM/hq720.jpg",
  },
];

export const videoLibrary: readonly WcbVideo[] = [
  homeVideos[1],
  ...additionalVideos,
  homeVideos[0],
  homeVideos[2],
];
