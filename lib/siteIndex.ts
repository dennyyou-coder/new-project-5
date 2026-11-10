import { getPublishedBrandCategories } from "@/lib/brandCategories";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getPublishedComponentProfiles } from "@/lib/componentProfiles";
import { getInsights, type Insight } from "@/lib/content";
import { getPublishedEquipmentProfiles } from "@/lib/equipment";
import { LISTED_HUB_CATEGORIES } from "@/lib/hubCategories";
import { getNews } from "@/lib/news";
import { productModels } from "@/lib/products";
import { getTopics } from "@/lib/topics";

// The HTML site index: plain lists of every public page, so each one is a
// couple of clicks from the footer instead of deep inside paginated lists.

export type IndexLink = { href: string; label: string };
export type IndexGroup = { title: string; links: IndexLink[] };

const byLabel = (a: IndexLink, b: IndexLink) => a.label.localeCompare(b.label);

function groupByPeriod<T>(items: T[], date: (item: T) => string, link: (item: T) => IndexLink, monthly: boolean): IndexGroup[] {
  const groups = new Map<string, { sort: string; links: { sort: string; link: IndexLink }[] }>();
  for (const item of items) {
    const value = date(item) || "";
    const key = monthly ? value.slice(0, 7) : value.slice(0, 4);
    const group = groups.get(key) ?? { sort: key, links: [] };
    group.links.push({ sort: value, link: link(item) });
    groups.set(key, group);
  }
  return [...groups.values()]
    .sort((a, b) => b.sort.localeCompare(a.sort))
    .map((group) => ({
      title: periodTitle(group.sort, monthly),
      links: group.links.sort((a, b) => b.sort.localeCompare(a.sort)).map(({ link }) => link)
    }));
}

function periodTitle(key: string, monthly: boolean) {
  if (!/^\d{4}/.test(key)) return "Undated";
  if (!monthly) return key;
  const date = new Date(`${key}-01T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? key : date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function getArticleIndex(): IndexGroup[] {
  const groups = new Map<string, Insight[]>();
  for (const article of getInsights()) {
    const key = article.category || "Other";
    groups.set(key, [...(groups.get(key) ?? []), article]);
  }
  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([title, articles]) => ({
      title,
      links: articles
        .sort((a, b) => (b.sortDate || b.date).localeCompare(a.sortDate || a.date))
        .map((article) => ({ href: `/blog/${article.slug}`, label: article.title }))
    }));
}

export function getNewsIndex(): IndexGroup[] {
  return groupByPeriod(
    getNews(),
    (story) => story.eventDate || story.publishedAt,
    (story) => ({ href: `/news/${story.slug}`, label: story.title }),
    true
  );
}

export function getSiteIndexOverview() {
  const insights = getInsights();
  const brands = getPublishedBrandProfiles(insights);
  const brandSlugs = new Set(brands.map(({ slug }) => slug));
  const groups: IndexGroup[] = [
    {
      title: "Sections",
      links: [
        { href: "/news", label: "News" },
        { href: "/blog", label: "Insights" },
        { href: "/guides", label: "Guides" },
        { href: "/topics", label: "Topics" },
        { href: "/rankings", label: "Rankings" },
        { href: "/markets", label: "Markets" },
        { href: "/reports", label: "Reports" },
        { href: "/videos", label: "Videos" },
        { href: "/sourcing", label: "Sourcing" },
        { href: "/events", label: "Industry events" },
        { href: "/wcb-expo", label: "WCB Expo" }
      ]
    },
    { title: "Topics", links: getTopics().map((topic) => ({ href: `/topics/${topic.slug}`, label: topic.title })) },
    { title: "Categories", links: LISTED_HUB_CATEGORIES.map((hub) => ({ href: `/categories/${hub.slug}`, label: hub.name })) },
    {
      title: "Companies by sector",
      links: getPublishedBrandCategories(brands)
        .filter(({ profiles }) => profiles.length > 0)
        .map(({ category }) => ({ href: `/brands/${category.slug}`, label: category.name }))
    },
    { title: "Companies", links: brands.map((brand) => ({ href: `/brands/${brand.slug}`, label: brand.name })).sort(byLabel) },
    { title: "Products", links: productModels.map((model) => ({ href: `/products/${model.slug}`, label: model.name })).sort(byLabel) },
    {
      title: "Equipment types",
      links: getPublishedEquipmentProfiles(brandSlugs).map((profile) => ({ href: `/equipment/${profile.slug}`, label: profile.name })).sort(byLabel)
    },
    {
      title: "Parts and components",
      links: getPublishedComponentProfiles().map((profile) => ({ href: `/components/${profile.slug}`, label: profile.name })).sort(byLabel)
    }
  ];
  return { groups: groups.filter((group) => group.links.length > 0), articleCount: insights.length, newsCount: getNews().length };
}
