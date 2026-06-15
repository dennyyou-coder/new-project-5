import fs from "node:fs";
import path from "node:path";
import { normalizeCategory } from "@/lib/categories";

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  metaDescription: string;
  date: string;
  publishedAt: string;
  sortDate: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  visualPriority: number;
  readingTime: string;
  takeaways: string[];
  coverImage?: string;
  youtubeId?: string;
  content: string;
};

const insightsDirectory = path.join(process.cwd(), "content", "insights");

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: source };
  }

  const data: Record<string, string | string[]> = {};
  const lines = match[1].split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    const value = rest.join(":").trim();
    if (!value) {
      const items: string[] = [];
      let cursor = index + 1;
      while (cursor < lines.length) {
        const item = lines[cursor].trim().match(/^-\s+(.*)$/);
        if (!item) break;
        items.push(item[1].trim().replace(/^"|"$/g, ""));
        cursor += 1;
      }
      if (items.length) {
        data[key.trim()] = items;
        index = cursor - 1;
      }
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[key.trim()] = parseInlineArray(value);
    } else {
      data[key.trim()] = value.replace(/^"|"$/g, "");
    }
  }

  return { data, content: match[2].trim() };
}

function parseInlineArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean);
    }
  } catch {
    // Fall back to a simple split for older hand-written frontmatter.
  }

  return value
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
}

export function getInsights(): Insight[] {
  if (!fs.existsSync(insightsDirectory)) return [];

  const articles = fs
    .readdirSync(insightsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .flatMap((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(insightsDirectory, file), "utf8");
      const { data, content } = parseFrontmatter(raw);
      if (String(data.hidden || "false").toLowerCase() === "true") {
        return [];
      }
      const excerpt = String(data.excerpt || data.description || makeExcerpt(content));
      const metaDescription = String(data.meta_description || data.description || excerpt);
      const coverImage = data.coverImage || data.cover_image;

      return [{
        slug,
        title: String(data.title || slug),
        excerpt,
        description: metaDescription,
        metaDescription,
        date: String(data.date || ""),
        publishedAt: String(data.publishedAt || data.date || ""),
        sortDate: String(data.sortDate || data.publishedAt || data.date || ""),
        author: String(data.author || "Denny You"),
        category: normalizeCategory(String(data.category || "")),
        tags: Array.isArray(data.tags) ? data.tags : [],
        featured: String(data.featured || "false").toLowerCase() === "true",
        visualPriority: Number(data.visualPriority || 0),
        readingTime: String(data.readingTime || estimateReadingTime(content)),
        takeaways: Array.isArray(data.takeaways) ? data.takeaways : [],
        coverImage: coverImage ? String(coverImage) : firstMarkdownImage(content),
        youtubeId: data.youtubeId ? String(data.youtubeId) : undefined,
        content
      }];
    })
    .sort((a, b) => {
      return b.sortDate.localeCompare(a.sortDate);
    });

  return articles;
}

export function getInsight(slug: string) {
  return getInsights().find((article) => article.slug === slug);
}

function articleSortRank(article: Insight) {
  const haystack = articleSearchText(article);

  let rank = 40;
  const isHistorical = /(2018|2019|2020|2021|2022|annual report|buying guide 2022|canton fair)/.test(haystack);

  if (
    article.category === "Pool Cleaning" ||
    article.category === "Robotic Mowers" ||
    /(pool robot|pool cleaner|pool cleaning|robotic mower|robot mower|lawn robot|backyard robot|yard cleaning|outdoor power equipment|\bope\b)/.test(haystack)
  ) {
    rank = 0;
  } else if (
    article.category === "Floorcare" ||
    /(robot vacuum|hard floor washer|floorcare|floor care|wet-dry|cleaning robot|mijia|dji|romo|dreame|anker|laifen|irobot|roomba|dyson|roborock|lidar|slam)/.test(haystack)
  ) {
    rank = 10;
  } else if (/(ifa|ces|awe|expo|trade show|canton fair)/.test(haystack)) {
    rank = 20;
  } else if (/(vacuum|cordless|battery|power tool|supply chain|sourcing)/.test(haystack)) {
    rank = 30;
  }

  if (!/(dji|romo)/.test(haystack) && /(2025|ifa 2025|ces 2025)/.test(haystack)) {
    rank += 15;
  }

  if (isHistorical) {
    rank += 50;
  }

  if (!isHistorical && /(irobot|roomba)/.test(haystack) && /(crisis|bankrupt|bankruptcy|uncertain future|exits|exit|financial|amazon)/.test(haystack)) {
    rank = Math.min(rank, 10);
  }

  if (!isHistorical && /(dyson|roborock)/.test(haystack) && /(crossroads|new product|romo|nautik|hard floor washer|strategy|targets|road|financial|oem|china|2025|2026)/.test(haystack)) {
    rank = Math.min(rank, 10);
  }

  return rank;
}

