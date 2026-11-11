import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./styles/home-a.css";
import { archivo, plexMono } from "./home-fonts";
import { TallyButton, TallyReportButton } from "@/components/LeadForms";
import { HomeToolCards } from "@/components/tools/HomeToolCards";
import { buildBrandMarkIndex, figureDirection, resolveBrandMark, type BrandMark } from "@/lib/brandMarks";
import { findParentProfile, shortParentName } from "@/lib/brandProfileView";
import { eventBadge, eventDateRange, upcomingEvents } from "@/lib/industryEvents";
import { FEATURED_REPORT } from "@/lib/reports";
import { recallName, shortDate } from "@/lib/radar/classify";
import { getFccCompanies, getFccFilings, getRecalls } from "@/lib/radar/data";
import { fccIdUrl } from "@/lib/radar/fcc";
import { daysUntil, upcomingRules } from "@/lib/radar/rules";
import { responsiveImageProps } from "@/lib/articleImages";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import { productCategoryLabel, type HubCategorySlug } from "@/lib/hubCategories";
import { getAllHubCategoryData } from "@/lib/hubCategoryContent";
import { getEditorialInsights, getLatestSeriesInsight } from "@/lib/insightCollections";
import { getNews, getNewsVisual, isBorrowedNewsVisual, newsDate, newsTopicLabel } from "@/lib/news";
import { EXPO_2026, isExpoUpcoming } from "@/lib/hubPresentation";
import { homeVideos } from "@/lib/wcbVideos";
import { featuredProductModels, productCover, productSelectionYear } from "@/lib/products";
import { getTopics, topicHref, topicImageSmall } from "@/lib/topics";
import { compareKeyBrands, isKeyBrand } from "@/lib/keyBrands";

export const metadata: Metadata = { alternates: { canonical: "/" } };
// Re-render a few times a day so counts, day counters and the expo block stay current without a deploy.
export const revalidate = 21600;

const founderSeries = "building-worlds-no-1-cleaning-show-from-scratch";
const founderCoverFallback = "/images/blog/building-worlds-no-1-cleaning-show-episode-01-cover.webp";
const EXPO_OPENS = "2026-11-18";

const SECTOR_SHORT = { cleaning: "Cleaning appliances", appliances: "Home appliances", tools: "Power tools and outdoor" } as const;

const sourcingLinks = [
  { label: "Robot vacuums", href: "/sourcing/robotic-vacuums" },
  { label: "Vacuum cleaners", href: "/sourcing/vacuum-cleaners" },
  { label: "Floor washers", href: "/sourcing/floor-washers" },
  { label: "Pool robots", href: "/sourcing/pool-robots" },
  { label: "Robotic mowers", href: "/sourcing/lawn-robots" },
  { label: "Commercial cleaning", href: "/sourcing/commercial-cleaning" }
];

// One product photo per category, all on white so the row reads as one set.
// None of these repeat in the New products row below.
const CATEGORY_IMAGES: Record<HubCategorySlug, { src: string; alt: string }> = {
  "robot-vacuums": { src: "/images/articles/ecovacs-deebot-x12-omnicyclone/01-cover.webp", alt: "ECOVACS DEEBOT X12 OmniCyclone robot vacuum" },
  "vacuum-cleaners": { src: "/images/articles/dyson-v10-konical/01-cover.webp", alt: "Dyson V10 Konical cordless vacuum" },
  "floor-washers": { src: "/images/articles/tineco-floor-one-s9-master/01-cover.webp", alt: "Tineco Floor One S9 Master floor washer" },
  "carpet-spot-cleaners": { src: "/images/home/categories/hoover-cleanslate.webp", alt: "Hoover CleanSlate spot cleaner" },
  "pool-robots": { src: "/images/articles/beatbot-aquasense-x/01-cover.webp", alt: "Beatbot AquaSense X pool robot" },
  "robotic-mowers": { src: "/images/articles/segway-navimow-x430/01-cover.webp", alt: "Segway Navimow X430 robotic mower" },
  "commercial-cleaning": { src: "/images/home/categories/nilfisk-autonomous-scrubber.webp", alt: "Nilfisk autonomous floor scrubber" },
  "window-robots": { src: "/images/articles/ecovacs-winbot-w3-omni/01-cover.webp", alt: "ECOVACS WINBOT W3 OMNI window robot" },
  "small-appliances": { src: "/images/brands/black-decker/hero-dustbuster-powerconnect.webp", alt: "BLACK+DECKER Dustbuster handheld vacuum" },
  "power-tools-outdoor": { src: "/images/brands/milwaukee/hero-m12-fuel-wet-dry-vacuum.webp", alt: "Milwaukee M12 FUEL wet/dry vacuum" }
};

