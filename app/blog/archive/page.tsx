import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDirectory } from "@/components/ContentDirectory";
import { ArchiveQueryDirectory } from "@/components/DirectoryQueryClient";
import { getInsights } from "@/lib/content";
import {
  directoryHref,
  paginateDirectoryItems,
  toDirectoryArticle
} from "@/lib/contentDirectory";
import {
  getAvailableCompanyKeywords
} from "@/lib/companyKeywords";
import {
  getEditorialInsights,
  getLatestSeriesInsight
} from "@/lib/insightCollections";

const siteUrl = "https://worldcleanbiz.com";
const featuredSeries = "building-worlds-no-1-cleaning-show-from-scratch";

export const metadata: Metadata = {
    title: "Analysis & Insights",
    description:
      "Browse original World Clean Biz analysis of cleaning robots, floorcare, pool cleaning, robotic mowers, brands, suppliers and global cleaning industry strategy.",
    alternates: {
      canonical: "/blog/archive"
    },
    robots: { index: true, follow: true }
};

export default function BlogArchivePage() {
  const allArticles = getInsights();
  const editorialInsights = getEditorialInsights(allArticles);
  const editorialArticles = editorialInsights.map(toDirectoryArticle);
  const categories = Array.from(
    new Set(editorialArticles.map((article) => article.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const availableCompanies = getAvailableCompanyKeywords(editorialArticles);
  const filteredArticles = editorialArticles;
  const {
    items: visibleArticles,
    currentPage,
    totalPages,
    pageStart
  } = paginateDirectoryItems(
    filteredArticles,
    1
  );
  const paginationParams = {};
  const pagination = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      page,
      href: directoryHref("/blog/archive", page, paginationParams),
      current: page === currentPage
    };
  });
  const filters = [
    {
      label: "All Analysis",
      href: "/blog/archive",
      active: true
    },
    ...categories.map((category) => ({
      label: category,
      href: directoryHref("/blog/archive", 1, { category }),
      active: false
    }))
  ];
  const latestSeriesArticle = getLatestSeriesInsight(
    allArticles,
    featuredSeries
  );
  const featuredSeriesArticle = latestSeriesArticle;
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "World Clean Biz Analysis & Insights",
    numberOfItems: filteredArticles.length,
    itemListElement: visibleArticles.map((article, index) => ({
      "@type": "ListItem",
      position: pageStart + index + 1,
      name: article.title,
      url: `${siteUrl}/blog/${article.slug}`
    }))
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/blog/archive`,
    name: "World Clean Biz Analysis & Insights",
    url: `${siteUrl}/blog/archive`,
    mainEntity: itemListSchema
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Analysis & Insights",
        item: `${siteUrl}/blog/archive`
      }
    ]
  };
  const directoryContent = (
    <ContentDirectory
      variant="analysis"
      eyebrow="Original Editorial"
      title="Analysis & Insights"
      description="Industry shifts, company strategy, original research and market observations from across the global cleaning industry."
      totalLabel={`${filteredArticles.length} analysis articles`}
      articles={visibleArticles}
      filters={filters}
      pagination={pagination}
      previousHref={undefined}
      nextHref={
        currentPage < totalPages
          ? directoryHref("/blog/archive", currentPage + 1)
          : undefined
      }
      featuredSeriesArticle={featuredSeriesArticle ? toDirectoryArticle(featuredSeriesArticle) : undefined}
      sidebar={{
        mode: "analysis",
        navigationTitle: "Company & Brand Index",
        navigationLinks: availableCompanies.map((company) => ({
          label: company.label,
          href: directoryHref("/blog/archive", 1, {
            company: company.value
          }),
          active: false
        })),
        importantTitle: "Important Analysis",
        importantArticles: editorialArticles.filter((article) => article.featured),
        importantMeta: "date"
      }}
    />
  );

  return (
    <div id="analysis">
      <Suspense fallback={directoryContent}>
        <ArchiveQueryDirectory
          articles={editorialArticles}
          latestSeriesArticle={featuredSeriesArticle ? toDirectoryArticle(featuredSeriesArticle) : undefined}
        />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            collectionSchema,
            itemListSchema,
            breadcrumbSchema
          ])
        }}
      />
    </div>
  );
}