function articleSearchText(article: Insight) {
  return [
    article.slug,
    article.title,
    article.category,
    article.excerpt,
    ...article.tags
  ]
    .join(" ")
    .toLowerCase();
}

function prioritizeVisualArticles(articles: Insight[]) {
  const priority = articles
    .filter((article) => Number.isFinite(article.visualPriority) && article.visualPriority > 0)
    .sort((a, b) => {
      const priorityDiff = a.visualPriority - b.visualPriority;

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return b.sortDate.localeCompare(a.sortDate);
    });
  const standard = articles.filter((article) => !priority.includes(article));

  return [...priority, ...interleaveCurrentTopics(standard)];
}

function topicBucket(article: Insight) {
  const haystack = articleSearchText(article);

  if (/(dreame|mova)/.test(haystack)) return "dreame";
  if (/anker/.test(haystack)) return "anker";
  if (/laifen/.test(haystack)) return "laifen";
  if (/roborock/.test(haystack)) return "roborock";
  if (/dyson/.test(haystack)) return "dyson";
  if (/(sharkninja|shark|ninja)/.test(haystack)) return "sharkninja";
  if (/(irobot|roomba)/.test(haystack)) return "irobot";
  if (/(dji|romo)/.test(haystack)) return "dji";
  if (
    article.category === "Pool Cleaning" ||
    article.category === "Robotic Mowers" ||
    /(pool robot|pool cleaner|pool cleaning|robotic mower|robot mower|lawn robot|backyard robot|yard cleaning|outdoor power equipment|\bope\b)/.test(haystack)
  ) {
    return "backyard";
  }
  if (article.category === "Floorcare" || /(robot vacuum|hard floor washer|floorcare|floor care|wet-dry|cleaning robot)/.test(haystack)) {
    return "floorcare";
  }
  return "current";
}

