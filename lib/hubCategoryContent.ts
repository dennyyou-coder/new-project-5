import { getBrandCategoriesForProfile } from "@/lib/brandCategories";
import { getPublishedBrandProfiles, type BrandProfile } from "@/lib/brands";
import { getInsights, type Insight } from "@/lib/content";
import { getPublishedEquipmentProfiles } from "@/lib/equipment";
import {
  LISTED_HUB_CATEGORIES,
  HUB_EQUIPMENT,
  hubCategoriesForBrand,
  hubCategoriesForInsight,
  hubCategoriesForNews,
  hubCategoriesForProduct,
  type HubCategory
} from "@/lib/hubCategories";
import { getEditorialInsights, getGuideInsights } from "@/lib/insightCollections";
import { getNews, type NewsArticle } from "@/lib/news";
import { productModels, productSelectionYear, type ProductModel } from "@/lib/products";

export type HubFeedItem =
  | { kind: "news"; date: string; news: NewsArticle }
  | { kind: "analysis"; date: string; article: Insight };

export type HubCategoryData = {
  hub: HubCategory;
  news: NewsArticle[];
  analysis: Insight[];
  guides: Insight[];
  essential: Insight[];
  products: ProductModel[];
  newModels: ProductModel[];
  companies: BrandProfile[];
  feed: HubFeedItem[];
  /** Equipment-type profiles for the hub, in the order listed in HUB_EQUIPMENT. */
  equipment: { slug: string; name: string }[];
};

function dateKey(value: string) {
  const time = Date.parse(value.length === 10 ? `${value}T00:00:00+08:00` : value);
  return Number.isNaN(time) ? 0 : time;
}

export function buildHubCategoryData(
  hub: HubCategory,
  source: {
    insights: Insight[];
    news: NewsArticle[];
    products: ProductModel[];
    brands: BrandProfile[];
    equipment?: { slug: string; name: string }[];
  }
): HubCategoryData {
  const inHub = <T,>(items: T[], classify: (item: T) => string[]) =>
    items.filter((item) => classify(item).includes(hub.slug));

  const hubInsights = inHub(source.insights, hubCategoriesForInsight);
  const analysis = getEditorialInsights(hubInsights).filter((article) => !article.series);
  const news = inHub(source.news, hubCategoriesForNews);
  const products = inHub(source.products, hubCategoriesForProduct);
  const newModels = products.filter((product) => product.launchYear === productSelectionYear);

  const productBrandSlugs = new Set(products.map((product) => product.brandSlug));
  const companies = source.brands.filter(
    (brand) =>
      productBrandSlugs.has(brand.slug) ||
      Boolean(hub.rules.brandSlugs?.includes(brand.slug)) ||
      hubCategoriesForBrand(getBrandCategoriesForProfile(brand.slug).map((category) => category.slug)).includes(hub.slug)
  );

  // Search-data picks first, then editor-marked articles; the module is
  // hidden when there are none.
  // A pick leads whichever module it belongs to: analysis picks lead
  // Essential reading, guide picks lead Guides.
  const pickFrom = (articles: Insight[]) =>
    (hub.searchPicks ?? [])
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is Insight => Boolean(article));
  const picks = pickFrom(analysis);
  const allGuides = getGuideInsights(hubInsights);
  const guidePicks = pickFrom(allGuides);
  const guides = [
    ...guidePicks,
    ...allGuides
      .filter((guide) => !guidePicks.includes(guide))
      .sort((a, b) => b.guidePriority - a.guidePriority)
  ];
  const editorMarked = analysis
    .filter((article) => (article.featured || article.visualPriority > 0) && !picks.includes(article))
    .sort((a, b) => b.visualPriority - a.visualPriority || b.sortDate.localeCompare(a.sortDate));
  const essential = [...picks, ...editorMarked];

  const feed: HubFeedItem[] = [
    ...news.map((item) => ({ kind: "news" as const, date: item.eventDate, news: item })),
    ...analysis.map((article) => ({ kind: "analysis" as const, date: article.sortDate || article.date, article }))
  ].sort((a, b) => dateKey(b.date) - dateKey(a.date));

  const equipmentBySlug = new Map((source.equipment ?? []).map((item) => [item.slug, item]));
  const equipment = (HUB_EQUIPMENT[hub.slug] ?? [])
    .map((slug) => equipmentBySlug.get(slug))
    .filter((item): item is { slug: string; name: string } => Boolean(item));

  return { hub, news, analysis, guides, essential, products, newModels, companies, feed, equipment };
}

function publishedEquipment(brands: BrandProfile[]) {
  return getPublishedEquipmentProfiles(new Set(brands.map(({ slug }) => slug))).map(({ slug, name }) => ({ slug, name }));
}

export function getHubCategoryData(hub: HubCategory): HubCategoryData {
  const insights = getInsights();
  const brands = getPublishedBrandProfiles(insights);
  return buildHubCategoryData(hub, {
    insights,
    news: getNews(),
    products: productModels,
    brands,
    equipment: publishedEquipment(brands)
  });
}

export function getAllHubCategoryData(): HubCategoryData[] {
  const insights = getInsights();
  const brands = getPublishedBrandProfiles(insights);
  const source = {
    insights,
    news: getNews(),
    products: productModels,
    brands,
    equipment: publishedEquipment(brands)
  };
  return LISTED_HUB_CATEGORIES.map((hub) => buildHubCategoryData(hub, source));
}
