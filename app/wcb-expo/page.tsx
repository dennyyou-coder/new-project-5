import { ShareBar } from "@/components/share/ShareBar";
import type { Metadata } from "next";
import { getArticleImage } from "@/lib/articleImages";
import { siteVisualProps } from "@/lib/siteVisuals";
import ExpoHistory from "./ExpoHistory";
import history from "./history-data.json";
import "./expo-story.css";
import { LogoTileImage } from "@/components/ui/LogoTileImage";
import { brandLogoTile } from "@/lib/brandLogoTiles";

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
    images: ["/images/articles/wcb-expo-programme/03-wcb-2026-key-visual-en.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 WCB International Cleaning Appliance Expo",
    description: "18–20 November 2026 · Suzhou, China",
    images: ["/images/articles/wcb-expo-programme/03-wcb-2026-key-visual-en.webp"]
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

// From the organizer's 2026 invitation.
const FEATURED_BRANDS = [
  { slug: "ecovacs", name: "ECOVACS" },
  { slug: "roborock", name: "Roborock" },
  { slug: "midea", name: "Midea cleaning" },
  { slug: "segway-navimow", name: "Navimow (Segway-Ninebot)" },
  { slug: "wybot", name: "WYBOT" },
  { slug: "bissell", name: "BISSELL" }
];

// Confirmed exhibitors listed in the organizer's 2026 invitation, in its order (Chinese company names).
const CONFIRMED_EXHIBITORS = ["华盛电机", "欣扬科技", "宏伟电器", "德宇鑫科技", "东裕华芯电子", "英斐逊环境", "摩路新材料", "莫之比智能", "精锐昌科技", "清洋流体科技（苏州）", "纽莱克电子", "舍孚勒轴承", "德欣电机", "铱鑫电子", "佳音机电", "纳声电子设备", "韬略科技", "弈博智能", "洽洁电子", "蓝体半导体", "春桥电子", "莱恩科技", "多密特密封", "本末动力（广东）", "锐科兰电器", "赋贵荣科技", "成就智能", "实隆轴承", "米多", "东海电器", "德晟智能", "荣采创新", "绍鼎密封", "斯卫浦", "创源", "晨光电机", "冠宇达电源", "德良齐科技", "力佳隆毛刷", "高斯贝金属软管", "巨腾电子", "乾泰翔科技", "华瑷科技", "量能科技", "润英联新材料", "瑞莱达电器", "恩牧必精密轴承制造", "普沃特净化器材", "汇龙电器", "兆力电机集团", "永捷电机", "西腾毛刷", "罗素科技", "施奈仕实业", "捷宝金属集团", "固辉胶粘制品", "舟水电器", "的家电器", "凯航电机", "索瑞达电子", "湛华传感", "长锦成智能制造", "畅彻电器", "中驱电机", "壹洁智能", "恒讯电器（苏州）", "科维津宏环保", "中科芯亿达电子", "宏联电子", "小科清洁", "璟博方精密电子", "奕雅达生物", "普力生连接", "长曜创新", "宏鹏传动", "凯豪电器", "康沃特变频电机", "旭益达无刷电机", "钜泰泵业", "北醒（北京）光子", "荣亿电器", "梵凯刀具", "东亿磁业", "元晶光电", "虹光新材料", "好易捷电器", "速能达电机", "日讯新材料", "景腾精工橡塑制品", "新鼎泰智能", "乐宝电机", "征承科技", "德威控制系统", "华昀电子", "科宏轴承", "精微科（苏州）电子", "点石驱动", "倍增电子", "闪联电气", "合泰电机电器", "馨源（深圳）电子", "密姆科技", "凯艺美净化", "顺都印刷", "时达创马达", "清水智能机器人", "富迪电子", "兴邦维科", "西格传动智能", "国梦电机", "鑫华煦橡胶制品"];

const WHY_VISIT = [
  { title: "Hear where the industry is going, for free", text: "Entrepreneurs and industry experts share their view of what comes next for cleaning appliances." },
  { title: "See leading brands’ new products", text: "Navimow (Segway-Ninebot), Roborock, ECOVACS, BISSELL, Midea and WYBOT in one place in Suzhou, without travelling to IFA." },
  { title: "Meet more than ten finished-product makers", text: "Robot vacuums, floor washers, vacuum cleaners, window robots, robotic mowers and pool cleaners, all on one visit." },
  { title: "Talk to dozens of component suppliers", text: "Motors, pumps, moulds and other core components on show, with suppliers ready to discuss projects on the spot." }
];

export default function WcbExpoPage() {
  return (
<div id="wcb-expo-story">
 <section className="v6-hero" id="wcb2026">
  <div className="shell v6-hero-grid">
   <div>
    <span className="eyebrow">
     01 / WCB INTERNATIONAL CLEANING APPLIANCE EXPO
    </span>
    <h1>
     WCB Expo 2026
    </h1>
    <p className="v6-tagline">
     The road to a trillion-yuan cleaning industry.
    </p>
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
    <ShareBar title="WCB Expo 2026 · 18–20 November · Suzhou" url="https://worldcleanbiz.com/wcb-expo" />
    <ul className="v6-stats" aria-label="WCB Expo 2026 at a glance">
     <li><strong>3 days</strong><span>Forums, matchmaking, launches</span></li>
     <li><strong>100+</strong><span>Exhibiting companies</span></li>
     <li><strong>Full chain</strong><span>Brands, finished products, supply chain</span></li>
    </ul>
    <div className="expo-actions">
     <a className="button" href="/contact?inquiry=expo_visitor#project-form">
      Plan your visit
     </a>
     <a className="button button-secondary" href="/contact?inquiry=expo_exhibitor#project-form">
      Exhibit or partner
     </a>
    </div>
    <p className="v6-register">
     Free admission for visitors. In China, you can also register through the WeChat mini program “WCB会展通”.
    </p>
   </div>
   <figure>
    <ExpoImage alt="WCB Expo 2026 key visual: Cleaning Appliances Expo, 18–20 November 2026, Suzhou Shishan Convention Center" priority src="/images/articles/wcb-expo-programme/03-wcb-2026-key-visual-en.webp"/>
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
   <a href="#why">
    Why visit
   </a>
   <a href="#origins">
    Our story
   </a>
   <a href="#showcase">
    Products &amp; people
   </a>
   <a href="#exhibitors">
    Exhibitors
   </a>
   <a href="#programme">
    On site
   </a>
   <a href="#schedule">
    Plan your visit
   </a>
  </div>
 </nav>
 <section className="shell section" id="why">
  <div className="v6-heading">
   <span className="eyebrow">
    02 / WHY VISIT
   </span>
   <h2>
    New products, partners and channels,
    <br/>
    in three days.
   </h2>
  </div>
  <ol className="v9-why">
   {WHY_VISIT.map((item, index) => (
    <li key={item.title}>
     <span className="v9-why-number">{String(index + 1).padStart(2, "0")}</span>
     <h3>{item.title}</h3>
     <p>{item.text}</p>
    </li>
   ))}
  </ol>
  <p className="v9-audience">
   For brand owners, cross-border e-commerce sellers, finished-product manufacturers, component suppliers, agents and distributors.
  </p>
  <div className="v9-brands">
   <h3>Featured exhibiting brands</h3>
   <ul>
    {FEATURED_BRANDS.map((brand) => (
     <li key={brand.slug}>
      <a href={`/brands/${brand.slug}`}>
       <span className="v9-brand-logo" aria-hidden="true">
        <LogoTileImage slug={brand.slug} fallbackSrc={brandLogoTile(brand.slug)?.src ?? ""} boxRatio={2.4} />
       </span>
       <span>{brand.name}</span>
      </a>
     </li>
    ))}
   </ul>
  </div>
  <div className="v9-view">
   <div>
    <span className="eyebrow">WCB’S VIEW</span>
    <h3>The road to a trillion-yuan cleaning industry</h3>
    <p>
     WCB expects the market for finished cleaning appliances to grow from under CNY 300 billion today, mainly household cleaning appliances, to about CNY 1 trillion in retail sales within ten years, driven by new categories, robotics and global expansion.
    </p>
   </div>
   <dl>
    <div><dt>CNY 1 trillion</dt><dd>Brand retail sales of finished products</dd></div>
    <div><dt>About CNY 250 billion</dt><dd>OEM and ODM manufacturing</dd></div>
    <div><dt>About CNY 185 billion</dt><dd>Core components: motors, batteries, pumps, sensors</dd></div>
   </dl>
   <p className="v9-view-note">
    WCB scenario estimate, not verified industry statistics or a third-party forecast. Segments: household, commercial and pool cleaning, and robotic mowing.
   </p>
  </div>
 </section>
 <section className="shell section" id="origins">
  <div className="section-head">
   <div>
    <span className="eyebrow">
     03 / OUR STORY
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
    04 / PRODUCTS &amp; PEOPLE
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
     <ExpoImage alt="Robot vacuum parts on show at the 2026 Shenzhen exhibition" sizes="(max-width: 760px) 90vw, (max-width: 1380px) 29vw, 400px" src="/images/articles/about-denny-expo-2026/20-photo-105.webp"/>
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
 <section className="shell section" id="exhibitors">
  <div className="v6-heading">
   <span className="eyebrow">
    CONFIRMED EXHIBITORS
   </span>
   <h2>
    More than 100 companies
    <br/>
    from across the supply chain.
   </h2>
  </div>
  <p className="v9-exhibitors-intro">
   Besides the featured brands above, the exhibitors include more than ten finished-product makers and dozens of component suppliers, from motors and pumps to moulds and other core parts. Names are shown in Chinese, as listed by the organizer.
  </p>
  <details className="v9-exhibitors">
   <summary>Show all {CONFIRMED_EXHIBITORS.length} confirmed exhibitors</summary>
   <ul lang="zh-CN">
    {CONFIRMED_EXHIBITORS.map((name) => <li key={name}>{name}</li>)}
   </ul>
  </details>
 </section>
 <section className="v6-onsite" id="programme">
  <div className="shell section">
   <div className="v6-heading">
    <span className="eyebrow">
     05 / ON SITE
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
     06 / PLAN YOUR VISIT
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
      <span className="v9-tag">Free</span>
      <p className="v9-session-detail">4–5 speakers on where the industry is heading: Denny You; a WYBOT representative; a robotic-mower speaker; a robot-vacuum speaker.</p>
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
      <span className="v9-tag">Free</span>
      <p className="v9-session-detail">4–5 experts, including a securities research analyst and an investment banking expert; further names to be announced.</p>
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
       Afternoon
      </span>
      <time>
       14:00–17:00
      </time>
      <h4>
       AVC workshop: evaluation metrics for home service robots
      </h4>
      <span className="v9-tag">By invitation</span>
      <p className="v9-session-detail">A closed-door session hosted by AVC (All View Cloud) in the Yushan Hall, 2nd floor, Hall A.</p>
     </div>
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
      <span className="v9-tag">Seat confirmation required</span>
      <p className="v9-session-detail">Exhibitors and invited guests meet face to face.</p>
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
      <span className="v9-tag">By invitation</span>
      <p className="v9-session-detail">Invited buyers meet exhibitors on site.</p>
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
      <span className="v9-tag">Open to visitors</span>
      <p className="v9-session-detail">5–6 exhibitors present new products and technology.</p>
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
      <span className="v9-tag">Open to visitors</span>
      <p className="v9-session-detail">5–6 exhibitors present new products and technology.</p>
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
   China Standard Time (UTC+8). Speaker names, talk titles and the order of launches will be announced later; the organizer’s latest notice applies. Exhibition admission hours will be confirmed by the organizer.
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
   <div className="expo-actions">
    <a className="button" href="/contact?inquiry=expo_visitor#project-form">
     Plan your visit
    </a>
    <a className="button button-secondary" href="/contact?inquiry=expo_exhibitor#project-form">
     Exhibit or partner
    </a>
   </div>
  </div>
 </section>
</div>

  );
}
