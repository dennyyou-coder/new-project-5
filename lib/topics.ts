import fs from "node:fs";
import path from "node:path";
import { getInsights, type Insight } from "@/lib/content";
import { getNews, type NewsArticle } from "@/lib/news";

export type TopicFact = { label: string; value: string };
export type TopicEvent = { date: string; title: string; text: string; href?: string };
export type TopicQuestion = { q: string; a: string };
export type TopicSource = { title: string; url: string };

export type Topic = {
  slug: string;
  title: string;
  /** Two or three words shown over the topic image on the homepage, e.g. "FCC Ban". */
  shortLabel?: string;
  seoTitle?: string;
  dek: string;
  description: string;
  coverImage?: string;
  /** Credit and licence for the cover image, shown with the sources. */
  coverCredit?: { text: string; url: string };
  updated: string;
  status: { label: string; text: string };
  summary: string[];
  keyFacts: TopicFact[];
  callout?: { title: string; text: string; href?: string };
  timeline: TopicEvent[];
  questions: TopicQuestion[];
  insights: string[];
  news: string[];
  sources: TopicSource[];
};

export type ResolvedTopic = Topic & {
  insightArticles: Insight[];
  newsArticles: NewsArticle[];
};

const topicsDirectory = path.join(process.cwd(), "content", "topics");

export function getTopics(): Topic[] {
  if (!fs.existsSync(topicsDirectory)) return [];
  return fs
    .readdirSync(topicsDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(topicsDirectory, file), "utf8")) as Topic)
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.slug.localeCompare(b.slug));
}

export function getTopic(slug: string): ResolvedTopic | undefined {
  const topic = getTopics().find((item) => item.slug === slug);
  if (!topic) return undefined;
  const insights = new Map(getInsights().map((article) => [article.slug, article]));
  const news = new Map(getNews().map((article) => [article.slug, article]));
  return {
    ...topic,
    insightArticles: topic.insights.map((item) => insights.get(item)).filter((item): item is Insight => Boolean(item)),
    newsArticles: topic.news
      .map((item) => news.get(item))
      .filter((item): item is NewsArticle => Boolean(item))
      .sort((a, b) => (b.eventDate || b.sortDate).localeCompare(a.eventDate || a.sortDate))
  };
}

/** Topics that list this article or news story, for "part of" links on story pages. */
export function getTopicsFor(kind: "insight" | "news", slug: string): Topic[] {
  return getTopics().filter((topic) => (kind === "insight" ? topic.insights : topic.news).includes(slug));
}

export function topicHref(slug: string) {
  return `/topics/${slug}`;
}

/** "2026-07-28" -> "28 Jul 2026"; "2025-12" -> "Dec 2025". */
export function topicDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const monthName = new Date(Date.UTC(year, (month || 1) - 1, 1)).toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  return day ? `${day} ${monthName} ${year}` : `${monthName} ${year}`;
}

/** The smaller 600px version that sits next to a topic cover ("cover.webp" → "cover-600.webp"). */
export function topicImageSmall(url: string) {
  return url.replace(/\.webp$/, "-600.webp");
}
