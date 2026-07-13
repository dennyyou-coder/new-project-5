import type { MetadataRoute } from "next";
import { getInsights } from "@/lib/content";

const baseUrl = "https://worldcleanbiz.com";
const lastModified = new Date("2026-06-03");
const sourcingProductPublishedAt = new Date("2026-07-12T00:00:00+08:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/blog",
    "/blog/archive",
    "/sourcing",
    "/sourcing/lawn-robots",
    "/sourcing/pool-robots",
    "/sourcing/floor-washers",
    "/sourcing/robotic-vacuums",
    "/sourcing/commercial-cleaning",
    "/sourcing/vacuum-cleaners",
    "/reports",
    "/world-clean-expo",
    "/about",
    "/contact"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: route.startsWith("/sourcing/") ? sourcingProductPublishedAt : lastModified
    })),
    ...getInsights().map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : article.date ? new Date(article.date) : new Date()
    }))
  ];
}
