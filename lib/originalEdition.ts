/**
 * Label for articles first published in Chinese, shown instead of the English date.
 * "long" sits in the article header, "short" on cards.
 */
export function chineseOriginalLabel(
  article: { originalLanguage?: string; originalYear?: string },
  style: "long" | "short" = "short"
): string | undefined {
  if (article.originalLanguage !== "zh") return undefined;
  const base = style === "long" ? "Originally published in Chinese" : "Chinese original";
  return article.originalYear ? `${base}, ${article.originalYear}` : base;
}
