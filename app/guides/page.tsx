import type { Metadata } from "next";
import { ContentDirectory } from "@/components/ContentDirectory";
import { getInsights } from "@/lib/content";
import {
  directoryHref,
  paginateDirectoryItems,
  parseDirectoryPage,
  toDirectoryArticle
} from "@/lib/contentDirectory";
import { GUIDE_TYPE_CONFIG } from "@/lib/guideTaxonomy";
import {
  getFeaturedGuides,
  getGuideInsights,
  getLatestSeriesInsight
} from "@/lib/insightCollections";

const siteUrl = "https://worldcleanbiz.com";
const featuredSeries = "building-worlds-no-1-cleaning-show-from-scratch";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
  searchParams?: SearchParams;
};

export async function generateMetadata({
  searchParams
}: PageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const guides = getGuideInsights(getInsights());
  const { currentPage: page } = paginateDirectoryItems(
    guides,
    parseDirectoryPage(resolvedSearchParams.page)
  );
  const canonical = directoryHref("/guides", page);

  return {
    title: page > 1 ? `Industry Guides – Page ${page}` : "Industry Guides",
    description:
      "World Clean Biz guides help buyers and industry professionals research brands, compare cleaning products, evaluate suppliers and understand market technologies.",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: "World Clean Biz Industry Guides",
      description:
        "Brand ownership, product comparisons, buying guides, sourcing research and technology explainers for the global cleaning industry.",
      type: "website",
      url: canonical,
      images: ["/images/industry/sourcing-product-components-2025.jpg"]
    },
    twitter: {
      card: "summary_large_image",
      title: "World Clean Biz Industry Guides",
      description:
        "Brand ownership, product comparisons, buying guides, sourcing research and technology explainers for the global cleaning industry.",
      images: ["/images/industry/sourcing-product-components-2025.jpg"]
    }
  };
}

export default async function GuidesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const allArticles = getInsights();
  const guides = getGuideInsights(allArticles).map(toDirectoryArticle);
  const {
    items: visibleGuides,
    currentPage,
    totalPages,
    pageStart
  } = paginateDirectoryItems(
    guides,
    parseDirectoryPage(resolvedSearchParams.page)
  );
  const pagination = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      page,
      href: directoryHref("/guides", page),
      current: page === currentPage
    };
  });
  const filters = [
    { label: "All Guides", href: "/guides", active: true },
    ...GUIDE_TYPE_CONFIG.map((guideType) => ({
      label: guideType.label,
      href: guideType.href,
      active: false
    }))
  ];
  const latestSeriesArticle = getLatestSeriesInsight(allArticles, featuredSeries);
  const currentPath = directoryHref("/guides", currentPage);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "World Clean Biz Industry Guides",
    numberOfItems: guides.length,
    itemListElement: visibleGuides.map((article, index) => ({
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
    name: "World Clean Biz Industry Guides",
    description:
      "Practical research for cleaning product, brand, sourcing and ownership decisions.",
    url: `${siteUrl}${currentPath}`,
    mainEntity: itemListSchema
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Industry Guides",
        item: `${siteUrl}${currentPath}`
      }
    ]
  };

  return (
    <>
      <ContentDirectory
        variant="guides"
        eyebrow="World Clean Biz Guides"
        title="Industry Guides"
        description="Research brand ownership, compare cleaning products, evaluate suppliers and understand the technologies shaping the market."
        totalLabel={`${guides.length} practical guides`}
        articles={visibleGuides}
        filters={filters}
        pagination={pagination}
        previousHref={
          currentPage > 1
            ? directoryHref("/guides", currentPage - 1)
            : undefined
        }
        nextHref={
          currentPage < totalPages
            ? directoryHref("/guides", currentPage + 1)
            : undefined
        }
        featuredSeriesArticle={
          currentPage === 1 && latestSeriesArticle
            ? toDirectoryArticle(latestSeriesArticle)
            : undefined
        }
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
          importantArticles: getFeaturedGuides(allArticles, 6).map(toDirectoryArticle),
          importantMeta: "readingTime"
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
    </>
  );
}
