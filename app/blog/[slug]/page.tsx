import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TallyButton, TallyReportButton } from "@/components/LeadForms";
import {
  getInsight,
  getInsights,
  markdownToHtml,
  removeLeadingArticleTitleAndCover
} from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = "https://worldcleanbiz.com";

function absoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function extractFaqSchema(content: string, pageUrl: string) {
  const faqStart = content.match(/^## FAQ\s*$/m);

  if (!faqStart) return undefined;

  const faqContent = content.slice(faqStart.index || 0);
  const questionBlocks = faqContent.split(/^### /m).slice(1);
  const mainEntity = questionBlocks.flatMap((block) => {
    const [questionLine, ...answerLines] = block.split("\n");
    const question = questionLine.trim();
    const answer = answerLines
      .join("\n")
      .split(/^## /m)[0]
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/[*_`>#-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!question || !answer) return [];

    return [{
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }];
  });

  if (!mainEntity.length) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity
  };
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

  const url = `${siteUrl}/blog/${article.slug}`;
  const publishedTime = article.publishedAt || article.date;
  const coverImage = absoluteUrl(article.coverImage);

  return {
    title: article.title,
    description: article.metaDescription,
    alternates: {
      canonical: `/blog/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      publishedTime,
      modifiedTime: publishedTime,
      authors: [article.author],
      url,
      images: coverImage ? [coverImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
      images: coverImage ? [coverImage] : undefined
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
  const articleContent = removeLeadingArticleTitleAndCover(
    article.content,
    article.title,
    article.coverImage
  );
  const url = `${siteUrl}/blog/${article.slug}`;
  const publishedTime = article.publishedAt || article.date;
  const coverImage = absoluteUrl(article.coverImage);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    headline: article.title,
    description: article.metaDescription,
    datePublished: publishedTime,
    dateModified: publishedTime,
    image: coverImage ? [coverImage] : undefined,
    author: {
      "@type": "Person",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: "World Clean Biz",
      url: siteUrl
    },
    url
  };
  const faqSchema = extractFaqSchema(articleContent, url);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url
      }
    ]
  };
  const structuredData = faqSchema
    ? [articleSchema, breadcrumbSchema, faqSchema]
    : [articleSchema, breadcrumbSchema];

  return (
    <>
      <section className="blog-article-hero">
        <div className="blog-article-container">
          <div className="signal-detail-meta">
            <span>{article.category}</span>
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

            {article.coverImage ? (
              <figure className="blog-article-cover">
                <img src={article.coverImage} alt={article.title} />
              </figure>
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
                __html: markdownToHtml(articleContent)
              }}
            />

            <footer className="blog-author-note">
              {article.tags.length ? (
                <div className="tag-list blog-article-tags" aria-label="Article tags">
                  {article.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
              <p>
                Denny You has worked inside the cleaning industry since 2006.
                World Clean Biz turns front-line product, supplier and category
                signals into practical industry intelligence.
              </p>
            </footer>
          </article>

        {related.length ? (
          <div className="blog-related-signals">
            <h2>Related Articles</h2>
            <div className="related-signal-grid">
              {related.map((item) => (
                <Link
                  className="related-signal-card"
                  href={`/blog/${item.slug}`}
                  key={item.slug}
                >
                  <div className="meta">{item.category}</div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span>Read Article</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

          <div className="blog-article-footer-cta">
            <TallyReportButton>Get Free Reports</TallyReportButton>
            <TallyButton form="contact">Talk With Denny</TallyButton>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
