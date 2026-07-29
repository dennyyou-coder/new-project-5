import type { MetadataRoute } from "next";
import { getBlogSeriesSlugs } from "@/lib/blogSeries";
import { getInsights } from "@/lib/content";
import { GUIDE_TYPE_CONFIG } from "@/lib/guideTaxonomy";

const baseUrl = "https://worldcleanbiz.com";
const lastModified = new Date("2026-06-03");
const sourcingProductPublishedAt = new Date("2026-07-12T00:00:00+08:00");
const guideRoutes = GUIDE_TYPE_CONFIG.map(({ href }) => href);

export default function sitemap(): MetadataRoute.Sitemap {
  const insights = getInsights();
  const staticRoutes = [
    "",
    "/blog",
    "/blog/archive",
    "/guides",
    ...guideRoutes,
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
    ...getBlogSeriesSlugs(insights).map((series) => ({
      url: `${baseUrl}/blog/series/${series}`,
      lastModified
    })),
    ...insights.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : article.date ? new Date(article.date) : new Date()
    }))
  ];
}
