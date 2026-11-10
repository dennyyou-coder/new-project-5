import { getTopics } from "@/lib/topics";
import { productModels } from "@/lib/products";
import { getNews } from "@/lib/news";
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
import { LISTED_HUB_CATEGORIES } from "@/lib/hubCategories";

const baseUrl = "https://worldcleanbiz.com";

function wcbDate(value?: string) {
  if (!value) return undefined;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00+08:00`)
    : new Date(value);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

// A timestamp shared by many stories comes from bulk maintenance, not from an editorial
// update. Reporting it as lastmod tells Google that every story changed at once, which
// makes the field untrustworthy, so those stories fall back to their publication date.
const BULK_UPDATE_THRESHOLD = 20;

export function newsLastModified(articles: { updatedAt?: string; publishedAt: string }[]) {
  const counts = new Map<string, number>();
  for (const article of articles) {
    if (article.updatedAt) counts.set(article.updatedAt, (counts.get(article.updatedAt) ?? 0) + 1);
  }
  return (article: { updatedAt?: string; publishedAt: string }) => {
    const updated = article.updatedAt && (counts.get(article.updatedAt) ?? 0) <= BULK_UPDATE_THRESHOLD
      ? article.updatedAt
      : undefined;
    return wcbDate(updated || article.publishedAt);
  };
}

function routeEntries(routes: string[]): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `${baseUrl}${route}` }));
}

export function buildBlogSitemap(): MetadataRoute.Sitemap {
  const insights = getInsights();
  const news = getNews();
  const newsDate = newsLastModified(news);

  // Paginated list pages stay crawlable through their links but are left out of the
  // sitemap: every story and article they list already has its own entry.
  return [
    { url: `${baseUrl}/news` },
    ...news.map((article) => ({ url: `${baseUrl}/news/${article.slug}`, lastModified: newsDate(article) })),
    ...routeEntries(["/blog", "/blog/archive", "/topics"]),
    ...getTopics().map((topic) => ({ url: `${baseUrl}/topics/${topic.slug}`, lastModified: wcbDate(topic.updated) })),
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
  const guideRoutes = GUIDE_TYPE_CONFIG.map((config) => config.href);
  const modelDate = new Map(productModels.map((model) => [`/products/${model.slug}`, wcbDate(model.verifiedAt)]));

  return routeEntries([
    "",
    "/categories",
    "/markets",
    ...LISTED_HUB_CATEGORIES.map((hub) => `/categories/${hub.slug}`),
    "/videos",
    "/products",
    ...productModels.map((model) => `/products/${model.slug}`),
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
    "/events",
    "/wcb-expo",
    "/about",
    "/contact",
    "/quality-compliance",
    "/editorial-policy",
    "/rankings",
    "/site-index",
    "/site-index/articles",
    "/site-index/news",
    "/authors/denny-you",
    "/authors/wcb-editorial"
  ]).map((entry) => {
    const lastModified = modelDate.get(entry.url.slice(baseUrl.length));
    return lastModified ? { ...entry, lastModified } : entry;
  });
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
