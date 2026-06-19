import type { MetadataRoute } from "next";
import { getInsights } from "@/lib/content";

const baseUrl = "https://worldcleanbiz.com";
const lastModified = new Date("2026-06-03");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/blog",
    "/blog/archive",
    "/sourcing",
    "/reports",
    "/world-clean-expo",
    "/about",
    "/contact"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified
    })),
    ...getInsights().map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : article.date ? new Date(article.date) : new Date()
    }))
  ];
}
