import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { getInsights } from "@/lib/content";
import { GUIDE_TYPE_CONFIG } from "@/lib/guideTaxonomy";
import {
  getFeaturedGuides,
  getGuideInsights
} from "@/lib/insightCollections";

const siteUrl = "https://worldcleanbiz.com";

export const metadata: Metadata = {
  title: "Industry Guides",
  description:
    "World Clean Biz guides help buyers and industry professionals research brands, compare cleaning products, evaluate suppliers and understand market technologies.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "World Clean Biz Industry Guides",
    description:
      "Brand ownership, product comparisons, buying guides, sourcing research and technology explainers for the global cleaning industry.",
    type: "website",
    url: "/guides",
    images: ["/images/industry/sourcing-product-components-2025.jpg"]
  }
};

export default function GuidesPage() {
  const allArticles = getInsights();
  const guides = getGuideInsights(allArticles);
  const featuredGuides = getFeaturedGuides(allArticles, 6);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured World Clean Biz Industry Guides",
    itemListElement: featuredGuides.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: `${siteUrl}/blog/${article.slug}`
    }))
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/guides`,
    name: "World Clean Biz Industry Guides",
    description:
      "Practical research for cleaning product, brand, sourcing and ownership decisions.",
    url: `${siteUrl}/guides`,
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
      }
    ]
  };

  return (
    <div className="guides-hub">
      <section className="guides-hero">
        <div className="insights-page-container guides-hero-grid">
          <div>
            <p className="eyebrow">World Clean Biz Guides</p>
            <h1>Industry Guides For Better Product, Brand And Sourcing Decisions.</h1>
            <p>
              Research brand ownership, compare cleaning products, evaluate
              suppliers and understand the technologies shaping the market.
            </p>
          </div>
          <div className="guides-hero-stat">
            <strong>{guides.length}</strong>
            <span>Practical guides across six decision areas</span>
            <Link href="/blog">Read Industry Analysis</Link>
          </div>
        </div>
      </section>

      <section className="section guides-featured-section">
        <div className="insights-page-container">
          <div className="section-heading guides-section-heading">
            <p className="eyebrow">Featured Guides</p>
            <h2>Start With High-Value Buyer And Sourcing Research.</h2>
          </div>
          <div className="guides-featured-grid">
            {featuredGuides.map((article) => (
              <GuideCard article={article} key={article.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section guides-browse-section">
        <div className="insights-page-container">
          <div className="section-heading guides-section-heading">
            <p className="eyebrow">Browse By Decision</p>
            <h2>Find The Research That Matches Your Next Question.</h2>
          </div>
          <div className="guides-category-grid">
            {GUIDE_TYPE_CONFIG.map((guideType) => {
              const articles = getGuideInsights(allArticles, guideType.type).slice(
                0,
                4
              );

              return (
                <section className="guides-category-panel" key={guideType.type}>
                  <div className="guides-category-heading">
                    <span>{articles.length ? `${getGuideInsights(allArticles, guideType.type).length} guides` : "New guides"}</span>
                    <h2>{guideType.label}</h2>
                    <p>{guideType.description}</p>
                  </div>
                  <div className="guides-category-links">
                    {articles.map((article) => (
                      <Link href={`/blog/${article.slug}`} key={article.slug}>
                        {article.title}
                      </Link>
                    ))}
                  </div>
                  <Link className="guides-category-action" href={guideType.href}>
                    View {guideType.label} →
                  </Link>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section guides-editorial-return">
        <div className="insights-page-container guides-editorial-return-inner">
          <div>
            <p className="eyebrow">Analysis &amp; Insights</p>
            <h2>Looking For Original Industry Analysis?</h2>
            <p>
              Follow company strategy, market shifts and category signals in
              the World Clean Biz Blog.
            </p>
          </div>
          <Link className="button" href="/blog">
            Read Industry Analysis
          </Link>
        </div>
      </section>

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
