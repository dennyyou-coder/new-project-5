import type { Metadata } from "next";
import { ContactProjectInquiry } from "@/components/ContactProjectInquiry";
import "../styles/approved-platform.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact World Clean Biz for sourcing support, market information, industry connections, WCB Expo, media cooperation or business opportunities.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact World Clean Biz",
    description:
      "Choose the right channel for sourcing, Expo, media, or general cleaning industry inquiries.",
    url: "/contact",
    images: ["/images/site-refresh/about/about-hero-denny.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact World Clean Biz",
    description:
      "Choose the right channel for sourcing, Expo, media, or general cleaning industry inquiries.",
    images: ["/images/site-refresh/about/about-hero-denny.webp"],
  },
};

type ContactSearchParams = { inquiry?: string | string[]; intent?: string | string[] };
export default async function ContactPage({ searchParams }: { searchParams: Promise<ContactSearchParams> }) {
  const query = await searchParams;
  const requested = typeof query.inquiry === "string" ? query.inquiry : "";
  const fallbackIntent = typeof query.intent === "string" ? query.intent : "";
  const initialInquiry = requested || (fallbackIntent === "sourcing" ? "sourcing" : fallbackIntent === "expo" ? "expo" : "");
  return (
    <div className="approved-platform contact-page">
      <section className="contact-hero mist"><div className="container">
        <p className="eyebrow">Contact World Clean Biz</p><h1>Work With World Clean Biz</h1>
        <p className="hero-intro">Choose a cooperation area and tell us about your company, market and project.</p>
      </div></section>
      <ContactProjectInquiry initialInquiry={initialInquiry} />
      <section className="contact-preparation" aria-labelledby="contact-preparation-title">
        <div className="container contact-preparation-layout">
          <figure className="denny-card">
            <img src="/images/site-refresh/about/about-hero-denny.webp" alt="Denny You discussing cleaning industry sourcing with suppliers" loading="lazy" width={1600} height={1200} />
            <figcaption className="denny-identity"><strong>Denny You</strong><span>Founder, World Clean Biz · Organizer, WCB Expo</span><small>Inside the cleaning industry since 2006</small></figcaption>
          </figure>
          <div className="preparation-copy">
            <p className="eyebrow">What Happens Next</p><h2 id="contact-preparation-title">What To Include In Your Inquiry</h2>
            <p>Clear context helps World Clean Biz understand your objective and route the request correctly.</p>
            <ol className="contact-context-list"><li>Your company and target market</li><li>Product category or business objective</li><li>Current project stage and timeline</li><li>The decision, supplier or connection you need</li></ol>
            <p className="contact-response-note">World Clean Biz reviews each relevant inquiry and routes it to the relevant team based on sourcing, Expo, media, or business intent.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
