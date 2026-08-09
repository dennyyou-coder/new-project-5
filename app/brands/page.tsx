import type { Metadata } from "next";
import Link from "next/link";
import { BrandDirectoryCard } from "@/components/brands/BrandDirectoryCard";
import { getPublishedBrandCategories } from "@/lib/brandCategories";
import {
  buildBrandDirectorySchemas,
  getPublishedBrandProfiles
} from "@/lib/brands";
import { getInsights } from "@/lib/content";

const siteUrl = "https://worldcleanbiz.com";

export const metadata: Metadata = {
  title: "Cleaning Appliance Brand Intelligence",
  description:
    "Independent brand profiles for cleaning- and home-appliance buyers, distributors and market professionals.",
  alternates: { canonical: "/brands" },
  openGraph: {
    title: "Cleaning & Home Appliance Brand Intelligence | World Clean Biz",
    description:
      "Research company ownership, product portfolios, manufacturing, channels and strategy.",
    type: "website",
    url: "/brands",
    images: ["/images/industry/about-forum-stage-2025.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning & Home Appliance Brand Intelligence",
    description:
      "Research company ownership, product portfolios, manufacturing, channels and strategy.",
    images: ["/images/industry/about-forum-stage-2025.jpg"]
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
            <h1>Cleaning & Home Appliance Brand Intelligence</h1>
            <p>
              Verified company profiles help cleaning and home-appliance buyers,
              distributors and industry professionals evaluate ownership,
              trademarks, operating companies, products, supply chains, channels
              and competitive strategy. Brands with verified product lines across
              markets appear in every relevant buying category; the published
              total counts unique brand profiles.
            </p>
          </div>
          <div className="guides-hero-stat">
            <strong>{profiles.length}</strong>
            <span>Published profiles meeting our evidence standard</span>
            <Link href="/blog">Read Industry Analysis</Link>
          </div>
        </div>
      </section>

      {categories.map((data, index) => (
        <section
          className={`section brand-category-list${index % 2 === 1 ? " brand-category-list--soft" : ""}`}
          id={data.category.slug}
          key={data.category.slug}
        >
          <div className="insights-page-container">
            <div className="brand-category-list__intro">
              <div>
                <p className="eyebrow">Buying category</p>
                <h2>{data.category.name}</h2>
                <p>{data.category.description}</p>
              </div>
            </div>
            <div className="guides-featured-grid brand-directory-grid">
              {data.profiles.map((profile) => (
                <BrandDirectoryCard key={profile.slug} profile={profile} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
