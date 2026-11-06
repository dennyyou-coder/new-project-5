import type { Insight } from "@/lib/content";
import type { HubCategory, HubCategorySlug } from "@/lib/hubCategories";
import type { HubCategoryData } from "@/lib/hubCategoryContent";
import { productCover } from "@/lib/products";

/** Site photography for categories that have it; others fall back to their newest product or article image. */
const HUB_PHOTOS: Partial<Record<HubCategorySlug, string>> = {
  "robot-vacuums": "/images/site-refresh/2026-09-commercial/01-robot-vacuum.webp",
  "vacuum-cleaners": "/images/site-refresh/2026-09-commercial/06-vacuum-cleaner.webp",
  "floor-washers": "/images/site-refresh/2026-09-commercial/02-floor-washer.webp",
  "pool-robots": "/images/site-refresh/2026-09-commercial/03-pool-robot.webp",
  "robotic-mowers": "/images/site-refresh/2026-09-commercial/04-lawn-robot.webp",
  "commercial-cleaning": "/images/site-refresh/2026-09-commercial/05-commercial-cleaning.webp"
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

export type HubVisual = { src: string; kind: "photo" | "product" | "cover" };

export function hubVisual(data: HubCategoryData): HubVisual | undefined {
  const photo = HUB_PHOTOS[data.hub.slug];
  if (photo) return { src: photo, kind: "photo" };
  const model = data.newModels[0];
  if (model) return { src: productCover(model.slug), kind: "product" };
  const article = [...data.essential, ...data.analysis].find((item) => item.coverImage);
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
    products: productCategory ? `/products?category=${encodeURIComponent(productCategory)}` : "/products"
  };
}

/** WCB Expo 2026 runs 18–20 November 2026 in Suzhou (UTC+8); the homepage features it until it closes. */
export const EXPO_2026 = {
  name: "WCB Expo 2026",
  dates: "18–20 November 2026",
  venue: "Suzhou Shishan Convention Center · Suzhou, China",
  image: "/images/expo/wcb-expo-2026-hero.webp",
  closesAt: Date.parse("2026-11-21T00:00:00+08:00")
};

export function isExpoUpcoming(now = Date.now()) {
  return now < EXPO_2026.closesAt;
}

/** The homepage feature after the expo: the newest analysis with a cover that is not already the feed lead. */
export function pickFeaturedAnalysis(editorial: Insight[], exclude?: string) {
  return editorial.find((article) => article.coverImage && !article.seriesTitle && article.slug !== exclude);
}
