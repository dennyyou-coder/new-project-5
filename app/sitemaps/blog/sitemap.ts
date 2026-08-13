import type { MetadataRoute } from "next";
import { buildBlogSitemap } from "@/lib/sitemaps";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildBlogSitemap();
}
