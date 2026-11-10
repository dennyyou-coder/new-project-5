import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import "./styles/home.css";
import "./styles/approved-home.css";
import "./styles/home-b.css";
import { Icon } from "@/components/Icon";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CompanyMark } from "@/components/ui/CompanyMark";
import { FigureChip } from "@/components/ui/FigureChip";
import { buildBrandMarkIndex, resolveBrandMark } from "@/lib/brandMarks";
import { findParentProfile, shortParentName } from "@/lib/brandProfileView";
import { TallyButton, TallyReportButton } from "@/components/LeadForms";
import { eventBadge, upcomingEvents } from "@/lib/industryEvents";
import { FEATURED_REPORT } from "@/lib/reports";
import { HomeToolCards } from "@/components/tools/HomeToolCards";
import { recallName, shortDate } from "@/lib/radar/classify";
import { getFccFilings, getRecalls } from "@/lib/radar/data";
import { fccIdUrl } from "@/lib/radar/fcc";
import { daysUntil, upcomingRules } from "@/lib/radar/rules";
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
import { getTopics, topicHref, topicImageSmall } from "@/lib/topics";
import { compareKeyBrands, isKeyBrand } from "@/lib/keyBrands";

export const metadata: Metadata = { alternates: { canonical: "/" } };
// Re-render a few times a day so the expo band drops off after the expo closes without a deploy.
export const revalidate = 21600;

const founderSeries = "building-worlds-no-1-cleaning-show-from-scratch";
const founderCoverFallback = "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";
// Supplier requests by category: each links to that category's sourcing page.
const radarIcon = (paths: string[]) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    {paths.map((d) => <path key={d} d={d} />)}
  </svg>
);

