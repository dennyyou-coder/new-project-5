import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import "./styles/home.css";
import "./styles/approved-home.css";
import "./styles/home-b.css";
import { HomeSearch, type HomeSearchEntry } from "@/components/HomeSearch";
import { HomeSeriesFeature } from "@/components/HomeSeriesFeature";
import { HomeVideos } from "@/components/HomeVideos";
import { TallyButton } from "@/components/LeadForms";
import { responsiveImageProps } from "@/lib/articleImages";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights, type Insight } from "@/lib/content";
import { getHubCategory, HUB_CATEGORIES, hubCategoriesForNews, type HubCategorySlug } from "@/lib/hubCategories";
import { getAllHubCategoryData } from "@/lib/hubCategoryContent";
import {
  getEditorialInsights,
  getFeaturedGuides,
  getGuideInsights,
  getLatestSeriesInsight
} from "@/lib/insightCollections";
import { getNews, newsDate, newsHref, newsTopicLabel } from "@/lib/news";
import { featuredProductModels, productCover, productSelectionYear } from "@/lib/products";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const founderSeries = "building-worlds-no-1-cleaning-show-from-scratch";
const supplyCategories = new Set(["Supply Chain", "Supply Chain Analysis"]);
const supplyTags = new Set(["manufacturing", "oem", "odm", "supply chain", "china supply chain", "components"]);
const resultsPattern = /\b(revenue|results|profit|sales|earnings)\b/i;

function hubOf(slugs: HubCategorySlug[]) {
  return slugs.length ? getHubCategory(slugs[0]) : undefined;
}

function HubDot({ slugs }: { slugs: HubCategorySlug[] }) {
  const hub = hubOf(slugs);
  if (!hub) return null;
  return (
    <span className="home-b-hub">
      <span className="home-b-dot" style={{ background: hub.color }} aria-hidden="true" />
      {hub.name}
    </span>
  );
}

function isSupplyChain(article: Insight) {
  return (
    supplyCategories.has(article.category) ||
    article.tags.some((tag) => supplyTags.has(String(tag).toLowerCase()))
  );
}

