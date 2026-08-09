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
const guideRoutes = GUIDE_TYPE_CONFIG.map(({ href }) => href);

function wcbDate(value?: string) {
  if (!value) return undefined;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00+08:00`)
    : new Date(value);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

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
    "/contact",
    "/quality-compliance"
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}` })),
    ...getBlogSeriesSlugs(insights).map((series) => ({
      url: `${baseUrl}/blog/series/${series}`,
      lastModified: undefined
    })),
    ...buildBrandSitemapEntries(profiles, baseUrl),
    ...buildBrandCategorySitemapEntries(profiles, baseUrl),
    ...buildEquipmentSitemapEntries(equipmentProfiles, baseUrl),
    ...buildComponentSitemapEntries(componentProfiles, baseUrl),
    ...insights.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: wcbDate(article.updatedAt || article.publishedAt || article.date)
    }))
  ];
}
