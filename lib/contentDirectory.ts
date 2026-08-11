export const DIRECTORY_PAGE_SIZE = 10;

import type { Insight } from "@/lib/content";
import type { DirectoryArticle } from "@/components/ContentDirectory";
import { responsiveImagePropsFor } from "@/lib/articleImageProps";

export function toDirectoryArticle(article: Insight): DirectoryArticle {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    date: article.date,
    readingTime: article.readingTime,
    category: article.category,
    coverImage: article.coverImage,
    coverAlt: article.coverAlt,
    coverWidth: article.coverWidth,
    coverHeight: article.coverHeight,
    coverMobile: article.coverMobile,
    featured: article.featured,
    tags: article.tags,
    seriesTitle: article.seriesTitle
  };
}

export function directoryArticleImageProps(
  article: Pick<
    DirectoryArticle,
    "coverImage" | "coverWidth" | "coverHeight" | "coverMobile"
  >,
  fallback: string
) {
  if (!article.coverImage) {
    return {
      src: fallback,
      loading: "lazy" as const,
      decoding: "async" as const
    };
  }

  return responsiveImagePropsFor(article.coverImage, "card", {
    width: article.coverWidth,
    height: article.coverHeight,
    mobile: article.coverMobile
  });
}

export function parseDirectoryPage(
  value: string | string[] | undefined
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

export function paginateDirectoryItems<T>(
  items: T[],
  requestedPage: number
): {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageStart: number;
} {
  const totalPages = Math.max(
    1,
    Math.ceil(items.length / DIRECTORY_PAGE_SIZE)
  );
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const pageStart = (currentPage - 1) * DIRECTORY_PAGE_SIZE;

  return {
    items: items.slice(pageStart, pageStart + DIRECTORY_PAGE_SIZE),
    currentPage,
    totalPages,
    pageStart
  };
}

export function directoryHref(
  pathname: string,
  page: number,
  params: Record<string, string | undefined> = {}
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }

  if (page > 1) search.set("page", String(page));

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}
