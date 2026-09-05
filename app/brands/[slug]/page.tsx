import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandArticles } from "@/components/brands/BrandArticles";
import { BrandCategoryPage } from "@/components/brands/BrandCategoryPage";
import { BrandHero } from "@/components/brands/BrandHero";
import { BrandSections } from "@/components/brands/BrandSections";
import { BrandSources } from "@/components/brands/BrandSources";
import { BrandTimeline } from "@/components/brands/BrandTimeline";
import {
  buildBrandPageSchemas,
  buildBrandStaticParams,
  getBrandPageData,
  buildBrandPageTitle,
  getPublishedBrandProfiles
} from "@/lib/brands";
import {
  buildBrandCategorySchemas,
  buildBrandCategoryStaticParams,
  getBrandCategoryPageData
} from "@/lib/brandCategories";
import { getInsights } from "@/lib/content";
import { buildWebsiteMetadata } from "@/lib/seo";

const siteUrl = "https://worldcleanbiz.com";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const articles = getInsights();
  const profiles = getPublishedBrandProfiles(articles);
  return [
    ...buildBrandStaticParams(profiles),
    ...buildBrandCategoryStaticParams(profiles)
  ];
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = getInsights();
  const profiles = getPublishedBrandProfiles(articles);
  const categoryData = getBrandCategoryPageData(slug, profiles);
  if (categoryData) {
    const canonical = `/brands/${categoryData.category.slug}`;

    return buildWebsiteMetadata({
      title: categoryData.category.title,
      description: categoryData.category.description,
      canonical
    });
  }

  const data = getBrandPageData(slug, articles);
  if (!data) return {};

  const { profile } = data;
  const canonical = `/brands/${profile.slug}`;
  const pageTitle = buildBrandPageTitle(profile);

  return buildWebsiteMetadata({
    title: pageTitle,
    description: profile.metaDescription,
    canonical,
    image: profile.heroImage
  });
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = getInsights();
  const profiles = getPublishedBrandProfiles(articles);
  const categoryData = getBrandCategoryPageData(slug, profiles);
  if (categoryData) {
    const schemas = buildBrandCategorySchemas(categoryData, siteUrl);

    return (
      <>
        <BrandCategoryPage data={categoryData} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </>
    );
  }

  const publishedBrandSlugs = new Set(profiles.map((profile) => profile.slug));
  const data = getBrandPageData(slug, articles);
  if (!data) notFound();

  const schemas = buildBrandPageSchemas(data, siteUrl);

  return (
    <div className="guides-hub brand-hub brand-detail">
      <BrandHero
        profile={data.profile}
        hasAnalysis={data.primaryArticles.length > 0 || data.relatedArticles.length > 0}
      />
      <BrandSections
        profile={data.profile}
        allowedCompetitorSlugs={publishedBrandSlugs}
      />
      <BrandTimeline profile={data.profile} />
      <BrandArticles
        primaryArticles={data.primaryArticles}
        relatedArticles={data.relatedArticles}
      />
      <BrandSources profile={data.profile} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
