import type { Metadata } from "next";
import { SiteIndexGroups, SiteIndexHero } from "@/components/SiteIndexList";
import { getArticleIndex } from "@/lib/siteIndex";
import "../../styles/trust.css";
import "../../styles/site-index.css";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Every World Clean Biz analysis, guide and company story on the cleaning industry, listed by year.",
  alternates: { canonical: "/site-index/articles" }
};

export default function ArticleIndexPage() {
  return (
    <div className="trust-page trust-legal-page">
      <SiteIndexHero back title="All articles" lead="Every analysis, guide and company story, newest year first." />
      <SiteIndexGroups groups={getArticleIndex()} />
    </div>
  );
}
