import Link from "next/link";
import type { BrandCategoryPageData } from "@/lib/brandCategories";
import { BrandDirectoryCard } from "./BrandDirectoryCard";

export function BrandCategoryPage({ data }: { data: BrandCategoryPageData }) {
  const { category, profiles } = data;

  return (
    <div className="guides-hub brand-hub brand-category-page">
      <section className="guides-hero">
        <div className="insights-page-container brand-directory-hero">
          <div>
            <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/brands">Brand Intelligence</Link>
              <span>/</span>
              <span>{category.name}</span>
            </nav>
            <p className="eyebrow">Independent Brand Intelligence</p>
            <h1>{category.title}</h1>
            <p>{category.description}</p>
          </div>
          <div className="guides-hero-stat">
            <strong>{profiles.length}</strong>
            <span>Verified profiles in this buying category</span>
            <Link href="/brands">Browse all brand intelligence</Link>
          </div>
        </div>
      </section>

      <section className="section guides-featured-section">
        <div className="insights-page-container">
          <div className="guides-featured-grid brand-directory-grid">
            {profiles.map((profile) => (
              <BrandDirectoryCard key={profile.slug} profile={profile} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
