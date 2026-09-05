import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleBrandLinks } from "@/components/ArticleBrandLinks";
import { ArticleShareActions } from "@/components/ArticleShareActions";
import { BlogConversionCta } from "@/components/BlogConversionCta";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { responsiveImageProps } from "@/lib/articleImages";
import {
  getInsight,
  getInsights,
  markdownToHtml,
  removeLeadingArticleTitleAndCover
} from "@/lib/content";
import {
  getRelatedEditorialInsights,
  orderSeriesInsights
} from "@/lib/insightCollections";
import { addArticleContents, getTopicReading } from "@/lib/articleExperience";
import { seoDescription, seoTitle } from "@/lib/seo";

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

function displayPublishedDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai"
  }).format(parsed);
}

function episodeDisplayTitle(title: string) {
  return title.replace(/^Episode\s+\d+\s*[|:—–-]\s*/i, "");
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
  const modifiedTime = article.updatedAt || publishedTime;
  const coverImage = absoluteUrl(article.coverImage);
  const metadataTitle = seoTitle(article.title);
  const metadataDescription = seoDescription(article.metaDescription);

  return {
    title: { absolute: metadataTitle },
    description: metadataDescription,
    alternates: {
      canonical: `/blog/${article.slug}`
    },
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [article.author],
      url,
      images: coverImage ? [coverImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: metadataDescription,
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

  const related = getTopicReading(articles, article, getRelatedEditorialInsights(articles, article, 3));
  const publishedBrandProfiles = getPublishedBrandProfiles(articles);
  const seriesArticles = article.series
    ? orderSeriesInsights(
        articles.filter((item) => item.series === article.series),
        "ascending"
      )
    : [];
  const seriesIndex = seriesArticles.findIndex((item) => item.slug === article.slug);
  const previousEpisode = seriesIndex > 0 ? seriesArticles[seriesIndex - 1] : undefined;
  const nextEpisode = seriesIndex >= 0 && seriesIndex < seriesArticles.length - 1
    ? seriesArticles[seriesIndex + 1]
    : undefined;
  const hasTakeaways = article.takeaways.length > 0;
  const articleContent = removeLeadingArticleTitleAndCover(
    article.content,
    article.title,
    article.coverImage
  );
  const reading = addArticleContents(markdownToHtml(articleContent));
  const url = `${siteUrl}/blog/${article.slug}`;
  const isGuide = article.contentClass === "search" && article.guideType;
  const collectionHref = isGuide ? `/guides/${article.guideType}` : "/blog";
  const collectionName = isGuide ? "Guides" : "Blog";
  const publishedTime = article.publishedAt || article.date;
  const modifiedTime = article.updatedAt || publishedTime;
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
    dateModified: modifiedTime,
    image: coverImage ? [coverImage] : undefined,
    articleSection: article.category,
    keywords: article.tags,
    isPartOf: {
      "@type": "CollectionPage",
      name: collectionName === "Guides"
        ? "World Clean Biz Industry Guides"
        : "World Clean Biz Blog",
      url: `${siteUrl}${collectionHref}`
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
        name: collectionName,
        item: `${siteUrl}${collectionHref}`
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
      <div className="article-reading-experience">
      <section className="blog-article-hero">
        <div className="blog-article-container">
          <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href={collectionHref}>{collectionName}</Link><span>/</span><span>{article.category}</span>
          </nav>
          <div className="signal-detail-meta">
            <span>{article.category}</span>
            <span>{displayPublishedDate(publishedTime)}</span>
            <span>{article.readingTime}</span>
          </div>
          {article.seriesTitle ? (
            <p className="blog-article-series-title">{article.seriesTitle}</p>
          ) : null}
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <p className="signal-detail-author">By <Link href="/about">{article.author}</Link></p>
          <ArticleBrandLinks
            brandSlugs={article.primaryBrands}
            profiles={publishedBrandProfiles}
          />
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
                <img {...responsiveImageProps(article.coverImage, "cover")} alt={article.coverAlt || article.title} />
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

            {reading.sections.length >= 3 ? (
              <details className="blog-contents">
                <summary>In this article <span>{reading.sections.length} sections</span></summary>
                <nav aria-label="Article contents">
                  <ol>{reading.sections.map((section) => (
                    <li key={section.id}><a href={`#${section.id}`} dangerouslySetInnerHTML={{ __html: section.labelHtml }} /></li>
                  ))}</ol>
                </nav>
              </details>
            ) : null}

            <div className="blog-reading-body" dangerouslySetInnerHTML={{ __html: reading.content }} />

            <ArticleShareActions title={article.title} url={url} />

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
                <img src="/images/site-refresh/about/about-hero-denny.webp" width={1600} height={1200} alt={`${article.author}, founder of World Clean Biz`} loading="lazy" decoding="async" />
                <div>
                  <strong>{article.author}</strong>
                  <span>Founder, World Clean Biz · Organizer, WCB Expo</span>
                  <p>
                    Inside the cleaning industry since 2006, Denny reviews product, supplier and category signals for practical business decisions.
                  </p>
                  <Link href="/about">About Denny &amp; World Clean Biz →</Link>
                </div>
              </div>
            </footer>
          </article>

          <BlogConversionCta
            category={article.category}
            guideType={isGuide ? article.guideType : undefined}
            location="article_footer"
            slug={article.slug}
          />

        {article.seriesTitle && seriesArticles.length ? (
          <section className="blog-series-navigation" id="series-episodes" aria-labelledby="series-episodes-title">
            <div className="blog-series-navigation-heading">
              <p>{article.seriesTitle}</p>
              <h2 id="series-episodes-title">All Episodes</h2>
            </div>

            {previousEpisode || nextEpisode ? (
              <nav className="blog-series-directions" aria-label="Previous and next episodes">
                {previousEpisode ? (
                  <Link className="blog-series-direction" href={`/blog/${previousEpisode.slug}`}>
                    <span>Previous Episode</span>
                    <strong>{previousEpisode.title}</strong>
                  </Link>
                ) : null}
                {nextEpisode ? (
                  <Link className="blog-series-direction blog-series-direction-next" href={`/blog/${nextEpisode.slug}`}>
                    <span>Next Episode</span>
                    <strong>{nextEpisode.title}</strong>
                  </Link>
                ) : null}
              </nav>
            ) : null}

            <ol className="blog-series-episode-list">
              {seriesArticles.map((item) => {
                const isCurrentEpisode = item.slug === article.slug;

                return (
                  <li className={isCurrentEpisode ? "is-current" : undefined} key={item.slug}>
                    <Link href={`/blog/${item.slug}`} aria-current={isCurrentEpisode ? "page" : undefined}>
                      <span>{item.seriesEpisode ? `Episode ${item.seriesEpisode}` : "Episode"}</span>
                      <strong>{episodeDisplayTitle(item.title)}</strong>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        {related.length ? (
          <section className="blog-related-signals" aria-labelledby="continue-reading-title">
            <div className="blog-related-signals-heading">
              <p>More on the companies, products and themes in this article</p>
              <h2 id="continue-reading-title">Continue Reading</h2>
            </div>
            <div className="related-signal-grid">
              {related.map((item) => (
                <Link className="related-signal-card" href={`/blog/${item.slug}`} key={item.slug}>
                  <div className="related-signal-image">
                    <img
                      {...(item.coverImage
                        ? responsiveImageProps(item.coverImage, "card")
                        : {
                            src: "/images/site-refresh/real/city-architecture.webp",
                            loading: "lazy" as const,
                            decoding: "async" as const
                          })}
                      alt=""
                    />
                  </div>
                  <div className="meta">{item.seriesTitle || item.category}</div>
                  <h3>{item.title}</h3>
                  <span>{item.readingTime} · Read Article</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

          <nav className="blog-topic-paths" aria-label="Explore industry resources">
            <strong>Keep exploring</strong>
            <Link href={collectionHref}>{isGuide ? "More in this guide collection" : "All industry analysis"} <span aria-hidden="true">→</span></Link>
            <Link href="/brands">Brand intelligence <span aria-hidden="true">→</span></Link>
            <Link href="/guides">Practical buying &amp; sourcing guides <span aria-hidden="true">→</span></Link>
          </nav>

        </div>
      </section>

      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
