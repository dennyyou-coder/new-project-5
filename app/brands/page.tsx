import type { Metadata } from "next";
import { BrandDirectoryCard } from "@/components/brands/BrandDirectoryCard";
import { getPublishedBrandCategories } from "@/lib/brandCategories";
import {
  buildBrandDirectorySchemas,
  getPublishedBrandProfiles,
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
    images: ["/images/industry/about-forum-stage-2025.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning & Home Appliance Brand Intelligence",
    description:
      "Research company ownership, product portfolios, manufacturing, channels and strategy.",
    images: ["/images/industry/about-forum-stage-2025.jpg"],
  },
};

export default function BrandsPage() {
  const articles = getInsights();
  const profiles = getPublishedBrandProfiles(articles);
  const categoryOrder = [
    "floorcare-home-cleaning",
    "commercial-industrial-cleaning",
    "pool-equipment-pool-care",
    "lawn-garden-equipment",
    "power-tools",
  ];
  const categories = getPublishedBrandCategories(profiles).sort((a, b) => {
    const rank = (slug: string) => {
      const i = categoryOrder.indexOf(slug);
      return i < 0 ? 99 : i;
    };
    return rank(a.category.slug) - rank(b.category.slug);
  });
  const schemas = buildBrandDirectorySchemas(profiles, siteUrl);

  return (
    <div className="guides-hub brand-hub">
      <section className="guides-hero">
        <div className="insights-page-container">
          <p className="eyebrow">Independent brand research</p>
          <h1>Companies &amp; Brands</h1>
          <p>
            Explore company ownership, products and business activities across
            the cleaning industry.
          </p>
          <p className="refresh-meta">
            {profiles.length} published brand profiles
          </p>
          <nav className="refresh-category-links" aria-label="Brand categories">
            {categories.map(({ category }) => (
              <a href={`#${category.slug}`} key={category.slug}>
                {category.name}
              </a>
            ))}
          </nav>
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

      <div className="insights-page-container refresh-directory-note">
        <p>
          Profiles distinguish ownership, trademarks and operating companies,
          with sources and verification dates. Brands may appear in more than
          one relevant category; the total counts unique profiles.
        </p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
