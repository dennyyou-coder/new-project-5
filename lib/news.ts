import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, getInsights } from "@/lib/content";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { productModels, getProduct } from "@/lib/products";
import { newsCompanyVisuals, newsStoryVisuals, newsIndustryContextVisual, type NewsVisual } from "@/lib/newsVisuals";
import type { Insight } from "@/lib/content";
import { explicitHubCategories, hubCategoriesForNews, isHubCategorySlug, type HubCategorySlug } from "@/lib/hubCategories";

export const NEWS_TOPICS = [
  { slug: "products", label: "Products" },
  { slug: "companies", label: "Companies" },
  { slug: "markets-channels", label: "Markets & Channels" },
  { slug: "policy-standards", label: "Policy & Standards" },
  { slug: "events", label: "Events" }
] as const;
export type NewsTopic = typeof NEWS_TOPICS[number]["slug"];
/**
 * Optional `key_figures` frontmatter: one line of JSON, e.g.
 * key_figures: [{"label":"Q3 revenue","value":"CNY 5.61 billion","change":"+34.85% YoY","period":"Q3 2026","usd":""}]
 * Every number must come from the article body. `usd` is filled only when
 * the article also has `usd_rate`: the Federal Reserve H.10 rate on the
 * day the article was published (the previous business day if none),
 * e.g. usd_rate: "1 USD = 6.6538 CNY; Federal Reserve H.10, 30 Oct 2026".
 */
export type NewsKeyFigure = { label: string; value: string; change?: string; period?: string; usd?: string };

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  topic: NewsTopic;
  category: string;
  publishedAt: string;
  updatedAt: string;
  sortDate: string;
  eventDate: string;
  author: string;
  brandSlugs: string[];
  productSlugs: string[];
  relatedArticles: string[];
  imageProduct?: string;
  coverImage?: string;
  sources: { title: string; url: string }[];
  readingTime: string;
  /** Explicit `hub_categories` frontmatter; most hubs are derived instead. */
  hubCategories: HubCategorySlug[];
  keyFigures: NewsKeyFigure[];
  /** Source and date of the rate used for `usd` in key figures. */
  usdRate?: string;
  content: string;
};

function parseKeyFigures(raw: string, slug: string): NewsKeyFigure[] {
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const line = frontmatter.match(/^key_figures:\s*(\[.*\])\s*$/m)?.[1];
  if (!line) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    throw new Error(`News ${slug}: key_figures must be one line of JSON`);
  }
  if (!Array.isArray(parsed)) throw new Error(`News ${slug}: key_figures must be an array`);
  return parsed.map((item, index) => {
    const figure = item as Record<string, unknown>;
    if (typeof figure.label !== "string" || !figure.label || typeof figure.value !== "string" || !figure.value) {
      throw new Error(`News ${slug}: key_figures[${index}] needs label and value`);
    }
    const optional = (key: string) => (typeof figure[key] === "string" && figure[key] ? String(figure[key]) : undefined);
    return { label: figure.label, value: figure.value, change: optional("change"), period: optional("period"), usd: optional("usd") };
  });
}

// Both extensions contain Markdown. Prepared covers use the existing MDX image workflow.
const directory = path.join(process.cwd(), "content", "news");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const array = (value: unknown): string[] => Array.isArray(value) ? value.map(String) : [];

export function newsTopicLabel(topic: NewsTopic) {
  return NEWS_TOPICS.find((item) => item.slug === topic)!.label;
}

export function newsDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Shanghai"
  }).format(new Date(value.length === 10 ? `${value}T00:00:00+08:00` : value));
}

// See getInsights(): parse once per process in production builds only.
const cacheNews = process.env.NODE_ENV === "production";
let newsCache: NewsArticle[] | undefined;

export function getNews(): NewsArticle[] {
  const articles = cacheNews && newsCache ? newsCache : readNews();
  if (cacheNews) newsCache = articles;
  // Scheduled items appear once their publish time passes, cache or not.
  const now = Date.now();
  return articles.filter((article) => Date.parse(article.publishedAt) <= now);
}

function readNews(): NewsArticle[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => /\.mdx?$/.test(file)).flatMap((file) => {
    const raw = fs.readFileSync(path.join(directory, file), "utf8");
    const { data, content } = parseFrontmatter(raw);
    if (data.hidden === "true") return [];
    const slug = file.replace(/\.mdx?$/, "");
    const topic = String(data.topic) as NewsTopic;
    const sources = array(data.source_urls).map((url, index) => ({
      url, title: array(data.source_titles)[index] || "Original announcement"
    }));
    for (const field of ["title", "excerpt", "category", "publishedAt", "sortDate", "eventDate"]) {
      if (!data[field]) throw new Error(`News ${slug}: missing ${field}`);
    }
    if (!slugPattern.test(slug) || !NEWS_TOPICS.some((item) => item.slug === topic)) {
      throw new Error(`News ${slug}: invalid slug or topic`);
    }
    for (const field of ["publishedAt", "sortDate", "eventDate"]) {
      if (Number.isNaN(Date.parse(String(data[field])))) throw new Error(`News ${slug}: invalid ${field}`);
    }
    if (sources.length === 0 || sources.some((source) => !/^https:\/\//.test(source.url))) {
      throw new Error(`News ${slug}: original HTTPS sources required`);
    }
    const words = content.replace(/\[[^\]]+\]\([^)]+\)/g, " ").split(/\s+/).length;
    return [{
      slug, topic, title: String(data.title), excerpt: String(data.excerpt), category: String(data.category),
      publishedAt: String(data.publishedAt), updatedAt: String(data.updatedAt || data.publishedAt),
      sortDate: String(data.sortDate), eventDate: String(data.eventDate), author: String(data.author || "World Clean Biz Editorial"),
      brandSlugs: array(data.brand_slugs), productSlugs: array(data.product_slugs),
      relatedArticles: array(data.related_articles), imageProduct: data.image_product ? String(data.image_product) : undefined,
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
      sources, readingTime: `${Math.max(1, Math.ceil(words / 220))} min read`,
      hubCategories: explicitHubCategories(data.hub_categories),
      keyFigures: parseKeyFigures(raw, slug),
      usdRate: data.usd_rate ? String(data.usd_rate) : undefined, content
    }];
  }).sort((a, b) => b.eventDate.localeCompare(a.eventDate) || b.sortDate.localeCompare(a.sortDate) || a.slug.localeCompare(b.slug));
}

