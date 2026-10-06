import type { Metadata } from "next";
import { HomeVideos } from "@/components/HomeVideos";
import "../styles/home.css";
export const metadata: Metadata = {
  title: "Cleaning Industry Videos",
  description:
    "Company stories, product strategy and cleaning industry analysis with Denny You. Watch World Clean Biz videos with English and Chinese subtitles.",
  alternates: { canonical: "/videos" },
};
export default function VideosPage() {
  return (
    <div className="refresh-videos">
      <header className="refresh-page-intro container">
        <p className="eyebrow">Watch with Denny</p>
        <h1>Video Insights</h1>
        <p>Company stories, product strategy and the business of cleaning.</p>
      </header>
      <HomeVideos library />
    </div>
  );
}
