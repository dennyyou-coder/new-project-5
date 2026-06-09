import fs from "node:fs";
import path from "node:path";
import { normalizeCategory } from "@/lib/categories";

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  publishedAt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
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
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    const value = rest.join(":").trim();
    if (value.startsWith("[") && value.endsWith("]")) {
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

  return fs
    .readdirSync(insightsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(insightsDirectory, file), "utf8");
      const { data, content } = parseFrontmatter(raw);
      const excerpt = String(data.excerpt || data.description || makeExcerpt(content));

      return {
        slug,
        title: String(data.title || slug),
        excerpt,
        description: excerpt,
        date: String(data.date || ""),
        publishedAt: String(data.publishedAt || data.date || ""),
        author: String(data.author || "Denny You"),
        category: normalizeCategory(String(data.category || "")),
        tags: Array.isArray(data.tags) ? data.tags : [],
        featured: String(data.featured || "false").toLowerCase() === "true",
        readingTime: String(data.readingTime || estimateReadingTime(content)),
        takeaways: Array.isArray(data.takeaways) ? data.takeaways : [],
        coverImage: data.coverImage ? String(data.coverImage) : undefined,
        youtubeId: data.youtubeId ? String(data.youtubeId) : undefined,
        content
      };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getInsight(slug: string) {
  return getInsights().find((article) => article.slug === slug);
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

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inline(trimmed.slice(3))}</h2>`);
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
