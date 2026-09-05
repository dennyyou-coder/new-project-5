import type { Insight } from "./content";

// Work on rendered article HTML so navigation follows the actual reading order.
export function addArticleContents(html: string) {
  const sections: { id: string; labelHtml: string }[] = [];
  const usedIds = new Set(Array.from(html.matchAll(/\bid=["']([^"']+)["']/g), (match) => match[1]));
  let index = 0;
  const content = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, heading: string) => {
    let id: string;
    do { id = `wcb-section-${++index}`; } while (usedIds.has(id));
    usedIds.add(id);
    sections.push({ id, labelHtml: heading.replace(/<[^>]*>/g, "") });
    return `<h2 id="${id}">${heading}</h2>`;
  });
  return { content, sections };
}

export function getTopicReading(articles: Insight[], current: Insight, fallback: Insight[], limit = 3) {
  const tags = new Set(current.tags.map((tag) => tag.toLowerCase()));
  const brands = new Set(current.primaryBrands);
  const ranked = articles
    .filter((item) => item.contentClass === "editorial" && item.slug !== current.slug && (!current.series || item.series !== current.series))
    .map((item) => ({ item, score:
      (item.primaryBrands.some((brand) => brands.has(brand)) ? 12 : 0) +
      item.tags.filter((tag) => tags.has(tag.toLowerCase())).length * 3 +
      (item.category === current.category ? 2 : 0)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.sortDate.localeCompare(a.item.sortDate) || a.item.slug.localeCompare(b.item.slug));
  const selected: Insight[] = [];
  for (const item of [...ranked.map(({ item }) => item), ...fallback]) {
    if (selected.some((entry) => entry.slug === item.slug || (item.series && entry.series === item.series))) continue;
    selected.push(item);
    if (selected.length >= limit) break;
  }
  return selected;
}
