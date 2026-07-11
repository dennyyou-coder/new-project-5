import type { IconName } from "@/components/Icon";
import type { TallyFormKey } from "@/lib/tallyForms";

export type SourcingCategory = {
  title: string;
  description: string;
  value: string;
  ctaLocation: string;
  icon: IconName;
  image: string;
};

export const SOURCING_CATEGORIES: SourcingCategory[] = [
  { title: "Pool Robots", description: "The Category Is Just Getting Started.", value: "pool_robots", ctaLocation: "sourcing_category_pool_robots", icon: "waves", image: "/images/sourcing/pool-robots.png" },
  { title: "Lawn Robots", description: "The Next Outdoor Robotics Market.", value: "lawn_robots", ctaLocation: "sourcing_category_lawn_robots", icon: "sparkles", image: "/images/sourcing/lawn-robots.png" },
  { title: "Floor Washers", description: "Still Early Outside China.", value: "floor_washers", ctaLocation: "sourcing_category_floor_washers", icon: "wind", image: "/images/sourcing/floor-washers.png" },
  { title: "Robotic Vacuums", description: "The Industry Is Entering A New Cycle.", value: "robotic_vacuums", ctaLocation: "sourcing_category_robotic_vacuums", icon: "target", image: "/images/sourcing/robotic-vacuums.png" },
  { title: "Commercial Cleaning", description: "Automation Is Just Beginning.", value: "commercial_cleaning", ctaLocation: "sourcing_category_commercial_cleaning", icon: "building", image: "/images/sourcing/commercial-cleaning.png" },
  { title: "Vacuum Cleaners", description: "A Mature Market Facing New Disruption.", value: "vacuum_cleaners", ctaLocation: "sourcing_category_vacuum_cleaners", icon: "layers", image: "/images/sourcing/vacuum-cleaners.png" }
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
  { icon: "factory", title: "Sourcing", description: "For sourcing, OEM/ODM, private label and product development questions.", value: "sourcing", ctaLocation: "contact_sourcing", form: "sourcing", buttonLabel: "Start A Sourcing Inquiry" },
  { icon: "calendar", title: "World Clean Expo", description: "For visiting, exhibiting, partnerships and event opportunities.", value: "expo", ctaLocation: "contact_expo", form: "expo", buttonLabel: "Send An Expo Inquiry" },
  { icon: "newspaper", title: "Media & Editorial", description: "For interviews, industry news, editorial collaboration and media requests.", value: "media", ctaLocation: "contact_media", form: "contact", buttonLabel: "Send A Media Inquiry" },
  { icon: "message", title: "General Business", description: "For partnerships and other cleaning industry business questions.", value: "general", ctaLocation: "contact_general", form: "contact", buttonLabel: "Send A General Inquiry" }
];
