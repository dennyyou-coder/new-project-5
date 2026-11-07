import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import "./styles/home.css";
import "./styles/approved-home.css";
import "./styles/home-b.css";
import { HomeSearch, type HomeSearchEntry } from "@/components/HomeSearch";
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
import { getHubCategory, HUB_CATEGORIES, hubCategoriesForNews, productCategoryLabel, type HubCategorySlug } from "@/lib/hubCategories";
import { getAllHubCategoryData } from "@/lib/hubCategoryContent";
import { getEditorialInsights, getLatestSeriesInsight } from "@/lib/insightCollections";
import { getNews, getNewsVisual, isBorrowedNewsVisual, newsDate, newsTopicLabel } from "@/lib/news";
import { EXPO_2026, isExpoUpcoming } from "@/lib/hubPresentation";
import { homeVideos } from "@/lib/wcbVideos";
import { featuredProductModels, productCover, productSelectionYear } from "@/lib/products";

export const metadata: Metadata = { alternates: { canonical: "/" } };
// Re-render a few times a day so the expo band drops off after the expo closes without a deploy.
export const revalidate = 21600;

const founderSeries = "building-worlds-no-1-cleaning-show-from-scratch";
const founderCoverFallback = "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";
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

export default function HomePage() {
  const articles = getInsights();
  const editorial = getEditorialInsights(articles).filter((article) => article.series !== founderSeries);
  const news = getNews();
  const brands = getPublishedBrandProfiles(articles);
  const hubs = getAllHubCategoryData();
  const latestFounderSeries = getLatestSeriesInsight(articles, founderSeries);
  const marks = buildBrandMarkIndex(brands);
  const expoUpcoming = isExpoUpcoming();

  // One newest model from each product category.
  const newModels = [...featuredProductModels]
    .sort((a, b) => String(b.announced ?? "").localeCompare(String(a.announced ?? "")))
    .filter((model, index, all) => all.findIndex((other) => other.category === model.category) === index)
    .slice(0, 6);

  // From Denny: his newest analysis, the latest Founder's Journal episode and a video, as one row of cards.
  const dennyAnalysis = editorial.filter((article) => article.coverImage).slice(0, latestFounderSeries ? 2 : 3);
  const dennyVideo = homeVideos[0];
  const dennyCards: { key: string; type: string; href: string; image: string; title: string; meta: string; external?: boolean }[] = [
    ...dennyAnalysis.map((article) => ({
      key: article.slug,
      type: "Analysis",
      href: `/blog/${article.slug}`,
      image: article.coverImage!,
      title: article.title,
      meta: newsDate(article.sortDate || article.date)
    })),
    ...(latestFounderSeries
      ? [{
          key: latestFounderSeries.slug,
          type: "Founder’s Journal",
          href: `/blog/${latestFounderSeries.slug}`,
          image: latestFounderSeries.coverImage || founderCoverFallback,
          title: latestFounderSeries.title,
          meta: "Building the World’s No.1 Cleaning Show"
        }]
      : []),
    ...(dennyVideo
      ? [{
          key: `video-${dennyVideo.key}`,
          type: "Video",
          href: `/videos#video-${dennyVideo.key}`,
          image: dennyVideo.poster,
          title: dennyVideo.title,
          meta: `${dennyVideo.duration} · Mandarin with English subtitles`,
          external: true
        }]
      : [])
  ];

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

  // Company results sit with Companies; every story, results and policy included, is in the one news list.
  const results = news.filter((item) => item.category === "Financial Results" || resultsPattern.test(item.title)).slice(0, 4);
  // This week's news: one lead story with a picture, then a list. The picture is the story's own photo,
  // else an official image of the company it names (credited below), else the story's product shot.
  // Another article's cover or a generic industry picture never leads.
  const recent = news.slice(0, 10);
  const leadTiers: ((visual: NonNullable<ReturnType<typeof getNewsVisual>>) => boolean)[] = [
    (visual) => !isBorrowedNewsVisual(visual) && visual.fit !== "contain",
    (visual) => visual.label === "Company image",
    (visual) => !isBorrowedNewsVisual(visual)
  ];
  const leadNews = leadTiers
    .map((tier) => recent.find((item) => { const visual = getNewsVisual(item); return visual ? tier(visual) : false; }))
    .find(Boolean);
  const leadVisual = leadNews ? getNewsVisual(leadNews) : undefined;
  const weekNews = recent.filter((item) => item.slug !== leadNews?.slug).slice(0, 6);

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
      kind: `Product · ${productCategoryLabel(model.category)}`,
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

  const intro = (
    <section className={`home-b-intro${expoUpcoming ? "" : " home-b-intro--first"}`} aria-labelledby="home-title">
      <div className="home-b-container home-b-intro-grid">
        <div>
          <h1 id="home-title">The global cleaning industry, in one place.</h1>
          <p className="home-b-lead">
            News, new products, companies, supply chains, markets and events across floor care, pool, lawn and commercial cleaning.
          </p>
        </div>
        <HomeSearch entries={searchEntries} />
      </div>
    </section>
  );

  return (
    <div className="home-b">
      {expoUpcoming ? (
        <section className="home-b-expo" id="expo" aria-labelledby="home-expo-title">
          <div className="home-b-container home-b-expo-grid">
            <div className="home-b-expo-copy">
              <p className="home-b-feature-kicker">Event · {EXPO_2026.dates}</p>
              <h2 id="home-expo-title"><Link href="/wcb-expo">{EXPO_2026.name}</Link></h2>
              <p className="home-b-expo-venue">{EXPO_2026.venue}</p>
              <p className="home-b-expo-text">
                An exhibition for cleaning appliances and their supply chains, bringing brands, manufacturers, technology companies and professional buyers together.
              </p>
              <div className="home-b-feature-actions">
                <TallyButton className="home-b-feature-primary" ctaLocation="home_hero_wce_visitor" form="wceVisitor" inquiryIntent="visitor_interest">Plan your visit</TallyButton>
                <TallyButton className="home-b-feature-secondary" ctaLocation="home_hero_wce_exhibitor" form="wceExhibitor" inquiryIntent="exhibitor_interest">Exhibit or partner</TallyButton>
              </div>
              <Link className="wcb-more home-b-expo-more" href="/wcb-expo">About the expo</Link>
            </div>
            <Link className="home-b-expo-image" href="/wcb-expo" tabIndex={-1} aria-hidden="true">
              <img src={EXPO_2026.image} srcSet={`${EXPO_2026.image.replace(/\.webp$/, "-800.webp")} 800w, ${EXPO_2026.image} 1600w`} sizes="(max-width: 900px) calc(100vw - 32px), 50vw" alt="" width={1600} height={900} loading="eager" decoding="async" fetchPriority="high" />
            </Link>
          </div>
        </section>
      ) : null}

      {intro}

      <section className="home-b-section" id="feed" aria-labelledby="home-feed-title">
        <div className="home-b-container">
          <div className="home-b-head">
            <h2 id="home-feed-title">Across the industry this week</h2>
            <Link className="wcb-more" href="/news">All news</Link>
          </div>
          <div className={leadNews ? "home-b-feed" : undefined}>
            {leadNews && leadVisual ? (
              <article className="home-b-lead-story">
                <Link className={`home-b-lead-image${leadVisual.fit === "contain" ? " home-b-lead-image--contain" : ""}`} href={`/news/${leadNews.slug}`} tabIndex={-1} aria-hidden="true">
                  <img src={leadVisual.src} alt="" loading="eager" decoding="async" style={leadVisual.position ? { objectPosition: leadVisual.position } : undefined} />
                </Link>
                {/* Credit outside the story itself; a company image is marked as a file photo, not a picture of this event. */}
                <p className="home-b-lead-credit">
                  {[leadVisual.label === "Company image" ? "File photo" : null, leadVisual.sourceLabel ? `Photo: ${leadVisual.sourceLabel}` : null].filter(Boolean).join(" · ")}
                  {leadVisual.license ? <> · <a href={leadVisual.license.url} rel="noopener noreferrer">{leadVisual.license.label}</a></> : null}
                </p>
                <p className="home-b-meta">
                  {newsTopicLabel(leadNews.topic)} · <HubDot slugs={hubCategoriesForNews(leadNews)} /> <time dateTime={leadNews.eventDate}>{newsDate(leadNews.eventDate)}</time>
                </p>
                <h3><Link href={`/news/${leadNews.slug}`}>{leadNews.title}</Link></h3>
                {leadNews.excerpt ? <p className="home-b-excerpt">{leadNews.excerpt}</p> : null}
              </article>
            ) : null}
          <ul className={`home-b-stream${leadNews ? "" : " home-b-stream--wide"}`}>
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

      {dennyCards.length > 0 ? (
        <section className="home-b-section home-b-soft" id="from-denny" aria-labelledby="home-denny-title">
          <div className="home-b-container">
            <div className="home-b-head">
              <h2 id="home-denny-title">From Denny You</h2>
              <Link className="wcb-more" href="/blog/archive">All analysis</Link>
            </div>
            <p className="home-b-sub">Analysis, the founder’s journal and video from the founder of World Clean Biz.</p>
            <div className="home-b-cards home-b-denny">
              {dennyCards.map((card) => (
                <Link key={card.key} className="home-b-card home-b-denny-card" href={card.href}>
                  <span className="home-b-card-image">
                    {card.external ? (
                      <img src={card.image} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <img {...responsiveImageProps(card.image, "card")} alt="" />
                    )}
                  </span>
                  <span className="home-b-denny-type">{card.type}</span>
                  <span className="home-b-card-title">{card.title}</span>
                  <span className="home-b-meta">{card.meta}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-b-section" aria-labelledby="home-categories-title">
        <div className="home-b-container">
          <div className="home-b-head">
            <h2 id="home-categories-title">Browse by category</h2>
            <Link className="wcb-more" href="/categories">All categories</Link>
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
        <section className="home-b-section home-b-soft" id="products" aria-labelledby="home-products-title">
          <div className="home-b-container">
            <div className="home-b-head">
              <h2 id="home-products-title">New products</h2>
              <Link className="wcb-more" href="/products">All {featuredProductModels.length} new {productSelectionYear} models</Link>
            </div>
            <div className="home-b-products">
              {newModels.map((model) => (
                <Link key={model.slug} className="home-b-product" href={`/products/${model.slug}`}>
                  <span className="home-b-product-image">
                    <img {...responsiveImageProps(productCover(model.slug), "card")} alt={model.name} />
                  </span>
                  <span className="home-b-meta">{productCategoryLabel(model.category)}</span>
                  <span className="home-b-product-name">{model.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-b-section" id="companies" aria-labelledby="home-companies-title">
        <div className="home-b-container">
          <div className="home-b-companies-wrap">
            <div className="home-b-companies-main">
              <div className="home-b-head">
                <h2 id="home-companies-title">Companies</h2>
                <Link className="wcb-more" href="/brands">All {brands.length} profiles</Link>
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
                <Link className="wcb-more home-b-owners-all" href="/brands#company-owners-title">All ownership groups</Link>
              </div>
            ) : null}
          </div>
          {results.length > 0 ? (
            <div className="home-b-results-row" id="markets">
              <div className="home-b-head">
                <h3><span className="home-b-head-icon"><Icon name="trending" /></span>Latest results</h3>
                <Link className="wcb-more" href="/markets">All results</Link>
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
        </div>
      </section>

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