export default function HomePage() {
  const articles = getInsights();
  const editorial = getEditorialInsights(articles).filter((article) => article.series !== founderSeries);
  const guides = getGuideInsights(articles);
  const news = getNews();
  const brands = getPublishedBrandProfiles(articles);
  const hubs = getAllHubCategoryData();
  const latestFounderSeries = getLatestSeriesInsight(articles, founderSeries);

  const counts = [
    { value: news.length, label: "news stories", href: "/news" },
    { value: getEditorialInsights(articles).length, label: "analyses", href: "/blog/archive" },
    { value: brands.length, label: "company profiles", href: "/brands" },
    { value: featuredProductModels.length, label: `new ${productSelectionYear} models`, href: "/products" },
    { value: guides.length, label: "practical guides", href: "/guides" }
  ];

  const lead = editorial.find((article) => article.coverImage && !article.seriesTitle);
  const weekNews = news.slice(0, 7);

  // One newest model from each product category.
  const newModels = [...featuredProductModels]
    .sort((a, b) => String(b.announced ?? "").localeCompare(String(a.announced ?? "")))
    .filter((model, index, all) => all.findIndex((other) => other.category === model.category) === index)
    .slice(0, 6);

  const supply = editorial.filter(isSupplyChain).slice(0, 4);

  const articleCount = new Map<string, number>();
  for (const article of articles) {
    for (const slug of new Set([...article.primaryBrands, ...article.relatedBrands])) {
      articleCount.set(slug, (articleCount.get(slug) ?? 0) + 1);
    }
  }
  const byCoverage = [...brands].sort(
    (a, b) => (articleCount.get(b.slug) ?? 0) - (articleCount.get(a.slug) ?? 0) || a.name.localeCompare(b.name)
  );
  const topCompanies = byCoverage.slice(0, 12);
  const ownership = byCoverage
    .filter((brand) => brand.ownership.parentCompany && brand.ownership.parentCompany !== brand.name)
    .slice(0, 3);

  const results = news.filter((item) => item.category === "Financial Results" || resultsPattern.test(item.title)).slice(0, 4);
  const policy = news.filter((item) => item.topic === "policy-standards").slice(0, 3);
  const events = news.filter((item) => item.topic === "events").slice(0, 2);
  const professionalGuides = getFeaturedGuides(articles, 3);

  const searchEntries: HomeSearchEntry[] = [
    ...HUB_CATEGORIES.map((hub) => ({ label: hub.name, kind: "Category", href: `/categories/${hub.slug}`, terms: hub.name.toLowerCase() })),
    ...brands.map((brand) => ({
      label: brand.name,
      kind: "Company",
      href: `/brands/${brand.slug}`,
      terms: [brand.name, ...brand.aliases].join(" ").toLowerCase()
    })),
    ...featuredProductModels.map((model) => ({
      label: model.name,
      kind: `Product · ${model.category}`,
      href: `/products/${model.slug}`,
      terms: `${model.name} ${model.brand} ${model.category}`.toLowerCase()
    }))
  ];

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://worldcleanbiz.com/#organization",
      name: "World Clean Biz",
      url: "https://worldcleanbiz.com",
      logo: "https://worldcleanbiz.com/brand/wcb-favicon-512.png",
      founder: {
        "@type": "Person",
        name: "Denny You",
        url: "https://worldcleanbiz.com/about"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://worldcleanbiz.com/#website",
      name: "World Clean Biz",
      url: "https://worldcleanbiz.com",
      publisher: { "@id": "https://worldcleanbiz.com/#organization" }
    }
  ];

  return (
    <div className="home-b">
      <section className="home-b-hero" aria-labelledby="home-title">
        <div className="home-b-container">
          <h1 id="home-title">The global cleaning industry, in one place.</h1>
          <p className="home-b-lead">
            News, new products, companies, supply chains, markets and events across floor care, pool, lawn and commercial cleaning.
          </p>
          <HomeSearch entries={searchEntries} />
          <ul className="home-b-counts" aria-label="What World Clean Biz covers">
            {counts.map((count) => (
              <li key={count.label}>
                <Link href={count.href}>
                  <strong>{count.value}</strong> {count.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-b-section" id="feed" aria-labelledby="home-feed-title">
        <div className="home-b-container">
          <div className="home-b-head">
            <h2 id="home-feed-title">Across the industry this week</h2>
            <Link href="/news">All news →</Link>
          </div>
          <div className="home-b-feed">
            {lead ? (
              <article className="home-b-lead-story">
                <Link className="home-b-lead-image" href={`/blog/${lead.slug}`} tabIndex={-1} aria-hidden="true">
                  <img {...responsiveImageProps(lead.coverImage!, "card")} alt="" loading="eager" decoding="async" />
                </Link>
                <p className="home-b-meta">Analysis · {lead.category}</p>
                <h3><Link href={`/blog/${lead.slug}`}>{lead.title}</Link></h3>
                <p className="home-b-excerpt">{lead.excerpt}</p>
                <p className="home-b-meta">{newsDate(lead.sortDate || lead.date)} · {lead.readingTime}</p>
              </article>
            ) : null}
            <ul className="home-b-stream">
              {weekNews.map((item) => (
                <li key={item.slug}>
                  <span className="home-b-type">{newsTopicLabel(item.topic)}</span>
                  <span className="home-b-stream-copy">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    <span className="home-b-meta">
                      <HubDot slugs={hubCategoriesForNews(item)} />
                      <time dateTime={item.eventDate}>{newsDate(item.eventDate)}</time>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-b-section home-b-soft" aria-labelledby="home-categories-title">
        <div className="home-b-container">
          <div className="home-b-head">
            <h2 id="home-categories-title">Browse by category</h2>
            <Link href="/categories">All categories →</Link>
          </div>
          <div className="home-b-categories">
            {hubs.map((data) => {
              const latest = data.feed[0];
              const fallback = data.newModels[0];
              return (
                <Link
                  key={data.hub.slug}
                  className="home-b-category"
                  href={`/categories/${data.hub.slug}`}
                  style={{ "--hub-color": data.hub.color } as CSSProperties}
                >
                  <span className="home-b-category-name">{data.hub.name}</span>
                  <span className="home-b-category-latest">
                    {latest
                      ? latest.kind === "news" ? latest.news.title : latest.article.title
                      : fallback ? `New: ${fallback.name}` : data.hub.intro}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {newModels.length > 0 ? (
        <section className="home-b-section" id="products" aria-labelledby="home-products-title">
          <div className="home-b-container">
            <div className="home-b-head">
              <h2 id="home-products-title">New products</h2>
              <Link href="/products">All {featuredProductModels.length} new {productSelectionYear} models →</Link>
            </div>
            <div className="home-b-products">
              {newModels.map((model) => (
                <Link key={model.slug} className="home-b-product" href={`/products/${model.slug}`}>
                  <span className="home-b-product-image">
                    <img {...responsiveImageProps(productCover(model.slug), "card")} alt={model.name} />
                  </span>
                  <span className="home-b-meta">{model.category}</span>
                  <span className="home-b-product-name">{model.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {supply.length > 0 ? (
        <section className="home-b-section home-b-soft" id="supply" aria-labelledby="home-supply-title">
          <div className="home-b-container">
            <div className="home-b-head">
              <h2 id="home-supply-title">Inside the supply chain</h2>
              <Link href="/blog/archive?category=Supply%20Chain">All supply chain stories →</Link>
            </div>
            <p className="home-b-sub">Factories, components and the companies behind the brands.</p>
            <div className="home-b-cards">
              {supply.map((article) => (
                <Link key={article.slug} className="home-b-card" href={`/blog/${article.slug}`}>
                  {article.coverImage ? (
                    <span className="home-b-card-image">
                      <img {...responsiveImageProps(article.coverImage, "card")} alt="" />
                    </span>
                  ) : null}
                  <span className="home-b-meta">{article.category} · {newsDate(article.sortDate || article.date)}</span>
                  <span className="home-b-card-title">{article.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-b-section" id="companies" aria-labelledby="home-companies-title">
        <div className="home-b-container home-b-companies-wrap">
          <div className="home-b-companies-main">
            <div className="home-b-head">
              <h2 id="home-companies-title">Companies</h2>
              <Link href="/brands">All {brands.length} profiles →</Link>
            </div>
            <div className="home-b-companies">
              {topCompanies.map((brand) => (
                <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}</Link>
              ))}
            </div>
          </div>
          {ownership.length > 0 ? (
            <div className="home-b-owners">
              <h3>Who owns what</h3>
              {ownership.map((brand) => (
                <Link key={brand.slug} href={`/brands/${brand.slug}`}>
                  <span className="home-b-owner-name">{brand.name}</span>
                  <span className="home-b-owner-parent">{brand.ownership.parentCompany}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="home-b-section home-b-soft" aria-label="Markets, policy and events">
        <div className="home-b-container home-b-columns">
          {results.length > 0 ? (
            <div id="markets">
              <div className="home-b-head">
                <h2>Markets</h2>
                <Link href="/markets">All results →</Link>
              </div>
              <ul className="home-b-list">
                {results.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    <span className="home-b-meta">{newsDate(item.eventDate)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {policy.length > 0 ? (
            <div id="policy">
              <div className="home-b-head">
                <h2>Policy and standards</h2>
                <Link href={newsHref("policy-standards")}>More →</Link>
              </div>
              <ul className="home-b-list">
                {policy.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    <span className="home-b-meta">{newsDate(item.eventDate)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div id="events">
            <div className="home-b-head">
              <h2>Events</h2>
              <Link href="/wcb-expo">WCB Expo →</Link>
            </div>
            <div className="home-b-event">
              <p className="home-b-event-date"><span>Nov</span>18–20</p>
              <div>
                <h3><Link href="/wcb-expo">WCB Expo 2026</Link></h3>
                <p className="home-b-meta">18–20 November 2026 · Suzhou Shishan Convention Center · Suzhou, China</p>
                <div className="home-b-event-actions">
                  <TallyButton className="home-b-text-button" ctaLocation="home_wce_exhibitor" form="wceExhibitor" inquiryIntent="exhibitor_interest">Exhibit / Partner</TallyButton>
                  <TallyButton className="home-b-text-button" ctaLocation="home_wce_visitor" form="wceVisitor" inquiryIntent="visitor_interest">Plan your visit</TallyButton>
                </div>
              </div>
            </div>
            {events.length > 0 ? (
              <ul className="home-b-list">
                {events.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    <span className="home-b-meta">{newsDate(item.eventDate)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      {professionalGuides.length > 0 ? (
        <section className="home-b-section" id="guides" aria-labelledby="home-guides-title">
          <div className="home-b-container">
            <div className="home-b-head">
              <h2 id="home-guides-title">Guides for professionals</h2>
              <Link href="/guides">All {guides.length} guides →</Link>
            </div>
            <div className="home-b-cards home-b-cards-3">
              {professionalGuides.map((guide) => (
                <Link key={guide.slug} className="home-b-card home-b-guide" href={`/blog/${guide.slug}`}>
                  <span className="home-b-meta">{guide.category} · {guide.readingTime}</span>
                  <span className="home-b-card-title">{guide.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {latestFounderSeries ? (
        <section className="home-b-section home-b-soft glacier-journal" id="founder-journal" aria-label="Denny You's founder journal">
          <div className="home-b-container">
            <HomeSeriesFeature article={latestFounderSeries} />
          </div>
        </section>
      ) : null}

      <HomeVideos />

      <section className="home-b-subscribe" id="subscribe" aria-labelledby="home-subscribe-title">
        <div className="home-b-container home-b-subscribe-inner">
          <div>
            <h2 id="home-subscribe-title">The whole industry, in your inbox</h2>
            <p>New products, company moves, supply chain and policy, for cleaning professionals.</p>
          </div>
          <TallyButton className="home-b-subscribe-button" ctaLocation="home_subscribe_band" form="newsletter">
            Subscribe
          </TallyButton>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
    </div>
  );
}
