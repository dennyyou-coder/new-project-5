import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getInsight, getInsights, markdownToHtml } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = "https://worldcleanbiz.com";

export function generateStaticParams() {
  return getInsights().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);

  if (!article) {
    return {};
  }

  const url = `${siteUrl}/insights/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/insights/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      url,
      images: article.coverImage ? [article.coverImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined
    }
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getInsight(slug);
  const articles = getInsights();

  if (!article) {
    notFound();
  }

  const sameCategory = articles.filter(
    (item) => item.slug !== slug && item.category === article.category
  );
  const fillers = articles.filter(
    (item) =>
      item.slug !== slug && !sameCategory.some((related) => related.slug === item.slug)
  );
  const related = [...sameCategory, ...fillers].slice(0, 3);
  const hasTakeaways = article.takeaways.length > 0;
  const url = `${siteUrl}/insights/${article.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: article.author
    },
    url
  };

  return (
    <>
      <section className="blog-article-hero">
        <div className="blog-article-container">
          <div className="signal-detail-meta">
            <span>{article.category}</span>
            <span>{article.date}</span>
            <span>{article.readingTime}</span>
          </div>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <p className="signal-detail-author">By {article.author}</p>
        </div>
      </section>

      <section className="blog-article-section">
        <div className="blog-article-container">
          <article className="article-prose blog-article-main">
            {hasTakeaways ? (
              <div className="blog-key-points">
                <strong>Key Points</strong>
                <ul>
                  {article.takeaways.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {article.youtubeId ? (
              <div className="article-video">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  src={`https://www.youtube.com/embed/${article.youtubeId}`}
                  title={article.title}
                />
              </div>
            ) : null}

            <div
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(article.content)
              }}
            />

            <footer className="blog-author-note">
              <p>
                Denny You has worked inside the cleaning industry since 2006.
                World Clean Biz turns front-line product, supplier and category
                signals into practical industry intelligence.
              </p>
            </footer>
          </article>

        {related.length ? (
          <div className="blog-related-signals">
            <h2>Related Insights</h2>
            <div className="related-signal-grid">
              {related.map((item) => (
                <Link
                  className="related-signal-card"
                  href={`/insights/${item.slug}`}
                  key={item.slug}
                >
                  <div className="meta">{item.category}</div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span>Read Signal</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

          <div className="blog-article-footer-cta">
            <Link href="/contact">Submit Inquiry</Link>
            <Link href="/insights">Latest Industry Signals</Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
