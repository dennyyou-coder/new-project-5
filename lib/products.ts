import fs from "node:fs";
import path from "node:path";
import records from "../content/product-models.json" with { type: "json" };
import guideRecords from "../content/product-guides.json" with { type: "json" };
import { parseFrontmatter } from "@/lib/content";

export type ProductModel = Omit<(typeof records)[number], "related" | "articles"> & { related: string[]; articles: string[] };
export type ProductGuide = (typeof guideRecords)[keyof typeof guideRecords];
const productGuides: Partial<Record<string, ProductGuide>> = guideRecords;

export const productModels: ProductModel[] = records;

// Keep published routes available while curating the first directory release.
export const productSelectionYear = 2026;
export const featuredProductModels = productModels.filter((model) => model.launchYear === productSelectionYear);

export function getProduct(slug: string) {
  const model = productModels.find((item) => item.slug === slug);
  if (!model) return undefined;
  const source = fs.readFileSync(path.join(process.cwd(), "content", "products", `${slug}.mdx`), "utf8");
  const { data, content } = parseFrontmatter(source);
  const guide = productGuides[slug];
  const sections = guide ? content.split(/^## /m).slice(1).map((section, index) => {
    const end = section.indexOf("\n");
    return { id: `guide-${index + 1}`, title: section.slice(0, end).trim(), content: section.slice(end + 1).trim() };
  }) : [];
  return { ...model, coverImage: String(data.coverImage), content, guide, sections };
}

export function productCover(slug: string) {
  return getProduct(slug)!.coverImage;
}

export function productDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export const productSourcingRoutes: Record<string, string> = {
  "Robot vacuums": "/sourcing/robotic-vacuums",
  "Cordless vacuums": "/sourcing/vacuum-cleaners",
  "Robot mowers": "/sourcing/lawn-robots",
  "Pool robots": "/sourcing/pool-robots"
};
