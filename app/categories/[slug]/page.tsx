import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import "../../styles/categories.css";
import { TallyButton } from "@/components/LeadForms";
import { responsiveImageProps } from "@/lib/articleImages";
import { getHubCategory, HUB_CATEGORIES, HUB_CATEGORY_GROUPS } from "@/lib/hubCategories";
import { getHubCategoryData, type HubFeedItem } from "@/lib/hubCategoryContent";
import { newsDate, newsTopicLabel } from "@/lib/news";
import { productCover, productSelectionYear } from "@/lib/products";
import { buildWebsiteMetadata } from "@/lib/seo";

const siteUrl = "https://worldcleanbiz.com";
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HUB_CATEGORIES.map((hub) => ({ slug: hub.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hub = getHubCategory((await params).slug);
  if (!hub) return {};
  return buildWebsiteMetadata({
    title: `${hub.name}: News, Companies & New Models | World Clean Biz`,
    description: hub.intro,
    canonical: `/categories/${hub.slug}`
  });
}

function feedDate(item: HubFeedItem) {
  return newsDate(item.date);
}

export default async function CategoryHubPage({ params }: Props) {
  const hub = getHubCategory((await params).slug);
  if (!hub) notFound();
  const data = getHubCategoryData(hub);
  const groupLabel = HUB_CATEGORY_GROUPS.find((group) => group.slug === hub.group)?.label;
  const pageUrl = `${siteUrl}/categories/${hub.slug}`;

  const metrics = [
    data.newModels.length > 0 && {
      value: data.newModels.length,
      label: `New ${productSelectionYear} models with specifications`,
      source: "Product library",
      href: "#hub-models"
    },
    data.companies.length > 0 && {
      value: data.companies.length,
      label: "Company profiles with ownership and history",
      source: "Company profiles",
      href: "#hub-companies"
    },
    data.feed.length > 0 && {
      value: data.feed.length,
      label: "News stories and analysis articles",
      source: "World Clean Biz coverage",
      href: "#hub-latest"
    }
  ].filter(Boolean) as { value: number; label: string; source: string; href: string }[];

  const latest = data.feed.slice(0, 8);
  const models = data.newModels.slice(0, 4);
  const essential = data.essential.slice(0, 4);
  const companies = data.companies.slice(0, 10);
  const guides = [...data.guides].sort((a, b) => b.guidePriority - a.guidePriority).slice(0, 4);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": pageUrl,
      name: hub.name,
      description: hub.intro,
      url: pageUrl,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: latest.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.kind === "news" ? item.news.title : item.article.title,
          url: `${siteUrl}${item.kind === "news" ? `/news/${item.news.slug}` : `/blog/${item.article.slug}`}`
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Categories", item: `${siteUrl}/categories` },
        { "@type": "ListItem", position: 3, name: hub.name, item: pageUrl }
      ]
    }
  ];

  return (
    <div className="hub-page" style={{ "--hub-color": hub.color } as CSSProperties}>
      <section className="hub-hero">
        <div className="hub-color-bar" aria-hidden="true" />
        <div className="hub-container">
          <nav className="hub-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/categories">Categories</Link> / <span aria-current="page">{hub.name}</span>
          </nav>
          <div className="hub-hero-row">
            <div className="hub-hero-copy">
              <p className="hub-eyebrow"><span className="hub-dot" aria-hidden="true" />{groupLabel}</p>
              <h1>{hub.name}</h1>
              <p className="hub-intro">{hub.intro}</p>
            </div>
            <TallyButton className="hub-follow" ctaLocation={`category_hub_follow_${hub.slug}`} form="newsletter">
              Follow by email
            </TallyButton>
          </div>
          {metrics.length > 0 ? (
            <div className="hub-metrics">
              {metrics.map((metric) => (
                <a key={metric.source} className="hub-metric" href={metric.href}>
                  <span className="hub-metric-value">{metric.value}</span>
                  <span className="hub-metric-label">{metric.label}</span>
                  <span className="hub-metric-source">{metric.source}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div className="hub-container hub-body">
        <div className="hub-main">
          {latest.length > 0 ? (
            <section id="hub-latest" aria-labelledby="hub-latest-heading">
              <h2 id="hub-latest-heading">Latest</h2>
              <ul className="hub-feed">
                {latest.map((item) => {
                  const href = item.kind === "news" ? `/news/${item.news.slug}` : `/blog/${item.article.slug}`;
                  const title = item.kind === "news" ? item.news.title : item.article.title;
                  const excerpt = item.kind === "news" ? item.news.excerpt : item.article.excerpt;
                  const label = item.kind === "news" ? `News · ${newsTopicLabel(item.news.topic)}` : `Analysis · ${item.article.category}`;
                  return (
                    <li key={href}>
                      <p className="hub-feed-meta">{label} · <time dateTime={item.date}>{feedDate(item)}</time></p>
                      <h3><Link href={href}>{title}</Link></h3>
                      <p className="hub-feed-excerpt">{excerpt}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="hub-more">
                {data.news.length > 0 ? <Link href="/news">All news →</Link> : null}
                {data.analysis.length > 0 ? <Link href="/blog/archive">All analysis →</Link> : null}
              </p>
            </section>
          ) : null}

          {models.length > 0 ? (
            <section id="hub-models" aria-labelledby="hub-models-heading">
              <div className="hub-section-head">
                <h2 id="hub-models-heading">New {productSelectionYear} models</h2>
                <Link href="/products">All {data.newModels.length} models →</Link>
              </div>
              <div className="hub-models">
                {models.map((model) => (
                  <Link key={model.slug} className="hub-model" href={`/products/${model.slug}`}>
                    <span className="hub-model-image">
                      <img {...responsiveImageProps(productCover(model.slug), "card")} alt={model.name} />
                    </span>
                    <span className="hub-model-brand">{model.brand}</span>
                    <span className="hub-model-name">{model.name}</span>
                    <span className="hub-model-summary">{model.summary}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {essential.length > 0 ? (
            <section aria-labelledby="hub-essential-heading">
              <h2 id="hub-essential-heading">Essential reading</h2>
              <ol className="hub-essential">
                {essential.map((article) => (
                  <li key={article.slug}>
                    <span className="hub-essential-meta">{article.category}</span>
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <aside className="hub-aside">
          {companies.length > 0 ? (
            <section id="hub-companies" aria-labelledby="hub-companies-heading">
              <h2 id="hub-companies-heading">Key companies</h2>
              <div className="hub-companies">
                {companies.map((brand) => (
                  <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}</Link>
                ))}
              </div>
              {data.companies.length > companies.length ? (
                <p className="hub-more"><Link href="/brands">All company profiles →</Link></p>
              ) : null}
            </section>
          ) : null}

          {guides.length > 0 ? (
            <section aria-labelledby="hub-guides-heading">
              <h2 id="hub-guides-heading">Guides</h2>
              <ul className="hub-guides">
                {guides.map((guide) => (
                  <li key={guide.slug}><Link href={`/blog/${guide.slug}`}>{guide.title}</Link></li>
                ))}
                <li><Link href="/guides">All guides →</Link></li>
              </ul>
            </section>
          ) : null}

          <section className="hub-subscribe" aria-labelledby="hub-subscribe-heading">
            <h2 id="hub-subscribe-heading">{hub.name}, by email</h2>
            <p>Industry updates from World Clean Biz.</p>
            <TallyButton className="hub-subscribe-button" ctaLocation={`category_hub_sidebar_${hub.slug}`} form="newsletter">
              Subscribe
            </TallyButton>
          </section>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
    </div>
  );
}
