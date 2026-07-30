export const DIRECTORY_PAGE_SIZE = 10;

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
