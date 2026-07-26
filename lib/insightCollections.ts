import type { Insight } from "@/lib/content";
import type { GuideType } from "@/lib/guideTaxonomy";

type SortableInsight = Pick<
  Insight,
  "slug" | "contentClass" | "guideType" | "guidePriority" | "sortDate"
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
