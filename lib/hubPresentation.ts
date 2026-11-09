import type { Insight } from "@/lib/content";
import type { HubCategory, HubCategorySlug } from "@/lib/hubCategories";
import type { HubCategoryData } from "@/lib/hubCategoryContent";
import { productCover } from "@/lib/products";

/** Official brand photography for each category, credited on the page; others fall back to their newest product or article image. */
const HUB_PHOTOS: Partial<Record<HubCategorySlug, { src: string; credit: string }>> = {
  "robot-vacuums": { src: "/images/brands/roborock/hero-saros-z70.webp", credit: "Roborock" },
  "vacuum-cleaners": { src: "/images/brands/samsung-home-appliances/hero-bespoke-ai-jet-lite.webp", credit: "Samsung" },
  "floor-washers": { src: "/images/brands/tineco/hero-floor-one-s9-artist-steam.webp", credit: "Tineco" },
  "pool-robots": { src: "/images/brands/wybot/hero-s3-pool-cleaner.webp", credit: "WYBOT" },
  "robotic-mowers": { src: "/images/brands/husqvarna/hero-automower-portfolio.webp", credit: "Husqvarna" },
  "commercial-cleaning": { src: "/images/brands/minuteman/hero-roboscrub-warehouse.webp", credit: "Minuteman" },
  "small-appliances": { src: "/images/brands/kitchenaid/hero-artisan-plus.webp", credit: "KitchenAid" },
  "power-tools-outdoor": { src: "/images/brands/stihl/hero-stihl-outdoor-power-equipment.webp", credit: "STIHL" }
};

/** Category sourcing pages that exist on the site. */
const HUB_SOURCING: Partial<Record<HubCategorySlug, string>> = {
  "robot-vacuums": "/sourcing/robotic-vacuums",
  "vacuum-cleaners": "/sourcing/vacuum-cleaners",
  "floor-washers": "/sourcing/floor-washers",
  "pool-robots": "/sourcing/pool-robots",
  "robotic-mowers": "/sourcing/lawn-robots",
  "commercial-cleaning": "/sourcing/commercial-cleaning"
};

export type HubVisual = { src: string; kind: "photo" | "product" | "cover"; credit?: string };

export function hubVisual(data: HubCategoryData): HubVisual | undefined {
  const photo = HUB_PHOTOS[data.hub.slug];
  if (photo) return { src: photo.src, kind: "photo", credit: photo.credit };
  const model = data.newModels[0];
  if (model) return { src: productCover(model.slug), kind: "product" };
  const article = [...data.essential, ...data.analysis, ...data.guides].find((item) => item.coverImage);
  return article?.coverImage ? { src: article.coverImage, kind: "cover" } : undefined;
}

export function hubSourcingHref(hub: HubCategory) {
  return HUB_SOURCING[hub.slug];
}

/** Links that open each full list already narrowed to the category. */
export function hubListHrefs(hub: HubCategory) {
  const productCategory = hub.rules.productCategories?.[0];
  return {
    news: `/news?category=${hub.slug}`,
    analysis: `/blog/archive?hub=${hub.slug}`,
    // The product library shows hub names, so the filter link uses the hub name too.
    products: productCategory ? `/products?category=${encodeURIComponent(hub.name)}` : "/products",
    companies: `/brands?category=${hub.slug}#all-companies`
  };
}

/** WCB Expo 2026 runs 18–20 November 2026 in Suzhou (UTC+8); the homepage features it until it closes. */
export const EXPO_2026 = {
  name: "WCB Expo 2026",
  dates: "18–20 November 2026",
  venue: "Suzhou Shishan Convention Center · Suzhou, China",
  /** English version of the organiser's 2026 key visual (a -800 variant sits beside it). */
  image: "/images/articles/wcb-expo-programme/03-wcb-2026-key-visual-en.webp",
  closesAt: Date.parse("2026-11-21T00:00:00+08:00")
};

export function isExpoUpcoming(now = Date.now()) {
  return now < EXPO_2026.closesAt;
}

/** The homepage feature after the expo: the newest analysis with a cover that is not already the feed lead. */
export function pickFeaturedAnalysis(editorial: Insight[], exclude?: string) {
  return editorial.find((article) => article.coverImage && !article.seriesTitle && article.slug !== exclude);
}
