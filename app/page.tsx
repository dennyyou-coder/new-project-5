import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./styles/home.css";
import { HomeVideos } from "@/components/HomeVideos";
import { BusinessServices } from "@/components/BusinessServices";
import { TallyButton } from "@/components/LeadForms";
import { getInsights } from "@/lib/content";
import { getEditorialInsights } from "@/lib/insightCollections";
import { responsiveImageProps } from "@/lib/articleImages";
import { getNews, newsDate, newsTopicLabel } from "@/lib/news";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function HomePage() {
  const editorial = getEditorialInsights(getInsights());
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
    <div className="refresh-home">
      <section className="refresh-home-hero">
        <div className="container refresh-home-hero-inner">
          <div>
            <p className="eyebrow">World Clean Biz</p>
            <h1>
              Understand the industry.
              <br />
              Connect with opportunity.
            </h1>
            <p>
              Independent perspectives on cleaning companies, products and
              markets.
              <br />
              Business connections through content and WCB Expo.
            </p>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/wcb-expo">
              Explore WCB Expo →
            </Link>
            <Link className="button-secondary" href="/contact">
              Work With WCB →
            </Link>
          </div>
        </div>
      </section>
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
        className="refresh-section"
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
      <BusinessServices />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
