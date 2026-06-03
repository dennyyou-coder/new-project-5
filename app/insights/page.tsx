import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CATEGORIES } from "@/lib/categories";
import { getInsights } from "@/lib/content";

export const metadata: Metadata = {
  title: "Signals",
  description:
    "Cleaning industry signals covering category movement, sourcing context, market notes, trade shows, and supply chain observations."
};

const insightPrinciples = [
  "What changed in the market",
  "Why it matters to cleaning industry professionals",
  "Which business questions readers should ask next"
];

export default function InsightsPage() {
  const articles = getInsights();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <section className="page-hero page-hero-insights">
        <div className="container">
          <p className="eyebrow">Signals</p>
          <h1>Cleaning Industry Signals</h1>
          <p>
            Category movement, sourcing context, market notes, trade show
            observations, and supply chain signals from the global cleaning
            industry.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured Insight</p>
              <h2>Featured signal from the global cleaning industry</h2>
              <p>
                Each signal is designed to explain what changed, why it matters,
                and which business question to ask next.
              </p>
            </div>
            <div className="tag-list compact-tags" aria-label="Insight categories">
              {CATEGORIES.slice(4).map((category) => (
                <span className="tag" key={category}>
                  {category}
                </span>
              ))}
            </div>
          </div>
          {featured ? (
            <Link className="featured-article insight-featured" href={`/insights/${featured.slug}`}>
              <div
                className="featured-article-image"
                style={{
                  backgroundImage: featured.coverImage
                    ? `url(${featured.coverImage})`
                    : undefined
                }}
                aria-hidden="true"
              />
              <div className="featured-article-body">
                <div className="meta">{featured.category}</div>
                <h3>{featured.title}</h3>
                <p>{featured.excerpt}</p>
                <span>Read Signal</span>
              </div>
            </Link>
          ) : null}
          <div className="grid-3 article-grid">
            {rest.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
          <div className="insight-principles">
            {insightPrinciples.map((item) => (
              <div className="card compact-card" key={item}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
