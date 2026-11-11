import type { Metadata } from "next";
import { CollectionSchema } from "@/components/seo/CollectionSchema";
import Link from "next/link";
import { getTopics, topicDate } from "@/lib/topics";

export const metadata: Metadata = {
  title: { absolute: "Topics: Trade, Regulation and Market Shifts | World Clean Biz" },
  description: "WCB's running files on the regulatory and trade stories reshaping the cleaning appliance industry, from US FCC robot restrictions to EU anti-dumping duties.",
  alternates: { canonical: "/topics" }
};

export default function TopicsPage() {
  const topics = getTopics();
  return (
    <div className="topic-page">
      <header className="topic-hero">
        <div className="topic-container">
          <nav className="topic-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
          </nav>
          <p className="topic-eyebrow">WCB Topics</p>
          <h1>Topics</h1>
          <p className="topic-dek">Running files on the trade and regulatory stories reshaping the cleaning appliance industry: what happened, where each case stands and what it means for brands, factories and buyers.</p>
        </div>
      </header>
      <div className="topic-container topic-index">
        <ul className="topic-index-list">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link href={`/topics/${topic.slug}`}>
                <span className="topic-eyebrow">Updated {topicDate(topic.updated)}</span>
                <strong>{topic.title}</strong>
                <span>{topic.dek}</span>
                <em>{topic.status.label}</em>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <CollectionSchema name="Topics" description="Running files on the trade and regulatory stories reshaping the cleaning appliance industry." path="/topics" items={topics.map((topic) => ({ name: topic.title, url: `/topics/${topic.slug}` }))} />
    </div>
  );
}
