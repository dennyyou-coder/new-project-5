import type { Metadata } from "next";
import Link from "next/link";
import { SiteIndexGroups, SiteIndexHero } from "@/components/SiteIndexList";
import { getSiteIndexOverview } from "@/lib/siteIndex";
import "../styles/trust.css";
import "../styles/site-index.css";

export const metadata: Metadata = {
  title: "Site Index",
  description: "Every section, topic, company, product, equipment type and component profile on World Clean Biz, with links to the full lists of articles and news.",
  alternates: { canonical: "/site-index" }
};

export default function SiteIndexPage() {
  const { groups, articleCount, newsCount } = getSiteIndexOverview();
  return (
    <div className="trust-page trust-legal-page">
      <SiteIndexHero title="Site index" lead="Every page on World Clean Biz in one place: sections, topics, companies, products, equipment and components." />
      <SiteIndexGroups groups={groups}>
        <nav className="site-index-more" aria-label="Full lists">
          <Link href="/site-index/articles">All {articleCount} articles</Link>
          <Link href="/site-index/news">All {newsCount} news stories</Link>
        </nav>
      </SiteIndexGroups>
    </div>
  );
}
