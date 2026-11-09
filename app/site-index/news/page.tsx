import type { Metadata } from "next";
import { SiteIndexGroups, SiteIndexHero } from "@/components/SiteIndexList";
import { getNewsIndex } from "@/lib/siteIndex";
import "../../styles/trust.css";
import "../../styles/site-index.css";

export const metadata: Metadata = {
  title: "All News",
  description: "Every World Clean Biz news story on cleaning appliances, robotics, results and regulation, listed by month.",
  alternates: { canonical: "/site-index/news" }
};

export default function NewsIndexPage() {
  return (
    <div className="trust-page trust-legal-page">
      <SiteIndexHero back title="All news" lead="Every news story, newest month first." />
      <SiteIndexGroups groups={getNewsIndex()} />
    </div>
  );
}
