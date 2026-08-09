import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDirectory } from "@/components/ContentDirectory";
import { getInsights } from "@/lib/content";
import {
  directoryHref,
  paginateDirectoryItems,
  parseDirectoryPage
} from "@/lib/contentDirectory";
import {
  GUIDE_TYPE_CONFIG,
  isGuideType
} from "@/lib/guideTaxonomy";
import {
  getFeaturedGuides,
  getGuideInsights
} from "@/lib/insightCollections";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

const siteUrl = "https://worldcleanbiz.com";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams?: SearchParams;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_TYPE_CONFIG.map(({ type }) => ({ type }));
}

export async function generateMetadata({
  params
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { type } = await params;
  const config = GUIDE_TYPE_CONFIG.find((item) => item.type === type);
  if (!config) return {};

  return {
    title: config.label,
    description: config.description,
    alternates: { canonical: config.href },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${config.label} | World Clean Biz`,
      description: config.description,
      type: "website",
      url: config.href,
      images: [DEFAULT_SOCIAL_IMAGE]
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.label} | World Clean Biz`,
      description: config.description,
      images: [DEFAULT_SOCIAL_IMAGE]
    }
  };
}

export default async function GuideTypePage({
  params,
  searchParams
}: PageProps) {
  const { type } = await params;
  if (!isGuideType(type)) notFound();

  const config = GUIDE_TYPE_CONFIG.find((item) => item.type === type);
  if (!config) notFound();

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const allArticles = getInsights();
  const articles = getGuideInsights(allArticles, type);
  const {
    items: visibleGuides,
    currentPage,
    totalPages,
    pageStart
  } = paginateDirectoryItems(
    articles,
    parseDirectoryPage(resolvedSearchParams.page)
  );
  const pagination = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      page,
      href: directoryHref(config.href, page),
      current: page === currentPage
    };
  });
  const filters = [
    { label: "All Guides", href: "/guides", active: false },
    ...GUIDE_TYPE_CONFIG.map((guideType) => ({
      label: guideType.label,
      href: guideType.href,
      active: guideType.type === type
    }))
  ];
  const featuredGuides = getFeaturedGuides(allArticles, 6);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.label} from World Clean Biz`,
    numberOfItems: articles.length,
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
    "@id": `${siteUrl}${config.href}`,
    name: `${config.label} | World Clean Biz`,
    description: config.description,
    url: `${siteUrl}${config.href}`,
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
        item: `${siteUrl}/guides`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: config.label,
        item: `${siteUrl}${config.href}`
      }
    ]
  };

  return (
    <>
      <ContentDirectory
        variant="guides"
        eyebrow="World Clean Biz Guides"
        title={config.label}
        description={config.description}
        totalLabel={`${articles.length} published guides`}
        articles={visibleGuides}
        filters={filters}
        pagination={pagination}
        previousHref={
          currentPage > 1
            ? directoryHref(config.href, currentPage - 1)
            : undefined
        }
        nextHref={
          currentPage < totalPages
            ? directoryHref(config.href, currentPage + 1)
            : undefined
        }
        sidebar={{
          mode: "guides",
          navigationTitle: "Guide Categories",
          navigationLinks: [
            { label: "All Industry Guides", href: "/guides", active: false },
            ...GUIDE_TYPE_CONFIG.map((guideType) => ({
              label: guideType.label,
              href: guideType.href,
              active: guideType.type === type
            }))
          ],
          importantTitle: "Essential Guides",
          importantArticles: featuredGuides,
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
