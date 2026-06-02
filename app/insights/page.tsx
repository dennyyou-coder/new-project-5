import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { getInsights } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Cleaning industry news, product trends, market analysis, buyer insights, and supply chain observations."
};

const categories = [
  "Industry News",
  "Market Trends",
  "Product Trends",
  "Buyer Insights",
  "Trade & Supply Chain",
  "Exhibition News",
  "Company Updates"
];

export default function InsightsPage() {
  const articles = getInsights();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Insights</p>
          <h1>Cleaning industry intelligence for B2B decision makers</h1>
          <p>
            Market trends, product category updates, supply chain analysis,
            exhibition observations, and buyer insights.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container content-layout">
          <div className="grid-2">
            {articles.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
          <aside className="sidebar">
            <div className="sidebar-box">
              <h3>Categories</h3>
              <ul>
                {categories.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            </div>
            <div className="sidebar-box">
              <h3>Contact Denny You</h3>
              <p>
                For sourcing, reports, expo cooperation, or media requests,
                send a focused inquiry through the contact page.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
