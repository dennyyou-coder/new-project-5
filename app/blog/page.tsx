import type { Metadata } from "next";
import { BlogArticleGrid, BlogBusinessLinks, BlogSeriesHero } from "@/components/BlogLanding";
import { NewsletterLeadForm } from "@/components/LeadForms";
import { getInsights } from "@/lib/content";
import {
  getBlogHomepageEditorial,
  getBlogHomepageGuides,
  getLatestSeriesInsight
} from "@/lib/insightCollections";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const siteUrl = "https://worldcleanbiz.com";
const featuredSeries = "building-worlds-no-1-cleaning-show-from-scratch";

export async function generateMetadata({ searchParams }: { searchParams?: SearchParams }): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const hasQueryParams = Object.values(resolvedSearchParams).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return typeof value !== "undefined";
  });

  return {
    title: "Blog",
    description:
      "Original World Clean Biz cleaning industry analysis and practical guides for product, sourcing and market decisions.",
    alternates: {
      canonical: "/blog"
    },
    openGraph: {
      title: "World Clean Biz Blog",
      description:
        "Original cleaning industry analysis and practical guides for buyers, brands, distributors and manufacturers.",
      type: "website",
      url: "/blog",
      images: ["/images/industry/about-forum-stage-2025.jpg"]
    },
    twitter: {
      card: "summary_large_image",
      title: "World Clean Biz Blog",
      description:
        "Original cleaning industry analysis and practical guides for buyers, brands, distributors and manufacturers.",
      images: ["/images/industry/about-forum-stage-2025.jpg"]
    },
    robots: hasQueryParams
      ? {
          index: false,
          follow: true
        }
      : {
          index: true,
          follow: true
        }
  };
}

export default function InsightsPage() {
  const allArticles = getInsights();
  const latestSeriesArticle = getLatestSeriesInsight(allArticles, featuredSeries);
  const analysisArticles = getBlogHomepageEditorial(allArticles, featuredSeries, 6);
  const guideArticles = getBlogHomepageGuides(allArticles, 6);
  const visibleArticles = [
    ...(latestSeriesArticle ? [latestSeriesArticle] : []),
    ...analysisArticles,
    ...guideArticles
  ];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "World Clean Biz Blog",
    numberOfItems: visibleArticles.length,
    itemListElement: visibleArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/blog/${article.slug}`,
      name: article.title
    }))
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/blog`,
    name: "World Clean Biz Blog",
    description:
      "Original cleaning industry analysis and practical guides for product, sourcing and market decisions.",
    url: `${siteUrl}/blog`,
    mainEntity: itemListSchema
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` }
    ]
  };

  return (
    <>
      <section className="blog-home-intro">
        <div className="insights-page-container">
          <p className="eyebrow">World Clean Biz Intelligence</p>
          <h1>Cleaning Industry Analysis And Practical Guides.</h1>
          <p>
            Original industry intelligence and practical decision guides for buyers, brands, distributors and manufacturers.
          </p>
        </div>
      </section>

      <div className="blog-home-main">
        <div className="insights-page-container">
          {latestSeriesArticle ? <BlogSeriesHero article={latestSeriesArticle} /> : null}
          <BlogArticleGrid
            articles={analysisArticles}
            sectionId="analysis"
            eyebrow="Original Editorial"
            title="Deep Analysis"
            description="Industry shifts, company strategy, original research and market observations."
            archiveHref="/blog/archive#analysis"
            archiveLabel="View all analysis"
            variant="analysis"
          />
          <BlogArticleGrid
            articles={guideArticles}
            sectionId="guides"
            eyebrow="Practical Research"
            title="Practical Guides"
            description="Buying decisions, brand ownership, product comparisons, sourcing and maintenance."
            archiveHref="/guides"
            archiveLabel="Browse all guides"
            variant="guide"
          />
          <NewsletterLeadForm />
          <BlogBusinessLinks />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionSchema, itemListSchema, breadcrumbSchema]) }}
      />
    </>
  );
}