const resultsPattern = /\b(revenue|results|profit|sales|earnings)\b/i;

/* Line icons, drawn on a 24px grid with a 1.8 stroke. */
const icon = (paths: ReactNode, size = 20) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths}
  </svg>
);
const ICONS = {
  companies: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2" /></>,
  models: <><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  news: <><path d="M4 5h13v14H5a1 1 0 0 1-1-1V5z" /><path d="M17 9h3v9a1 1 0 0 1-1 1h-2M8 9h5M8 13h5M8 16h3" /></>,
  analysis: <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />,
  recall: <><path d="M12 3l9.5 17h-19L12 3z" /><path d="M12 10v4M12 17.4v.2" /></>,
  fcc: <><circle cx="12" cy="12" r="2" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" /></>,
  rules: <><path d="M12 4v16M7 20h10M5 8h14" /><path d="M5 8l-3 6a3 3 0 0 0 6 0L5 8zM19 8l-3 6a3 3 0 0 0 6 0l-3-6z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.5 3.5 5.2" /></>,
  ticket: <><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" /><path d="M14 7v10" strokeDasharray="2 2" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />
};

/** A company logo on a white tile; near-white logos are darkened, and companies without a logo get their name. */
function Logo({ mark, className = "" }: { mark: BrandMark | undefined; className?: string }) {
  if (!mark) return null;
  if (!mark.logo) return <span className={`ha-logo ha-logo--name ${className}`}>{mark.name}</span>;
  return <img className={`ha-logo${mark.logoLight ? " ha-logo--light" : ""} ${className}`} src={mark.logo} alt={mark.name} loading="lazy" decoding="async" />;
}

function SectionHead({ id, kicker, title, more, children }: { id: string; kicker: string; title: string; more?: { href: string; label: string }; children?: ReactNode }) {
  return (
    <div className="ha-head">
      <div>
        <p className="ha-kicker">{kicker}</p>
        <h2 id={id}>{title}</h2>
        {children}
      </div>
      {more ? <Link className="ha-more" href={more.href}>{more.label} →</Link> : null}
    </div>
  );
}

function SubHead({ id, title, more }: { id: string; title: string; more: { href: string; label: string } }) {
  return (
    <div className="ha-subhead">
      <h3 id={id}>{title}</h3>
      <Link className="ha-more" href={more.href}>{more.label} →</Link>
    </div>
  );
}

