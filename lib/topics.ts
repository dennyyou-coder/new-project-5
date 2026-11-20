import fs from "node:fs";
import path from "node:path";
import { getInsights, type Insight } from "@/lib/content";
import { getNews, type NewsArticle } from "@/lib/news";

export type TopicFact = { label: string; value: string };
export type TopicEvent = { date: string; title: string; text: string; href?: string };
export type TopicQuestion = { q: string; a: string };
export type TopicSource = { title: string; url: string };

/** A small data chart drawn on the topic page from the topic file (no image needed). */
export type TopicChart =
  | {
      type: "bars";
      title: string;
      note?: string;
      unit?: string;
      legend?: string[];
      rows: { label: string; segments: number[]; display?: string; href?: string }[];
    }
  /** Revenue growth for the latest reported quarter, from the results tracker. */
  | { type: "results-growth"; title: string; note?: string }
  /**
   * Events on a shared year axis, one lane per side. An item with `end` is drawn as a span;
   * `n` is the number shown in the marker (matching a numbered table below).
   */
  /** A running total that steps up on each date; `highlight` points get a label on the chart. */
  | {
      type: "cumulative";
      title: string;
      note?: string;
      start: string;
      end: string;
      points: { date: string; count: number; label?: string; highlight?: boolean; place?: "left" | "right" }[];
      /** Value at the start date (default 0). */
      startValue?: number;
      /** Appended to values, e.g. "%". */
      unit?: string;
      /** A shaded stretch at the end of the axis, e.g. an expiry window. */
      zone?: { from: string; label: string };
      /** A short line shown big next to the title, e.g. "Chinese makers approved: 0". */
      callout?: { value: string; label: string };
    }
  /** One dot per row on a date axis, with a vertical marker line; dots before the marker are shown in red. */
  | {
      type: "dots";
      title: string;
      note?: string;
      start: string;
      end: string;
      marker: { date: string; label: string };
      rows: { label: string; date: string; href?: string; note?: string }[];
    }
  | {
      type: "lanes";
      title: string;
      note?: string;
      start: number;
      end: number;
      lanes: { label: string; items: { date: string; end?: string; n?: number; label: string }[] }[];
    };

/** A table on a topic page; on phones each row becomes a card labelled by its column names. */
export type TopicTable = {
  columns: string[];
  rows: { cells: string[]; href?: string }[];
  note?: string;
  /** "cards": the first column becomes a date rail and the other columns stack as labelled lines. */
  layout?: "table" | "cards";
  /** Number the rows 1, 2, 3… so they can be matched to markers in a chart. */
  numbered?: boolean;
  /** Fold the table behind this summary text, e.g. "Show the full list". */
  collapse?: string;
};

/** A big number with a short label. */
export type TopicStat = { value: string; label: string };
/** A person with a portrait; `credit` is shown under the group. */
export type TopicPerson = { name: string; role: string; image: string; credit: string; side?: string };
/** One side of a brand line-up: the parent's logo and its brands (logo when `slug` is given, otherwise the name). */
export type TopicBrandSide = { name: string; slug: string; brands: { name: string; slug?: string }[] };

/** A brand card in a camp: logo and name link to the brand page; `made` lists production sites. */
export type TopicCampBrand = { name: string; slug?: string; tag?: string; made: string };
/** A group of brands on one side of a case, e.g. complainants and companies facing duties. */
export type TopicCamp = { label: string; note?: string; tone?: "home" | "target"; brands: TopicCampBrand[] };
/** One procedure shown as steps; `state` marks steps done, the current one and those ahead. */
export type TopicProgress = { label: string; note?: string; steps: { date: string; label: string; state: "done" | "now" | "next" }[] };

/** A yes/no check list read top to bottom; each step names the answer that takes a product out. */
export type TopicFlow = {
  steps: { q: string; exit: "yes" | "no"; out: string; note?: string }[];
  result: { title: string; text: string };
  note?: string;
};
/** Items sorted into labelled groups; `focus` groups are shown first and highlighted. */
export type TopicGroup = { label: string; focus?: boolean; items: { name: string; href?: string; note?: string }[] };

/**
 * An extra section of a topic page: key facts, a table, small charts side by side and links.
 * `position` places it after the summary (default) or after the timeline.
 */
export type TopicSection = {
  id: string;
  title: string;
  position?: "after-summary" | "after-timeline";
  /** Shown as a highlighted case box instead of a plain section. */
  highlight?: boolean;
  intro?: string;
  stats?: TopicStat[];
  people?: TopicPerson[];
  facts?: TopicFact[];
  lineup?: TopicBrandSide[];
  camps?: TopicCamp[];
  flow?: TopicFlow;
  /** Short cards side by side, e.g. scenarios; `tag` is a small label above the title. */
  cards?: { title: string; text: string; tag?: string }[];
  groups?: TopicGroup[];
  progress?: TopicProgress[];
  table?: TopicTable;
  charts?: TopicChart[];
  links?: { title: string; href: string }[];
};

/** One company in a versus overview. */
export type TopicVersusSide = {
  name: string;
  /** Brand page and logo; without it, `logo` (an image path) or the name is shown as the heading. */
  slug?: string;
  logo?: string;
  figure: { value: string; label: string; tone?: "up" | "down" };
  facts: string[];
  person?: { name: string; role: string; image: string };
  brands?: { name: string; slug?: string }[];
};

/**
 * A full-width overview under the topic header: two companies and what moved between them,
 * read left to right (top to bottom on phones).
 */
export type TopicVersus = {
  title: string;
  sides: [TopicVersusSide, TopicVersusSide];
  flows: { label: string; detail: string; image?: string; tone?: "legal" }[];
  /** false: the middle column lists points without left-to-right arrows. */
  arrows?: boolean;
  footer?: string;
  credit?: string;
};

/** A "follow this topic" signup shown on the topic page and on its articles and news. */
export type TopicFollow = { heading: string; note: string };

export type Topic = {
  slug: string;
  title: string;
  /** Two or three words shown over the topic image on the homepage, e.g. "FCC Ban". */
  shortLabel?: string;
  /** Shown first, as the lead, in the homepage topics band. */
  pinned?: boolean;
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
  chart?: TopicChart;
  sections?: TopicSection[];
  follow?: TopicFollow;
  versus?: TopicVersus;
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
