import type { Metadata } from "next";
import Link from "next/link";
import { BrandDirectoryCard } from "@/components/brands/BrandDirectoryCard";
import { BrandCategoryCard } from "@/components/brands/BrandCategoryCard";
import { getPublishedBrandCategories } from "@/lib/brandCategories";
import {
  buildBrandDirectorySchemas,
  getPublishedBrandProfiles
} from "@/lib/brands";
import { getInsights } from "@/lib/content";

const siteUrl = "https://worldcleanbiz.com";

export const metadata: Metadata = {
  title: "Cleaning Industry Brand Intelligence",
  description:
    "Independent brand profiles for cleaning-industry buyers, distributors and market professionals.",
  alternates: { canonical: "/brands" },
  openGraph: {
    title: "Cleaning Industry Brand Intelligence | World Clean Biz",
    description:
      "Research company ownership, product portfolios, manufacturing, channels and strategy.",
    type: "website",
    url: "/brands"
  }
};

export default function BrandsPage() {
  const articles = getInsights();
  const profiles = getPublishedBrandProfiles(articles);
  const categories = getPublishedBrandCategories(profiles);
  const schemas = buildBrandDirectorySchemas(profiles, siteUrl);

  return (
    <div className="guides-hub brand-hub">
      <section className="guides-hero">
        <div className="insights-page-container guides-hero-grid brand-directory-hero">
          <div>
            <p className="eyebrow">Independent Brand Intelligence</p>
            <h1>Cleaning Industry Brand Intelligence</h1>
            <p>
              Verified company profiles help buyers, distributors and industry
              professionals evaluate ownership, products, supply chains,
              channels and competitive strategy.
            </p>
          </div>
          <div className="guides-hero-stat">
            <strong>{profiles.length}</strong>
            <span>Published profiles meeting our evidence standard</span>
            <Link href="/blog">Read Industry Analysis</Link>
          </div>
        </div>
      </section>

      <section className="section brand-category-directory-section">
        <div className="insights-page-container">
          <div className="section-heading guides-section-heading">
            <p className="eyebrow">Buying categories</p>
            <h2>Start with the product market.</h2>
          </div>
          <div className="brand-category-grid">
            {categories.map((data) => (
              <BrandCategoryCard key={data.category.slug} data={data} />
            ))}
          </div>
        </div>
      </section>

      <section className="section guides-featured-section">
        <div className="insights-page-container">
          <div className="section-heading guides-section-heading">
            <p className="eyebrow">Company Research</p>
            <h2>Browse All Verified Brand Profiles.</h2>
          </div>
          <div className="guides-featured-grid brand-directory-grid">
            {profiles.map((profile) => (
              <BrandDirectoryCard key={profile.slug} profile={profile} />
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
