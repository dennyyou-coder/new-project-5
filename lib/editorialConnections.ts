import type { Insight } from "./content";
import type { NewsArticle } from "./news";
import type { ProductModel } from "./products";
import type { WcbVideo } from "./wcbVideos";

type ArticleRelation = Pick<Insight, "slug" | "content" | "primaryBrands" | "series">;

// Read only actual internal links; words in a title are not model relationships.
function linkedSlugs(content: string, route: "blog" | "products") {
  const slugs = new Set<string>();
  const links = /(?:\]\(|href=["'])(?:https:\/\/(?:www\.)?worldcleanbiz\.com)?\/(blog|products)\/([a-z0-9]+(?:-[a-z0-9]+)*)(?=[/#?\s)"'])/g;
  for (const match of content.matchAll(links)) if (match[1] === route) slugs.add(match[2]);
  return slugs;
}

export function getArticleProducts(article: Pick<Insight, "slug" | "content">, products: readonly ProductModel[]) {
  const direct = linkedSlugs(article.content, "products");
  return products.filter((product) => direct.has(product.slug) || product.articles.includes(article.slug))
    .sort((a, b) => Number(direct.has(b.slug)) - Number(direct.has(a.slug)));
}

export function getArticleReading(article: ArticleRelation, articles: readonly Insight[], products: readonly ProductModel[], limit = 3) {
  if (limit <= 0) return [];
  const direct = linkedSlugs(article.content, "blog");
  const relatedProducts = getArticleProducts(article, products);
  const brands = new Set(article.primaryBrands);
  const ranked = articles.filter((item) => item.slug !== article.slug && (!article.series || item.series !== article.series))
    .map((item) => ({ item, score: direct.has(item.slug) ? 100
      : linkedSlugs(item.content, "blog").has(article.slug) ? 90
      : relatedProducts.some((product) => product.articles.includes(item.slug)) ? 60
      : item.primaryBrands.some((brand) => brands.has(brand)) ? 40 : 0 }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.sortDate.localeCompare(a.item.sortDate) || a.item.slug.localeCompare(b.item.slug));
  const selected: Insight[] = [];
  for (const { item } of ranked) {
    if (item.series && selected.some((entry) => entry.series === item.series)) continue;
    selected.push(item);
    if (selected.length >= limit) break;
  }
  return selected;
}

export function getNewsReading(news: Pick<NewsArticle, "content" | "relatedArticles" | "brandSlugs" | "productSlugs">, articles: readonly Insight[], products: readonly ProductModel[], limit = 3) {
  if (limit <= 0) return [];
  const direct = linkedSlugs(news.content, "blog");
  const mentionedProducts = products.filter((product) => news.productSlugs.includes(product.slug));
  return articles.map((item) => ({ item, score:
    news.relatedArticles.includes(item.slug) ? 100 - news.relatedArticles.indexOf(item.slug)
    : direct.has(item.slug) ? 90
    : mentionedProducts.some((product) => product.articles.includes(item.slug)) ? 60
    : item.primaryBrands.some((brand) => news.brandSlugs.includes(brand)) ? 40 : 0 }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.sortDate.localeCompare(a.item.sortDate) || a.item.slug.localeCompare(b.item.slug))
    .slice(0, limit).map(({ item }) => item);
}

export function getArticleNews(article: ArticleRelation, news: readonly NewsArticle[], products: readonly ProductModel[], limit = 3) {
  if (limit <= 0) return [];
  const relatedModels = new Set(getArticleProducts(article, products).map((product) => product.slug));
  return news.map((item) => ({ item, score:
    item.relatedArticles.includes(article.slug) || linkedSlugs(item.content, "blog").has(article.slug) ? 100
    : item.productSlugs.some((slug) => relatedModels.has(slug)) ? 80
    : item.topic !== "products" && !item.productSlugs.length && item.brandSlugs.some((slug) => article.primaryBrands.includes(slug)) ? 40 : 0 }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.eventDate.localeCompare(a.item.eventDate) || b.item.sortDate.localeCompare(a.item.sortDate) || a.item.slug.localeCompare(b.item.slug))
    .slice(0, limit).map(({ item }) => item);
}

export function getArticleVideos(article: Pick<Insight, "slug">, videos: readonly WcbVideo[], limit = 2) {
  return limit <= 0 ? [] : videos.filter((video) => video.articleSlugs.includes(article.slug)).slice(0, limit);
}
