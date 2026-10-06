import type { IconName } from "@/components/Icon";
import type { TallyFormKey } from "@/lib/tallyForms";

export type SourcingCategory = {
  title: string;
  description: string;
  value: string;
  ctaLocation: string;
  icon: IconName;
  image: string;
  href: string;
};

export const SOURCING_CATEGORIES: SourcingCategory[] = [
  { title: "Robotic Cleaning Products", description: "Indoor and outdoor robots reshaping how cleaning work gets done.", value: "robotic_cleaning", ctaLocation: "sourcing_opportunity_robotic_cleaning", icon: "target", image: "/images/site-refresh/2026-09-commercial/01-robot-vacuum.webp", href: "/sourcing/robotic-vacuums" },
  { title: "Floor Care Equipment", description: "Fast-moving residential and professional floor-cleaning solutions.", value: "floor_care", ctaLocation: "sourcing_opportunity_floor_care", icon: "wind", image: "/images/site-refresh/2026-09-commercial/02-floor-washer.webp", href: "/sourcing/floor-washers" },
  { title: "Vacuum Cleaners", description: "Established demand meeting new formats, features and price points.", value: "vacuum_cleaners", ctaLocation: "sourcing_opportunity_vacuum_cleaners", icon: "layers", image: "/images/site-refresh/2026-09-commercial/06-vacuum-cleaner.webp", href: "/sourcing/vacuum-cleaners" },
  { title: "Commercial Cleaning Equipment", description: "Machines and automation for professional cleaning operations.", value: "commercial_cleaning", ctaLocation: "sourcing_opportunity_commercial_cleaning", icon: "building", image: "/images/site-refresh/2026-09-commercial/05-commercial-cleaning.webp", href: "/sourcing/commercial-cleaning" },
  { title: "Outdoor Cleaning Products", description: "Robotic mowers, pool care and emerging outdoor maintenance products.", value: "outdoor_cleaning", ctaLocation: "sourcing_opportunity_outdoor_cleaning", icon: "sparkles", image: "/images/site-refresh/2026-09-commercial/04-lawn-robot.webp", href: "/sourcing/lawn-robots" },
  { title: "New & Emerging Products", description: "Early product directions that do not fit yesterday's category map.", value: "new_emerging", ctaLocation: "sourcing_opportunity_new_emerging", icon: "waves", image: "/images/site-refresh/2026-09-commercial/14-emerging-products.webp", href: "/sourcing/pool-robots" }
];

export type ContactInquiry = {
  icon: IconName;
  title: string;
  description: string;
  value: string;
  ctaLocation: string;
  form: TallyFormKey;
  buttonLabel: string;
};

export const CONTACT_INQUIRIES: ContactInquiry[] = [
  { icon: "factory", title: "Sourcing & Supply Chain", description: "Find products, manufacturing partners and technical solutions for sourcing, components and OEM/ODM projects.", value: "sourcing", ctaLocation: "contact_sourcing", form: "sourcing", buttonLabel: "Discuss Sourcing" },
  { icon: "message", title: "Channel Partnerships", description: "Explore distribution, retail and regional market cooperation between brands, buyers and channel partners.", value: "general", ctaLocation: "contact_general", form: "contact", buttonLabel: "Discuss Channel Cooperation" },
  { icon: "calendar", title: "Exhibition Partnerships", description: "Discuss WCB Expo participation, event partnerships and sponsorship opportunities.", value: "expo", ctaLocation: "contact_expo", form: "expo", buttonLabel: "Discuss WCB Expo" },
  { icon: "newspaper", title: "Content & Brand Communication", description: "Explore company interviews, product introductions and video collaborations. Commercial content is distinguished from independent analysis.", value: "media", ctaLocation: "contact_media", form: "contact", buttonLabel: "Discuss Content Cooperation" }
];
