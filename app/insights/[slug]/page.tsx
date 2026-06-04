import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconBadge, InlineIcon } from "@/components/Icon";
import { getInsight, getInsights, markdownToHtml } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = "https://worldcleanbiz.com";

function getWhyThisMatters(category: string) {
  if (category === "Pool Cleaning") {
    return [
      {
        title: "For Brands",
        text: "Understand how pool cleaning market developments may affect product strategy and future opportunities."
      },
      {
        title: "For Suppliers",
        text: "Identify shifts in demand, technology and customer expectations across the pool cleaning category."
      },
      {
        title: "For Distributors",
        text: "Track product movement and regional signals that may shape future channel decisions."
      }
    ];
  }

  if (category === "Vacuum" || category === "Floorcare") {
    return [
      {
        title: "For Brands",
        text: "Understand how category movement may affect product planning, positioning and future opportunities."
      },
      {
        title: "For Retailers",
        text: "Track product and customer expectation shifts that may influence assortment and channel decisions."
      },
      {
        title: "For Manufacturers",
        text: "Identify technology, feature and demand signals that may shape product development priorities."
      }
    ];
  }

  return [
    {
      title: "For Brands",
      text: "Understand how market developments may affect product strategy and future opportunities."
    },
    {
      title: "For Suppliers",
      text: "Identify shifts in demand, technology and customer expectations."
    },
    {
      title: "For Industry Professionals",
      text: "Stay informed about developments shaping the future of the cleaning industry."
    }
  ];
}

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
  const summaryPoints = hasTakeaways
    ? article.takeaways.slice(0, 3)
    : [article.excerpt];
  const whyThisMatters = getWhyThisMatters(article.category);
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
      <section className="signal-detail-hero page-hero page-hero-insights">
        <div className="container">
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

      <section className="signal-summary-section">
        <div className="container signal-summary-card">
          <div>
            <p className="eyebrow">
              <InlineIcon name="radio" />
              Signal Summary
            </p>
            <h2>Understand the value of this signal in 10 seconds</h2>
          </div>
          <div className="signal-summary-list">
            {summaryPoints.map((point, index) => (
              <div className="signal-summary-item" key={point}>
                <span>
                  {index === 0
                    ? "What changed"
                    : index === 1
                      ? "Why it matters"
                      : "What to watch next"}
                </span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section signal-detail-section">
        <div className="container signal-detail-shell">
          <article className="article-prose signal-detail-main">
            {hasTakeaways ? (
              <div className="key-takeaways">
                <div className="module-kicker">
                  <InlineIcon name="clipboard" />
                  Key Takeaways
                </div>
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
          </article>
        </div>

        <div className="container signal-business-context">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                <InlineIcon name="lightbulb" />
                Why This Matters
              </p>
              <h2>Turn this signal into business context</h2>
            </div>
          </div>
          <div className="grid-3">
            {whyThisMatters.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {related.length ? (
          <div className="container related-signals">
            <div className="section-head">
              <div>
                <p className="eyebrow">
                  <InlineIcon name="layers" />
                  Related Signals
                </p>
                <h2>More industry context to track</h2>
              </div>
            </div>
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

        <div className="container about-denny-signal">
          <div className="grid-2">
            <div>
              <p className="eyebrow">
                <InlineIcon name="user" />
                About Denny You
              </p>
              <h2>About Denny You</h2>
              <p>
                Denny You is one of the leading influencers and consultants in
                China's cleaning products industry.
              </p>
              <p>
                With more than 20 years of industry experience, he works across
                manufacturing, sourcing, industry media and trade shows.
              </p>
              <p>
                Through World Clean Biz, he helps industry professionals
                understand markets, products, suppliers and opportunities.
              </p>
            </div>
            <div>
              <Link className="button" href="/about">
                About Denny
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="cta-band article-cta">
            <div className="grid-2">
              <div>
                <IconBadge name="message" />
                <h2>Have A Question About This Signal?</h2>
                <p>
                  Industry signals become valuable only when they lead to better
                  decisions. If this signal is relevant to your business, tell
                  us what you're exploring. We may be able to help with
                  sourcing, market intelligence or industry connections.
                </p>
              </div>
              <div className="hero-actions">
                <Link className="button" href="/contact">
                  Share Inquiry
                </Link>
                <Link className="button-secondary" href="/insights">
                  Explore Signals
                </Link>
              </div>
            </div>
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
