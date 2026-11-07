import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import "../../styles/categories.css";
import "../../styles/category-hub-v2.css";
import { TallyButton } from "@/components/LeadForms";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { responsiveImageProps } from "@/lib/articleImages";
import { getHubCategory, HUB_CATEGORIES, HUB_CATEGORY_GROUPS } from "@/lib/hubCategories";
import { getHubCategoryData } from "@/lib/hubCategoryContent";
import { getNewsVisual, isBorrowedNewsVisual, newsDate, newsTopicLabel } from "@/lib/news";
import { shortParentName } from "@/lib/brandProfileView";
import { hubListHrefs, hubSourcingHref, hubVisual } from "@/lib/hubPresentation";
import { productCover, productSelectionYear } from "@/lib/products";
import { buildWebsiteMetadata } from "@/lib/seo";
import { LogoTileImage } from "@/components/ui/LogoTileImage";
import { brandLogoTile } from "@/lib/brandLogoTiles";

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


/** A company logo tile as a thumbnail; light logos are darkened so they show on white. */
function logoThumb(brandSlugs: string[]) {
  const tile = brandSlugs.map((slug) => brandLogoTile(slug)).find(Boolean);
  return tile ? { src: tile.src, contain: true, logo: true, light: Boolean(tile.light) } : undefined;
}

