import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./styles/home.css";
import "./styles/homepage-editorial.css";
import { HomeSeriesFeature } from "@/components/HomeSeriesFeature";
import { HomeVideos } from "@/components/HomeVideos";
import { BusinessServices } from "@/components/BusinessServices";
import { TallyButton } from "@/components/LeadForms";
import { getInsights } from "@/lib/content";
import {
  getEditorialInsights,
  getLatestSeriesInsight,
} from "@/lib/insightCollections";
import { responsiveImageProps } from "@/lib/articleImages";
import { getNews, newsDate, newsTopicLabel } from "@/lib/news";
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
  const news = getNews().slice(0, 4);
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
    <div className="refresh-home home-editorial">
      <section className="editorial-hero" aria-labelledby="home-title">
        <div className="editorial-hero-scene">
          <Image
            src="/images/industry/about-forum-stage-2025.jpg"
            alt="Denny You speaking to cleaning industry professionals at a 2025 forum"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 70vw"
          />
        </div>
        <div className="container editorial-hero-inner">
          <div className="editorial-hero-copy">
            <p className="eyebrow">World Clean Biz · A view from inside</p>
            <h1 id="home-title">
              Inside the global
              <br />
              <em>cleaning industry.</em>
            </h1>
            <p className="editorial-hero-lead">
              The companies. The people.
              <br />
              The opportunities ahead.
            </p>
            <p className="editorial-hero-description">
              Independent analysis, product intelligence and real industry
              connections — from the factory floor to WCB Expo.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/wcb-expo">
                Explore WCB Expo <span aria-hidden="true">↗</span>
              </Link>
              <Link className="editorial-hero-secondary" href="/contact">
                Work With WCB <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="editorial-hero-caption">
            <span>ON THE GROUND</span>
            <p>Conversations that connect an industry.</p>
            <small>Cleaning industry forum · 2025</small>
          </div>
        </div>
        <div className="editorial-hero-foot">
          <div className="container">
            <span>Independent perspectives. Practical connections.</span>
            <Link href="#founder-journal">
              Follow the founder’s journey <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </section>
      {latestFounderSeries && (
        <section
          className="editorial-journal"
          id="founder-journal"
          aria-label="Denny You's founder journal"
        >
          <div className="container">
            <HomeSeriesFeature article={latestFounderSeries} />
          </div>
        </section>
      )}
      <section
        className="refresh-section"
        aria-labelledby="industry-focus-title"
      >
        <div className="container">
          <div className="refresh-section-head">
            <div>
              <p className="eyebrow">Industry focus</p>
              <h2 id="industry-focus-title">What Matters Now</h2>
            </div>
            <Link href="/news">All news →</Link>
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
              {news.map((item) => (
                <article key={item.slug}>
                  <span className="eyebrow">{newsTopicLabel(item.topic)}</span>
                  <h3>
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.excerpt}</p>
                  <time className="refresh-meta" dateTime={item.eventDate}>
                    {newsDate(item.eventDate)}
                  </time>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="refresh-section refresh-soft" id="featured-analysis">
        <div className="container">
          <div className="refresh-section-head">
            <div>
              <p className="eyebrow">Insights &amp; analysis</p>
              <h2>Selected Industry Analysis</h2>
            </div>
            <Link href="/blog">All insights →</Link>
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
      <section
        className="refresh-section editorial-expo"
        aria-labelledby="home-wcb-expo-title"
      >
        <div className="container refresh-expo">
          <Image
            src="/images/industry/home-expo-networking-2025.jpg"
            alt="Visitors meeting at a previous WCB industry gathering"
            width={1440}
            height={960}
            sizes="(max-width: 760px) 92vw, 45vw"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">WCB Expo 2026</p>
            <h2 id="home-wcb-expo-title">Meet the Industry in Suzhou</h2>
            <p>
              Discover cleaning products and meet brands, manufacturers,
              suppliers and professional buyers.
            </p>
            <p className="refresh-expo-date">
              <strong>18–20 November 2026</strong>
              <br />
              Suzhou Shishan Convention Center · Suzhou, China
            </p>
            <div className="hero-actions">
              <TallyButton
                ctaLocation="home_wce_exhibitor"
                form="wceExhibitor"
                inquiryIntent="exhibitor_interest"
              >
                Exhibit / Partner
              </TallyButton>
              <TallyButton
                className="button-secondary"
                ctaLocation="home_wce_visitor"
                form="wceVisitor"
                inquiryIntent="visitor_interest"
              >
                Plan Your Visit
              </TallyButton>
            </div>
            <Link href="/wcb-expo" className="refresh-card-link">
              Explore WCB Expo →
            </Link>
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
              <Link className="button" href="/about">
                Meet Denny You →
              </Link>
              <Link href={`/blog/series/${founderSeries}`}>
                Read my founder’s journal ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
      <BusinessServices />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