function interleaveCurrentTopics(articles: Insight[]) {
  const current: Insight[] = [];
  const archive: Insight[] = [];

  for (const article of articles) {
    if (articleSortRank(article) <= 10) {
      current.push(article);
    } else {
      archive.push(article);
    }
  }

  const bucketOrder = [
    "backyard",
    "dreame",
    "anker",
    "laifen",
    "roborock",
    "dyson",
    "sharkninja",
    "irobot",
    "dji",
    "floorcare",
    "current"
  ];
  const buckets = new Map<string, Insight[]>(
    bucketOrder.map((bucket) => [bucket, []])
  );

  for (const article of current) {
    buckets.get(topicBucket(article))?.push(article);
  }

  const woven: Insight[] = [];
  let hasArticles = true;

  while (hasArticles) {
    hasArticles = false;

    for (const bucket of bucketOrder) {
      const next = buckets.get(bucket)?.shift();

      if (next) {
        woven.push(next);
        hasArticles = true;
      }
    }
  }

  return [...woven, ...archive];
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let listOpen: "ul" | "ol" | false = false;

  function closeList() {
    if (listOpen) {
      html.push(`</${listOpen}>`);
      listOpen = false;
    }
  }

  function openList(type: "ul" | "ol") {
    if (listOpen === type) return;
    closeList();
    html.push(`<${type}>`);
    listOpen = type;
  }

  function markdownImage(line: string) {
    return line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
  }

  function isTableDivider(line: string) {
    return /^\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());
  }

  function isTableRow(line: string) {
    const trimmed = line.trim();
    return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.includes("|");
  }

  function tableCells(line: string) {
    return line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim());
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed === "---" || trimmed === "* * *") {
      closeList();
    } else if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inline(trimmed.slice(2))}</h1>`);
    } else if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inline(trimmed.slice(3))}</h2>`);
    } else if (isTableRow(trimmed) && isTableDivider(lines[index + 1] || "")) {
      closeList();
      const headers = tableCells(trimmed);
      const rows: string[][] = [];
      let cursor = index + 2;
      while (cursor < lines.length && isTableRow(lines[cursor])) {
        rows.push(tableCells(lines[cursor]));
        cursor += 1;
      }

      html.push(`<div class="article-table-wrap"><table><thead><tr>`);
      for (const header of headers) {
        html.push(`<th>${inline(header)}</th>`);
      }
      html.push(`</tr></thead><tbody>`);
      for (const row of rows) {
        html.push(`<tr>`);
        for (const cell of row) {
          html.push(`<td>${inline(cell)}</td>`);
        }
        html.push(`</tr>`);
      }
      html.push(`</tbody></table></div>`);
      index = cursor - 1;
    } else if (markdownImage(trimmed)) {
      closeList();
      const images: RegExpMatchArray[] = [];
      let cursor = index;
      while (cursor < lines.length) {
        const candidate = lines[cursor].trim();
        if (!candidate) {
          cursor += 1;
          continue;
        }
        const image = markdownImage(candidate);
        if (!image) break;
        images.push(image);
        cursor += 1;
      }

      if (images.length > 1) {
        html.push(`<div class="article-inline-image-grid">`);
        for (const image of images) {
          html.push(
            `<figure class="article-inline-image"><img src="${image[2]}" alt="${inline(image[1])}" /></figure>`
          );
        }
        html.push(`</div>`);
        index = cursor - 1;
      } else {
        const image = images[0];
        html.push(
          `<figure class="article-inline-image"><img src="${image[2]}" alt="${inline(image[1])}" /></figure>`
        );
      }
    } else if (trimmed.startsWith("> ")) {
      closeList();
      html.push(`<blockquote>${inline(trimmed.slice(2))}</blockquote>`);
    } else if (trimmed.startsWith("- ")) {
      openList("ul");
      html.push(`<li>${inline(trimmed.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      openList("ol");
      html.push(`<li>${inline(trimmed.replace(/^\d+\.\s/, ""))}</li>`);
    } else {
      closeList();
      html.push(`<p>${inline(trimmed)}</p>`);
    }
  }

  closeList();
  return html.join("\n");
}

function estimateReadingTime(content: string) {
  const text = stripMarkdown(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));

  return `${minutes} min read`;
}

function makeExcerpt(content: string) {
  const text = stripMarkdown(content);

  if (text.length <= 155) {
    return text;
  }

  return `${text.slice(0, 152).trim()}...`;
}

function firstMarkdownImage(content: string) {
  const image = content.match(/!\[(.*?)\]\((.*?)\)/);
  return image ? image[2] : undefined;
}

export function removeLeadingArticleTitleAndCover(content: string, title: string, coverImage?: string) {
  const lines = content.split("\n");
  let cursor = 0;

  while (!lines[cursor]?.trim() && cursor < lines.length) cursor += 1;

  if (lines[cursor]?.trim() === `# ${title}`) {
    cursor += 1;
  }

  while (!lines[cursor]?.trim() && cursor < lines.length) cursor += 1;

  const image = lines[cursor]?.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
  if (coverImage && image?.[2] === coverImage) {
    cursor += 1;
  }

  return lines.slice(cursor).join("\n").trim();
}

function stripMarkdown(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inline(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}
