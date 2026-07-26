import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/GuideCard";
import { getInsights } from "@/lib/content";
import {
  GUIDE_TYPE_CONFIG,
  isGuideType
} from "@/lib/guideTaxonomy";
import { getGuideInsights } from "@/lib/insightCollections";

const siteUrl = "https://worldcleanbiz.com";

type PageProps = {
  params: Promise<{ type: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_TYPE_CONFIG.map(({ type }) => ({ type }));
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { type } = await params;
  const config = GUIDE_TYPE_CONFIG.find((item) => item.type === type);

  if (!config) return {};

  return {
    title: config.label,
    description: config.description,
    alternates: { canonical: config.href },
    openGraph: {
      title: `${config.label} | World Clean Biz`,
      description: config.description,
      type: "website",
      url: config.href
    }
  };
}

export default async function GuideTypePage({ params }: PageProps) {
  const { type } = await params;
  if (!isGuideType(type)) notFound();

  const config = GUIDE_TYPE_CONFIG.find((item) => item.type === type);
  if (!config) notFound();

  const articles = getGuideInsights(getInsights(), type);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.label} from World Clean Biz`,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: `${siteUrl}/blog/${article.slug}`
    }))
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
    <div className="guides-hub guide-category-page">
      <section className="guides-category-hero">
        <div className="insights-page-container">
          <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/guides">Industry Guides</Link>
            <span>/</span>
            <span>{config.label}</span>
          </nav>
          <p className="eyebrow">World Clean Biz Guides</p>
          <h1>{config.label}</h1>
          <p>{config.description}</p>
          <strong>{articles.length} published guides</strong>
        </div>
      </section>

      <section className="section">
        <div className="insights-page-container">
          <div className="guide-category-list">
            {articles.map((article) => (
              <GuideCard article={article} key={article.slug} />
            ))}
          </div>
          <div className="guide-category-footer">
            <Link href="/guides">Explore All Industry Guides</Link>
            <Link href="/blog">Read Industry Analysis</Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([itemListSchema, breadcrumbSchema])
        }}
      />
    </div>
  );
}
