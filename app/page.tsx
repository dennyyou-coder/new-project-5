import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./styles/home.css";
import "./styles/approved-home.css";
import { HomeSeriesFeature } from "@/components/HomeSeriesFeature";
import { NewsImage, NewsImageCaption } from "@/components/news/NewsImage";
import { HomeVideos } from "@/components/HomeVideos";
import { BusinessServices } from "@/components/BusinessServices";
import { TallyButton } from "@/components/LeadForms";
import { getInsights } from "@/lib/content";
import {
  getEditorialInsights,
  getLatestSeriesInsight,
} from "@/lib/insightCollections";
import { responsiveImageProps } from "@/lib/articleImages";
import { getNews, getNewsVisual, newsDate, newsTopicLabel, type NewsArticle } from "@/lib/news";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function HomePage() {
  const articles = getInsights();
  const founderSeries = "building-worlds-no-1-cleaning-show-from-scratch";
  const latestFounderSeries = getLatestSeriesInsight(articles, founderSeries);
  const editorial = getEditorialInsights(articles).filter(
    (article) => article.series !== founderSeries,
  );
  const featured = editorial[0];
  const analysis = editorial
    .filter(
      (article) => article.slug !== featured?.slug && !article.seriesTitle,
    )
    .slice(0, 3);
  const news: { article: NewsArticle; visual: NonNullable<ReturnType<typeof getNewsVisual>> }[] = [];
  // Keep the existing date order and let new stories with verified imagery enter naturally.
  for (const article of getNews()) {
    const visual = getNewsVisual(article);
    if (!visual) continue;
    news.push({ article, visual });
    if (news.length === 3) break;
  }
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
        url: "https://worldcleanbiz.com/about",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://worldcleanbiz.com/#website",
      name: "World Clean Biz",
      url: "https://worldcleanbiz.com",
      publisher: { "@id": "https://worldcleanbiz.com/#organization" },
    },
  ];
  return (
    <div className="glacier-home">
      <section className="glacier-hero" aria-labelledby="home-title">
        <div className="container glacier-hero-heading">
          <h1 id="home-title">Inside the global cleaning industry.</h1>
          <div>
            <p className="glacier-hero-lead">The companies. The people.<br />The opportunities ahead.</p>
            <p className="glacier-hero-description">Independent analysis, product intelligence and real industry connections — from the factory floor to WCB Expo.</p>
          </div>
        </div>
        <figure className="glacier-hero-media">
          <Image src="/images/industry/home-expo-networking-2025.jpg"
            alt="Visitors and suppliers meeting at a previous WCB cleaning industry gathering in 2025"
            width={2200} height={1467} priority sizes="100vw" />
          <figcaption>Previous WCB industry gathering · 2025</figcaption>
        </figure>
        <div className="glacier-expo-strip" aria-labelledby="home-wcb-expo-title">
          <div className="container glacier-expo-inner">
            <div><strong>WCB Expo 2026</strong><h2 id="home-wcb-expo-title">Meet the Industry in Suzhou</h2></div>
            <p>Discover cleaning products and meet brands, manufacturers, suppliers and professional buyers.</p>
            <div className="glacier-expo-date"><strong>18–20 November 2026</strong><span>Suzhou Shishan Convention Center · Suzhou, China</span></div>
            <div className="glacier-expo-actions">
              <TallyButton ctaLocation="home_wce_exhibitor" form="wceExhibitor" inquiryIntent="exhibitor_interest">Exhibit / Partner</TallyButton>
              <div><TallyButton className="glacier-text-link" ctaLocation="home_wce_visitor" form="wceVisitor" inquiryIntent="visitor_interest">Plan Your Visit</TallyButton><Link className="glacier-text-link" href="/wcb-expo">Explore WCB Expo</Link></div>
            </div>
          </div>
        </div>
      </section>
      {latestFounderSeries && (
        <section
          className="glacier-journal"
          id="founder-journal"
          aria-label="Denny You's founder journal"
        >
          <div className="container">
            <HomeSeriesFeature article={latestFounderSeries} />
          </div>
        </section>
      )}
      <section
        className="refresh-section editorial-focus"
        aria-labelledby="industry-focus-title"
      >
        <div className="container">
          <div className="refresh-section-head">
            <div>
              <p className="eyebrow">Industry focus</p>
              <h2 id="industry-focus-title">What Matters Now</h2>
            </div>
            <Link className="home-quiet-link" href="/news">All news</Link>
          </div>
          <div className="refresh-focus-grid">
            {featured && (
              <article className="refresh-featured">
                <Link href={`/blog/${featured.slug}`}>
                  {featured.coverImage && (
                    <img
                      {...responsiveImageProps(featured.coverImage, "card")}
                      alt={featured.coverAlt || featured.title}
                    />
                  )}
                  <span className="eyebrow">
                    Editor's pick · {featured.category}
                  </span>
                  <h3>{featured.title}</h3>
                  <p>{featured.excerpt}</p>
                  <span className="refresh-meta">
                    {featured.date} · {featured.readingTime}
                  </span>
                </Link>
              </article>
            )}
            <div className="refresh-news-list">
              <h3>Latest Industry News</h3>
              <div className="editorial-news-stack">
                {news.map(({ article: item }) => (
                  <article key={item.slug}>
                    <div className="editorial-news-visual"><Link className="editorial-news-thumb" href={`/news/${item.slug}`} aria-label={item.title}>
                      <NewsImage article={item} />
                    </Link><NewsImageCaption article={item} /></div>
                    <div className="editorial-news-copy">
                      <span className="eyebrow">{newsTopicLabel(item.topic)}</span>
                      <h3><Link href={`/news/${item.slug}`}>{item.title}</Link></h3>
                      <p>{item.excerpt}</p>
                      <time className="refresh-meta" dateTime={item.eventDate}>{newsDate(item.eventDate)}</time>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <BusinessServices />
      <section className="refresh-section refresh-soft" id="featured-analysis">
        <div className="container">
          <div className="refresh-section-head">
            <div>
              <p className="eyebrow">Insights &amp; analysis</p>
              <h2>Selected Industry Analysis</h2>
            </div>
            <Link className="home-quiet-link" href="/blog">All insights</Link>
          </div>
          <div className="refresh-analysis-grid">
            {analysis.map((article) => (
              <Link
                className="refresh-analysis-card"
                href={`/blog/${article.slug}`}
                key={article.slug}
              >
                {article.coverImage && (
                  <img
                    {...responsiveImageProps(article.coverImage, "card")}
                    alt={article.coverAlt || article.title}
                  />
                )}
                <span className="eyebrow">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="refresh-soft">
        <HomeVideos />
      </div>
      <section
        className="editorial-founder"
        id="meet-denny"
        aria-labelledby="meet-denny-title"
      >
        <div className="container editorial-founder-grid">
          <figure>
            <Image
              src="/images/site-refresh/about/about-hero-denny.webp"
              alt="Denny You discussing the cleaning industry at a forum"
              width={1600}
              height={1200}
              sizes="(max-width: 760px) 92vw, 40vw"
              loading="lazy"
            />
            <figcaption>
              Denny You <span>Founder, World Clean Biz</span>
            </figcaption>
          </figure>
          <div className="editorial-founder-copy">
            <p className="eyebrow">The person behind World Clean Biz</p>
            <h2 id="meet-denny-title">
              An industry perspective.
              <br />
              Built through experience.
            </h2>
            <p className="editorial-founder-intro">
              I’m Denny You. I’ve worked in the cleaning industry since 2006 —
              across products, factories, supply chains and international
              markets.
            </p>
            <p>
              World Clean Biz brings that experience into independent analysis
              and business connections. Through WCB Expo, I’m working to bring
              more of the industry together.
            </p>
            <div className="editorial-founder-facts">
              <div>
                <strong>Since 2006</strong>
                <span>Cleaning industry experience</span>
              </div>
              <div>
                <strong>Entrepreneur</strong>
                <span>Products &amp; supply chains</span>
              </div>
              <div>
                <strong>WCB Expo</strong>
                <span>Founder &amp; organizer</span>
              </div>
            </div>
            <div className="editorial-founder-actions">
              <Link className="button-secondary" href="/about">
                Meet Denny You
              </Link>
              <Link className="home-quiet-link" href={`/blog/series/${founderSeries}`}>
                Read my founder’s journal
              </Link>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
