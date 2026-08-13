import type { MetadataRoute } from "next";
import { buildDiscoverySitemap } from "@/lib/sitemaps";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildDiscoverySitemap();
}
