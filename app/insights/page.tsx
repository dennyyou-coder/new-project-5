import type { Metadata } from "next";
import Link from "next/link";
import { IconBadge, InlineIcon } from "@/components/Icon";
import { getInsights } from "@/lib/content";

export const metadata: Metadata = {
  title: "Signals",
  description:
    "Cleaning industry signals covering category movement, sourcing context, market notes, trade shows, and supply chain observations."
};

export default function InsightsPage() {
  const articles = getInsights();

  return (
    <>
      <section className="page-hero page-hero-insights">
        <div className="container">
          <p className="eyebrow">
            <InlineIcon name="radio" />
            Signals
          </p>
          <h1>Signal Feed</h1>
          <p>
            Market movement, sourcing context and expo observations from the
            global cleaning industry.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="signal-library-list">
            {articles.map((article) => (
              <Link className="signal-library-card" href={`/insights/${article.slug}`} key={article.slug}>
                <div className="meta">
                  <InlineIcon name="trending" />
                  {article.category}
                </div>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <div className="signal-library-footer">
                  <span>
                    {article.date} / {article.readingTime}
                  </span>
                  <strong>Read Signal</strong>
                </div>
              </Link>
            ))}
          </div>
          <div className="insight-prompt insight-prompt-compact">
            <div>
              <IconBadge name="message" />
              <p className="eyebrow">Topic Request</p>
              <h3>Have a signal worth tracking?</h3>
              <p>
                Share a category, supplier, region or expo topic that should be
                watched.
              </p>
            </div>
            <Link className="button" href="/contact">
              Share Inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
