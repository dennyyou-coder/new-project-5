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
import { getNewsVisual, isBorrowedNewsVisual, newsDate } from "@/lib/news";
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

  // The category's front page: one lead analysis, the latest news, then a few
  // picks from each list with a link to the full list narrowed to this category.
  const lead = data.analysis.find((article) => article.coverImage && article.coverImage !== visual?.src);
  const latest = data.feed.filter((item) => item.kind === "news" || item.article.slug !== lead?.slug).slice(0, 4);
  const essentialPool = [...data.essential, ...data.analysis].filter(
    (article, index, all) => article.coverImage && article.coverImage !== visual?.src && article.slug !== lead?.slug && all.findIndex((other) => other.slug === article.slug) === index
  );
  const essential = essentialPool.slice(0, 4);
  const companies = data.companies.slice(0, 12);
  const showMoreModels = data.newModels.length > 4;
  const models = data.newModels.slice(0, showMoreModels ? 3 : 4);
  const guides = data.guides.slice(0, 3);

  const quickLinks = [
    data.news.length ? { label: "News", href: lists.news } : null,
    data.analysis.length ? { label: "Analysis", href: lists.analysis } : null,
    data.newModels.length ? { label: `${productSelectionYear} models`, href: lists.products } : null,
    companies.length ? { label: "Companies", href: "#hub-companies" } : null,
    guides.length ? { label: "Buyer guides", href: "#hub-guides" } : null,
    sourcing ? { label: "Sourcing", href: sourcing } : null
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
            <div className="ch-quick">
              <nav aria-label={`${hub.name} sections`}>
                {quickLinks.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
              </nav>
              <TallyButton className="hub-follow" ctaLocation={`category_hub_follow_${hub.slug}`} form="newsletter">
                Follow by email
              </TallyButton>
            </div>
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
        {lead || latest.length ? (
          <section className="ch-top" aria-label={`Latest in ${hub.name}`}>
            {lead ? (
              <article className="ch-lead">
                <Link className="ch-lead-image" href={`/blog/${lead.slug}`} tabIndex={-1} aria-hidden="true">
                  <img {...responsiveImageProps(lead.coverImage!, "card")} alt="" loading="eager" />
                </Link>
                <p className="ch-meta">Analysis · {lead.category} · <time dateTime={lead.sortDate || lead.date}>{newsDate(lead.sortDate || lead.date)}</time></p>
                <h2><Link href={`/blog/${lead.slug}`}>{lead.title}</Link></h2>
                <p className="ch-excerpt">{lead.excerpt}</p>
              </article>
            ) : null}
            {latest.length ? (
              <div className="ch-latest" id="hub-latest">
                <div className="ch-head">
                  <h2>Latest</h2>
                  {data.news.length ? <Link className="wcb-more" href={lists.news}>All {hub.name.toLowerCase()} news</Link> : null}
                </div>
                <ul>
                  {latest.map((item) => {
                    const href = item.kind === "news" ? `/news/${item.news.slug}` : `/blog/${item.article.slug}`;
                    const title = item.kind === "news" ? item.news.title : item.article.title;
                    const newsVisual = item.kind === "news" ? getNewsVisual(item.news) : undefined;
                    const thumb = item.kind === "analysis"
                      ? item.article.coverImage ? { src: item.article.coverImage, contain: false } : undefined
                      : newsVisual && !isBorrowedNewsVisual(newsVisual)
                        ? { src: newsVisual.src, contain: newsVisual.fit === "contain" }
                        // Without a story image, the company's logo tells the reader whose news it is.
                        : logoThumb(item.news.brandSlugs);
                    return (
                      <li key={href}>
                        <span className={`ch-thumb${thumb?.contain ? " ch-thumb--contain" : ""}${thumb && "logo" in thumb ? " ch-thumb--logo" : ""}${thumb && "light" in thumb && thumb.light ? " ch-thumb--light" : ""}`} aria-hidden="true">
                          {thumb ? <img src={thumb.src} alt="" loading="lazy" decoding="async" /> : <CategoryIcon slug={hub.slug} color={hub.color} size="sm" />}
                        </span>
                        <span>
                          <span className="ch-meta">{item.kind === "news" ? "News" : "Analysis"} · <time dateTime={item.date}>{newsDate(item.date)}</time></span>
                          <Link href={href}>{title}</Link>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {companies.length ? (
          <section className="ch-section" id="hub-companies" aria-labelledby="hub-companies-heading">
            <div className="ch-head">
              <h2 id="hub-companies-heading">Companies in {hub.name.toLowerCase()}</h2>
              <Link className="wcb-more" href="/brands">All company profiles</Link>
            </div>
            <div className="ch-companies">
              {companies.map((brand) => (
                <Link key={brand.slug} href={`/brands/${brand.slug}`}>
                  <span className="ch-company-logo" aria-hidden="true">
                    <LogoTileImage slug={brand.slug} fallbackSrc={brand.logoImage} boxRatio={2.2} />
                  </span>
                  <span className="ch-company-name">{brand.name}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {models.length ? (
          <section className="ch-section" id="hub-models" aria-labelledby="hub-models-heading">
            <div className="ch-head">
              <h2 id="hub-models-heading">New {productSelectionYear} models</h2>
              <Link className="wcb-more" href={lists.products}>All {hub.name.toLowerCase()} models</Link>
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
              {showMoreModels ? (
                <Link className="ch-more" href={lists.products}>
                  <b className="wcb-more-label">See all {hub.name.toLowerCase()} models</b>
                  <span>Opens the product library filtered to {hub.name.toLowerCase()}</span>
                </Link>
              ) : null}
            </div>
          </section>
        ) : null}

        {essential.length ? (
          <section className="ch-section" aria-labelledby="hub-essential-heading">
            <div className="ch-head">
              <h2 id="hub-essential-heading">Essential reading</h2>
              <Link className="wcb-more" href={lists.analysis}>All {hub.name.toLowerCase()} analysis</Link>
            </div>
            <div className="ch-grid4">
              {essential.map((article) => (
                <Link key={article.slug} className="ch-card" href={`/blog/${article.slug}`}>
                  <span className="ch-card-image"><img {...responsiveImageProps(article.coverImage!, "card")} alt="" /></span>
                  <span className="ch-meta">{article.category}</span>
                  <b>{article.title}</b>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {guides.length || sourcing ? (
          <section className="ch-section ch-bottom" id="hub-guides" aria-label="Guides and sourcing">
            {guides.length ? (
              <div>
                <div className="ch-head">
                  <h2>Buyer guides</h2>
                  <Link className="wcb-more" href="/guides">All guides</Link>
                </div>
                <div className="ch-grid3">
                  {guides.map((guide) => (
                    <Link key={guide.slug} className="ch-card" href={`/blog/${guide.slug}`}>
                      {guide.coverImage ? <span className="ch-card-image"><img {...responsiveImageProps(guide.coverImage, "card")} alt="" /></span> : null}
                      <span className="ch-meta">{guide.category}</span>
                      <b>{guide.title}</b>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {sourcing ? (
              <Link className="ch-sourcing" href={sourcing}>
                <span>
                  <b>Sourcing {hub.name.toLowerCase()}?</b>
                  <span>Product platforms, channels and supplier checks for this category.</span>
                </span>
                <i>Category sourcing</i>
              </Link>
            ) : null}
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
