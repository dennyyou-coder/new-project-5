import { BusinessServices } from "@/components/BusinessServices";
import type { Metadata } from "next";
import Link from "next/link";
import "../styles/about.css";
import { IconBadge, type IconName } from "@/components/Icon";

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
  return (
    <div className="about-network-page">
      <section className="refresh-page-intro container">
        <p className="eyebrow">About World Clean Biz</p>
        <h1>Industry Knowledge. Business Connections.</h1>
        <p>
          World Clean Biz connects cleaning industry news, independent analysis,
          company and product research, and WCB Expo.
        </p>
      </section>
      <div id="world-clean-biz">
        <BusinessServices />
      </div>
      <section className="section">
        <div className="container refresh-about-founder">
          <img
            src="/images/site-refresh/about/about-hero-denny.webp"
            alt="Denny You speaking at a cleaning industry forum"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Denny You · Founder</p>
            <h2>Inside the Cleaning Industry Since 2006</h2>
            <p>
              Denny You is the founder of World Clean Biz and organizer of WCB
              Expo. His work spans cleaning products, supply chains, industry
              analysis and business connections.
            </p>
            <p>
              Denny reviews product direction and key industry resources. The
              team supports research, quotations, samples, supplier coordination
              and delivery.
            </p>
          </div>
        </div>
      </section>
      <section className="section about-network-trust">
        <div className="container">
          <div className="about-network-heading">
            <p className="eyebrow">EXPERIENCE, INFLUENCE &amp; EXECUTION</p>
            <h2>Industry Credibility Built Through Real Work.</h2>
          </div>
          <div className="about-network-trust-grid">
            {trustFacts.map((item) => (
              <article key={item.title}>
                <IconBadge name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section about-network-journey">
        <div className="container">
          <div className="about-network-heading">
            <p className="eyebrow">THE JOURNEY</p>
            <h2>From Industry Operator To Platform Builder.</h2>
          </div>
          <div className="about-network-journey-grid">
            {journey.map((item) => (
              <article key={item.marker}>
                <span>{item.marker}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container refresh-contact-links">
          <Link className="button" href="/contact">
            Work With WCB →
          </Link>
          <Link href="/blog/series/building-worlds-no-1-cleaning-show-from-scratch">
            Read Denny's founder series →
          </Link>
        </div>
      </section>
    </div>
  );
}
