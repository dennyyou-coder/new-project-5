import type { MetadataRoute } from "next";
import { getBlogSeriesSlugs } from "@/lib/blogSeries";
import {
  buildBrandSitemapEntries,
  getPublishedBrandProfiles
} from "@/lib/brands";
import { buildBrandCategorySitemapEntries } from "@/lib/brandCategories";
import { getInsights } from "@/lib/content";
import {
  buildComponentSitemapEntries,
  getPublishedComponentProfiles
} from "@/lib/componentProfiles";
import {
  buildEquipmentSitemapEntries,
  getPublishedEquipmentProfiles
} from "@/lib/equipment";
import { GUIDE_TYPE_CONFIG } from "@/lib/guideTaxonomy";

const baseUrl = "https://worldcleanbiz.com";
const lastModified = new Date("2026-06-03");
const sourcingProductPublishedAt = new Date("2026-07-12T00:00:00+08:00");
const guideRoutes = GUIDE_TYPE_CONFIG.map(({ href }) => href);

export default function sitemap(): MetadataRoute.Sitemap {
  const insights = getInsights();
  const profiles = getPublishedBrandProfiles(insights);
  const publishedBrandSlugs = new Set(profiles.map(({ slug }) => slug));
  const equipmentProfiles = getPublishedEquipmentProfiles(publishedBrandSlugs);
  const componentProfiles = getPublishedComponentProfiles();
  const staticRoutes = [
    "",
    "/blog",
    "/blog/archive",
    "/brands",
    ...(equipmentProfiles.length > 0 ? ["/equipment"] : []),
    ...(componentProfiles.length > 0 ? ["/components"] : []),
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
    "/wcb-expo",
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
    ...buildBrandSitemapEntries(profiles, baseUrl),
    ...buildBrandCategorySitemapEntries(profiles, baseUrl),
    ...buildEquipmentSitemapEntries(equipmentProfiles, baseUrl),
    ...buildComponentSitemapEntries(componentProfiles, baseUrl),
    ...insights.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : article.date ? new Date(article.date) : new Date()
    }))
  ];
}
