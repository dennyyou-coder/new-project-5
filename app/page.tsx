import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import "./styles/home.css";
import "./styles/approved-home.css";
import "./styles/home-b.css";
import { HomeSearch, type HomeSearchEntry } from "@/components/HomeSearch";
import { HomeSeriesFeature } from "@/components/HomeSeriesFeature";
import { HomeVideos } from "@/components/HomeVideos";
import { Icon } from "@/components/Icon";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CompanyMark } from "@/components/ui/CompanyMark";
import { FigureChip } from "@/components/ui/FigureChip";
import { buildBrandMarkIndex, resolveBrandMark } from "@/lib/brandMarks";
import { findParentProfile, shortParentName } from "@/lib/brandProfileView";
import { TallyButton } from "@/components/LeadForms";
import { responsiveImageProps } from "@/lib/articleImages";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import { getHubCategory, HUB_CATEGORIES, hubCategoriesForNews, type HubCategorySlug } from "@/lib/hubCategories";
import { getAllHubCategoryData } from "@/lib/hubCategoryContent";
import {
  getEditorialInsights,
  getFeaturedGuides,
  getGuideInsights,
  getLatestSeriesInsight
} from "@/lib/insightCollections";
import { getNews, getNewsVisual, isBorrowedNewsVisual, newsDate, newsHref, newsTopicLabel } from "@/lib/news";
import { EXPO_2026, isExpoUpcoming, pickFeaturedAnalysis } from "@/lib/hubPresentation";
import type { IconName } from "@/components/Icon";
import { featuredProductModels, productCover, productSelectionYear } from "@/lib/products";

export const metadata: Metadata = { alternates: { canonical: "/" } };
// Re-render a few times a day so the featured slot switches from the expo to analysis without a deploy.
export const revalidate = 21600;

const founderSeries = "building-worlds-no-1-cleaning-show-from-scratch";
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

// A topic icon for policy stories, from words in the headline.
function policyIcon(title: string): IconName {
  if (/tariff|trade|duty|dumping|investigation|import|export/i.test(title)) return "globe";
  if (/fcc|certif|standard|safety|recall|\bul\b|iec|approval/i.test(title)) return "badge";
  if (/subsid|trade-in|funding|yuan|rebate|incentive/i.test(title)) return "dollar";
  return "clipboard";
}

const POPULAR_HUBS: HubCategorySlug[] = ["robot-vacuums", "pool-robots", "robotic-mowers", "floor-washers", "commercial-cleaning"];

