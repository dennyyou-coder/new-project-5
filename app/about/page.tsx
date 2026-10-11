import type { Metadata } from "next";
import { getArticleImage } from "@/lib/articleImages";
import { ProfileGallery, ProfileImage, type ProfilePhoto } from "./ProfileGallery";
import "./profile.css";

export const metadata: Metadata = {
  title: "About Denny You (游丹尼)",
  description: "Meet Denny You, founder of Glorison Innovation and World Clean Biz: cleaning industry experience, securities-firm talks, industry forums and WCB Expo.",
  alternates: { canonical: "/about" },
  openGraph: { title: "Denny You (游丹尼) | World Clean Biz", url: "/about", images: ["/images/articles/about-denny-profile/01-cover.webp"] },
  twitter: { card: "summary_large_image", title: "Denny You (游丹尼) | World Clean Biz", images: ["/images/articles/about-denny-profile/01-cover.webp"] }
};

function photo(src: string, caption: string): ProfilePhoto {
  const image = getArticleImage(src);
  if (!image) throw new Error(`Missing About photo: ${src}`);
  return { src, caption, ...image };
}
const galleryPhotos: Record<string, ProfilePhoto[]> = {
"about-denny-speaking": [
photo("/images/articles/about-denny-speaking/01-cover.webp", "CITIC Securities · “A century of cleaning appliances”"),
photo("/images/articles/about-denny-speaking/02-photo-0.webp", "GF Securities · Cleaning appliances before the dawn"),
photo("/images/articles/about-denny-speaking/03-photo-2.webp", "招商证券 · Overseas markets and inventory · November 2022"),
photo("/images/articles/about-denny-speaking/04-photo-3.webp", "开源证券 · Floor-washer industry discussion"),
photo("/images/articles/about-denny-speaking/05-photo-11.webp", "德邦证券 · Economic & investment summit · 2021"),
photo("/images/articles/about-denny-speaking/06-photo-9.webp", "CITIC Securities · Brand and product evolution"),
photo("/images/articles/about-denny-speaking/07-photo-28.webp", "July 2025 · Denny You (游丹尼) discussing global trade"),
photo("/images/articles/about-denny-speaking/08-photo-33.webp", "July 2025 · Denny You (游丹尼) in the industry panel"),
photo("/images/articles/about-denny-speaking/09-photo-59.webp", "March 2026 · Denny You (游丹尼) speaking in Shenzhen")
],
"about-denny-forums-2019": [
photo("/images/articles/about-denny-forums-2019/01-cover.webp", "2019 · Shenzhen forum audience"),
photo("/images/articles/about-denny-forums-2019/02-photo-14.webp", "2019 · Suzhou forum · Denny speaking"),
photo("/images/articles/about-denny-forums-2019/03-photo-15.webp", "2019 · Shenzhen forum · Industry exchange")
],
"about-denny-forum-2025": [
photo("/images/articles/about-denny-forum-2025/01-cover.webp", "July 2025 · Suzhou · Full-room view"),
photo("/images/articles/about-denny-forum-2025/02-photo-25.webp", "July 2025 · Suzhou · Presentations and audience"),
photo("/images/articles/about-denny-forum-2025/03-photo-26.webp", "July 2025 · Suzhou · Industry presentations"),
photo("/images/articles/about-denny-forum-2025/04-photo-29.webp", "July 2025 · Suzhou · Participants in the audience"),
photo("/images/articles/about-denny-forum-2025/05-photo-30.webp", "July 2025 · Suzhou · Views from the audience"),
photo("/images/articles/about-denny-forum-2025/06-photo-34.webp", "July 2025 · Suzhou · Panel discussion"),
photo("/images/articles/about-denny-forum-2025/07-photo-31.webp", "July 2025 · Suzhou · Participants on stage"),
photo("/images/articles/about-denny-forum-2025/08-photo-28.webp", "July 2025 · Suzhou · Denny discussing global trade"),
photo("/images/articles/about-denny-forum-2025/09-photo-32.webp", "July 2025 · Suzhou · Guest presentation"),
photo("/images/articles/about-denny-forum-2025/10-photo-33.webp", "July 2025 · Suzhou · Denny in the panel"),
photo("/images/articles/about-denny-forum-2025/11-photo-20.webp", "July 2025 · Suzhou · Product display conversations"),
photo("/images/articles/about-denny-forum-2025/12-photo-21.webp", "July 2025 · Suzhou · Supplier discussions"),
photo("/images/articles/about-denny-forum-2025/13-photo-18.webp", "July 2025 · Suzhou · Product demonstrations"),
photo("/images/articles/about-denny-forum-2025/14-photo-19.webp", "July 2025 · Suzhou · Hands-on product exchange"),
photo("/images/articles/about-denny-forum-2025/15-photo-22.webp", "July 2025 · Suzhou · Denny with a participant")
],
"about-denny-expo-2025": [
photo("/images/articles/about-denny-expo-2025/01-cover.webp", "November 2025 · Full forum audience"),
photo("/images/articles/about-denny-expo-2025/02-photo-40.webp", "November 2025 · Industry professionals in the audience"),
photo("/images/articles/about-denny-expo-2025/03-photo-39.webp", "November 2025 · Expert presentation and audience"),
photo("/images/articles/about-denny-expo-2025/04-photo-41.webp", "November 2025 · Technology presentation"),
photo("/images/articles/about-denny-expo-2025/05-photo-45.webp", "November 2025 · Expert sharing session"),
photo("/images/articles/about-denny-expo-2025/06-photo-46.webp", "November 2025 · Discussion on stage"),
photo("/images/articles/about-denny-expo-2025/07-photo-48.webp", "November 2025 · Product and market presentation"),
photo("/images/articles/about-denny-expo-2025/08-photo-50.webp", "November 2025 · Forum presentation"),
photo("/images/articles/about-denny-expo-2025/09-photo-73.webp", "November 2025 · Category presentation"),
photo("/images/articles/about-denny-expo-2025/10-photo-43.webp", "November 2025 · Conversations in the exhibition area"),
photo("/images/articles/about-denny-expo-2025/11-photo-36.webp", "November 2025 · Visitors and product displays"),
photo("/images/articles/about-denny-expo-2025/12-photo-81.webp", "November 2025 · Supplier conversations"),
photo("/images/articles/about-denny-expo-2025/13-photo-42.webp", "November 2025 · Denny speaking on stage"),
photo("/images/articles/about-denny-expo-2025/14-photo-47.webp", "November 2025 · Audience listening to the presentations"),
photo("/images/articles/about-denny-expo-2025/15-photo-49.webp", "November 2025 · Market presentation"),
photo("/images/articles/about-denny-expo-2025/16-photo-71.webp", "November 2025 · Guest speaker"),
photo("/images/articles/about-denny-expo-2025/17-photo-74.webp", "November 2025 · Cleaning-material samples"),
photo("/images/articles/about-denny-expo-2025/18-photo-78.webp", "November 2025 · Motors and components on display")
],
"about-denny-expo-2026": [
photo("/images/articles/about-denny-expo-2026/01-cover.webp", "March 2026 · Shenzhen · Panoramic view of the forum"),
photo("/images/articles/about-denny-expo-2026/02-photo-106.webp", "March 2026 · Shenzhen · Conversations across the audience"),
photo("/images/articles/about-denny-expo-2026/03-photo-82.webp", "March 2026 · Shenzhen · Visitors on the exhibition floor"),
photo("/images/articles/about-denny-expo-2026/04-photo-83.webp", "March 2026 · Shenzhen · Industry forum audience"),
photo("/images/articles/about-denny-expo-2026/05-photo-63.webp", "March 2026 · Shenzhen · Audience interaction"),
photo("/images/articles/about-denny-expo-2026/06-photo-84.webp", "March 2026 · Shenzhen · Participants following the presentation"),
photo("/images/articles/about-denny-expo-2026/07-photo-54.webp", "March 2026 · Shenzhen · Participants on stage"),
photo("/images/articles/about-denny-expo-2026/08-photo-59.webp", "March 2026 · Shenzhen · Denny speaking"),
photo("/images/articles/about-denny-expo-2026/09-photo-87.webp", "March 2026 · Shenzhen · Industry presentation"),
photo("/images/articles/about-denny-expo-2026/10-photo-89.webp", "March 2026 · Shenzhen · Technology presentation"),
photo("/images/articles/about-denny-expo-2026/11-photo-97.webp", "March 2026 · Shenzhen · Product presentation"),
photo("/images/articles/about-denny-expo-2026/12-photo-98.webp", "March 2026 · Shenzhen · Robotics presentation"),
photo("/images/articles/about-denny-expo-2026/13-photo-90.webp", "March 2026 · Shenzhen · Exhibition aisles"),
photo("/images/articles/about-denny-expo-2026/14-photo-86.webp", "March 2026 · Shenzhen · Supplier booth discussions"),
photo("/images/articles/about-denny-expo-2026/15-photo-91.webp", "March 2026 · Shenzhen · Visitors meeting exhibitors"),
photo("/images/articles/about-denny-expo-2026/16-photo-92.webp", "March 2026 · Shenzhen · Product and supplier discussions"),
photo("/images/articles/about-denny-expo-2026/17-photo-95.webp", "March 2026 · Shenzhen · Examining components together"),
photo("/images/articles/about-denny-expo-2026/18-photo-103.webp", "March 2026 · Shenzhen · Conversations at the meeting table"),
photo("/images/articles/about-denny-expo-2026/19-photo-101.webp", "March 2026 · Shenzhen · Exhibitor discussions"),
photo("/images/articles/about-denny-expo-2026/20-photo-105.webp", "March 2026 · Shenzhen · Face-to-face business conversations")
],
"about-denny-profile": [
photo("/images/articles/about-denny-profile/01-cover.webp", "Denny You · Industry forum, July 2025"),
photo("/images/articles/about-denny-profile/02-photo-13.webp", "Denny You (游丹尼)"),
photo("/images/articles/about-denny-profile/03-wcb-2026-key-visual.webp", "WCB 2026 exhibition promotional artwork, with 18–20 November 2026 and Suzhou Shishan Convention Center")
],
};

