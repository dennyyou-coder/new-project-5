import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogSeriesPageData, getBlogSeriesSlugs } from "@/lib/blogSeries";
import { getInsights } from "@/lib/content";
import { getEditorialInsights } from "@/lib/insightCollections";

type PageParams = Promise<{ series: string }>;

const siteUrl = "https://worldcleanbiz.com";
const seriesDescriptions: Record<string, string> = {
  "building-worlds-no-1-cleaning-show-from-scratch":
    "Follow You Denny’s public record of building World Clean Expo, from the industry experiences that shaped the idea to the decisions, setbacks and connections behind the show."
};

function getSeriesData(series: string) {
  return getBlogSeriesPageData(
    getEditorialInsights(getInsights()),
    series
  );
}

function descriptionFor(series: string, title: string) {
  return seriesDescriptions[series] ||
    `Browse every published episode of ${title}, collected in chronological order.`;
}

function episodeTitle(title: string) {
  return title.replace(/^Episode\s+\d+\s*\|\s*/i, "");
}

export function generateStaticParams() {
  return getBlogSeriesSlugs(getEditorialInsights(getInsights())).map((series) => ({
    series
  }));
}

export async function generateMetadata({
  params
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { series } = await params;
  const data = getSeriesData(series);

  if (!data) {
    return {};
  }

  const description = descriptionFor(series, data.title);
  const latestEpisode = data.episodes.at(-1);
  const canonical = `/blog/series/${series}`;

  return {
    title: data.title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: data.title,
      description,
      type: "website",
      url: canonical,
      images: latestEpisode?.coverImage ? [latestEpisode.coverImage] : []
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: latestEpisode?.coverImage ? [latestEpisode.coverImage] : []
    }
  };
}

export default async function BlogSeriesPage({
  params
}: {
  params: PageParams;
}) {
  const { series } = await params;
  const data = getSeriesData(series);

  if (!data) {
    notFound();
  }

  const description = descriptionFor(series, data.title);
  const seriesUrl = `${siteUrl}/blog/series/${series}`;
  const latestDate = data.latestPublishedAt.slice(0, 10);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: data.title,
    numberOfItems: data.episodes.length,
    itemListElement: data.episodes.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: `${siteUrl}/blog/${article.slug}`
    }))
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": seriesUrl,
    name: data.title,
    description,
    url: seriesUrl,
    mainEntity: itemListSchema
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: "Series", item: seriesUrl }
    ]
  };

  return (
    <>
      <main className="blog-series-page">
        <section className="blog-series-page-hero">
          <div className="blog-series-page-container">
            <nav className="blog-series-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog">Blog</Link>
              <span aria-hidden="true">/</span>
              <span>Series</span>
            </nav>
            <p className="eyebrow">WCB Original Series</p>
            <h1>{data.title}</h1>
            <p className="blog-series-page-intro">{description}</p>
            <div className="blog-series-page-meta">
              <span><strong>{data.episodes.length}</strong> Published Episodes</span>
              <span>Latest update: <strong>{latestDate}</strong></span>
            </div>
          </div>
        </section>

        <section className="blog-series-page-episodes" aria-labelledby="all-series-episodes">
          <div className="blog-series-page-container">
            <div className="blog-series-page-heading">
              <p className="eyebrow">Follow The Story</p>
              <h2 id="all-series-episodes">All Episodes</h2>
            </div>

            <ol className="blog-series-page-list">
              {data.episodes.map((article) => (
                <li key={article.slug}>
                  <article className="blog-series-page-card">
                    <Link
                      className="blog-series-page-card-image"
                      href={`/blog/${article.slug}`}
                      aria-label={`Read ${article.title}`}
                    >
                      <img
                        src={article.coverImage || "/images/site-refresh/real/city-architecture.webp"}
                        alt={article.coverAlt || `${article.title} cover`}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                    <div className="blog-series-page-card-copy">
                      <span className="blog-series-page-episode">
                        {article.seriesEpisode ? `Episode ${article.seriesEpisode}` : "Episode"}
                      </span>
                      <h3>
                        <Link href={`/blog/${article.slug}`}>
                          {episodeTitle(article.title)}
                        </Link>
                      </h3>
                      <p>{article.excerpt}</p>
                      <div className="insights-card-meta">
                        <span>{article.date}</span>
                        <span>{article.readingTime}</span>
                      </div>
                      <Link className="blog-series-page-read" href={`/blog/${article.slug}`}>
                        Read Episode →
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ol>

            <Link className="blog-series-page-back" href="/blog">
              ← Back to Blog
            </Link>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([collectionSchema, itemListSchema, breadcrumbSchema])
        }}
      />
    </>
  );
}
