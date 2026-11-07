import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { responsiveImageProps } from "@/lib/articleImages";
import { newsDate } from "@/lib/news";
import { seoDescription, seoTitle } from "@/lib/seo";
import { getTopic, getTopics, topicDate } from "@/lib/topics";

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

  return (
    <article className="topic-page">
      <header className="topic-hero">
        <div className="topic-container">
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
        </div>
      </header>

      <div className="topic-container topic-layout">
        <div className="topic-main">
          <section aria-labelledby="topic-summary">
            <h2 id="topic-summary">The story so far</h2>
            {topic.summary.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
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
            <ol className="topic-timeline">
              {topic.timeline.map((event) => (
                <li key={`${event.date}-${event.title}`}>
                  <time dateTime={event.date}>{topicDate(event.date)}</time>
                  <div>
                    <h3>{event.href ? <Link href={event.href}>{event.title}</Link> : event.title}</h3>
                    <p>{event.text}</p>
                  </div>
                </li>
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
                    <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time>
                    <Link href={`/news/${article.slug}`}>{article.title}</Link>
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
                      <span>{article.excerpt}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <footer className="topic-container topic-sources">
        <h2>Sources</h2>
        <ul>
          {topic.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
            </li>
          ))}
        </ul>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </article>
  );
}
