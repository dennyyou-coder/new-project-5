import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, getInsights } from "@/lib/content";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { productModels, getProduct } from "@/lib/products";
import { newsCompanyVisuals, newsStoryVisuals, newsIndustryContextVisual, type NewsVisual } from "@/lib/newsVisuals";
import type { Insight } from "@/lib/content";

export const NEWS_TOPICS = [
  { slug: "products", label: "Products" },
  { slug: "companies", label: "Companies" },
  { slug: "markets-channels", label: "Markets & Channels" },
  { slug: "policy-standards", label: "Policy & Standards" },
  { slug: "events", label: "Events" }
] as const;
export type NewsTopic = typeof NEWS_TOPICS[number]["slug"];
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
  sources: { title: string; url: string }[];
  readingTime: string;
  content: string;
};

// News remains plain Markdown; image relationships are reviewed separately in newsVisuals.
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

export function getNews(): NewsArticle[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => file.endsWith(".md")).flatMap((file) => {
    const { data, content } = parseFrontmatter(fs.readFileSync(path.join(directory, file), "utf8"));
    if (data.hidden === "true") return [];
    const slug = file.slice(0, -3);
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
    if (Date.parse(String(data.publishedAt)) > Date.now()) return [];
    const words = content.replace(/\[[^\]]+\]\([^)]+\)/g, " ").split(/\s+/).length;
    return [{
      slug, topic, title: String(data.title), excerpt: String(data.excerpt), category: String(data.category),
      publishedAt: String(data.publishedAt), updatedAt: String(data.updatedAt || data.publishedAt),
      sortDate: String(data.sortDate), eventDate: String(data.eventDate), author: String(data.author || "World Clean Biz Editorial"),
      brandSlugs: array(data.brand_slugs), productSlugs: array(data.product_slugs),
      relatedArticles: array(data.related_articles), imageProduct: data.image_product ? String(data.image_product) : undefined,
      sources, readingTime: `${Math.max(1, Math.ceil(words / 220))} min read`, content
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
  if (storyVisual) return storyVisual;
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

export function getRelatedNewsForArticle(article: Pick<Insight, "slug" | "primaryBrands">, limit = 3) {
  const brands = new Set(article.primaryBrands);
  return getNews()
    .filter((item) => item.relatedArticles.includes(article.slug) || item.brandSlugs.some((slug) => brands.has(slug)))
    .sort((a, b) => Number(b.relatedArticles.includes(article.slug)) - Number(a.relatedArticles.includes(article.slug)) || b.eventDate.localeCompare(a.eventDate) || b.sortDate.localeCompare(a.sortDate))
    .slice(0, limit);
}

export const NEWS_PAGE_SIZE = 12;
export function newsHref(topic?: NewsTopic, page = 1) {
  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (page > 1) params.set("page", String(page));
  return `/news${params.size ? `?${params}` : ""}`;
}

export function selectNews(articles: NewsArticle[], topicValue?: string, pageValue?: string) {
  const topic = NEWS_TOPICS.find((item) => item.slug === topicValue)?.slug;
  const filtered = topic ? articles.filter((article) => article.topic === topic) : articles;
  const pageNumber = pageValue && /^\d+$/.test(pageValue) ? Number(pageValue) : 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / NEWS_PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number.isSafeInteger(pageNumber) ? pageNumber : 1));
  return { topic, page, totalPages, total: filtered.length, articles: filtered.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE) };
}
