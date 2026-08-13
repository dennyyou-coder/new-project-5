import type { MetadataRoute } from "next";
import { getBlogSeriesSlugs } from "@/lib/blogSeries";
import {
  buildBrandSitemapEntries,
  getPublishedBrandProfiles
} from "@/lib/brands";
import { buildBrandCategorySitemapEntries } from "@/lib/brandCategories";
import { getInsights } from "@/lib/content";
import {
  DIRECTORY_PAGE_SIZE,
  directoryHref
} from "@/lib/contentDirectory";
import {
  buildComponentSitemapEntries,
  getPublishedComponentProfiles
} from "@/lib/componentProfiles";
import {
  buildEquipmentSitemapEntries,
  getPublishedEquipmentProfiles
} from "@/lib/equipment";
import { GUIDE_TYPE_CONFIG } from "@/lib/guideTaxonomy";
import {
  getEditorialInsights,
  getGuideInsights
} from "@/lib/insightCollections";

const baseUrl = "https://worldcleanbiz.com";

function wcbDate(value?: string) {
  if (!value) return undefined;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00+08:00`)
    : new Date(value);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function paginatedRoutes(pathname: string, itemCount: number) {
  const totalPages = Math.ceil(itemCount / DIRECTORY_PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
    directoryHref(pathname, index + 2)
  );
}

function routeEntries(routes: string[]): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `${baseUrl}${route}` }));
}

export function buildBlogSitemap(): MetadataRoute.Sitemap {
  const insights = getInsights();
  const editorial = getEditorialInsights(insights);

  return [
    ...routeEntries([
      "/blog",
      "/blog/archive",
      ...paginatedRoutes("/blog/archive", editorial.length)
    ]),
    ...getBlogSeriesSlugs(insights).map((series) => ({
      url: `${baseUrl}/blog/series/${series}`
    })),
    ...insights.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: wcbDate(article.updatedAt || article.publishedAt || article.date)
    }))
  ];
}

export function buildDiscoverySitemap(): MetadataRoute.Sitemap {
  const insights = getInsights();
  const guides = getGuideInsights(insights);
  const guideRoutes = GUIDE_TYPE_CONFIG.flatMap((config) => [
    config.href,
    ...paginatedRoutes(config.href, getGuideInsights(insights, config.type).length)
  ]);

  return routeEntries([
    "",
    "/guides",
    ...paginatedRoutes("/guides", guides.length),
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
  ]);
}

export function buildBrandsSitemap(): MetadataRoute.Sitemap {
  const insights = getInsights();
  const profiles = getPublishedBrandProfiles(insights);

  return [
    { url: `${baseUrl}/brands` },
    ...buildBrandSitemapEntries(profiles, baseUrl),
    ...buildBrandCategorySitemapEntries(profiles, baseUrl)
  ];
}

export function buildTechnicalSitemap(): MetadataRoute.Sitemap {
  const insights = getInsights();
  const brandProfiles = getPublishedBrandProfiles(insights);
  const publishedBrandSlugs = new Set(brandProfiles.map(({ slug }) => slug));
  const equipmentProfiles = getPublishedEquipmentProfiles(publishedBrandSlugs);
  const componentProfiles = getPublishedComponentProfiles();

  return [
    ...(equipmentProfiles.length > 0 ? [{ url: `${baseUrl}/equipment` }] : []),
    ...buildEquipmentSitemapEntries(equipmentProfiles, baseUrl),
    ...(componentProfiles.length > 0 ? [{ url: `${baseUrl}/components` }] : []),
    ...buildComponentSitemapEntries(componentProfiles, baseUrl)
  ];
}
