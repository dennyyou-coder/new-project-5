import { buildBrandAnalysisLink } from "@/components/brands/brandAnalysisLink";
import { getAvailableCompanyKeywords } from "@/lib/companyKeywords";
import { getEditorialInsights } from "@/lib/insightCollections";
import { getNews } from "@/lib/news";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandArticles } from "@/components/brands/BrandArticles";
import { BrandCategoryPage } from "@/components/brands/BrandCategoryPage";
import { BrandHero } from "@/components/brands/BrandHero";
import { BrandFinancials } from "@/components/brands/BrandFinancials";
import { BrandFactRail } from "@/components/brands/BrandFactRail";
import { BrandSections, type BrandCompetitorCard, type BrandModelCard } from "@/components/brands/BrandSections";
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
import { buildBrandMarkIndex } from "@/lib/brandMarks";
import { getBrandCategoryForProfile } from "@/lib/brandCategories";
import { productCover, productModels } from "@/lib/products";
import { findParentProfile } from "@/lib/brandProfileView";
import "../../styles/brand-profile.css";

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

  const data = getBrandPageData(slug, articles);
  if (!data) notFound();

  const profile = data.profile;
  const publishedSlugs = new Set(profiles.map((item) => item.slug));
  const markIndex = buildBrandMarkIndex(profiles);
  const parentProfile = findParentProfile(profile, profiles);
  const schemas = buildBrandPageSchemas(data, siteUrl);
  const relatedNews = getNews().filter((article) => article.brandSlugs.includes(profile.slug));
  const analysisLink = buildBrandAnalysisLink(profile, getAvailableCompanyKeywords(
    getEditorialInsights(articles).filter((article) => !article.series)
  ));

  // Product cards: newest models first, with two short specification values.
  const models: BrandModelCard[] = productModels
    .filter((model) => model.brandSlug === profile.slug)
    .sort((a, b) => String(b.announced ?? "").localeCompare(String(a.announced ?? "")))
    .map((model) => ({
      slug: model.slug,
      name: model.name.toLowerCase().startsWith(`${profile.name.toLowerCase()} `) ? model.name.slice(profile.name.length + 1) : model.name,
      category: model.category,
      cover: productCover(model.slug),
      specs: (model.facts ?? [])
        .map((fact: { value?: string }) => String(fact.value ?? "").trim())
        .filter((value: string) => value && value.length <= 26)
        .slice(0, 2)
    }));

  // Competitors: logo, category and the comparison article when one covers both companies.
  const competitors: BrandCompetitorCard[] = profile.competitivePosition.competitorSlugs
    .filter((competitorSlug) => publishedSlugs.has(competitorSlug))
    .slice(0, 4)
    .map((competitorSlug) => {
      const mark = markIndex.get(competitorSlug)!;
      const comparison = articles.find(
        (article) =>
          article.contentClass === "search" &&
          article.guideType === "comparison" &&
          [...article.primaryBrands, ...article.relatedBrands].includes(profile.slug) &&
          [...article.primaryBrands, ...article.relatedBrands].includes(competitorSlug)
      );
      return {
        mark,
        caption: getBrandCategoryForProfile(competitorSlug)?.name,
        href: comparison ? `/blog/${comparison.slug}` : `/brands/${competitorSlug}`,
        linkLabel: comparison ? "Compare" : "Company profile"
      };
    });

  const ownershipAnalysis = articles.find(
    (article) => article.contentClass === "search" && article.guideType === "ownership" && article.primaryBrands.includes(profile.slug)
  );

  return (
    <div className="guides-hub brand-hub brand-detail approved-catalog">
      <BrandHero profile={profile} modelCount={models.length} hasAnalysis={true} />
      <div className="insights-page-container bp-body">
        <div className="bp-main brand-content-sections">
          <BrandSections
            profile={profile}
            brandMark={markIndex.get(profile.slug) ?? { name: profile.name, logo: profile.logoImage }}
            parentMark={parentProfile ? markIndex.get(parentProfile.slug) : undefined}
            models={models}
            competitors={competitors}
            ownershipAnalysisHref={ownershipAnalysis ? `/blog/${ownershipAnalysis.slug}` : undefined}
          />
          <BrandFinancials brand={profile.slug} />
          <BrandTimeline profile={profile} />
          <BrandArticles
            brandName={profile.name}
            analysisLink={analysisLink}
            news={relatedNews}
            primaryArticles={data.primaryArticles}
            relatedArticles={data.relatedArticles}
          />
          <BrandSources profile={profile} />
        </div>
        <BrandFactRail profile={profile} competitors={competitors.map((competitor) => competitor.mark)} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
