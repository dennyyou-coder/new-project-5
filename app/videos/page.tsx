import type { Metadata } from "next";
import { HomeVideos } from "@/components/HomeVideos";
import "../styles/approved-platform.css";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Cleaning Industry Videos",
  description:
    "Company stories, product strategy and cleaning industry analysis with Denny You. Watch World Clean Biz videos with English and Chinese subtitles.",
  alternates: { canonical: "/videos" },
};
const relatedArticles = [
  { company: "BISSELL", title: "Who Owns BISSELL? Family Ownership & Sanitaire", href: "/blog/who-owns-bissell-family-sanitaire" },
  { company: "Segway Navimow", title: "Ninebot: From a RMB 21.3 Billion Mobility Business to Robotic Lawn Mowers", href: "/blog/ninebot-smart-mobility-navimow" },
  { company: "Roborock", title: "Is Roborock Owned by Xiaomi? Roborock, Dreame and the Xiaomi Ecosystem Explained", href: "/blog/is-roborock-owned-by-xiaomi" },
];
export default function VideosPage() {
  return (
    <div className="approved-platform videos-page">
      <HomeVideos library />
      <section className="section soft" aria-labelledby="video-reading-title">
        <div className="container">
          <div className="section-head"><div><p className="eyebrow">Continue reading</p><h2 id="video-reading-title">Related Articles</h2></div></div>
          <div className="video-reading-grid">{relatedArticles.map((article) => <Link className="video-reading-link" href={article.href} key={article.href}><span>{article.company}</span><strong>{article.title}</strong><small>Read the related article</small></Link>)}</div>
        </div>
      </section>
    </div>
  );
}
