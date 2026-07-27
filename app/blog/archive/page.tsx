import type { Metadata } from "next";
import { ContentDirectory } from "@/components/ContentDirectory";
import { getInsights } from "@/lib/content";
import {
  directoryHref,
  paginateDirectoryItems,
  parseDirectoryPage
} from "@/lib/contentDirectory";
import { getEditorialInsights } from "@/lib/insightCollections";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const siteUrl = "https://worldcleanbiz.com";

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
  const editorialArticles = getEditorialInsights(getInsights());
  const categories = Array.from(
    new Set(editorialArticles.map((article) => article.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const requestedCategory = queryValue(resolvedSearchParams.category);
  const selectedCategory = categories.includes(requestedCategory || "")
    ? requestedCategory
    : undefined;
  const filteredArticles = selectedCategory
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
  const categoryParams = { category: selectedCategory };
  const pagination = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      page,
      href: directoryHref("/blog/archive", page, categoryParams),
      current: page === currentPage
    };
  });
  const filters = [
    {
      label: "All Analysis",
      href: "/blog/archive",
      active: !selectedCategory
    },
    ...categories.map((category) => ({
      label: category,
      href: directoryHref("/blog/archive", 1, { category }),
      active: selectedCategory === category
    }))
  ];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: selectedCategory
      ? `${selectedCategory} analysis from World Clean Biz`
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
                categoryParams
              )
            : undefined
        }
        nextHref={
          currentPage < totalPages
            ? directoryHref(
                "/blog/archive",
                currentPage + 1,
                categoryParams
              )
            : undefined
        }
        sidebarPrimaryTitle="Explore World Clean Biz"
        sidebarPrimaryLinks={[
          {
            label: "All Analysis",
            href: "/blog/archive",
            active: !selectedCategory,
          },
          { label: "Industry Guides", href: "/guides" },
          { label: "Back To Blog", href: "/blog" },
          { label: "Market Reports", href: "/reports" },
          { label: "Sourcing Opportunities", href: "/sourcing" }
        ]}
        sidebarSecondaryTitle="Popular Analysis Categories"
        sidebarSecondaryLinks={categories.slice(0, 8).map((category) => ({
          label: category,
          href: directoryHref("/blog/archive", 1, { category }),
          active: selectedCategory === category
        }))}
        latestArticles={editorialArticles.slice(0, 5)}
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
