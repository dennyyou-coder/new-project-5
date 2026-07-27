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

function episodeNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getLatestSeriesInsight<T extends SortableInsight>(
  articles: T[],
  series: string
) {
  return [...articles]
    .filter((article) => article.series === series)
    .sort((a, b) => {
      const episodeA = episodeNumber(a.seriesEpisode);
      const episodeB = episodeNumber(b.seriesEpisode);

      if (episodeA !== undefined && episodeB !== undefined && episodeA !== episodeB) {
        return episodeB - episodeA;
      }

      if (episodeA !== undefined) return -1;
      if (episodeB !== undefined) return 1;

      return b.sortDate.localeCompare(a.sortDate) || a.slug.localeCompare(b.slug);
    })[0];
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
  limit = 6
) {
  return getGuideInsights(articles)
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
