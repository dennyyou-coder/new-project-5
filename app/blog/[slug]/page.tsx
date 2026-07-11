import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogConversionCta } from "@/components/BlogConversionCta";
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
const relatedArticleOverrides: Record<string, string[]> = {
  "factory-audit-cleaning-appliance-suppliers-china": [
    "how-to-evaluate-a-chinese-cleaning-appliance-supplier",
    "sample-testing-cleaning-appliances-china",
    "quality-control-cleaning-appliances-china"
  ],
  "spare-parts-warranty-cleaning-appliances-china": [
    "sample-testing-cleaning-appliances-china",
    "quality-control-cleaning-appliances-china",
    "cleaning-appliance-moq-pricing-hidden-costs-china"
  ],
  "sample-testing-cleaning-appliances-china": [
    "quality-control-cleaning-appliances-china",
    "cleaning-appliance-moq-pricing-hidden-costs-china",
    "how-to-evaluate-a-chinese-cleaning-appliance-supplier"
  ],
  "cleaning-appliance-moq-pricing-hidden-costs-china": [
    "quality-control-cleaning-appliances-china",
    "compliance-certification-cleaning-appliances-china",
    "how-to-evaluate-a-chinese-cleaning-appliance-supplier"
  ],
  "compliance-certification-cleaning-appliances-china": [
    "quality-control-cleaning-appliances-china",
    "how-to-evaluate-a-chinese-cleaning-appliance-supplier",
    "oem-vs-odm-cleaning-products"
  ],
  "private-label-cleaning-products-from-china": [
    "oem-vs-odm-cleaning-products",
    "factory-vs-trading-company-china-cleaning-appliances",
    "how-to-evaluate-a-chinese-cleaning-appliance-supplier"
  ],
  "factory-vs-trading-company-china-cleaning-appliances": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "how-to-evaluate-a-chinese-cleaning-appliance-supplier",
    "oem-vs-odm-cleaning-products"
  ],
  "how-to-evaluate-a-chinese-cleaning-appliance-supplier": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "oem-vs-odm-cleaning-products",
    "floor-washer-manufacturers-china"
  ],
  "oem-vs-odm-cleaning-products": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "robot-vacuum-cleaners-from-china",
    "floor-washer-manufacturers-china"
  ],
  "commercial-cleaning-robot-manufacturers-china": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "floor-washer-manufacturers-china",
    "robot-vacuum-cleaners-from-china"
  ],
  "robotic-lawn-mower-manufacturers-china": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "robot-vacuum-cleaners-from-china",
    "cordless-vacuum-cleaner-oem-manufacturers-china"
  ],
  "floor-washer-manufacturers-china": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "cordless-vacuum-cleaner-oem-manufacturers-china",
    "robot-vacuum-cleaners-from-china"
  ],
  "cordless-vacuum-cleaner-oem-manufacturers-china": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "robot-vacuum-cleaners-from-china",
    "robotic-pool-cleaner-manufacturers-china"
  ],
  "robotic-pool-cleaner-manufacturers-china": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "aiper-fluidra-pool-robotics-alliance",
    "pool-robotics-new-competitive-table"
  ],
  "robot-vacuum-cleaners-from-china": [
    "how-to-find-reliable-cleaning-product-suppliers-in-china",
    "robotic-pool-cleaner-manufacturers-china",
    "the-hidden-front-brushless-motors"
  ]
};

function absoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function displayPublishedDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(parsed);
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

  const relatedOverrideSlugs = relatedArticleOverrides[slug] || [];
  const relatedOverrides = relatedOverrideSlugs
    .map((relatedSlug) => articles.find((item) => item.slug === relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const sameCategory = articles.filter(
    (item) =>
      item.slug !== slug &&
      item.category === article.category &&
      !relatedOverrideSlugs.includes(item.slug)
  );
  const fillers = articles.filter(
    (item) =>
      item.slug !== slug &&
      !relatedOverrideSlugs.includes(item.slug) &&
      !sameCategory.some((related) => related.slug === item.slug)
  );
  const related = [...relatedOverrides, ...sameCategory, ...fillers].slice(0, 3);
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
    articleSection: article.category,
    keywords: article.tags,
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteUrl}/blog`
    },
    author: {
      "@type": "Person",
      name: article.author,
      url: `${siteUrl}/about`
    },
    publisher: {
      "@type": "Organization",
      name: "World Clean Biz",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.svg`
      }
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
          <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span>{article.category}</span>
          </nav>
          <div className="signal-detail-meta">
            <span>{article.category}</span>
            <span>{displayPublishedDate(publishedTime)}</span>
            <span>{article.readingTime}</span>
          </div>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <p className="signal-detail-author">By <Link href="/about">{article.author}</Link></p>
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
                <img src={article.coverImage} alt={article.coverAlt || article.title} fetchPriority="high" decoding="async" />
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
                <div className="blog-article-tag-panel">
                  <span>Tags</span>
                  <div className="tag-list blog-article-tags" aria-label="Article tags">
                    {article.tags.map((tag) => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="blog-author-bio-box">
                <img src="/images/site-refresh/about/about-hero-denny.webp" alt="Denny You, founder of World Clean Biz" loading="lazy" decoding="async" />
                <div>
                  <strong>Denny You</strong>
                  <span>Founder, World Clean Biz · Organizer, World Clean Expo</span>
                  <p>
                    Inside the cleaning industry since 2006, Denny reviews product, supplier and category signals for practical business decisions.
                  </p>
                  <Link href="/about">About Denny &amp; World Clean Biz →</Link>
                </div>
              </div>
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
                  <div className="related-signal-image">
                    <img src={item.coverImage || "/images/site-refresh/real/city-architecture.webp"} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="meta">{item.category}</div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span>{item.readingTime} · Read Article</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

          <BlogConversionCta
            category={article.category}
            location="article_footer"
            slug={article.slug}
          />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
