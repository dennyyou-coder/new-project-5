import fs from "node:fs";
import path from "node:path";

export type Insight = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
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
      data[key.trim()] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    } else {
      data[key.trim()] = value.replace(/^"|"$/g, "");
    }
  }

  return { data, content: match[2].trim() };
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

      return {
        slug,
        title: String(data.title || slug),
        description: String(data.description || ""),
        date: String(data.date || ""),
        author: String(data.author || "Denny You"),
        category: String(data.category || "Insights"),
        tags: Array.isArray(data.tags) ? data.tags : [],
        coverImage: data.coverImage ? String(data.coverImage) : undefined,
        youtubeId: data.youtubeId ? String(data.youtubeId) : undefined,
        content
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInsight(slug: string) {
  return getInsights().find((article) => article.slug === slug);
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let listOpen = false;

  function closeList() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  }

  for (const line of lines) {
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
    } else if (trimmed.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${inline(trimmed.slice(2))}</li>`);
    } else {
      closeList();
      html.push(`<p>${inline(trimmed)}</p>`);
    }
  }

  closeList();
  return html.join("\n");
}

function inline(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}
