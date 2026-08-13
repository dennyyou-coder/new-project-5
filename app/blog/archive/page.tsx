import type { Metadata } from "next";
import { ContentDirectory } from "@/components/ContentDirectory";
import { getInsights } from "@/lib/content";
import {
  directoryHref,
  paginateDirectoryItems,
  parseDirectoryPage,
  toDirectoryArticle
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

const siteUrl = "https://worldcleanbiz.com";
const featuredSeries = "building-worlds-no-1-cleaning-show-from-scratch";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
  searchParams?: SearchParams;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  searchParams
}: PageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const articles = getEditorialInsights(getInsights()).map(toDirectoryArticle);
  const categories = Array.from(
    new Set(articles.map((article) => article.category).filter(Boolean))
  );
  const availableCompanies = getAvailableCompanyKeywords(articles);
  const selectedCompany = getCompanyKeyword(
    firstParam(resolvedSearchParams.company),
    availableCompanies
  );
  const requestedCategory = firstParam(resolvedSearchParams.category);
  const selectedCategory = selectedCompany
    ? undefined
    : categories.includes(requestedCategory || "")
      ? requestedCategory
      : undefined;
  const filteredArticles = selectedCompany
    ? filterArticlesByCompany(articles, selectedCompany)
    : selectedCategory
      ? articles.filter((article) => article.category === selectedCategory)
      : articles;
  const { currentPage: page } = paginateDirectoryItems(
    filteredArticles,
    parseDirectoryPage(resolvedSearchParams.page)
  );
  const filtered = Boolean(
    firstParam(resolvedSearchParams.category) ||
      firstParam(resolvedSearchParams.company)
  );
  const canonical = filtered
    ? "/blog/archive"
    : directoryHref("/blog/archive", page);

  return {
    title: page > 1 ? `Analysis & Insights – Page ${page}` : "Analysis & Insights",
    description:
      "Browse original World Clean Biz analysis of cleaning robots, floorcare, pool cleaning, robotic mowers, brands, suppliers and global cleaning industry strategy.",
    alternates: { canonical },
    robots: filtered
      ? { index: false, follow: true }
      : { index: true, follow: true }
  };
}

export default async function BlogArchivePage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const allArticles = getInsights();
  const editorialInsights = getEditorialInsights(allArticles);
  const editorialArticles = editorialInsights.map(toDirectoryArticle);
  const categories = Array.from(
    new Set(editorialArticles.map((article) => article.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const availableCompanies = getAvailableCompanyKeywords(editorialArticles);
  const selectedCompany = getCompanyKeyword(
    firstParam(resolvedSearchParams.company),
    availableCompanies
  );
  const requestedCategory = firstParam(resolvedSearchParams.category);
  const selectedCategory = selectedCompany
    ? undefined
    : categories.includes(requestedCategory || "")
      ? requestedCategory
      : undefined;
  const filteredArticles = selectedCompany
    ? filterArticlesByCompany(editorialArticles, selectedCompany)
    : selectedCategory
      ? editorialArticles.filter((article) => article.category === selectedCategory)
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
  const currentPath = directoryHref(
    "/blog/archive",
    currentPage,
    paginationParams
  );
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
    "@id": `${siteUrl}${currentPath}`,
    name: "World Clean Biz Analysis & Insights",
    url: `${siteUrl}${currentPath}`,
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
        item: `${siteUrl}${currentPath}`
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
            ? directoryHref("/blog/archive", currentPage - 1, paginationParams)
            : undefined
        }
        nextHref={
          currentPage < totalPages
            ? directoryHref("/blog/archive", currentPage + 1, paginationParams)
            : undefined
        }
        featuredSeriesArticle={
          currentPage === 1 && !selectedCategory && !selectedCompany && latestSeriesArticle
            ? toDirectoryArticle(latestSeriesArticle)
            : undefined
        }
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
          importantArticles: editorialArticles.filter((article) => article.featured),
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
