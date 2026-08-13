import type { MetadataRoute } from "next";
import { buildBrandsSitemap } from "@/lib/sitemaps";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildBrandsSitemap();
}