export default function AboutPage() {
 return <div id="denny-about">
<section className="hero"><div className="wrap hero-grid"><div className="hero-copy"><div className="eyebrow">THE PERSON BEHIND WORLD CLEAN BIZ</div>
<h1>Denny You <span className="chinese-name">(游丹尼)</span>
</h1>
<h2>A working life<br />inside the cleaning industry.</h2>
<p className="lead">Entrepreneur. Industry writer. Forum organizer.</p>
<p>Since 2006, I’ve worked with cleaning products, factories, supply chains and international markets. Today, I bring that experience to World Clean Biz and WCB Expo.</p>
<div className="actions"><a className="btn" href="#journey">Meet Denny</a>
<a className="textlink" href="#in-person">See the work in person</a>
</div>
<p className="roles">Founder, Glorison Innovation · World Clean Biz · WCB Expo</p>
</div>
<div className="hero-photo"><ProfileGallery single priority label="Denny You · Industry forum, July 2025" photos={[photo("/images/articles/about-denny-profile/01-cover.webp", "Denny You · Industry forum, July 2025")]} /></div>
</div>
</section>

<div className="milestones wrap"><div><strong>2006</strong>
<span>Entered the cleaning industry</span>
</div>
<div><strong>2017</strong>
<span>Began publishing industry articles</span>
</div>
<div><strong>2019</strong>
<span>Organized the first industry forums</span>
</div>
<div><strong>Today</strong>
<span>Building World Clean Biz &amp; WCB Expo</span>
</div>
</div>

<nav aria-label="About page sections" className="sectionnav"><div className="wrap"><a href="#journey">My journey</a>
<a href="#speaking">Speaking</a>
<a href="#writing">Writing &amp; videos</a>
<a href="#in-person">Forums &amp; events</a>
</div>
</nav>

<section className="wrap section" id="journey"><div className="sectionhead"><div><div className="eyebrow">01 / EXPERIENCE</div>
<h2>Built through doing.</h2>
</div>
<p>From factory sales to building products, writing about the industry and bringing its people together.</p>
</div>
<div className="journey-grid"><div className="bio-photo"><ProfileGallery single  label="Denny You (游丹尼)" photos={[photo("/images/articles/about-denny-profile/02-photo-13.webp", "Denny You (游丹尼)")]} /></div>
<div className="timeline"><article><span>2006–2016</span>
<h3>Products, factories and overseas markets</h3>
<p>I started in export sales at a vacuum cleaner factory in Hangzhou. Working with customers, samples and manufacturing gave me a practical understanding of the business.</p>
</article>
<article><span>2017–2018</span>
<h3>Finding an industry voice</h3>
<p>I began writing under the name Denny You (游丹尼), sharing observations on cleaning companies, products and the supply chain. At the end of 2018, I left salaried employment to explore my next chapter.</p>
</article>
<article><span>2019 ONWARDS</span>
<h3>Building a company. Connecting an industry.</h3>
<p>Factory visits and industry forums led to a new entrepreneurial path. I founded Glorison Innovation (荣采创新), working on products and the practical challenges of bringing them to market.</p>
</article>
<article><span>TODAY</span>
<h3>World Clean Biz &amp; WCB Expo</h3>
<p>Writing, videos and in-person events now sit alongside one another: a way to understand the industry and help its people find each other.</p>
</article>
</div>
</div>
<div className="venture"><div><span className="eyebrow">ENTREPRENEURSHIP</span>
<h3>Founder of Glorison Innovation <span>荣采创新</span>
</h3>
</div>
<div><strong>Raised tens of millions in funding.</strong>
<p>My perspective also comes from building a business: developing products, working with suppliers and customers, and making decisions under real commercial constraints.</p>
</div>
</div>
</section>

<section className="tinted" id="speaking"><div className="wrap section"><div className="sectionhead"><div><div className="eyebrow">02 / INDUSTRY PERSPECTIVE</div>
<h2>Sharing what I see.</h2>
</div>
<p>Industry history, product change and the companies behind it—shared with securities firms and professional audiences.</p>
</div>
<div className="speaking-main"><ProfileGallery label="Securities firms and public speaking photo gallery" photos={galleryPhotos["about-denny-speaking"]} /><div className="speaking-copy"><div className="eyebrow">SECURITIES-FIRM SHARING &amp; PUBLIC SPEAKING</div>
<h3>From the factory floor to the bigger industry picture.</h3>
<p>Since 2006, my work has taken me through cleaning products, export sales, factories, supply chains and building a hardware business. I bring that operating experience to my writing and talks.</p>
<p>In sessions with securities firms and industry audiences, I connect the details of a product with the decisions behind it: how a category develops, how a company competes and what changes when it enters a new market.</p>
<div className="talk-topics"><h4>What I speak about</h4>
<div><b>Industry history &amp; product change</b>
<p>From vacuum cleaners to floor washers and cleaning robots: how products, technologies and consumer needs evolve.</p>
</div>
<div><b>Companies, brands &amp; global markets</b>
<p>Company histories, product strategy, overseas channels and the relationships between manufacturers and brands.</p>
</div>
<div><b>Supply chains &amp; the realities of building a business</b>
<p>Connecting product development, suppliers and market demand through the perspective of an industry operator and entrepreneur.</p>
</div>
</div>
<div className="speaking-firms"><h4>Selected speaking engagements</h4>
<p>CITIC Securities · GF Securities<br />招商证券 · 开源证券 · 德邦证券</p>
<span>Topics shown in the gallery include cleaning-industry history, overseas markets and floor-washer development.</span>
</div>
<a className="textlink" href="/contact">Discuss a talk or industry exchange →</a>
</div>
</div>
</div>
</section>

<section className="wrap section media-section" id="writing" aria-labelledby="media-title">
<div className="sectionhead"><div><div className="eyebrow">03 / WRITING &amp; VIDEO</div>
<h2 id="media-title">Sharing the industry’s stories.</h2></div>
<p>Since 2017, I’ve explored cleaning companies, products and markets through articles and video.</p></div>
<div className="media-grid">
<div className="media-column"><h3>Selected writing</h3>
<a className="media-feature" href="/blog/story-of-hard-floor-washers">
<ProfileImage photo={photo("/images/articles/story-of-hard-floor-washers/01-cover.webp", "The Story of Hard Floor Washers")} />
<h4>The Story of Hard Floor Washers</h4></a>
<div className="media-links">
<a href="/blog/irobot-decline-and-the-new-robot-vacuum-order">iRobot’s Decline and the New Order in Robot Vacuums <span aria-hidden="true">→</span></a>
<a href="/blog/series/building-worlds-no-1-cleaning-show-from-scratch">My founder’s journal: Building the World’s No.1 Cleaning Show from Scratch <span aria-hidden="true">→</span></a>
</div>
<a className="textlink" href="/blog/archive">Explore all analysis →</a>
</div>
<div className="media-column" id="watch"><h3>Watch &amp; follow</h3>
<a className="media-feature" href="https://www.youtube.com/watch?v=kCa9-2gsSVE" rel="noopener" target="_blank">
<div className="videoimage"><img alt="Segway-Ninebot: From Mobility to Robot Mowers" loading="lazy" src="https://i.ytimg.com/vi/kCa9-2gsSVE/hq720.jpg" width={1280} height={720} decoding="async" /><span className="play" aria-hidden="true">▶</span></div>
<h4>Segway-Ninebot: From Mobility to Robot Mowers</h4></a>
<p className="media-caption">Company stories and product strategy.<br />Mandarin audio · English &amp; Chinese subtitles</p>
<div className="media-actions"><a className="textlink" href="https://www.youtube.com/@WCBdenny/videos" rel="noopener" target="_blank">Denny on YouTube ↗</a>
<a className="textlink" href="/videos">All WCB videos →</a></div>
</div>
</div>
</section>

<section className="wrap section" id="in-person"><div className="sectionhead"><div><div className="eyebrow">04 / IN PERSON</div>
<h2>An influential forum.<br />A bigger ambition.</h2>
</div>
<p>A leading forum for China’s cleaning industry, bringing together brands, manufacturers and supply-chain partners. What began with two industry gatherings in 2019 has grown into forums, specialist exhibitions and the ambition behind WCB Expo.</p>
</div>
<article className="event"><div className="event-intro"><span className="date">2019</span>
<h3>Two cities. A shared industry conversation.</h3>
<div className="event-facts"><div><strong>2 forums</strong>
<span>Suzhou &amp; Shenzhen</span>
</div>
<div><strong>500</strong>
<span>participants at each forum</span>
</div>
</div>
<div className="event-body"><p>In 2019, I organized industry forums in Suzhou and Shenzhen, each attended by 500 people. These gatherings brought my industry writing into a room where people could meet, exchange views and discuss the business face to face.</p>
<p>The conversations centred on cleaning products, technology and company development. For me, this was the start of a lasting part of my work: bringing the people behind the industry together.</p>
</div>
</div>
<ProfileGallery label="2019 photo gallery" photos={galleryPhotos["about-denny-forums-2019"]} /></article>
<article className="event"><div className="event-intro"><span className="date">JUL 2025 · SUZHOU</span>
<h3>A fuller room. A wider industry conversation.</h3>
<div className="event-facts"><div><strong>500</strong>
<span>industry participants</span>
</div>
<div><strong>Suzhou</strong>
<span>July 2025</span>
</div>
</div>
<div className="event-body"><p>The July 2025 forum welcomed 500 industry professionals in Suzhou, with representatives from many of the sector’s leading companies. The programme brought together presentations, panel discussions and product displays.</p>
<p>Beyond the stage, participants examined products, spoke with suppliers and exchanged views on overseas markets. The gallery captures both the scale of the gathering and the conversations that took place around it.</p>
</div>
</div>
<ProfileGallery label="JUL 2025 · SUZHOU photo gallery" photos={galleryPhotos["about-denny-forum-2025"]} /></article>
<article className="event" hidden id="august-2025-pending"><div className="event-intro"><span className="date">AUG 2025 · SHENZHEN</span>
<h3>The conversation continued in Shenzhen.</h3>
<span className="event-badge">500 participants</span>
<p>The August industry forum brought together 500 professionals in Shenzhen, including representatives from many leading cleaning companies. The July and August forums connected brands, manufacturers and supply-chain partners.</p>
</div>
<div className="forum-record"><span className="eyebrow">SHENZHEN · INDUSTRY FORUM</span>
<strong>500<span>industry participants</span>
</strong>
<div className="record-line">Brands · Manufacturers · Supply-chain partners</div>
<blockquote>“The two industry forums in July and August each brought together nearly 500 people.”</blockquote>
<p>From Denny’s archive: 清洁电器供应链技术展</p>
</div>
</article>
<article className="event"><div className="event-intro"><span className="date">NOV 2025 · FIRST EDITION</span>
<h3>The first Cleaning Appliance Supply Chain Technology Exhibition.</h3>
<div className="event-facts event-facts-three"><div><strong>100+</strong>
<span>exhibitors</span>
</div>
<div><strong>2,000–3,000</strong>
<span>professional visitors, approximately</span>
</div>
<div><strong>10+</strong>
<span>industry expert speakers</span>
</div>
</div>
<div className="event-body"><p>In November 2025, we held the first Cleaning Appliance Supply Chain Technology Exhibition, bringing together more than 100 exhibitors and approximately 2,000–3,000 industry professionals.</p>
<p>It took the forum format onto the exhibition floor. Manufacturers and suppliers presented products, components and technical solutions, while more than ten industry experts shared their views on stage. Visitors could move between industry discussions, product demonstrations and face-to-face supplier conversations.</p>
<p>This was the foundation for the next stage: a specialist exhibition built around the people, products and technologies of the cleaning supply chain.</p>
</div>
</div>
<ProfileGallery label="NOV 2025 photo gallery" photos={galleryPhotos["about-denny-expo-2025"]} /></article>
<article className="event"><div className="event-intro"><span className="date">MAR 2026 · SHENZHEN</span>
<h3>An upgraded format. A wider regional reach.</h3>
<div className="event-facts"><div><strong>Shenzhen &amp; beyond</strong>
<span>professionals from the surrounding region</span>
</div>
<div><strong>New modules</strong>
<span>matchmaking &amp; product launches</span>
</div>
</div>
<div className="event-body"><p>The March 2026 Shenzhen exhibition built on the first supply-chain technology exhibition, reaching practitioners in Shenzhen and the surrounding area.</p>
<p>We expanded the programme with procurement matchmaking and new product launches alongside the exhibition and industry talks. The upgraded format gave buyers a setting to discuss their needs, suppliers a way to introduce their capabilities, and companies a platform to present new products.</p>
<p>The exhibition was developing beyond displays and presentations, with dedicated activities that helped people find relevant contacts and discuss concrete business opportunities.</p>
</div>
</div>
<ProfileGallery label="MAR 2026 photo gallery" photos={galleryPhotos["about-denny-expo-2026"]} /></article>
<article className="event future-event" id="wcb-2026"><div className="event-intro"><span className="date">NOV 2026 · THE NEXT UPGRADE</span>
<h3>From the supply chain to the wider cleaning industry.</h3>
<p>WCB Expo 2026 takes the next step: bringing brands, finished-product manufacturers, component suppliers, R&amp;D and procurement teams, and channel partners together in Suzhou.</p>
<p>The scope extends across robot vacuums, floor washers, vacuum cleaners, window-cleaning robots, robotic mowers, pool cleaning, commercial cleaning and pressure washing.</p>
<div className="event-facts"><div><strong>3 days</strong>
<span>to meet, discover and discuss business</span>
</div>
<div><strong>141 planned booths</strong>
<span>according to the 8 October 2026 floor plan</span>
</div>
</div>
<p className="expo-ambition">My ambition is to build the world’s No.1 specialist cleaning exhibition—growing from the industry gatherings and supply-chain exhibitions we have already organized.</p>
<div className="future-date">18–20 November 2026<span>Suzhou Shishan Convention Center · Suzhou, China</span>
</div>
<a className="btn" href="/wcb-expo">Explore WCB Expo 2026</a>
</div>
<figure className="future-visual"><ProfileGallery single label="WCB Expo 2026 promotional artwork" photos={[photo("/images/articles/about-denny-profile/03-wcb-2026-key-visual.webp", "WCB Expo 2026 · Promotional key visual")]} /><div className="future-visual-note"><h4>The planned WCB 2026 programme</h4>
<dl className="expo-programme"><div><dt><span>01</span>
Procurement matchmaking</dt>
<dd>Connect exhibitors with invited purchasing teams around product directions and sourcing needs.</dd>
</div>
<div><dt><span>02</span>
Industry forums</dt>
<dd>Discussions on technology, supply chains and overseas markets, with entrepreneur and expert sessions planned for 18 November.</dd>
</div>
<div><dt><span>03</span>
Product &amp; technology launches</dt>
<dd>Two launch sessions are planned for 19–20 November. Exhibitor applications and presentation content are subject to review.</dd>
</div>
<div><dt><span>04</span>
Exhibitor networking dinner</dt>
<dd>A setting for exhibitors and invited guests to continue conversations beyond the exhibition floor.</dd>
</div>
<div><dt><span>05</span>
Exhibitor directory &amp; communications</dt>
<dd>Company listings, basic publicity and selected product coverage help buyers discover participating businesses.</dd>
</div>
</dl>
<p className="programme-note">Planned activities; final schedules and participation arrangements will be announced by the organizer.</p>
</div>
</figure>
</article>
</section>

</div>;
}
