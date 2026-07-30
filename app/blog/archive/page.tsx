import type { Metadata } from "next";
import { ContentDirectory } from "@/components/ContentDirectory";
import { getInsights } from "@/lib/content";
import {
  directoryHref,
  paginateDirectoryItems,
  parseDirectoryPage
} from "@/lib/contentDirectory";
import {
  filterArticlesByCompany,
  getAvailableCompanyKeywords,
  getCompanyKeyword
} from "@/lib/companyKeywords";
import {
  getEditorialInsights,
  getLatestSeriesInsight
} from "@/lib/insightCollections";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const siteUrl = "https://worldcleanbiz.com";
const featuredSeries = "building-worlds-no-1-cleaning-show-from-scratch";

function queryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  searchParams
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const hasQueryParams = Object.values(resolvedSearchParams).some((value) =>
    Array.isArray(value) ? value.length > 0 : typeof value !== "undefined"
  );

  return {
    title: "Analysis & Insights",
    description:
      "Browse original World Clean Biz analysis of cleaning robots, floorcare, pool cleaning, robotic mowers, brands, suppliers and global cleaning industry strategy.",
    alternates: {
      canonical: "/blog/archive"
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

export default async function BlogArchivePage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const hasQueryParams = Object.values(resolvedSearchParams).some((value) =>
    Array.isArray(value) ? value.length > 0 : typeof value !== "undefined"
  );
  const allArticles = getInsights();
  const editorialArticles = getEditorialInsights(allArticles);
  const categories = Array.from(
    new Set(editorialArticles.map((article) => article.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const requestedCategory = queryValue(resolvedSearchParams.category);
  const requestedCompany = queryValue(resolvedSearchParams.company);
  const availableCompanies = getAvailableCompanyKeywords(editorialArticles);
  const selectedCompany = getCompanyKeyword(
    requestedCompany,
    availableCompanies
  );
  const selectedCategory = selectedCompany
    ? undefined
    : categories.includes(requestedCategory || "")
      ? requestedCategory
      : undefined;
  const filteredArticles = selectedCompany
    ? filterArticlesByCompany(editorialArticles, selectedCompany)
    : selectedCategory
      ? editorialArticles.filter(
          (article) => article.category === selectedCategory
        )
      : editorialArticles;
  const {
    items: visibleArticles,
    currentPage,
    totalPages,
    pageStart
  } = paginateDirectoryItems(
    filteredArticles,
    parseDirectoryPage(resolvedSearchParams.page)
  );
  const paginationParams = selectedCompany
    ? { company: selectedCompany.value }
    : { category: selectedCategory };
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
      active: !selectedCategory && !selectedCompany
    },
    ...categories.map((category) => ({
      label: category,
      href: directoryHref("/blog/archive", 1, { category }),
      active: selectedCategory === category
    }))
  ];
  const latestSeriesArticle = getLatestSeriesInsight(
    allArticles,
    featuredSeries
  );
  const featuredSeriesArticle =
    !hasQueryParams &&
    currentPage === 1 &&
    !selectedCategory &&
    !selectedCompany
      ? latestSeriesArticle
      : undefined;
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: selectedCategory
      ? `${selectedCategory} analysis from World Clean Biz`
      : selectedCompany
        ? `${selectedCompany.label} analysis from World Clean Biz`
      : "World Clean Biz Analysis & Insights",
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

  return (
    <div id="analysis">
      <ContentDirectory
        variant="analysis"
        eyebrow="Original Editorial"
        title="Analysis & Insights"
        description="Industry shifts, company strategy, original research and market observations from across the global cleaning industry."
        totalLabel={`${filteredArticles.length} analysis articles`}
        articles={visibleArticles}
        filters={filters}
        pagination={pagination}
        previousHref={
          currentPage > 1
            ? directoryHref(
                "/blog/archive",
                currentPage - 1,
                paginationParams
              )
            : undefined
        }
        nextHref={
          currentPage < totalPages
            ? directoryHref(
                "/blog/archive",
                currentPage + 1,
                paginationParams
              )
            : undefined
        }
        featuredSeriesArticle={featuredSeriesArticle}
        sidebar={{
          mode: "analysis",
          navigationTitle: "Company & Brand Index",
          navigationLinks: availableCompanies.map((company) => ({
            label: company.label,
            href: directoryHref("/blog/archive", 1, {
              company: company.value
            }),
            active: selectedCompany?.value === company.value
          })),
          importantTitle: "Important Analysis",
          importantArticles: editorialArticles.filter(
            (article) => article.featured
          ),
          importantMeta: "date"
        }}
      />
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
