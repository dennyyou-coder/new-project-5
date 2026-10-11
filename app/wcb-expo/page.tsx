import type { Metadata } from "next";
import { getArticleImage } from "@/lib/articleImages";
import { siteVisualProps } from "@/lib/siteVisuals";
import ExpoHistory from "./ExpoHistory";
import history from "./history-data.json";
import "./expo-story.css";

export const metadata: Metadata = {
  title: "WCB Expo 2026 | Suzhou",
  description:
    "Plan your visit to the 2026 WCB International Cleaning Appliance Expo, 18–20 November 2026 at Suzhou Shishan Convention Center in Suzhou, China.",
  alternates: { canonical: "/wcb-expo" },
  openGraph: {
    title: "2026 WCB International Cleaning Appliance Expo",
    description:
      "Meet cleaning appliance brands, manufacturers, supply-chain companies and industry professionals in Suzhou, China.",
    url: "/wcb-expo",
    images: ["/images/articles/about-denny-profile/03-wcb-2026-key-visual.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 WCB International Cleaning Appliance Expo",
    description: "18–20 November 2026 · Suzhou, China",
    images: ["/images/articles/about-denny-profile/03-wcb-2026-key-visual.webp"]
  }
};


const events = history.events.map(event => ({
  ...event,
  photos: history.galleries[event.id as keyof typeof history.galleries].map(photo => ({
    ...photo, ...getArticleImage(photo.src)!
  }))
}));

function ExpoImage({ src, alt, sizes = "(max-width: 760px) 90vw, (max-width: 1380px) 45vw, 620px", priority = false }: {
  src: string; alt: string; sizes?: string; priority?: boolean;
}) {
  const image = src.startsWith("/images/articles/") ? getArticleImage(src) : undefined;
  const props = image ? {
    src, width: image.width, height: image.height, sizes,
    srcSet: image.mobile ? `${image.mobile.src} ${image.mobile.width}w, ${src} ${image.width}w` : undefined
  } : siteVisualProps(src, sizes);
  return <img {...props} alt={alt} loading={priority ? "eager" : "lazy"}
    fetchPriority={priority ? "high" : "auto"} decoding="async" />;
}

export default function WcbExpoPage() {
  return (
<div id="wcb-expo-story">
 <section className="v6-hero" id="wcb2026">
  <div className="shell v6-hero-grid">
   <div>
    <span className="eyebrow">
     01 / WCB EXPO 2026
    </span>
    <h1>
     The cleaning industry,
     <br/>
     in one place.
    </h1>
    <p className="v6-lead">
     An exhibition for cleaning appliances and their supply chains—bringing brands, manufacturers, technology companies and professional buyers together.
    </p>
    <p className="v6-date">
     <strong>
      18–20 November 2026
     </strong>
     <span>
      Suzhou Shishan Convention Center · Suzhou, China
     </span>
    </p>
   </div>
   <figure>
    <ExpoImage alt="Official WCB 2026 exhibition artwork" priority src="/images/articles/about-denny-profile/03-wcb-2026-key-visual.webp"/>
    <figcaption>
     WCB International Cleaning Appliance Expo 2026
    </figcaption>
   </figure>
  </div>
 </section>
 <nav aria-label="Page sections" className="story-nav">
  <div className="shell">
   <a href="#wcb2026">
    WCB 2026
   </a>
   <a href="#origins">
    Our story
   </a>
   <a href="#showcase">
    Products &amp; people
   </a>
   <a href="#programme">
    On site
   </a>
   <a href="#schedule">
    Plan your visit
   </a>
  </div>
 </nav>
 <section className="shell section" id="origins">
  <div className="section-head">
   <div>
    <span className="eyebrow">
     02 / OUR STORY
    </span>
    <h2>
     Built through years of bringing
     <br/>
     the industry together.
    </h2>
   </div>
   <p>
    From the first forums in 2019 to supply-chain exhibitions and procurement meetings. Explore each edition below.
   </p>
  </div>
  <ExpoHistory events={events} />
  <div className="story-summary">
   <h3>
    Rooted in the industry.
   </h3>
   <p>
    Founded by Denny You, a cleaning-industry practitioner since 2006, WCB connects finished products with their supply chains—and keeps the conversation going through industry writing, videos and face-to-face events.
   </p>
  </div>
 </section>
 <section className="shell section" id="showcase">
  <div className="v6-heading">
   <span className="eyebrow">
    03 / PRODUCTS &amp; PEOPLE
   </span>
   <h2>
    From finished appliances
    <br/>
    to the people behind them.
   </h2>
  </div>
  <div className="v6-trio">
   <article>
    <figure>
     <ExpoImage alt="Cleaning appliances" sizes="(max-width: 760px) 90vw, (max-width: 1380px) 29vw, 400px" src="/images/site-refresh/2026-09-commercial/01-robot-vacuum.webp"/>
     <figcaption>
      Product category illustration
     </figcaption>
    </figure>
    <h3>
     Cleaning appliances
    </h3>
    <p>
     Robot vacuums, floor washers, vacuum cleaners and window-cleaning robots, plus pool cleaners, robotic mowers, commercial cleaning equipment and pressure washers.
    </p>
   </article>
   <article>
    <figure>
     <ExpoImage alt="Components &amp; technology" sizes="(max-width: 760px) 90vw, (max-width: 1380px) 29vw, 400px" src="/images/articles/about-denny-expo-2025/18-photo-78.webp"/>
     <figcaption>
      November 2025 · Component displays
     </figcaption>
    </figure>
    <h3>
     Components &amp; technology
    </h3>
    <p>
     Motors, batteries, pumps, valves, sensors and materials. Discuss technical requirements and manufacturing capabilities with supply-chain partners.
    </p>
   </article>
   <article>
    <figure>
     <ExpoImage alt="Industry partners" sizes="(max-width: 760px) 90vw, (max-width: 1380px) 29vw, 400px" src="/images/articles/about-denny-expo-2026/03-photo-82.webp"/>
     <figcaption>
      March 2026 · Shenzhen exhibition
     </figcaption>
    </figure>
    <h3>
     Industry partners
    </h3>
    <p>
     Brands and manufacturers meet R&amp;D and procurement teams, distributors and channel partners to explore products, suppliers and new cooperation.
    </p>
   </article>
  </div>
 </section>
 <section className="v6-onsite" id="programme">
  <div className="shell section">
   <div className="v6-heading">
    <span className="eyebrow">
     04 / ON SITE
    </span>
    <h2>
     See the products.
     <br/>
     Join the conversations.
    </h2>
   </div>
   <div className="v6-trio">
    <article>
     <figure>
      <ExpoImage alt="Industry forums" sizes="(max-width: 760px) 90vw, (max-width: 1380px) 29vw, 400px" src="/images/articles/about-denny-expo-2026/01-cover.webp"/>
      <figcaption>
       March 2026 · Shenzhen forum
      </figcaption>
     </figure>
     <h3>
      Industry forums
     </h3>
     <p>
      Hear entrepreneurs and industry experts discuss technology, supply chains and international markets. Two sessions are planned for 18 November, free for visitors.
     </p>
    </article>
    <article>
     <figure>
      <ExpoImage alt="Procurement matchmaking" sizes="(max-width: 760px) 90vw, (max-width: 1380px) 29vw, 400px" src="/images/industry/expo-business-matching-2026.jpg"/>
      <figcaption>
       March 2026 · Procurement discussions
      </figcaption>
     </figure>
     <h3>
      Procurement matchmaking
     </h3>
     <p>
      Meet around specific product and sourcing requirements. A dedicated session connects exhibitors with invited purchasing teams.
     </p>
    </article>
    <article>
     <figure>
      <ExpoImage alt="New product launches" sizes="(max-width: 760px) 90vw, (max-width: 1380px) 29vw, 400px" src="/images/articles/about-denny-expo-2026/11-photo-97.webp"/>
      <figcaption>
       March 2026 · Product presentation
      </figcaption>
     </figure>
     <h3>
      New product launches
     </h3>
     <p>
      Discover products and enabling technologies through exhibitor presentations, with two sessions planned across 19–20 November.
     </p>
    </article>
   </div>
   <div className="v6-extras" id="networking">
    <article className="v8-extra">
     <figure className="v8-thumb">
      <ExpoImage alt="Illustration of professionals at a networking dinner" sizes="(max-width: 760px) 110px, 140px" src="/images/articles/wcb-expo-programme/01-cover.webp"/>
      <figcaption>
       AI illustration
      </figcaption>
     </figure>
     <p>
      <strong>
       Exhibitor dinner
      </strong>
      A networking evening on 18 November for exhibitors and invited guests; attendance arranged in advance.
     </p>
    </article>
    <article className="v8-extra">
     <figure className="v8-thumb">
      <ExpoImage alt="Illustration of an exhibitor catalogue and digital directory" sizes="(max-width: 760px) 110px, 140px" src="/images/articles/wcb-expo-programme/02-exhibitor-directory.webp"/>
      <figcaption>
       AI illustration
      </figcaption>
     </figure>
     <p>
      <strong>
       Exhibitor directory
      </strong>
      Company introductions help visitors find relevant businesses and continue conversations after the show.
     </p>
    </article>
   </div>
  </div>
 </section>
 <section className="shell section" id="schedule">
  <div className="v7-schedule-head">
   <div>
    <span className="eyebrow">
     05 / PLAN YOUR VISIT
    </span>
    <h2>
     Your three days at WCB.
    </h2>
   </div>
   <p className="v7-exhibition">
    <b>
     Exhibition open across all three days
    </b>
    <span>
     18–20 November 2026 · Suzhou
    </span>
   </p>
  </div>
  <div aria-label="Proposed WCB Expo programme" className="v7-calendar">
   <div className="v7-day">
    <h3>
     <strong aria-label="November 18" className="date-calendar" data-month="NOV">
      18
     </strong>
     <span>
      November
      <small>
       Wednesday
      </small>
     </span>
    </h3>
    <div className="v7-session">
     <div className="v8-session-copy">
      <span className="v7-period">
       Morning
      </span>
      <time>
       09:30–12:00
      </time>
      <h4>
       Entrepreneur forum
      </h4>
     </div>
     <figure className="v8-thumb">
      <ExpoImage alt="Audience at a previous Shenzhen industry forum" sizes="(max-width: 760px) 110px, 140px" src="/images/articles/about-denny-expo-2026/01-cover.webp"/>
      <figcaption>
       March 2026
      </figcaption>
     </figure>
    </div>
    <div className="v7-session">
     <div className="v8-session-copy">
      <span className="v7-period">
       Afternoon
      </span>
      <time>
       14:00–16:30
      </time>
      <h4>
       Industry expert forum
      </h4>
     </div>
     <figure className="v8-thumb">
      <ExpoImage alt="Expert presentation at the previous supply-chain exhibition" sizes="(max-width: 760px) 110px, 140px" src="/images/articles/about-denny-expo-2025/03-photo-39.webp"/>
      <figcaption>
       November 2025
      </figcaption>
     </figure>
    </div>
    <div className="v7-session">
     <div className="v8-session-copy">
      <span className="v7-period">
       Evening
      </span>
      <time>
       Time to be confirmed
      </time>
      <h4>
       Exhibitor dinner
      </h4>
     </div>
     <figure className="v8-thumb">
      <ExpoImage alt="Illustration of a networking dinner" sizes="(max-width: 760px) 110px, 140px" src="/images/articles/wcb-expo-programme/01-cover.webp"/>
      <figcaption>
       AI illustration
      </figcaption>
     </figure>
    </div>
   </div>
   <div className="v7-day">
    <h3>
     <strong aria-label="November 19" className="date-calendar" data-month="NOV">
      19
     </strong>
     <span>
      November
      <small>
       Thursday
      </small>
     </span>
    </h3>
    <div className="v7-session">
     <div className="v8-session-copy">
      <span className="v7-period">
       Morning
      </span>
      <time>
       10:00–12:00
      </time>
      <h4>
       Procurement matchmaking
      </h4>
     </div>
     <figure className="v8-thumb">
      <ExpoImage alt="Procurement discussions at the previous Shenzhen exhibition" sizes="(max-width: 760px) 110px, 140px" src="/images/industry/expo-business-matching-2026.jpg"/>
      <figcaption>
       March 2026
      </figcaption>
     </figure>
    </div>
    <div className="v7-session">
     <div className="v8-session-copy">
      <span className="v7-period">
       Afternoon
      </span>
      <time>
       14:00–16:30
      </time>
      <h4>
       Product launches
       <small>
        Session 1
       </small>
      </h4>
     </div>
     <figure className="v8-thumb">
      <ExpoImage alt="Product presentation at the previous Shenzhen exhibition" sizes="(max-width: 760px) 110px, 140px" src="/images/articles/about-denny-expo-2026/11-photo-97.webp"/>
      <figcaption>
       March 2026
      </figcaption>
     </figure>
    </div>
    <div className="v7-session v7-empty">
     <span className="v7-period">
      Evening
     </span>
     <p>
      No session announced
     </p>
    </div>
   </div>
   <div className="v7-day">
    <h3>
     <strong aria-label="November 20" className="date-calendar" data-month="NOV">
      20
     </strong>
     <span>
      November
      <small>
       Friday
      </small>
     </span>
    </h3>
    <div className="v7-session">
     <div className="v8-session-copy">
      <span className="v7-period">
       Morning
      </span>
      <time>
       10:00–12:00
      </time>
      <h4>
       Product launches
       <small>
        Session 2
       </small>
      </h4>
     </div>
     <figure className="v8-thumb">
      <ExpoImage alt="Robotics presentation at the previous Shenzhen exhibition" sizes="(max-width: 760px) 110px, 140px" src="/images/articles/about-denny-expo-2026/12-photo-98.webp"/>
      <figcaption>
       March 2026
      </figcaption>
     </figure>
    </div>
    <div className="v7-session v7-empty">
     <span className="v7-period">
      Afternoon
     </span>
     <p>
      No session announced
     </p>
    </div>
    <div className="v7-session v7-empty">
     <span className="v7-period">
      Evening
     </span>
     <p>
      No session announced
     </p>
    </div>
   </div>
  </div>
  <p className="note">
   Proposed programme · China Standard Time (UTC+8). Final sessions and exhibition admission hours will be confirmed by the organizer.
  </p>
  <div className="v7-location">
   <div>
    <span className="eyebrow">
     YOU’RE INVITED / WCB EXPO 2026
    </span>
    <h3>
     Join us in Suzhou.
    </h3>
    <p className="visit-invitation">
     See the products, meet the people behind them and exchange ideas with the cleaning industry. We look forward to welcoming you to WCB.
    </p>
    <p className="visit-details">
     <strong>
      18–20 November 2026
     </strong>
     <span>
      Suzhou Shishan Convention Center · Suzhou, China
     </span>
    </p>
   </div>
   <a className="button" href="/contact?inquiry=expo_visitor#project-form">
    Plan your visit
   </a>
  </div>
 </section>
</div>

  );
}