// Each radar column gets its own mark so readers see three trackers, not one list:
// a warning triangle for recalls, radio waves for FCC filings, a calendar for trade rules.
const RADAR_ICONS = {
  recall: radarIcon(["M12 3.5 2.8 19.5h18.4z", "M12 9.5v4.5", "M12 17h.01"]),
  fcc: radarIcon(["M12 13v8", "M9.5 21h5", "M12 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "M8 7.5a5.5 5.5 0 0 0 0 7.8", "M16 7.5a5.5 5.5 0 0 1 0 7.8", "M5.2 4.8a9.5 9.5 0 0 0 0 13.4", "M18.8 4.8a9.5 9.5 0 0 1 0 13.4"]),
  rules: radarIcon(["M4 5.5h16v15H4z", "M4 10h16", "M8.5 3.5v4", "M15.5 3.5v4", "M8.5 14.5l2 2 4-4"])
};

const sourcingLinks = [
  { label: "Robot vacuums", href: "/sourcing/robotic-vacuums" },
  { label: "Vacuum cleaners", href: "/sourcing/vacuum-cleaners" },
  { label: "Floor washers", href: "/sourcing/floor-washers" },
  { label: "Pool robots", href: "/sourcing/pool-robots" },
  { label: "Robotic mowers", href: "/sourcing/lawn-robots" },
  { label: "Commercial cleaning", href: "/sourcing/commercial-cleaning" }
];
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
  const nextEvents = upcomingEvents(new Date(), 5);
  const radarRecalls = getRecalls().slice(0, 4);
  const radarFilings = getFccFilings().filter((filing) => filing.type === "new").slice(0, 4);
  const radarRules = upcomingRules(new Date(), 4);

  // The industry's running stories: each WCB topic as an image card under the hero.
  const watch = getTopics().map((topic) => ({ topic }));

  // One model from each product category: a key brand's newest 2026 model when there is one, else the newest.
  const thisYear = (model: (typeof featuredProductModels)[number]) => String(model.announced ?? "").startsWith("2026");
  const newModels = [...featuredProductModels]
    .sort((a, b) =>
      Number(isKeyBrand(b.brandSlug) && thisYear(b)) - Number(isKeyBrand(a.brandSlug) && thisYear(a)) ||
      String(b.announced ?? "").localeCompare(String(a.announced ?? ""))
    )
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
  // Key brands first (lib/keyBrands.ts), then by how much WCB has written about each company.
  const byCoverage = [...brands].sort(
    (a, b) =>
      compareKeyBrands(a.slug, b.slug) ||
      (articleCount.get(b.slug) ?? 0) - (articleCount.get(a.slug) ?? 0) ||
      a.name.localeCompare(b.name)
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
  // Brand → parent pairs, one per parent, preferring parents that have their own profile; pairs involving a key brand first.
  const ownershipPairs = byCoverage
    .map((brand) => ({ brand, parentProfile: findParentProfile(brand, brands), parentName: shortParentName(brand.ownership.parentCompany) }))
    .filter((pair) => pair.parentName && pair.parentProfile)
    .sort((a, b) =>
      Number(isKeyBrand(b.brand.slug) || isKeyBrand(b.parentProfile?.slug)) - Number(isKeyBrand(a.brand.slug) || isKeyBrand(a.parentProfile?.slug))
    )
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
  // Within each picture tier, a key brand's story leads before other companies' stories.
  const recentKeyFirst = [...recent].sort((a, b) => compareKeyBrands(a.brandSlugs.find(isKeyBrand), b.brandSlugs.find(isKeyBrand)));
  const leadNews = leadTiers
    .map((tier) => recentKeyFirst.find((item) => { const visual = getNewsVisual(item); return visual ? tier(visual) : false; }))
    .find(Boolean);
  const leadVisual = leadNews ? getNewsVisual(leadNews) : undefined;
  const weekNews = recent.filter((item) => item.slug !== leadNews?.slug).slice(0, 6);

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
      <h1 className="home-b-sr-only">World Clean Biz: news and intelligence on the global cleaning industry</h1>


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

      {/* Phones: jump to a zone instead of scrolling the whole page. */}
      <nav className="home-zone-nav" aria-label="Homepage sections">
        <a href="#zone-news">News</a>
        <a href="#zone-analysis">Analysis</a>
        <a href="#zone-business">Tools</a>
        <a href="#radar">Radar</a>
        <a href="#zone-directory">Directory</a>
      </nav>

      <div className="home-zone home-zone--news" id="zone-news">
      {watch.length ? (
        <section className="home-b-section home-b-watch" aria-labelledby="home-watch-title">
          <div className="home-b-container">
            <h2 id="home-watch-title" className="home-b-sr-only">Industry watch: WCB topics</h2>
            <div className="home-b-watch-grid">
              {watch.map(({ topic }) => (
                <Link key={topic.slug} className="home-b-watch-card" href={topicHref(topic.slug)}>
                  <span className="home-b-watch-image">
                    {topic.coverImage ? (
                      <img
                        src={topicImageSmall(topic.coverImage)}
                        srcSet={`${topicImageSmall(topic.coverImage)} 600w, ${topic.coverImage} 1000w`}
                        sizes="(max-width: 560px) 120px, (max-width: 1100px) 45vw, 290px"
                        alt=""
                        width={600}
                        height={375}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    {topic.shortLabel ? <span className="home-b-watch-label" aria-hidden="true">{topic.shortLabel}</span> : null}
                  </span>
                  <span className="home-b-watch-body">
                    <span className="home-b-watch-title">{topic.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-b-section" id="feed" aria-labelledby="home-feed-title">
        <div className="home-b-container">
          <div className="home-b-head">
            <div className="home-b-title">
              <span className="home-b-eyebrow">News</span>
              <h2 id="home-feed-title">Across the industry this week</h2>
            </div>
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
      </div>

      {dennyCards.length > 0 ? (
        <div className="home-zone home-zone--analysis" id="zone-analysis">
        <section className="home-b-section" id="from-denny" aria-labelledby="home-denny-title">
          <div className="home-b-container">
            <div className="home-b-head">
              <div className="home-b-title">
                <span className="home-b-eyebrow">Analysis</span>
                <h2 id="home-denny-title">From Denny You</h2>
              </div>
              <Link className="wcb-more" href="/blog/archive">All analysis</Link>
            </div>
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
        </div>
      ) : null}

      <div className="home-zone home-zone--business" id="zone-business">
      <section className="home-b-section" id="business" aria-labelledby="home-business-title">
        <div className="home-b-container">
          <div className="home-b-head">
            <div className="home-b-title">
              <span className="home-b-eyebrow">For business</span>
              <h2 id="home-business-title">Tools, reports and sourcing</h2>
            </div>
            <Link className="wcb-more" href="/tools">All tools</Link>
          </div>
          <div className="home-b-business">
            <HomeToolCards />
            <article className="home-b-biz home-b-biz-report">
              <img className="home-b-biz-cover" src={FEATURED_REPORT.cover} alt={`${FEATURED_REPORT.title} report cover`} loading="lazy" decoding="async" />
              <div className="home-b-biz-body">
                <span className="home-b-biz-kicker">Free report · {FEATURED_REPORT.pages} pages</span>
                <h3>{FEATURED_REPORT.title}</h3>
                <p>Where growth goes next: yard, pool and commercial cleaning robots.</p>
                <div className="home-b-biz-actions">
                  <TallyReportButton className="home-b-biz-button" ctaLocation="home_business_report" reportId={FEATURED_REPORT.id}>
                    Get the free PDF
                  </TallyReportButton>
                  <Link href="/reports">All reports</Link>
                </div>
              </div>
            </article>
            <article className="home-b-biz home-b-biz-sourcing">
              <div className="home-b-biz-body">
                <span className="home-b-biz-kicker">Sourcing</span>
                <h3>Looking for a supplier or factory?</h3>
                <p>Tell us the product and market. We reply within two working days.</p>
                <div className="home-b-biz-actions">
                  <TallyButton className="home-b-biz-button" ctaLocation="home_business_sourcing" form="sourcing">
                    Send a sourcing request
                  </TallyButton>
                  <Link href="/sourcing">How it works</Link>
                </div>
              </div>
              <ul className="home-b-biz-pills" aria-label="Sourcing by category">
                {sourcingLinks.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </article>
            <article className="home-b-biz home-b-biz-events">
              <div className="home-b-biz-events-head">
                <span className="home-b-biz-kicker">Industry events</span>
                <Link href="/events">Full calendar</Link>
              </div>
              <ul className="home-b-events">
                {nextEvents.map((event) => {
                  const badge = eventBadge(event);
                  return (
                    <li key={event.slug} className={event.wcb ? "is-wcb" : undefined}>
                      <span className="home-b-event-date" aria-hidden="true">
                        <span>{badge.month}</span>
                        <strong>{badge.day}</strong>
                      </span>
                      <span className="home-b-event-copy">
                        {event.url.startsWith("/") ? (
                          <Link href={event.url}>{event.name}</Link>
                        ) : (
                          <a href={event.url} target="_blank" rel="noopener noreferrer">{event.name}</a>
                        )}
                        <span className="home-b-meta">{event.city}, {event.country}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="home-b-section" id="radar" aria-labelledby="home-radar-title">
        <div className="home-b-container">
          <div className="home-b-head home-b-head--sub">
            <h2 id="home-radar-title">Industry radar</h2>
            <Link className="wcb-more" href="/tools">All trackers</Link>
          </div>
          <div className="home-b-radar">
            <article className="home-b-radar-col">
              <div className="home-b-radar-head">
                <span className="home-b-radar-mark is-recall" aria-hidden="true">{RADAR_ICONS.recall}</span>
                <span className="home-b-radar-title">
                  <strong>Recalls</strong>
                  <span>US CPSC and EU Safety Gate</span>
                </span>
                <Link href="/recalls">All</Link>
              </div>
              <ul className="home-b-radar-list">
                {radarRecalls.map((recall) => (
                  <li key={recall.id}>
                    <span className="home-b-meta">
                      <span className={`home-b-radar-tag is-${recall.source === "CPSC" ? "us" : "eu"}`}>{recall.source === "CPSC" ? "US" : "EU"}</span> {shortDate(recall.date)}
                    </span>
                    <a href={recall.url} target="_blank" rel="noopener noreferrer">{recallName(recall)}</a>
                    {recall.risk ? <span className="home-b-radar-note">{recall.risk}</span> : null}
                  </li>
                ))}
              </ul>
            </article>
            <article className="home-b-radar-col">
              <div className="home-b-radar-head">
                <span className="home-b-radar-mark is-fcc" aria-hidden="true">{RADAR_ICONS.fcc}</span>
                <span className="home-b-radar-title">
                  <strong>FCC filings</strong>
                  <span>New radio approvals before launch</span>
                </span>
                <Link href="/launch-radar">All</Link>
              </div>
              <ul className="home-b-radar-list">
                {radarFilings.map((filing) => (
                  <li key={`${filing.fccId}-${filing.date}`}>
                    <span className="home-b-meta">{shortDate(filing.date)}</span>
                    <a href={fccIdUrl(filing.fccId)} target="_blank" rel="noopener noreferrer">{filing.company} <span className="home-b-radar-id">FCC ID {filing.fccId}</span></a>
                    <span className="home-b-radar-note">{filing.bands.join(", ") || "New product"}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="home-b-radar-col">
              <div className="home-b-radar-head">
                <span className="home-b-radar-mark is-rules" aria-hidden="true">{RADAR_ICONS.rules}</span>
                <span className="home-b-radar-title">
                  <strong>Trade rules</strong>
                  <span>Tariff and regulation deadlines</span>
                </span>
                <Link href="/rules-calendar">All</Link>
              </div>
              <ul className="home-b-radar-list">
                {radarRules.map((rule) => (
                  <li key={rule.id}>
                    <span className="home-b-meta">
                      <span className={`home-b-radar-tag is-${rule.region.toLowerCase()}`}>{rule.region}</span> {shortDate(rule.date)} · in {daysUntil(rule.date)} days
                    </span>
                    <Link href={rule.href ?? "/rules-calendar"}>{rule.title}</Link>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
      </div>

      <div className="home-zone home-zone--directory" id="zone-directory">
      <section className="home-b-section" aria-labelledby="home-categories-title">
        <div className="home-b-container">
          <div className="home-b-head">
            <div className="home-b-title">
              <span className="home-b-eyebrow">Directory</span>
              <h2 id="home-categories-title">Browse by category</h2>
            </div>
            <Link className="wcb-more" href="/categories">All categories</Link>
          </div>
          <div className="home-b-categories">
            {hubs.map((data) => {
              // Companies whose main category is this hub first, key brands among them first, then by coverage.
              const isHome = (slug: string) => (hubOfBrand.get(slug) === data.hub.name ? 1 : 0);
              const leaders = [...data.companies]
                .sort((a, b) => isHome(b.slug) - isHome(a.slug) || compareKeyBrands(a.slug, b.slug) || (articleCount.get(b.slug) ?? 0) - (articleCount.get(a.slug) ?? 0))
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
            <div className="home-b-head home-b-head--sub">
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
              <div className="home-b-head home-b-head--sub">
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
      </div>

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
