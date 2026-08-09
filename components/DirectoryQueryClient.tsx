"use client";

import { useSearchParams } from "next/navigation";
import {
  ContentDirectory,
  type DirectoryArticle
} from "@/components/ContentDirectory";
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
import { GUIDE_TYPE_CONFIG } from "@/lib/guideTaxonomy";

export function GuidesQueryDirectory({
  articles,
  latestSeriesArticle,
  importantArticles
}: {
  articles: DirectoryArticle[];
  latestSeriesArticle?: DirectoryArticle;
  importantArticles: DirectoryArticle[];
}) {
  const searchParams = useSearchParams();
  const { items, currentPage, totalPages } = paginateDirectoryItems(
    articles,
    parseDirectoryPage(searchParams.get("page") || undefined)
  );
  const pagination = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return { page, href: directoryHref("/guides", page), current: page === currentPage };
  });

  return (
    <ContentDirectory
      variant="guides"
      eyebrow="World Clean Biz Guides"
      title="Industry Guides"
      description="Research brand ownership, compare cleaning products, evaluate suppliers and understand the technologies shaping the market."
      totalLabel={`${articles.length} practical guides`}
      articles={items}
      filters={[
        { label: "All Guides", href: "/guides", active: true },
        ...GUIDE_TYPE_CONFIG.map((guideType) => ({
          label: guideType.label,
          href: guideType.href,
          active: false
        }))
      ]}
      pagination={pagination}
      previousHref={currentPage > 1 ? directoryHref("/guides", currentPage - 1) : undefined}
      nextHref={currentPage < totalPages ? directoryHref("/guides", currentPage + 1) : undefined}
      featuredSeriesArticle={searchParams.size === 0 && currentPage === 1 ? latestSeriesArticle : undefined}
      sidebar={{
        mode: "guides",
        navigationTitle: "Guide Categories",
        navigationLinks: [
          { label: "All Industry Guides", href: "/guides", active: true },
          ...GUIDE_TYPE_CONFIG.map((guideType) => ({
            label: guideType.label,
            href: guideType.href
          }))
        ],
        importantTitle: "Essential Guides",
        importantArticles,
        importantMeta: "readingTime"
      }}
    />
  );
}

export function ArchiveQueryDirectory({
  articles,
  latestSeriesArticle
}: {
  articles: DirectoryArticle[];
  latestSeriesArticle?: DirectoryArticle;
}) {
  const searchParams = useSearchParams();
  const categories = Array.from(
    new Set(articles.map((article) => article.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const availableCompanies = getAvailableCompanyKeywords(articles);
  const selectedCompany = getCompanyKeyword(
    searchParams.get("company") || undefined,
    availableCompanies
  );
  const requestedCategory = searchParams.get("category") || undefined;
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
  const { items, currentPage, totalPages } = paginateDirectoryItems(
    filteredArticles,
    parseDirectoryPage(searchParams.get("page") || undefined)
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

  return (
    <ContentDirectory
      variant="analysis"
      eyebrow="Original Editorial"
      title="Analysis & Insights"
      description="Industry shifts, company strategy, original research and market observations from across the global cleaning industry."
      totalLabel={`${filteredArticles.length} analysis articles`}
      articles={items}
      filters={[
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
      ]}
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
        searchParams.size === 0 && currentPage === 1 && !selectedCategory && !selectedCompany
          ? latestSeriesArticle
          : undefined
      }
      sidebar={{
        mode: "analysis",
        navigationTitle: "Company & Brand Index",
        navigationLinks: availableCompanies.map((company) => ({
          label: company.label,
          href: directoryHref("/blog/archive", 1, { company: company.value }),
          active: selectedCompany?.value === company.value
        })),
        importantTitle: "Important Analysis",
        importantArticles: articles.filter((article) => article.featured),
        importantMeta: "date"
      }}
    />
  );
}
