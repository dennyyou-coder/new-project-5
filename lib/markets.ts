import { getBrandCategoriesForProfile } from "@/lib/brandCategories";
import { getPublishedBrandProfiles, type BrandProfile } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import {
  getHubCategory,
  hubCategoriesForBrand,
  hubCategoriesForNews,
  hubCategoriesForProduct,
  type HubCategory,
  type HubCategorySlug
} from "@/lib/hubCategories";
import { getNews, type NewsArticle, type NewsKeyFigure } from "@/lib/news";
import { productModels } from "@/lib/products";

export type MarketResultRow = {
  news: NewsArticle;
  company?: BrandProfile;
  companyName: string;
  hub?: HubCategory;
  figure?: NewsKeyFigure;
};

const DEAL_PATTERN = /\b(acquire|acquires|acquired|acquisition|stake|merger|merge|takeover|buys|buyout|divest|divests|sale of|joint venture|venture)\b/i;
const REVENUE_PATTERN = /\b(revenue|sales)\b/i;

/** Results stories: anything with key_figures, plus the Financial Results category. */
export function isResultsNews(article: NewsArticle) {
  return article.keyFigures.length > 0 || article.category === "Financial Results";
}

function hubForCompany(slug: string | undefined): HubCategorySlug | undefined {
  if (!slug) return undefined;
  const votes = new Map<HubCategorySlug, number>();
  for (const hub of hubCategoriesForBrand(getBrandCategoriesForProfile(slug).map((category) => category.slug))) {
    votes.set(hub, (votes.get(hub) ?? 0) + 1);
  }
  for (const product of productModels.filter((model) => model.brandSlug === slug)) {
    for (const hub of hubCategoriesForProduct(product)) votes.set(hub, (votes.get(hub) ?? 0) + 1);
  }
  return [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

/** The headline revenue or sales figure: the last one listed (the longest period). */
function revenueFigure(article: NewsArticle) {
  const revenue = article.keyFigures.filter((figure) => REVENUE_PATTERN.test(figure.label));
  return revenue.at(-1);
}

export function getMarketsData() {
  const news = getNews();
  const brands = getPublishedBrandProfiles(getInsights());
  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

  const results: MarketResultRow[] = news.filter(isResultsNews).map((article) => {
    const company = article.brandSlugs.map((slug) => brandBySlug.get(slug)).find(Boolean);
    const hubSlug = hubCategoriesForNews(article)[0] ?? hubForCompany(company?.slug ?? article.brandSlugs[0]);
    return {
      news: article,
      company,
      companyName: company?.name ?? article.title,
      hub: hubSlug ? getHubCategory(hubSlug) : undefined,
      figure: revenueFigure(article)
    };
  });

  const deals = news.filter((article) => !isResultsNews(article) && DEAL_PATTERN.test(article.title)).slice(0, 8);
  // Other results stories (without key figures yet), newest first.
  const coverage = news
    .filter((article) => !isResultsNews(article) && /\b(revenue|results|profit|sales|earnings)\b/i.test(article.title))
    .slice(0, 8);
  return { results, deals, coverage };
}
