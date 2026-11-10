import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { responsiveImageProps } from "@/lib/articleImages";
import { getNews, getNewsVisual, newsDate } from "@/lib/news";
import { getInsights } from "@/lib/content";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { buildBrandMarkIndex } from "@/lib/brandMarks";
import { CompanyMark } from "@/components/ui/CompanyMark";
import { TopicChart } from "@/components/topics/TopicChart";
import { ShareBar } from "@/components/share/ShareBar";
import { compareKeyBrands } from "@/lib/keyBrands";
import { seoDescription, seoTitle } from "@/lib/seo";
import { getTopic, getTopics, topicDate, topicImageSmall } from "@/lib/topics";

type PageParams = Promise<{ slug: string }>;

const siteUrl = "https://worldcleanbiz.com";

export function generateStaticParams() {
  return getTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  const title = seoTitle(topic.seoTitle || topic.title);
  const description = seoDescription(topic.description);
  const canonical = `/topics/${topic.slug}`;
  const images = topic.coverImage ? [topic.coverImage] : [];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "website", url: canonical, images },
    twitter: { card: "summary_large_image", title, description, images }
  };
}

export default async function TopicPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  // Pictures for timeline and news entries: the story's own visual, or the analysis cover.
  const news = getNews();
  const insights = getInsights();
  const thumbFor = (href?: string) => {
    if (!href) return undefined;
    const [, kind, itemSlug] = href.split("/");
    if (kind === "news") {
      const item = news.find((entry) => entry.slug === itemSlug);
      const visual = item ? getNewsVisual(item) : undefined;
      return visual && visual.label !== "Industry context" ? { src: visual.src, contain: visual.fit === "contain" } : undefined;
    }
    if (kind === "blog") {
      const article = insights.find((entry) => entry.slug === itemSlug);
      return article?.coverImage ? { src: article.coverImage, contain: false } : undefined;
    }
    return undefined;
  };

  // Companies in this topic: those tagged on its news and analysis, most-mentioned first.
  const profiles = getPublishedBrandProfiles(insights);
  const marks = buildBrandMarkIndex(profiles);
  const mentions = new Map<string, number>();
  for (const slugs of [...topic.newsArticles.map((item) => item.brandSlugs), ...topic.insightArticles.map((item) => item.primaryBrands)]) {
    for (const brand of new Set(slugs)) mentions.set(brand, (mentions.get(brand) ?? 0) + 1);
  }
  const companies = [...mentions.entries()]
    .filter(([brand]) => marks.has(brand))
    .sort((a, b) => b[1] - a[1] || compareKeyBrands(a[0], b[0]) || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([brand]) => marks.get(brand)!);

  const url = `${siteUrl}/topics/${topic.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": url,
      name: topic.title,
      description: topic.description,
      url,
      dateModified: topic.updated,
      hasPart: [
        ...topic.insightArticles.map((article) => ({ "@type": "Article", headline: article.title, url: `${siteUrl}/blog/${article.slug}` })),
        ...topic.newsArticles.map((article) => ({ "@type": "NewsArticle", headline: article.title, url: `${siteUrl}/news/${article.slug}` }))
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: topic.questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Topics", item: `${siteUrl}/topics` },
        { "@type": "ListItem", position: 3, name: topic.title, item: url }
      ]
    }
  ];

  // The timeline runs oldest to newest: the latest events stay open, earlier ones fold above them.
  const TIMELINE_OPEN = 5;
  const timelineItem = (event: (typeof topic.timeline)[number]) => (
      <li key={`${event.date}-${event.title}`}>
                  <time dateTime={event.date}>{topicDate(event.date)}</time>
                  <div className="topic-event">
                    <div>
                      <h3>{event.href ? <Link href={event.href}>{event.title}</Link> : event.title}</h3>
                      <p>{event.text}</p>
                    </div>
                    {(() => {
                      const thumb = thumbFor(event.href);
                      return thumb && event.href ? (
                        <Link className={`topic-event-thumb${thumb.contain ? " is-contain" : ""}`} href={event.href} tabIndex={-1} aria-hidden="true">
                          <img src={thumb.src} alt="" loading="lazy" decoding="async" />
                        </Link>
                      ) : null;
                    })()}
                  </div>
                </li>
  );

  return (
    <article className="topic-page">
      <header className="topic-hero">
        <div className={`topic-container${topic.coverImage ? " topic-hero-grid" : ""}`}>
          <div className="topic-hero-copy">
          <nav className="topic-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/topics">Topics</Link>
          </nav>
          <p className="topic-eyebrow">WCB Topic · Updated {topicDate(topic.updated)}</p>
          <h1>{topic.title}</h1>
          <p className="topic-dek">{topic.dek}</p>
          <div className="topic-status">
            <strong>{topic.status.label}</strong>
            <p>{topic.status.text}</p>
          </div>
          <ShareBar title={topic.title} url={url} />
          </div>
          {topic.coverImage ? (
            <figure className="topic-hero-media">
              <img
                src={topicImageSmall(topic.coverImage)}
                srcSet={`${topicImageSmall(topic.coverImage)} 600w, ${topic.coverImage} 1000w`}
                sizes="(max-width: 900px) calc(100vw - 32px), 460px"
                alt=""
                width={600}
                height={375}
                fetchPriority="high"
              />
              {topic.coverCredit ? <figcaption>{topic.coverCredit.text}</figcaption> : null}
            </figure>
          ) : null}
        </div>
      </header>

      {companies.length ? (
        <nav className="topic-companies" aria-label="Companies in this topic">
          <div className="topic-container">
            <span className="topic-companies-label">Companies in this topic</span>
            <ul>
              {companies.map((mark) => (
                <li key={mark.slug}>
                  <Link href={`/brands/${mark.slug}`} title={mark.name}>
                    <CompanyMark mark={mark} size="sm" showName />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}

      <div className="topic-container topic-layout">
        <div className="topic-main">
          <section aria-labelledby="topic-summary">
            <h2 id="topic-summary">The story so far</h2>
            {topic.summary.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
            {topic.chart ? <TopicChart chart={topic.chart} /> : null}
          </section>

          {topic.callout ? (
            <aside className="topic-callout">
              <h3>{topic.callout.title}</h3>
              <p>{topic.callout.text}</p>
              {topic.callout.href ? (
                <a href={topic.callout.href} target="_blank" rel="noopener noreferrer">Source</a>
              ) : null}
            </aside>
          ) : null}

          <section aria-labelledby="topic-timeline">
            <h2 id="topic-timeline">Timeline</h2>
            {topic.timeline.length > TIMELINE_OPEN ? (
              <details className="topic-earlier">
                <summary>Earlier events ({topic.timeline.length - TIMELINE_OPEN})</summary>
                <ol className="topic-timeline">{topic.timeline.slice(0, -TIMELINE_OPEN).map(timelineItem)}</ol>
              </details>
            ) : null}
            <ol className="topic-timeline">
              {topic.timeline.slice(-TIMELINE_OPEN).map((event) => (
                timelineItem(event)
              ))}
            </ol>
          </section>

          <section aria-labelledby="topic-questions">
            <h2 id="topic-questions">Key questions</h2>
            <div className="topic-questions">
              {topic.questions.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="topic-side">
          <section className="topic-panel" aria-labelledby="topic-facts">
            <h2 id="topic-facts">Key facts</h2>
            <dl className="topic-facts">
              {topic.keyFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {topic.newsArticles.length ? (
            <section className="topic-panel" aria-labelledby="topic-news">
              <h2 id="topic-news">News</h2>
              <ul className="topic-news">
                {topic.newsArticles.map((article) => (
                  <li key={article.slug}>
                    {(() => {
                      const thumb = thumbFor(`/news/${article.slug}`);
                      return thumb ? (
                        <span className={`topic-news-thumb${thumb.contain ? " is-contain" : ""}`} aria-hidden="true">
                          <img src={thumb.src} alt="" loading="lazy" decoding="async" />
                        </span>
                      ) : null;
                    })()}
                    <span className="topic-news-copy">
                      <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time>
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>

      {topic.insightArticles.length ? (
        <section className="topic-analysis" aria-labelledby="topic-analysis">
          <div className="topic-container">
            <h2 id="topic-analysis">Analysis</h2>
            <ul className="topic-cards">
              {topic.insightArticles.map((article) => (
                <li key={article.slug}>
                  <Link className="topic-card" href={`/blog/${article.slug}`}>
                    {article.coverImage ? (
                      <img {...responsiveImageProps(article.coverImage, "card")} alt={article.coverAlt || ""} />
                    ) : null}
                    <span className="topic-card-copy">
                      <strong>{article.title}</strong>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <footer className="topic-container topic-sources">
        <details>
        <summary><h2>Sources ({topic.sources.length})</h2></summary>
        <ul>
          {topic.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
            </li>
          ))}
          {topic.coverCredit ? (
            <li>
              Image: <a href={topic.coverCredit.url} target="_blank" rel="noopener noreferrer">{topic.coverCredit.text}</a>
            </li>
          ) : null}
        </ul>
        </details>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </article>
  );
}
