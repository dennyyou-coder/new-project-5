import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandArticles } from "@/components/brands/BrandArticles";
import { BrandHero } from "@/components/brands/BrandHero";
import { BrandSections } from "@/components/brands/BrandSections";
import { BrandSources } from "@/components/brands/BrandSources";
import { BrandTimeline } from "@/components/brands/BrandTimeline";
import {
  buildBrandPageSchemas,
  getBrandPageData,
  getPublishedBrandProfiles
} from "@/lib/brands";
import { getInsights } from "@/lib/content";

const siteUrl = "https://worldcleanbiz.com";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const articles = getInsights();
  return getPublishedBrandProfiles(articles).map((profile) => ({
    slug: profile.slug
  }));
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = getInsights();
  const data = getBrandPageData(slug, articles);
  if (!data) return {};

  const { profile } = data;
  const canonical = `/brands/${profile.slug}`;

  return {
    title: `${profile.name} Company Profile, Ownership, Products & Strategy`,
    description: profile.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: `${profile.name} Company Profile, Ownership, Products & Strategy`,
      description: profile.metaDescription,
      type: "website",
      url: canonical,
      images: profile.heroImage ? [profile.heroImage] : undefined
    }
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = getInsights();
  const publishedBrandSlugs = new Set(
    getPublishedBrandProfiles(articles).map((profile) => profile.slug)
  );
  const data = getBrandPageData(slug, articles);
  if (!data) notFound();

  const schemas = buildBrandPageSchemas(data, siteUrl);

  return (
    <div className="guides-hub brand-hub brand-detail">
      <BrandHero profile={data.profile} />
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