export default function HomePage() {
  const now = new Date();
  const articles = getInsights();
  const editorial = getEditorialInsights(articles).filter((article) => article.series !== founderSeries);
  const news = getNews();
  const brands = getPublishedBrandProfiles(articles);
  const hubs = getAllHubCategoryData();
  const latestFounderSeries = getLatestSeriesInsight(articles, founderSeries);
  const marks = buildBrandMarkIndex(brands);
  const expoUpcoming = isExpoUpcoming();
  const expoDays = daysUntil(EXPO_OPENS, now);
  const nextEvents = upcomingEvents(now, 6);
  const recalls = getRecalls();
  const filings = getFccFilings();
  const radarRecalls = recalls.slice(0, 4);
  const radarFilings = filings.filter((filing) => filing.type === "new").slice(0, 4);
  const radarRules = upcomingRules(now, 4);
  const topics = getTopics();
  const runningStories = topics.slice(0, 4);
  const asOf = shortDate(now.toISOString().slice(0, 10));

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
  const dennyCards: { key: string; type: string; href: string; image: string; title: string; meta: string; video?: string }[] = [
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
          video: dennyVideo.duration
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
    .map((brand) => ({ brand, parentProfile: findParentProfile(brand, brands), parentName: shortParentName(brand.ownership.parentCompany)?.replace(/,?\s*(Co\.,?\s*)?(Ltd|Limited|Inc|LLC)\.?$/i, "") }))
    .filter((pair) => pair.parentName && pair.parentProfile)
    .sort((a, b) =>
      Number(isKeyBrand(b.brand.slug) || isKeyBrand(b.parentProfile?.slug)) - Number(isKeyBrand(a.brand.slug) || isKeyBrand(a.parentProfile?.slug))
    )
    .filter((pair, index, all) => all.findIndex((other) => other.parentProfile?.slug === pair.parentProfile?.slug) === index)
    .slice(0, 4);

  // Latest company results, one line each: company, the reported figure and its change.
  const results = news
    .filter((item) => item.category === "Financial Results" || resultsPattern.test(item.title))
    .map((item) => ({ item, mark: resolveBrandMark(marks, item.brandSlugs[0]), figure: item.keyFigures.find((entry) => entry.change) }))
    .filter((entry) => entry.mark && entry.figure)
    .slice(0, 4);

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

  const tracked = [
    { value: brands.length, label: "company profiles", icon: ICONS.companies },
    { value: featuredProductModels.length, label: `new ${productSelectionYear} models`, icon: ICONS.models },
    { value: news.length, label: "news stories", icon: ICONS.news },
    { value: editorial.length, label: "analyses", icon: ICONS.analysis },
    { value: recalls.length, label: "product recalls logged", icon: ICONS.recall },
    { value: filings.length, label: "FCC filings logged", icon: ICONS.fcc }
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
    <div className={`home-a ${archivo.variable} ${plexMono.variable}`}>
      {/* Hero: what WCB is, a search box and what it tracks. */}
      <section className="ha-hero" aria-labelledby="home-title">
        <div className="ha-wrap">
          <div className="ha-hero-grid">
            <div className="ha-hero-copy">
              <p className="ha-kicker">Global cleaning industry intelligence</p>
              <h1 id="home-title">The global cleaning industry, in one place.</h1>
              <p className="ha-hero-lead">
                News, company profiles, new models, recalls and trade rules across robot vacuums, floor care, pool and lawn robots and commercial cleaning. Sourced, dated and updated daily.
              </p>
              <form className="ha-search" action="/search" method="get" role="search">
                <input
                  name="q"
                  type="search"
                  aria-label="Search World Clean Biz"
                  placeholder={`Search ${brands.length} companies, ${featuredProductModels.length} new models, ${news.length} stories`}
                  autoComplete="off"
                />
                <button type="submit">{icon(ICONS.search, 18)}Search</button>
              </form>
              {topics.length ? (
                <div className="ha-chips">
                  <span>Running stories:</span>
                  {topics.slice(0, 4).map((topic) => (
                    <Link key={topic.slug} href={topicHref(topic.slug)}>{topic.shortLabel ?? topic.title}</Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="ha-tracks">
              <div className="ha-tracks-head">
                <span>What WCB tracks</span>
                <span>As of {asOf}</span>
              </div>
              <div className="ha-tracks-grid">
                {tracked.map((item) => (
                  <div key={item.label} className="ha-track">
                    <div>
                      <div className="ha-track-value">{item.value}</div>
                      <div className="ha-track-label">{item.label}</div>
                    </div>
                    <span className="ha-icon-tile">{icon(item.icon)}</span>
                  </div>
                ))}
              </div>
              <div className="ha-tracks-foot">
                <span>Every story lists its sources.</span>
                <Link href="/editorial-policy">Editorial standards →</Link>
              </div>
            </div>
          </div>

          <div className="ha-covered">
            <span className="ha-label">Companies covered</span>
            {topCompanies.slice(0, 10).map((brand) => (
              <Link key={brand.slug} href={`/brands/${brand.slug}`} className="ha-covered-logo">
                <Logo mark={marks.get(brand.slug)} />
              </Link>
            ))}
            <Link className="ha-more" href="/brands">All {brands.length} →</Link>
          </div>
        </div>
      </section>

      {results.length > 0 ? (
        <section className="ha-results" aria-label="Latest company results">
          <div className="ha-wrap ha-results-row">
            <span className="ha-label">Latest results</span>
            {results.map(({ item, mark, figure }) => {
              const direction = figureDirection(figure!.change);
              const change = figure!.change!.replace(/\s*(YoY|year[- ]on[- ]year)\b.*$/i, "").replace(/\s*\(.*\)\s*$/, "").trim();
              return (
                <Link key={item.slug} href={`/news/${item.slug}`} className="ha-result">
                  <strong>{mark!.name}</strong> <span className="ha-result-label">{figure!.label}</span>{" "}
                  <span className={`ha-change ha-change--${direction}`}>
                    {direction === "flat" ? null : icon(direction === "up" ? ICONS.up : ICONS.down, 13)} {change}
                  </span>
                </Link>
              );
            })}
            <Link className="ha-more ha-results-all" href="/markets">All results →</Link>
          </div>
        </section>
      ) : null}

      {/* News: a lead story, the week's list and the running stories. */}
      <section className="ha-section" id="news" aria-labelledby="home-feed-title">
        <div className="ha-wrap ha-stack">
          <SectionHead id="home-feed-title" kicker="News" title="Across the industry this week" more={{ href: "/news", label: "All news" }} />
          <div className="ha-news">
            {leadNews && leadVisual ? (
              <article className="ha-lead">
                <Link className={`ha-lead-image${leadVisual.fit === "contain" ? " ha-lead-image--contain" : ""}`} href={`/news/${leadNews.slug}`} tabIndex={-1} aria-hidden="true">
                  <img src={leadVisual.src} alt="" loading="eager" decoding="async" fetchPriority="high" style={leadVisual.position ? { objectPosition: leadVisual.position } : undefined} />
                </Link>
                {/* Credit outside the story itself; a company image is marked as a file photo, not a picture of this event. */}
                <p className="ha-lead-credit">
                  {[leadVisual.label === "Company image" ? "File photo" : null, leadVisual.sourceLabel ? `Photo: ${leadVisual.sourceLabel}` : null].filter(Boolean).join(" · ")}
                  {leadVisual.license ? <> · <a href={leadVisual.license.url} rel="noopener noreferrer">{leadVisual.license.label}</a></> : null}
                </p>
                <p className="ha-meta">
                  {newsTopicLabel(leadNews.topic)} · <time dateTime={leadNews.eventDate}>{newsDate(leadNews.eventDate)}</time>
                </p>
                <h3><Link href={`/news/${leadNews.slug}`}>{leadNews.title}</Link></h3>
                {leadNews.excerpt ? <p className="ha-lead-excerpt">{leadNews.excerpt}</p> : null}
              </article>
            ) : null}

            <ul className="ha-stream">
              {weekNews.map((item) => {
                const mark = resolveBrandMark(marks, item.brandSlugs[0]);
                return (
                  <li key={item.slug}>
                    <Link href={`/news/${item.slug}`}>
                      <span className="ha-stream-mark">
                        {mark?.logo ? <Logo mark={mark} /> : <span className="ha-icon-tile ha-icon-tile--sm">{icon(ICONS.news)}</span>}
                      </span>
                      <span className="ha-stream-copy">
                        <span className="ha-meta">{newsTopicLabel(item.topic)} · <time dateTime={item.eventDate}>{newsDate(item.eventDate)}</time></span>
                        <span className="ha-stream-title">{item.title}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {runningStories.length ? (
              <div className="ha-running">
                <p className="ha-label">Running stories</p>
                <div className="ha-running-grid">
                  {runningStories.map((topic) => (
                    <Link key={topic.slug} href={topicHref(topic.slug)} className="ha-running-card">
                      {topic.coverImage ? <img src={topicImageSmall(topic.coverImage)} alt="" width={84} height={56} loading="lazy" decoding="async" /> : null}
                      <span>
                        {topic.shortLabel ? <span className="ha-running-label">{topic.shortLabel}</span> : null}
                        <span className="ha-running-title">{topic.title}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {expoUpcoming ? (
        <section className="ha-expo" id="expo" aria-labelledby="home-expo-title">
          <div className="ha-wrap ha-expo-grid">
            <Link className="ha-expo-image" href="/wcb-expo" tabIndex={-1} aria-hidden="true">
              <img src={EXPO_2026.image} srcSet={`${EXPO_2026.image.replace(/\.webp$/, "-800.webp")} 800w, ${EXPO_2026.image} 1600w`} sizes="(max-width: 900px) calc(100vw - 32px), 50vw" alt="" width={1600} height={900} loading="lazy" decoding="async" />
            </Link>
            <div className="ha-expo-copy">
              <p className="ha-kicker">{EXPO_2026.name} · {expoDays > 1 ? `Opens in ${expoDays} days` : expoDays === 1 ? "Opens tomorrow" : "On now"}</p>
              <h2 id="home-expo-title"><Link href="/wcb-expo">The industry meets in Suzhou, {EXPO_2026.dates}</Link></h2>
              <p className="ha-expo-venue">{EXPO_2026.venue}</p>
              <p className="ha-expo-text">
                An exhibition for cleaning appliances and their supply chains, bringing brands, manufacturers, technology companies and professional buyers together.
              </p>
              <div className="ha-expo-stats">
                <div><span className="ha-expo-stat-icon">{icon(ICONS.people, 22)}</span><strong>100+</strong><span>exhibitors</span></div>
                <div><span className="ha-expo-stat-icon">{icon(ICONS.calendar, 22)}</span><strong>3 days</strong><span>forums, matchmaking, launches</span></div>
                <div><span className="ha-expo-stat-icon">{icon(ICONS.ticket, 22)}</span><strong>Free</strong><span>entry for visitors</span></div>
              </div>
              <div className="ha-actions">
                <TallyButton className="ha-button" ctaLocation="home_hero_wce_visitor" form="wceVisitor" inquiryIntent="visitor_interest">Plan your visit</TallyButton>
                <TallyButton className="ha-button ha-button--ghost" ctaLocation="home_hero_wce_exhibitor" form="wceExhibitor" inquiryIntent="exhibitor_interest">Exhibit or partner</TallyButton>
                <Link className="ha-text-link" href="/wcb-expo">About the expo →</Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Radar: three trackers built from official records. */}
      <section className="ha-section" id="radar" aria-labelledby="home-radar-title">
        <div className="ha-wrap ha-stack">
          <SectionHead id="home-radar-title" kicker="Industry radar" title="Recalls, new device approvals and rule deadlines" more={{ href: "/tools", label: "All trackers" }}>
            <p className="ha-head-text">Three trackers built from official records. They show safety problems, products on the way and rule changes before they reach the news.</p>
          </SectionHead>
          <div className="ha-radar">
            <article className="ha-radar-col ha-radar-col--recall">
              <div className="ha-radar-head">
                <span className="ha-radar-icon">{icon(ICONS.recall, 24)}</span>
                <div>
                  <h3>Product recalls</h3>
                  <p>Unsafe products pulled from sale. From US CPSC and EU Safety Gate.</p>
                  <p className="ha-radar-count">{recalls.length} logged</p>
                </div>
              </div>
              <ul className="ha-radar-list">
                {radarRecalls.map((recall) => (
                  <li key={recall.id}>
                    <span className={`ha-region ha-region--${recall.source === "CPSC" ? "us" : "eu"}`}>{recall.source === "CPSC" ? "US" : "EU"}</span>
                    <span>
                      <a href={recall.url} target="_blank" rel="noopener noreferrer">{recallName(recall)}</a>
                      <span className="ha-radar-note">{[shortDate(recall.date), recall.risk, recall.units ? recall.units.replace(/^About/, "about") + " units" : null].filter(Boolean).join(" · ")}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link className="ha-radar-all" href="/recalls">All recalls →</Link>
            </article>

            <article className="ha-radar-col ha-radar-col--fcc">
              <div className="ha-radar-head">
                <span className="ha-radar-icon">{icon(ICONS.fcc, 24)}</span>
                <div>
                  <h3>New device approvals</h3>
                  <p>Wireless products cleared by the US FCC, usually before they launch.</p>
                  <p className="ha-radar-count">{getFccCompanies().length} companies</p>
                </div>
              </div>
              <ul className="ha-radar-list">
                {radarFilings.map((filing) => (
                  <li key={`${filing.fccId}-${filing.date}`} className="ha-radar-fcc">
                    <span>
                      <span className="ha-radar-fcc-row">
                        <a href={fccIdUrl(filing.fccId)} target="_blank" rel="noopener noreferrer">{filing.company}</a>
                        <span className="ha-radar-id">{filing.fccId}</span>
                      </span>
                      <span className="ha-radar-note">{shortDate(filing.date)} · {filing.bands.join(", ") || "New product"}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link className="ha-radar-all" href="/launch-radar">All FCC filings →</Link>
            </article>

            <article className="ha-radar-col ha-radar-col--rules">
              <div className="ha-radar-head">
                <span className="ha-radar-icon">{icon(ICONS.rules, 24)}</span>
                <div>
                  <h3>Tariff and rule deadlines</h3>
                  <p>Dates when tariffs and product rules change, counted in days.</p>
                  <p className="ha-radar-count">Days left</p>
                </div>
              </div>
              <ul className="ha-radar-list">
                {radarRules.map((rule) => (
                  <li key={rule.id}>
                    <span className="ha-days">{daysUntil(rule.date, now)}</span>
                    <span>
                      <Link href={rule.href ?? "/rules-calendar"}>{rule.title}</Link>
                      <span className="ha-radar-note">{rule.region} · {shortDate(rule.date)} · {rule.sectors.length === 3 ? "All sectors" : rule.sectors.map((sector) => SECTOR_SHORT[sector]).join(", ")}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link className="ha-radar-all" href="/rules-calendar">Full rules calendar →</Link>
            </article>
          </div>
        </div>
      </section>

      {dennyCards.length > 0 ? (
        <section className="ha-section ha-section--tight" id="analysis" aria-labelledby="home-denny-title">
          <div className="ha-wrap ha-stack">
            <SectionHead id="home-denny-title" kicker="Analysis" title="From Denny You" more={{ href: "/blog/archive", label: `All ${editorial.length} analyses` }} />
            <div className="ha-denny">
              <img src="/images/home/denny-you.webp" alt="Denny You" width={56} height={56} loading="lazy" decoding="async" />
              <p>
                <strong>Denny You (游丹尼)</strong> · Founder and editor of World Clean Biz. In the cleaning industry since 2006, writing about it since 2017.
              </p>
              <Link className="ha-more" href="/about">About Denny →</Link>
            </div>
            <div className="ha-cards ha-cards--four">
              {dennyCards.map((card) => (
                <Link key={card.key} className="ha-card" href={card.href}>
                  <span className={`ha-card-image${card.video ? " ha-card-image--video" : ""}`}>
                    {card.video ? (
                      <>
                        <img src={card.image} alt="" loading="lazy" decoding="async" />
                        <span className="ha-play" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg></span>
                        <span className="ha-duration">{card.video}</span>
                      </>
                    ) : (
                      <img {...responsiveImageProps(card.image, "card")} alt="" />
                    )}
                  </span>
                  <span className="ha-card-body">
                    <span className="ha-card-type">{card.type}</span>
                    <span className="ha-card-title">{card.title}</span>
                    <span className="ha-card-meta">{card.meta}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Directory: categories, companies, ownership and new products. */}
      <section className="ha-section ha-section--soft" id="directory" aria-labelledby="home-directory-title">
        <div className="ha-wrap ha-stack">
          <SectionHead
            id="home-directory-title"
            kicker="Directory"
            title={`${brands.length} companies and ${featuredProductModels.length} new models, each with sources`}
            more={{ href: "/brands", label: "Open the directory" }}
          />

          <SubHead id="home-categories-title" title="Browse by category" more={{ href: "/categories", label: "All categories" }} />
          <div className="ha-categories">
            {hubs.map((data) => {
              // Companies whose main category is this hub first, key brands among them first, then by coverage.
              const isHome = (slug: string) => (hubOfBrand.get(slug) === data.hub.name ? 1 : 0);
              const leaders = [...data.companies]
                .sort((a, b) => isHome(b.slug) - isHome(a.slug) || compareKeyBrands(a.slug, b.slug) || (articleCount.get(b.slug) ?? 0) - (articleCount.get(a.slug) ?? 0))
                .slice(0, 3);
              const picture = CATEGORY_IMAGES[data.hub.slug];
              return (
                <Link key={data.hub.slug} className="ha-category" href={`/categories/${data.hub.slug}`}>
                  <span className="ha-category-image">
                    {picture ? (
                      picture.src.startsWith("/images/articles/") ? (
                        <img {...responsiveImageProps(picture.src, "card")} alt={picture.alt} />
                      ) : (
                        <img src={picture.src} alt={picture.alt} loading="lazy" decoding="async" />
                      )
                    ) : null}
                  </span>
                  <span className="ha-category-name">{data.hub.name}</span>
                  <span className="ha-category-logos">
                    {leaders.map((brand) => <Logo key={brand.slug} mark={marks.get(brand.slug)} />)}
                  </span>
                </Link>
              );
            })}
            {hubs.length % 5 ? (
              <Link className="ha-category ha-category--all" href="/categories">
                <span className="ha-category-image">
                  <span className="ha-icon-tile ha-icon-tile--lg">{icon(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>, 30)}</span>
                </span>
                <span className="ha-category-name">All categories →</span>
                <span className="ha-category-note">Companies, products and news by category</span>
              </Link>
            ) : null}
          </div>

          <SubHead id="home-companies-title" title="Featured companies" more={{ href: "/brands", label: `All ${brands.length}` }} />
          <div className="ha-companies">
            {topCompanies.map((brand) => (
              <Link key={brand.slug} className="ha-company" href={`/brands/${brand.slug}`}>
                <Logo mark={marks.get(brand.slug)} />
                <span>
                  <span className="ha-company-name">{brand.name}</span>
                  {hubOfBrand.get(brand.slug) ? <span className="ha-company-hub">{hubOfBrand.get(brand.slug)}</span> : null}
                </span>
              </Link>
            ))}
          </div>

          {ownershipPairs.length > 0 ? (
            <>
              <SubHead id="home-owners-title" title="Who owns what" more={{ href: "/brands#company-owners-title", label: "All groups" }} />
              <div className="ha-owners">
                {ownershipPairs.map(({ brand, parentProfile, parentName }) => (
                  <Link key={brand.slug} className="ha-owner" href={`/brands/${brand.slug}`}>
                    <span className="ha-owner-logos">
                      <Logo mark={marks.get(brand.slug)} />
                      <span className="ha-owner-arrow">{icon(ICONS.arrow)}</span>
                      <Logo mark={marks.get(parentProfile!.slug)} />
                    </span>
                    <span className="ha-owner-text"><strong>{brand.name}</strong> is owned by <strong>{parentName}</strong></span>
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          {newModels.length > 0 ? (
            <>
              <SubHead id="home-products-title" title="New products" more={{ href: "/products", label: `All ${featuredProductModels.length} new ${productSelectionYear} models` }} />
              <div className="ha-products">
                {newModels.map((model) => (
                  <Link key={model.slug} className="ha-product" href={`/products/${model.slug}`}>
                    <span className="ha-product-image">
                      <img {...responsiveImageProps(productCover(model.slug), "card")} alt={model.name} />
                    </span>
                    <span className="ha-product-body">
                      <span className="ha-product-meta">
                        {thisYear(model) ? <span className="ha-new">NEW {productSelectionYear}</span> : null}
                        {productCategoryLabel(model.category)}
                      </span>
                      <span className="ha-product-name">{model.name}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* For business: tools, the report, sourcing help and the events calendar. */}
      <section className="ha-section" id="business" aria-labelledby="home-business-title">
        <div className="ha-wrap ha-stack">
          <SectionHead id="home-business-title" kicker="For business" title="Free tools, a report, sourcing help and the events calendar" more={{ href: "/tools", label: "All tools" }} />
          <div className="ha-tools">
            <HomeToolCards />
          </div>
          <div className="ha-business">
            <div className="ha-business-main">
              <article className="ha-panel">
                <img className="ha-report-cover" src={FEATURED_REPORT.cover} alt={`Report cover: ${FEATURED_REPORT.title}`} width={112} height={168} loading="lazy" decoding="async" />
                <div className="ha-panel-copy">
                  <p className="ha-kicker">Free report · {FEATURED_REPORT.pages} pages</p>
                  <h3>{FEATURED_REPORT.title}</h3>
                  <p>Where growth goes next: yard, pool and commercial cleaning robots.</p>
                  <div className="ha-actions">
                    <TallyReportButton className="ha-button" ctaLocation="home_business_report" reportId={FEATURED_REPORT.id}>Get the free PDF</TallyReportButton>
                    <Link className="ha-text-link ha-text-link--blue" href="/reports">All reports →</Link>
                  </div>
                </div>
              </article>
              <article className="ha-panel">
                <div className="ha-panel-copy">
                  <p className="ha-kicker">Sourcing</p>
                  <h3>Looking for a supplier or factory?</h3>
                  <p>Tell us the product and market. We reply within two working days.</p>
                  <div className="ha-actions">
                    <TallyButton className="ha-button" ctaLocation="home_business_sourcing" form="sourcing">Send a sourcing request</TallyButton>
                    <Link className="ha-text-link ha-text-link--blue" href="/sourcing">How it works →</Link>
                  </div>
                </div>
                <ul className="ha-pills" aria-label="Sourcing by category">
                  {sourcingLinks.map((link) => (
                    <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                  ))}
                </ul>
              </article>
            </div>

            <article className="ha-events">
              <div className="ha-events-head">
                <span className="ha-radar-icon">{icon(ICONS.calendar, 24)}</span>
                <div>
                  <h3>Industry events calendar</h3>
                  <p>Trade shows for cleaning appliances, by date</p>
                </div>
              </div>
              <ul className="ha-events-list">
                {nextEvents.map((event) => {
                  const badge = eventBadge(event);
                  const body = (
                    <>
                      <span className="ha-date" aria-hidden="true"><span>{badge.month}</span><strong>{badge.day}</strong></span>
                      <span className="ha-event-copy">
                        <span className="ha-event-name">{event.name}</span>
                        <span className="ha-event-meta">{eventDateRange(event)} · {event.city}, {event.country}</span>
                      </span>
                      {event.wcb ? <span className="ha-ours">Our show</span> : null}
                    </>
                  );
                  return (
                    <li key={event.slug} className={event.wcb ? "is-wcb" : undefined}>
                      {event.url.startsWith("/") ? (
                        <Link href={event.url}>{body}</Link>
                      ) : (
                        <a href={event.url} target="_blank" rel="noopener noreferrer">{body}</a>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Link className="ha-radar-all" href="/events">Full events calendar →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="ha-subscribe" id="subscribe" aria-labelledby="home-subscribe-title">
        <div className="ha-wrap ha-subscribe-row">
          <div className="ha-subscribe-copy">
            <span className="ha-radar-icon ha-radar-icon--lg">{icon(ICONS.mail, 28)}</span>
            <div>
              <h2 id="home-subscribe-title">The whole industry, in your inbox</h2>
              <p>New products, company moves, supply chain and policy, for cleaning professionals.</p>
            </div>
          </div>
          <div className="ha-subscribe-action">
            <TallyButton className="ha-button ha-button--lg" ctaLocation="home_subscribe_band" form="newsletter">Subscribe</TallyButton>
            <p>Unsubscribe with one click, any time.</p>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
    </div>
  );
}
