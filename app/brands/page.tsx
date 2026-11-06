import type { Metadata } from "next";
import Link from "next/link";
import "../styles/company-directory.css";
import { CompanyDirectory } from "@/components/brands/CompanyDirectory";
import { getBrandCategoriesForProfile, getPublishedBrandCategories } from "@/lib/brandCategories";
import { buildOwnershipGroups, headquartersCountry, ownershipLine } from "@/lib/brandDirectory";
import {
  buildBrandDirectorySchemas,
  getPublishedBrandProfiles,
} from "@/lib/brands";
import { getInsights } from "@/lib/content";
import { brandMonogram } from "@/lib/brandMarks";

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
  const ownershipGroups = buildOwnershipGroups(profiles);
  // Each company appears once; categories are filters, not sections.
  const companies = [...profiles]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      logo: profile.logoImage,
      logoAlt: profile.logoImageAlt,
      headquarters: profile.headquarters,
      country: headquartersCountry(profile.headquarters),
      ownership: ownershipLine(profile),
      categories: getBrandCategoriesForProfile(profile.slug).map((category) => category.slug),
      search: [profile.name, profile.slug, ...profile.aliases, profile.ownership.parentCompany ?? ""].join(" ").toLowerCase(),
    }));
  const countries = [...new Set(companies.map((company) => company.country).filter((country): country is string => Boolean(country)))].sort();

  return (
    <div className="company-directory-page">
      <section className="company-directory-hero">
        <div className="company-directory-container">
          <nav className="company-directory-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span aria-current="page">Companies</span>
          </nav>
          <h1>Companies &amp; Brands</h1>
          <p>Ownership, products and business activities of {profiles.length} companies and brands across the cleaning industry.</p>
          <nav className="company-directory-categories" aria-label="Company categories">
            {categories.map((data) => (
              <Link key={data.category.slug} href={`/brands/${data.category.slug}`}>
                {data.category.name} <span>{data.profiles.length}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="company-directory-container company-directory-body">
        {ownershipGroups.length > 0 ? (
          <section className="company-owners" aria-labelledby="company-owners-title">
            <h2 id="company-owners-title">Who owns what</h2>
            <p className="company-owners-note">Groups that own two or more of the brands profiled here, taken from each profile&rsquo;s ownership record.</p>
            <ul className="company-owners-grid">
              {ownershipGroups.map((group) => (
                <li key={group.key}>
                  <p className="company-owner-parent">
                    <span className={`company-owner-mark${group.parentProfile ? "" : " company-owner-mark--monogram"}`} aria-hidden="true">
                      {group.parentProfile ? <img src={group.parentProfile.logoImage} alt="" loading="lazy" decoding="async" /> : brandMonogram(group.parent)}
                    </span>
                    {group.parentProfile ? <Link href={`/brands/${group.parentProfile.slug}`}>{group.parent}</Link> : group.parent}
                  </p>
                  <p className="company-owner-brands">
                    {group.brands.map((brand) => (
                      <Link key={brand.slug} className="company-owner-brand" href={`/brands/${brand.slug}`}>
                        <span className="company-owner-mark company-owner-mark--small" aria-hidden="true">
                          <img src={brand.logoImage} alt="" loading="lazy" decoding="async" />
                        </span>
                        {brand.name}
                      </Link>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <CompanyDirectory
          companies={companies}
          categories={categories.map((data) => ({ slug: data.category.slug, name: data.category.name }))}
          countries={countries}
        />

        <p className="company-directory-note">
          Profiles distinguish ownership, trademarks and operating companies, with sources and verification dates.
        </p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
