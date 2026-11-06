import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import "../styles/categories.css";
import "../styles/category-hub-v2.css";
import { HUB_CATEGORY_GROUPS } from "@/lib/hubCategories";
import { getAllHubCategoryData } from "@/lib/hubCategoryContent";
import { hubVisual } from "@/lib/hubPresentation";
import { buildWebsiteMetadata } from "@/lib/seo";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const siteUrl = "https://worldcleanbiz.com";

export const metadata: Metadata = buildWebsiteMetadata({
  title: "Cleaning Industry Categories | World Clean Biz",
  description:
    "Browse World Clean Biz by category: robot vacuums, vacuum cleaners, floor washers, pool robots, robotic mowers, commercial cleaning and adjacent industries.",
  canonical: "/categories"
});

export default function CategoriesPage() {
  const hubs = getAllHubCategoryData();
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteUrl}/categories`,
      name: "Categories",
      url: `${siteUrl}/categories`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: hubs.map((data, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: data.hub.name,
          url: `${siteUrl}/categories/${data.hub.slug}`
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Categories", item: `${siteUrl}/categories` }
      ]
    }
  ];

  return (
    <div className="hub-page">
      <section className="hub-hero">
        <div className="hub-container">
          <nav className="hub-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span aria-current="page">Categories</span>
          </nav>
          <h1>Categories</h1>
          <p className="hub-intro">News, analysis, companies and new models, grouped by the part of the cleaning industry they cover.</p>
        </div>
      </section>
      <div className="hub-container hub-overview">
        {HUB_CATEGORY_GROUPS.map((group) => (
          <section key={group.slug} aria-labelledby={`hub-group-${group.slug}`}>
            <h2 id={`hub-group-${group.slug}`}>{group.label}</h2>
            <div className="hub-cards">
              {hubs.filter((data) => data.hub.group === group.slug).map((data) => {
                const latest = data.feed[0];
                const visual = hubVisual(data);
                return (
                  <article key={data.hub.slug} className="hub-card ch-hubcard" style={{ "--hub-color": data.hub.color } as CSSProperties}>
                    {visual ? (
                      <Link className={`ch-hubcard-image ch-hubcard-image--${visual.kind}`} href={`/categories/${data.hub.slug}`} tabIndex={-1} aria-hidden="true">
                        <img src={visual.src} alt="" loading="lazy" decoding="async" />
                      </Link>
                    ) : null}
                    <div className="hub-card-title">
                      <CategoryIcon slug={data.hub.slug} color={data.hub.color} />
                      <h3><Link href={`/categories/${data.hub.slug}`}>{data.hub.name}</Link></h3>
                    </div>
                    <p className="hub-card-intro">{data.hub.intro}</p>
                    {latest ? (
                      <p className="hub-card-latest">
                        <span>Latest</span>
                        <Link href={latest.kind === "news" ? `/news/${latest.news.slug}` : `/blog/${latest.article.slug}`}>
                          {latest.kind === "news" ? latest.news.title : latest.article.title}
                        </Link>
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
    </div>
  );
}
