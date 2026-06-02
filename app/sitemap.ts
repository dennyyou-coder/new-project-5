import type { MetadataRoute } from "next";
import { getInsights } from "@/lib/content";

const baseUrl = "https://worldcleanbiz.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/insights",
    "/sourcing",
    "/market-reports",
    "/world-clean-expo",
    "/about",
    "/contact"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...getInsights().map((article) => ({
      url: `${baseUrl}/insights/${article.slug}`,
      lastModified: article.date ? new Date(article.date) : new Date()
    }))
  ];
}
