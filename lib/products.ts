import fs from "node:fs";
import path from "node:path";
import records from "../content/product-models.json" with { type: "json" };
import { parseFrontmatter } from "@/lib/content";

export type ProductModel = Omit<(typeof records)[number], "related" | "articles"> & { related: string[]; articles: string[] };
export const productModels: ProductModel[] = records;

export function getProduct(slug: string) {
  const model = productModels.find((item) => item.slug === slug);
  if (!model) return undefined;
  const source = fs.readFileSync(path.join(process.cwd(), "content", "products", `${slug}.mdx`), "utf8");
  const { data, content } = parseFrontmatter(source);
  return { ...model, coverImage: String(data.coverImage), content };
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