export function getNewsArticle(slug: string) {
  return getNews().find((article) => article.slug === slug);
}

export function getNewsContext(article: NewsArticle) {
  const insights = getInsights();
  const profiles = getPublishedBrandProfiles(insights);
  return {
    brands: profiles.filter((brand) => article.brandSlugs.includes(brand.slug)),
    products: productModels.filter((product) => article.productSlugs.includes(product.slug)),
    articles: insights.filter((item) => article.relatedArticles.includes(item.slug)),
    image: article.imageProduct && article.productSlugs.includes(article.imageProduct)
      ? getProduct(article.imageProduct)
      : undefined
  };
}

export function getNewsVisual(article: NewsArticle): NewsVisual | undefined {
  const storyVisual = newsStoryVisuals[article.slug];
  if (storyVisual) return article.coverImage
    ? { ...storyVisual, src: article.coverImage, prepared: true }
    : storyVisual;
  if (article.imageProduct && article.productSlugs.includes(article.imageProduct)) {
    const product = getProduct(article.imageProduct);
    if (product) return {
      src: product.coverImage, alt: product.name, kind: "product", prepared: true, fit: "contain",
      label: "Product reference", caption: `Model pictured: ${product.name}. Product reference image.`,
      sourceUrl: `/products/${product.slug}`, sourceLabel: "Product profile and sources"
    };
  }
  // Only use an explicit brand relationship. Never infer a model or fall back to a logo.
  return article.brandSlugs.map((slug) => newsCompanyVisuals[slug]).find(Boolean) || newsIndustryContextVisual;
}

// Visuals not taken from the story itself: a company stock image, another
// article's cover or the generic industry picture.
const BORROWED_VISUAL_LABELS = new Set(["Company image", "Related coverage", "Industry context"]);
export function isBorrowedNewsVisual(visual: NewsVisual | undefined) {
  return Boolean(visual && BORROWED_VISUAL_LABELS.has(visual.label));
}

export function getRelatedNewsForArticle(article: Pick<Insight, "slug" | "primaryBrands">, limit = 3) {
  const brands = new Set(article.primaryBrands);
  return getNews()
    .filter((item) => item.relatedArticles.includes(article.slug) || item.brandSlugs.some((slug) => brands.has(slug)))
    .sort((a, b) => Number(b.relatedArticles.includes(article.slug)) - Number(a.relatedArticles.includes(article.slug)) || b.eventDate.localeCompare(a.eventDate) || b.sortDate.localeCompare(a.sortDate))
    .slice(0, limit);
}

// Stories that share a company, then a category, then a topic, closest in date first.
// Every story page lists these plus its chronological neighbours, so no story depends
// on the paginated archive alone to be found.
export function getMoreNews(article: NewsArticle, limit = 4) {
  const brands = new Set(article.brandSlugs);
  const hubs = new Set(hubCategoriesForNews(article));
  const eventTime = Date.parse(article.eventDate);
  const score = (item: NewsArticle) =>
    (item.brandSlugs.some((slug) => brands.has(slug)) ? 4 : 0) +
    (hubCategoriesForNews(item).some((hub) => hubs.has(hub)) ? 2 : 0) +
    (item.topic === article.topic ? 1 : 0);
  return getNews()
    .filter((item) => item.slug !== article.slug)
    .map((item) => ({ item, score: score(item), distance: Math.abs(Date.parse(item.eventDate) - eventTime) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.distance - b.distance || a.item.slug.localeCompare(b.item.slug))
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getAdjacentNews(article: NewsArticle) {
  const all = getNews();
  const index = all.findIndex((item) => item.slug === article.slug);
  return { newer: index > 0 ? all[index - 1] : undefined, older: index >= 0 ? all[index + 1] : undefined };
}

export const NEWS_PAGE_SIZE = 12;
export function newsHref(topic?: NewsTopic, page = 1, category?: HubCategorySlug) {
  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  return `/news${params.size ? `?${params}` : ""}`;
}

export function selectNews(articles: NewsArticle[], topicValue?: string, pageValue?: string, categoryValue?: string) {
  const topic = NEWS_TOPICS.find((item) => item.slug === topicValue)?.slug;
  const category = categoryValue && isHubCategorySlug(categoryValue) ? categoryValue : undefined;
  const filtered = articles.filter(
    (article) =>
      (!topic || article.topic === topic) &&
      (!category || hubCategoriesForNews(article).includes(category))
  );
  const pageNumber = pageValue && /^\d+$/.test(pageValue) ? Number(pageValue) : 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / NEWS_PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number.isSafeInteger(pageNumber) ? pageNumber : 1));
  return { topic, category, page, totalPages, total: filtered.length, articles: filtered.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE) };
}
