import type { Insight } from "@/lib/content";
import type { GuideType } from "@/lib/guideTaxonomy";

type SortableInsight = Pick<
  Insight,
  | "slug"
  | "contentClass"
  | "guideType"
  | "guidePriority"
  | "sortDate"
  | "series"
  | "seriesEpisode"
>;

function newestFirst<T extends SortableInsight>(articles: T[]) {
  return [...articles].sort(
    (a, b) =>
      b.sortDate.localeCompare(a.sortDate) || a.slug.localeCompare(b.slug)
  );
}

export function getEditorialInsights<T extends SortableInsight>(articles: T[]) {
  return newestFirst(
    articles.filter((article) => article.contentClass === "editorial")
  );
}

export function getGuideInsights<T extends SortableInsight>(
  articles: T[],
  guideType?: GuideType
) {
  return newestFirst(
    articles.filter(
      (article) =>
        article.contentClass === "search" &&
        (!guideType || article.guideType === guideType)
    )
  );
}

export function getFeaturedGuides<T extends SortableInsight>(
  articles: T[],
  limit = 5
) {
  return articles
    .filter(
      (article) =>
        article.contentClass === "search" && article.guidePriority > 0
    )
    .sort(
      (a, b) =>
        a.guidePriority - b.guidePriority ||
        b.sortDate.localeCompare(a.sortDate) ||
        a.slug.localeCompare(b.slug)
    )
    .slice(0, limit);
}

type SeriesOrder = "ascending" | "descending";

function episodeNumber(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed || !/^\d+$/.test(trimmed)) return undefined;
  return BigInt(trimmed);
}

export function orderSeriesInsights<T extends SortableInsight>(
  articles: T[],
  order: SeriesOrder
) {
  const direction = order === "ascending" ? 1 : -1;

  return [...articles].sort((a, b) => {
    const episodeA = episodeNumber(a.seriesEpisode);
    const episodeB = episodeNumber(b.seriesEpisode);

    if (episodeA !== undefined && episodeB !== undefined && episodeA !== episodeB) {
      return (episodeA < episodeB ? -1 : 1) * direction;
    }

    if (episodeA !== undefined && episodeB === undefined) return -1;
    if (episodeA === undefined && episodeB !== undefined) return 1;

    const dateComparison = a.sortDate.localeCompare(b.sortDate);
    return dateComparison * direction || a.slug.localeCompare(b.slug);
  });
}

export function getLatestSeriesInsight<T extends SortableInsight>(
  articles: T[],
  series: string
) {
  return orderSeriesInsights(
    articles.filter((article) => article.series === series),
    "descending"
  )[0];
}

function stableInsightScore(seed: string, value: string) {
  let hash = 2166136261;
  for (const character of `${seed}:${value}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableInsightOrder<T extends SortableInsight>(articles: T[], seed: string) {
  return [...articles].sort(
    (a, b) =>
      stableInsightScore(seed, a.slug) - stableInsightScore(seed, b.slug) ||
      a.slug.localeCompare(b.slug)
  );
}

export function getRelatedEditorialInsights<T extends SortableInsight>(
  articles: T[],
  current: T,
  limit = 3
) {
  if (limit <= 0) return [];

  const eligible = getEditorialInsights(articles).filter(
    (article) =>
      article.slug !== current.slug &&
      (!current.series || article.series !== current.series)
  );
  const ungrouped = eligible.filter((article) => !article.series);
  const seriesGroups = new Map<string, T[]>();

  for (const article of eligible) {
    if (!article.series) continue;
    const group = seriesGroups.get(article.series) ?? [];
    group.push(article);
    seriesGroups.set(article.series, group);
  }

  const latestSeries = [...seriesGroups.values()]
    .map((group) => orderSeriesInsights(group, "descending")[0])
    .filter((article): article is T => Boolean(article));
  const ordered = stableInsightOrder([...ungrouped, ...latestSeries], current.slug);
  const selected: T[] = [];

  if (!current.series && latestSeries.length && selected.length < limit) {
    selected.push(stableInsightOrder(latestSeries, current.slug)[0]);
  }

  for (const article of ordered) {
    if (selected.length >= limit) break;
    if (selected.some((item) => item.slug === article.slug)) continue;
    selected.push(article);
    if (selected.length >= limit) break;
  }

  if (selected.length < limit) {
    throw new Error(
      `RELATED_EDITORIAL_INSUFFICIENT slug=${current.slug} required=${limit} available=${selected.length}`
    );
  }

  return selected;
}

export function getBlogHomepageEditorial<T extends SortableInsight>(
  articles: T[],
  excludedSeries: string,
  limit = 6
) {
  return getEditorialInsights(articles)
    .filter((article) => article.series !== excludedSeries)
    .slice(0, limit);
}

export function getBlogHomepageGuides<T extends SortableInsight>(
  articles: T[],
  limit = 6,
  excludedSlugs: readonly string[] = []
) {
  const excluded = new Set(excludedSlugs);

  return getGuideInsights(articles)
    .filter((article) => !excluded.has(article.slug))
    .sort((a, b) => {
      const priorityA = a.guidePriority > 0 ? a.guidePriority : Number.MAX_SAFE_INTEGER;
      const priorityB = b.guidePriority > 0 ? b.guidePriority : Number.MAX_SAFE_INTEGER;
      return (
        priorityA - priorityB ||
        b.sortDate.localeCompare(a.sortDate) ||
        a.slug.localeCompare(b.slug)
      );
    })
    .slice(0, limit);
}
