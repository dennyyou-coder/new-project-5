import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getInsight, getInsights, markdownToHtml } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInsights().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/insights/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.coverImage ? [article.coverImage] : undefined
    }
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getInsight(slug);
  const latest = getInsights()
    .filter((item) => item.slug !== slug)
    .slice(0, 4);

  if (!article) {
    notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <p className="meta">
            {article.date} / {article.author}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container content-layout">
          <article className="article-prose">
            {article.youtubeId ? (
              <div style={{ marginBottom: 28, aspectRatio: "16 / 9" }}>
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  src={`https://www.youtube.com/embed/${article.youtubeId}`}
                  style={{ width: "100%", height: "100%", border: 0 }}
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
          <aside className="sidebar">
            <div className="sidebar-box">
              <h3>Need sourcing support?</h3>
              <p>
                Share your target category, market, and supplier requirements
                with Denny You.
              </p>
              <p>
                <Link className="button" href="/contact">
                  Contact
                </Link>
              </p>
            </div>
            <div className="sidebar-box">
              <h3>Latest Insights</h3>
              <ul>
                {latest.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/insights/${item.slug}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