export default async function CategoryHubPage({ params }: Props) {
  const hub = getHubCategory((await params).slug);
  if (!hub) notFound();
  const data = getHubCategoryData(hub);
  const groupLabel = HUB_CATEGORY_GROUPS.find((group) => group.slug === hub.group)?.label;
  const pageUrl = `${siteUrl}/categories/${hub.slug}`;
  const visual = hubVisual(data);
  const lists = hubListHrefs(hub);
  const sourcing = hubSourcingHref(hub);

  // The category's front page, one module per row in a fixed order: news,
  // analysis, new models, companies, sourcing, then guides and the email band.
  // A module with nothing to show is left out.
  const news = data.news.slice(0, 6);
  const analysisPool = [...data.analysis, ...data.essential].filter(
    (article, index, all) => article.coverImage && article.coverImage !== visual?.src && all.findIndex((other) => other.slug === article.slug) === index
  );
  // Search-data picks (data.essential) lead when they exist, then the newest analysis.
  const picked = data.essential.filter((article) => article.coverImage && article.coverImage !== visual?.src);
  const analysis = [...picked, ...analysisPool].filter((article, index, all) => all.findIndex((other) => other.slug === article.slug) === index).slice(0, 4);
  const [leadAnalysis, ...moreAnalysis] = analysis;
  const models = data.newModels.slice(0, 4);
  const companies = data.companies.slice(0, 12);
  const guides = data.guides.slice(0, 5);

  const quickLinks = [
    news.length ? { label: "News", href: "#hub-news" } : null,
    analysis.length ? { label: "Analysis", href: "#hub-analysis" } : null,
    models.length ? { label: `${productSelectionYear} models`, href: "#hub-models" } : null,
    companies.length ? { label: "Companies", href: "#hub-companies" } : null,
    sourcing ? { label: "Sourcing", href: "#hub-sourcing" } : null
  ].filter((item): item is { label: string; href: string } => Boolean(item));

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
        itemListElement: data.feed.slice(0, 8).map((item, index) => ({
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
    <div className="hub-page ch" style={{ "--hub-color": hub.color } as CSSProperties}>
      <section className="ch-hero">
        <div className="hub-color-bar" aria-hidden="true" />
        <div className="hub-container ch-hero-grid">
          <div className="ch-hero-copy">
            <nav className="hub-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link> / <Link href="/categories">Categories</Link> / <span aria-current="page">{hub.name}</span>
            </nav>
            <p className="hub-eyebrow"><span className="hub-dot" aria-hidden="true" />{groupLabel}</p>
            <div className="hub-title-row">
              <CategoryIcon slug={hub.slug} color={hub.color} size="lg" />
              <h1>{hub.name}</h1>
            </div>
            <p className="hub-intro">{hub.intro}</p>
            {quickLinks.length ? (
              <nav className="ch-quick" aria-label={`${hub.name} sections`}>
                {quickLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
              </nav>
            ) : null}
          </div>
          {visual ? (
            <figure className={`ch-hero-visual ch-hero-visual--${visual.kind}`}>
              {visual.kind === "photo" ? <img src={visual.src} alt="" width={1600} height={1000} loading="eager" decoding="async" fetchPriority="high" /> : <img src={visual.src} alt="" width={1536} height={1024} loading="eager" decoding="async" />}
              {visual.credit ? <figcaption>Photo: {visual.credit}</figcaption> : null}
            </figure>
          ) : null}
        </div>
      </section>

      <div className="hub-container ch-body">
        {news.length ? (
          <section className="ch-section" id="hub-news" aria-labelledby="hub-news-heading">
            <div className="ch-head">
              <h2 id="hub-news-heading">Industry news</h2>
              <Link className="wcb-more" href={lists.news}>All {hub.name.toLowerCase()} news</Link>
            </div>
            <ul className="ch-news">
              {news.map((item) => {
                const newsVisual = getNewsVisual(item);
                const thumb = newsVisual && !isBorrowedNewsVisual(newsVisual)
                  ? { src: newsVisual.src, contain: newsVisual.fit === "contain" }
                  // Without a story image, the company's logo tells the reader whose news it is.
                  : logoThumb(item.brandSlugs);
                return (
                  <li key={item.slug}>
                    <span className={`ch-thumb${thumb?.contain ? " ch-thumb--contain" : ""}${thumb && "logo" in thumb ? " ch-thumb--logo" : ""}${thumb && "light" in thumb && thumb.light ? " ch-thumb--light" : ""}`} aria-hidden="true">
                      {thumb ? <img src={thumb.src} alt="" loading="lazy" decoding="async" /> : <CategoryIcon slug={hub.slug} color={hub.color} size="sm" />}
                    </span>
                    <span>
                      <span className="ch-meta">{newsTopicLabel(item.topic)} · <time dateTime={item.eventDate}>{newsDate(item.eventDate)}</time></span>
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {leadAnalysis ? (
          <section className="ch-section" id="hub-analysis" aria-labelledby="hub-analysis-heading">
            <div className="ch-head">
              <h2 id="hub-analysis-heading">Analysis</h2>
              <Link className="wcb-more" href={lists.analysis}>All {hub.name.toLowerCase()} analysis</Link>
            </div>
            <div className={`ch-analysis${moreAnalysis.length ? "" : " ch-analysis--single"}`}>
              <Link className="ch-analysis-lead" href={`/blog/${leadAnalysis.slug}`}>
                <span className="ch-lead-image"><img {...responsiveImageProps(leadAnalysis.coverImage!, "card")} alt="" /></span>
                <span className="ch-meta">{leadAnalysis.category} · <time dateTime={leadAnalysis.sortDate || leadAnalysis.date}>{newsDate(leadAnalysis.sortDate || leadAnalysis.date)}</time></span>
                <b>{leadAnalysis.title}</b>
                {leadAnalysis.excerpt ? <span className="ch-excerpt">{leadAnalysis.excerpt}</span> : null}
              </Link>
              {moreAnalysis.length ? (
                <ul className="ch-analysis-more">
                  {moreAnalysis.map((article) => (
                    <li key={article.slug}>
                      <Link href={`/blog/${article.slug}`}>
                        <span className="ch-thumb" aria-hidden="true"><img {...responsiveImageProps(article.coverImage!, "card")} alt="" /></span>
                        <span>
                          <span className="ch-meta">{article.category}</span>
                          <b>{article.title}</b>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ) : null}

        {models.length ? (
          <section className="ch-section" id="hub-models" aria-labelledby="hub-models-heading">
            <div className="ch-head">
              <h2 id="hub-models-heading">New {productSelectionYear} models</h2>
              <Link className="wcb-more" href={lists.products}>All {data.newModels.length} {hub.name.toLowerCase()} models</Link>
            </div>
            <div className="ch-grid4">
              {models.map((model) => (
                <Link key={model.slug} className="ch-model" href={`/products/${model.slug}`}>
                  <span className="ch-model-image"><img {...responsiveImageProps(productCover(model.slug), "card")} alt={model.name} /></span>
                  <span className="ch-model-copy">
                    <small>{model.brand}</small>
                    <b>{model.name}</b>
                    {model.facts.length ? (
                      <span className="ch-model-facts">
                        {model.facts.slice(0, 2).map((fact) => <span key={fact.label}><i>{fact.label}</i>{fact.value}</span>)}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {companies.length ? (
          <section className="ch-section" id="hub-companies" aria-labelledby="hub-companies-heading">
            <div className="ch-head">
              <h2 id="hub-companies-heading">Companies</h2>
              <Link className="wcb-more" href={lists.companies}>All {hub.name.toLowerCase()} companies</Link>
            </div>
            <div className="ch-companies">
              {companies.map((brand) => {
                const parent = shortParentName(brand.ownership.parentCompany);
                return (
                  <Link key={brand.slug} href={`/brands/${brand.slug}`}>
                    <span className="ch-company-logo" aria-hidden="true">
                      <LogoTileImage slug={brand.slug} fallbackSrc={brand.logoImage} boxRatio={2.2} />
                    </span>
                    <span className="ch-company-text">
                      <span className="ch-company-name">{brand.name}</span>
                      {parent && parent !== brand.name ? <span className="ch-company-owner">Part of {parent}</span> : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {sourcing ? (
          <section className="ch-section" id="hub-sourcing" aria-label={`Sourcing ${hub.name.toLowerCase()}`}>
            <Link className="ch-sourcing" href={sourcing}>
              <span>
                <b>Sourcing {hub.name.toLowerCase()}?</b>
                <span>Product platforms, channels and supplier checks for this category.</span>
              </span>
              <i>Category sourcing</i>
            </Link>
          </section>
        ) : null}

        {guides.length ? (
          <section className="ch-section ch-guides" id="hub-guides" aria-labelledby="hub-guides-heading">
            <div className="ch-head">
              <h2 id="hub-guides-heading">Practical guides</h2>
              <Link className="wcb-more" href="/guides">All guides</Link>
            </div>
            <ul>
              {guides.map((guide) => (
                <li key={guide.slug}><Link href={`/blog/${guide.slug}`}>{guide.title}</Link></li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="ch-subscribe" aria-labelledby="hub-subscribe-heading">
          <div>
            <h2 id="hub-subscribe-heading">{hub.name}, by email</h2>
            <p>New models, company moves and analysis from World Clean Biz.</p>
          </div>
          <TallyButton className="hub-subscribe-button" ctaLocation={`category_hub_sidebar_${hub.slug}`} form="newsletter">
            Subscribe
          </TallyButton>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
    </div>
  );
}
