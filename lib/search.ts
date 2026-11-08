import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import { HUB_CATEGORIES, productCategoryLabel } from "@/lib/hubCategories";
import { getNews, newsDate } from "@/lib/news";
import { productModels } from "@/lib/products";
import { getTopics, topicHref } from "@/lib/topics";

export type SearchKind = "Topics" | "Companies" | "Categories" | "Products" | "News" | "Analysis";

export type SearchEntry = {
  kind: SearchKind;
  title: string;
  href: string;
  meta?: string;
  summary?: string;
  /** Words that should match strongly: title, names, aliases. */
  primary: string;
  /** Words that match weakly: summary, tags. */
  secondary: string;
  /** Sort key for ties, newest first (ISO date) where it applies. */
  date?: string;
};

export const SEARCH_KINDS: SearchKind[] = ["Topics", "Companies", "Categories", "Products", "News", "Analysis"];

const LIMITS: Record<SearchKind, number> = { Topics: 4, Companies: 8, Categories: 4, Products: 8, News: 10, Analysis: 10 };

let cache: SearchEntry[] | undefined;

/** Everything the site search covers, built once per server process. */
export function getSearchIndex(): SearchEntry[] {
  if (cache) return cache;
  const insights = getInsights();
  const entries: SearchEntry[] = [
    ...getTopics().map((topic) => ({
      kind: "Topics" as const,
      title: topic.title,
      href: topicHref(topic.slug),
      meta: "WCB Topic",
      summary: topic.dek,
      primary: `${topic.title} ${topic.shortLabel ?? ""}`,
      secondary: `${topic.dek} ${topic.description}`
    })),
    ...getPublishedBrandProfiles(insights).map((brand) => ({
      kind: "Companies" as const,
      title: brand.name,
      href: `/brands/${brand.slug}`,
      meta: brand.headline,
      summary: brand.quickAnswer ?? brand.description,
      primary: [brand.name, ...brand.aliases, brand.legalName ?? ""].join(" "),
      secondary: `${brand.headline} ${brand.description}`
    })),
    ...HUB_CATEGORIES.map((hub) => ({
      kind: "Categories" as const,
      title: hub.name,
      href: `/categories/${hub.slug}`,
      meta: "Category",
      primary: hub.name,
      secondary: ""
    })),
    ...productModels.map((model) => ({
      kind: "Products" as const,
      title: model.name,
      href: `/products/${model.slug}`,
      meta: `${model.brand} · ${productCategoryLabel(model.category)}`,
      summary: model.summary,
      primary: `${model.name} ${model.brand}`,
      secondary: `${model.summary} ${productCategoryLabel(model.category)}`,
      date: String(model.announced ?? "")
    })),
    ...getNews().map((item) => ({
      kind: "News" as const,
      title: item.title,
      href: `/news/${item.slug}`,
      meta: newsDate(item.eventDate),
      summary: item.excerpt,
      primary: item.title,
      secondary: `${item.excerpt} ${item.brandSlugs.join(" ")}`,
      date: item.eventDate
    })),
    ...insights.map((article) => ({
      kind: "Analysis" as const,
      title: article.title,
      href: `/blog/${article.slug}`,
      meta: newsDate(article.sortDate || article.date),
      summary: article.excerpt || article.description,
      primary: article.title,
      secondary: `${article.excerpt} ${article.tags.join(" ")} ${[...article.primaryBrands, ...article.relatedBrands].join(" ")}`,
      date: article.sortDate || article.date
    }))
  ];
  cache = entries;
  return entries;
}

function tokens(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9一-鿿]+/)
    .filter(Boolean);
}

/**
 * Every query word must start a word somewhere in the entry ("pool" finds "Pool robots", not "Whirlpool").
 * Title and name matches outrank summary matches; ties go to the newest item.
 */
export function searchSite(query: string, index: SearchEntry[] = getSearchIndex()) {
  const words = tokens(query);
  const groups = new Map<SearchKind, { entry: SearchEntry; score: number }[]>(SEARCH_KINDS.map((kind) => [kind, []]));
  if (!words.length) return { words, groups, total: 0 };
  for (const entry of index) {
    const primary = tokens(entry.primary);
    const secondary = tokens(entry.secondary);
    let score = 0;
    let matched = true;
    for (const word of words) {
      if (primary.some((token) => token === word)) score += 6;
      else if (primary.some((token) => token.startsWith(word))) score += 4;
      else if (secondary.some((token) => token.startsWith(word))) score += 1;
      else {
        matched = false;
        break;
      }
    }
    if (matched) groups.get(entry.kind)!.push({ entry, score });
  }
  let total = 0;
  for (const [kind, hits] of groups) {
    hits.sort((a, b) => b.score - a.score || String(b.entry.date ?? "").localeCompare(String(a.entry.date ?? "")));
    total += hits.length;
    groups.set(kind, hits);
  }
  return { words, groups, total, limits: LIMITS };
}

export function searchLimit(kind: SearchKind) {
  return LIMITS[kind];
}