export default function HomePage() {
  const articles = getInsights();
  const editorial = getEditorialInsights(articles).filter((article) => article.series !== founderSeries);
  const guides = getGuideInsights(articles);
  const news = getNews();
  const brands = getPublishedBrandProfiles(articles);
  const hubs = getAllHubCategoryData();
  const latestFounderSeries = getLatestSeriesInsight(articles, founderSeries);


  const lead = editorial.find((article) => article.coverImage && !article.seriesTitle);
  const marks = buildBrandMarkIndex(brands);

  // One newest model from each product category.
  const newModels = [...featuredProductModels]
    .sort((a, b) => String(b.announced ?? "").localeCompare(String(a.announced ?? "")))
    .filter((model, index, all) => all.findIndex((other) => other.category === model.category) === index)
    .slice(0, 6);

  // Deep analysis: the newest long-form pieces with covers, after the feed lead.
  const deepAnalysis = editorial.filter((article) => article.coverImage && article.slug !== lead?.slug).slice(0, 4);
  const expoUpcoming = isExpoUpcoming();
  const featured = expoUpcoming ? undefined : pickFeaturedAnalysis(editorial, lead?.slug);

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
  // Caption each company with the hub where it has the most product models, else its first hub.
  const hubOfBrand = new Map<string, string>();
  const productWeight = new Map<string, number>();
  for (const data of hubs) {
    for (const company of data.companies) {
      const weight = data.products.filter((product) => product.brandSlug === company.slug).length;
      if (!hubOfBrand.has(company.slug) || weight > (productWeight.get(company.slug) ?? 0)) {
        hubOfBrand.set(company.slug, data.hub.name);
        productWeight.set(company.slug, weight);
      }
    }
  }
  // Brand → parent pairs, one per parent, preferring parents that have their own profile.
  const ownershipPairs = byCoverage
    .map((brand) => ({ brand, parentProfile: findParentProfile(brand, brands), parentName: shortParentName(brand.ownership.parentCompany) }))
    .filter((pair) => pair.parentName && pair.parentProfile)
    .filter((pair, index, all) => all.findIndex((other) => other.parentProfile?.slug === pair.parentProfile?.slug) === index)
    .slice(0, 4);

  const results = news.filter((item) => item.category === "Financial Results" || resultsPattern.test(item.title)).slice(0, 4);
  const policy = news.filter((item) => item.topic === "policy-standards").slice(0, 3);
  const events = news.filter((item) => item.topic === "events").slice(0, 2);
  // Each story appears once on the page: the week stream skips stories shown in Markets, Policy or Events.
  const shownElsewhere = new Set([...results, ...policy, ...events].map((item) => item.slug));
  const weekNews = news.filter((item) => !shownElsewhere.has(item.slug)).slice(0, 7);
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
        <div className="home-b-container home-b-hero-grid">
          <div className="home-b-hero-copy">
          <h1 id="home-title">The global cleaning industry, in one place.</h1>
          <p className="home-b-lead">
            News, new products, companies, supply chains, markets and events across floor care, pool, lawn and commercial cleaning.
          </p>
          <HomeSearch entries={searchEntries} />
          <p className="home-b-popular">
            <span>Popular:</span>
            {POPULAR_HUBS.map((slug) => getHubCategory(slug)).filter(Boolean).map((hub) => (
              <Link key={hub!.slug} href={`/categories/${hub!.slug}`}>
                <CategoryIcon slug={hub!.slug} color={hub!.color} size="sm" />
                {hub!.name}
              </Link>
            ))}
          </p>
          </div>
          {expoUpcoming ? (
            <article className="home-b-feature">
              <Link className="home-b-feature-image" href="/wcb-expo" tabIndex={-1} aria-hidden="true">
                <img src={EXPO_2026.image} alt="" width={1672} height={941} loading="eager" decoding="async" />
              </Link>
              <div className="home-b-feature-copy">
                <p className="home-b-feature-kicker">Event · {EXPO_2026.dates}</p>
                <h2><Link href="/wcb-expo">{EXPO_2026.name}</Link></h2>
                <p>{EXPO_2026.venue}</p>
                <div className="home-b-feature-actions">
                  <TallyButton className="home-b-feature-primary" ctaLocation="home_hero_wce_visitor" form="wceVisitor" inquiryIntent="visitor_interest">Plan your visit</TallyButton>
                  <TallyButton className="home-b-feature-secondary" ctaLocation="home_hero_wce_exhibitor" form="wceExhibitor" inquiryIntent="exhibitor_interest">Exhibit / Partner</TallyButton>
                </div>
              </div>
            </article>
          ) : featured ? (
            <article className="home-b-feature">
              <Link className="home-b-feature-image" href={`/blog/${featured.slug}`} tabIndex={-1} aria-hidden="true">
                <img {...responsiveImageProps(featured.coverImage!, "card")} alt="" loading="eager" decoding="async" />
              </Link>
              <div className="home-b-feature-copy">
                <p className="home-b-feature-kicker">Deep analysis · {newsDate(featured.sortDate || featured.date)}</p>
                <h2><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2>
                <p>{featured.excerpt}</p>
              </div>
            </article>
          ) : null}
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
                  <span className="home-b-type">
                    {resolveBrandMark(marks, item.brandSlugs[0]) ? (
                      <CompanyMark mark={resolveBrandMark(marks, item.brandSlugs[0])!} size="sm" />
                    ) : null}
                    <span>{newsTopicLabel(item.topic)}</span>
                  </span>
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
              // Companies whose main category is this hub first, then by coverage.
              const isHome = (slug: string) => (hubOfBrand.get(slug) === data.hub.name ? 1 : 0);
              const leaders = [...data.companies]
                .sort((a, b) => isHome(b.slug) - isHome(a.slug) || (articleCount.get(b.slug) ?? 0) - (articleCount.get(a.slug) ?? 0))
                .slice(0, 3);
              return (
                <Link
                  key={data.hub.slug}
                  className="home-b-category"
                  href={`/categories/${data.hub.slug}`}
                  style={{ "--hub-color": data.hub.color } as CSSProperties}
                >
                  <CategoryIcon slug={data.hub.slug} color={data.hub.color} />
                  <span className="home-b-category-body">
                    <span className="home-b-category-name">{data.hub.name}</span>
                    {leaders.length ? (
                      <span className="home-b-category-logos">
                        {leaders.map((brand) => (
                          <CompanyMark key={brand.slug} mark={marks.get(brand.slug)!} size="xs" />
                        ))}
                      </span>
                    ) : null}
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

      {deepAnalysis.length > 0 ? (
        <section className="home-b-section home-b-soft" id="analysis" aria-labelledby="home-analysis-title">
          <div className="home-b-container">
            <div className="home-b-head">
              <h2 id="home-analysis-title">Deep analysis</h2>
              <Link href="/blog/archive">All analysis →</Link>
            </div>
            <p className="home-b-sub">Supply chains, company strategy and the forces behind the brands.</p>
            <div className="home-b-cards">
              {deepAnalysis.map((article) => (
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
                <Link key={brand.slug} className="home-b-company" href={`/brands/${brand.slug}`}>
                  <CompanyMark mark={marks.get(brand.slug)!} size="md" />
                  <span className="home-b-company-name">{brand.name}</span>
                  {hubOfBrand.get(brand.slug) ? <span className="home-b-company-hub">{hubOfBrand.get(brand.slug)}</span> : null}
                </Link>
              ))}
            </div>
          </div>
          {ownershipPairs.length > 0 ? (
            <div className="home-b-owners">
              <h3>Who owns what</h3>
              {ownershipPairs.map(({ brand, parentProfile, parentName }) => (
                <Link key={brand.slug} href={`/brands/${brand.slug}`}>
                  <CompanyMark mark={marks.get(brand.slug)!} size="sm" />
                  <span className="home-b-owner-arrow" aria-hidden="true">←</span>
                  <CompanyMark mark={marks.get(parentProfile!.slug)!} size="sm" />
                  <span className="home-b-owner-text">
                    <span className="home-b-owner-name">{brand.name}</span>
                    <span className="home-b-owner-parent">Owned by {parentName}</span>
                  </span>
                </Link>
              ))}
              <Link className="home-b-owners-all" href="/brands#company-owners-title">All ownership groups →</Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="home-b-section home-b-soft" aria-label="Markets, policy and events">
        <div className="home-b-container home-b-columns">
          {results.length > 0 ? (
            <div id="markets">
              <div className="home-b-head">
                <h2><span className="home-b-head-icon"><Icon name="trending" /></span>Markets</h2>
                <Link href="/markets">All results →</Link>
              </div>
              <ul className="home-b-list home-b-results">
                {results.map((item) => {
                  const mark = resolveBrandMark(marks, item.brandSlugs[0]);
                  const figure = item.keyFigures.find((entry) => entry.change);
                  return (
                    <li key={item.slug}>
                      {mark ? <CompanyMark mark={mark} size="sm" /> : null}
                      <span className="home-b-result-copy">
                        <Link href={`/news/${item.slug}`}>{item.title}</Link>
                        <span className="home-b-meta">
                          {figure ? <FigureChip label={figure.label} change={figure.change} /> : null}
                          {newsDate(item.eventDate)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {policy.length > 0 ? (
            <div id="policy">
              <div className="home-b-head">
                <h2><span className="home-b-head-icon"><Icon name="clipboard" /></span>Policy and standards</h2>
                <Link href={newsHref("policy-standards")}>More →</Link>
              </div>
              <ul className="home-b-list">
                {policy.map((item) => (
                  <li key={item.slug} className="home-b-iconrow">
                    <span className="home-b-row-icon"><Icon name={policyIcon(item.title)} /></span>
                    <span className="home-b-result-copy">
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                      <span className="home-b-meta">{newsDate(item.eventDate)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div id="events">
            <div className="home-b-head">
              <h2><span className="home-b-head-icon"><Icon name="calendar" /></span>Events</h2>
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
                {events.map((item) => {
                  const visual = getNewsVisual(item);
                  const thumb = visual && !isBorrowedNewsVisual(visual) ? visual : undefined;
                  return (
                    <li key={item.slug} className="home-b-iconrow">
                      {thumb ? (
                        <span className={`home-b-row-thumb${thumb.fit === "contain" ? " home-b-row-thumb--contain" : ""}`}><img src={thumb.src} alt="" loading="lazy" decoding="async" /></span>
                      ) : (
                        <span className="home-b-row-icon"><Icon name="calendar" /></span>
                      )}
                      <span className="home-b-result-copy">
                        <Link href={`/news/${item.slug}`}>{item.title}</Link>
                        <span className="home-b-meta">{newsDate(item.eventDate)}</span>
                      </span>
                    </li>
                  );
                })}
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
                  {guide.coverImage ? (
                    <span className="home-b-card-image">
                      <img {...responsiveImageProps(guide.coverImage, "card")} alt="" />
                    </span>
                  ) : null}
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
