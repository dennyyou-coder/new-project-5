import { BusinessServices } from "@/components/BusinessServices";
import type { Metadata } from "next";
import Link from "next/link";
import "../styles/approved-platform.css";
import type { IconName } from "@/components/Icon";
import { getInsights } from "@/lib/content";
import { getLatestSeriesInsight } from "@/lib/insightCollections";

export const metadata: Metadata = {
  title: "About Denny You | Cleaning Industry",
  description:
    "Meet Denny You, founder of World Clean Biz and organizer of WCB Expo, connecting cleaning products, supply chains, buyers and global markets.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Denny You | World Clean Biz",
    description:
      "Inside the cleaning industry since 2006, connecting products, supply chains, buyers, capital and industry opportunities.",
    url: "/about",
    images: ["/images/site-refresh/about/about-hero-denny.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Denny You | World Clean Biz",
    description:
      "Inside the cleaning industry since 2006, connecting products, supply chains, buyers, capital and industry opportunities.",
    images: ["/images/site-refresh/about/about-hero-denny.webp"],
  },
};

const trustFacts: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "factory",
    title: "Inside The Cleaning Industry Since 2006",
    text: "Front-line experience across products, customers, factories, suppliers and global markets.",
  },
  {
    icon: "newspaper",
    title: "For A Decade, An Industry Voice",
    text: "Ten years of sharing cleaning industry analysis, making Denny one of the industry’s best-known professional voices.",
  },
  {
    icon: "rocket",
    title: "Hardware Entrepreneur",
    text: "A cleaning industry hardware entrepreneur whose ventures have raised tens of millions in funding.",
  },
  {
    icon: "users",
    title: "Organizer Of WCB Expo",
    text: "Building an industry platform that connects products, companies, buyers, experts, capital and media.",
  },
];

const journey = [
  {
    marker: "SINCE 2006",
    title: "Industry Operator & Product Builder",
    text: "Worked inside cleaning products, customers, supply chains and global-market projects.",
  },
  {
    marker: "FOR A DECADE",
    title: "Industry Analysis & Influence",
    text: "Shared cleaning industry articles and views with professionals, securities firms and investment banks.",
  },
  {
    marker: "ENTREPRENEUR",
    title: "Hardware Business & Capital Experience",
    text: "Built cleaning industry hardware ventures and raised tens of millions in funding.",
  },
  {
    marker: "TODAY",
    title: "World Clean Biz & WCB Expo",
    text: "Connecting intelligence, products, supply chains, buyers and industry relationships on a global platform.",
  },
];

export default function AboutPage() {
  const series = "building-worlds-no-1-cleaning-show-from-scratch";
  const latestEpisode = getLatestSeriesInsight(getInsights(), series);
  return (
    <div className="approved-platform about-page">
      <section className="page-hero mist about-intro" id="world-clean-biz">
        <div className="container">
          <p className="eyebrow">About World Clean Biz</p>
          <h1>Industry Knowledge. Business Connections.</h1>
          <p className="about-platform-copy">World Clean Biz connects cleaning industry news, independent analysis, company and product research, and WCB Expo.</p>
        </div>
      </section>
      <section className="section" id="denny-you" aria-labelledby="founder-title">
        <div className="container about-founder-grid">
          <figure className="about-founder-photo">
            <img src="/images/site-refresh/about/about-hero-denny.webp" alt="Denny You speaking at a cleaning industry forum" width={1600} height={1200} decoding="async" />
            <figcaption>Denny You · Founder, World Clean Biz</figcaption>
          </figure>
          <div className="about-founder-copy">
            <p className="eyebrow">Denny You · Founder</p>
            <h2 id="founder-title">Inside the Cleaning Industry Since 2006</h2>
            <p>Denny You is the founder of World Clean Biz and organizer of <Link href="/wcb-expo">WCB Expo</Link>. His work spans cleaning products, supply chains, industry analysis and business connections.</p>
            <p>Denny reviews product direction and key industry resources. The team supports research, quotations, samples, supplier coordination and delivery.</p>
          </div>
        </div>
      </section>
      <section className="section about-trust" aria-labelledby="credibility-title">
        <div className="container">
          <div className="section-head"><div>
            <p className="eyebrow">EXPERIENCE, INFLUENCE &amp; EXECUTION</p>
            <h2 id="credibility-title">Industry Credibility Built Through Real Work.</h2>
          </div></div>
          <div className="grid two about-trust-grid">
            {trustFacts.map((item) => <article className="about-trust-item" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section about-journey" aria-labelledby="journey-title">
        <div className="container">
          <div className="section-head"><div>
            <p className="eyebrow">THE JOURNEY</p>
            <h2 id="journey-title">From Industry Operator To Platform Builder.</h2>
          </div></div>
          <div className="grid four about-journey-grid">
            {journey.map((item) => <article className="about-journey-item" key={item.marker}><p className="about-marker">{item.marker}</p><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>
      {latestEpisode && <section className="section soft about-journal" aria-labelledby="journal-title">
        <div className="container about-journal-grid">
          <Link className="about-journal-media" href={`/blog/${latestEpisode.slug}`} aria-label={latestEpisode.title}>
            <img src={latestEpisode.coverImage} alt={latestEpisode.coverAlt || latestEpisode.title} width={1600} height={900} loading="lazy" decoding="async" />
          </Link>
          <div className="about-journal-copy">
            <p className="eyebrow">A Founder’s Journal · Denny You</p>
            <h2 id="journal-title">{latestEpisode.seriesTitle || "Building the World’s No.1 Cleaning Show from Scratch"}</h2>
            <h3><Link href={`/blog/${latestEpisode.slug}`}>{latestEpisode.title}</Link></h3>
            <p className="about-journal-excerpt">{latestEpisode.excerpt}</p>
            <div className="actions">
              <Link className="text-link" href={`/blog/${latestEpisode.slug}`}>Read Latest Episode</Link>
              <Link className="text-link" href={`/blog/series/${series}`}>Read Denny&apos;s founder series</Link>
            </div>
          </div>
        </div>
      </section>}
      <BusinessServices />
    </div>
  );
}
