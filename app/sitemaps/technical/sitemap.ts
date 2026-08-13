import type { MetadataRoute } from "next";
import { buildTechnicalSitemap } from "@/lib/sitemaps";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildTechnicalSitemap();
}
