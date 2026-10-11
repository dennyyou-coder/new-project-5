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
"about-denny-shenzhen-august-2025": [
photo("/images/articles/about-denny-shenzhen-august-2025/01-cover.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Full-room view"),
photo("/images/articles/about-denny-shenzhen-august-2025/02-forum-147.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Forum stage and audience"),
photo("/images/articles/about-denny-shenzhen-august-2025/03-forum-083.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Denny You on stage"),
photo("/images/articles/about-denny-shenzhen-august-2025/04-forum-129.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Denny discussing overseas channels"),
photo("/images/articles/about-denny-shenzhen-august-2025/05-forum-235.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Roundtable discussion"),
photo("/images/articles/about-denny-shenzhen-august-2025/06-forum-261.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Exchange between panelists"),
photo("/images/articles/about-denny-shenzhen-august-2025/07-forum-208.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Industry presentation and audience"),
photo("/images/articles/about-denny-shenzhen-august-2025/08-forum-181.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Guest presentation"),
photo("/images/articles/about-denny-shenzhen-august-2025/09-forum-087.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Participants in the front rows"),
photo("/images/articles/about-denny-shenzhen-august-2025/10-forum-106.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Industry professionals listening"),
photo("/images/articles/about-denny-shenzhen-august-2025/11-forum-114.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Audience during the forum"),
photo("/images/articles/about-denny-shenzhen-august-2025/12-forum-142.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Views across the audience"),
photo("/images/articles/about-denny-shenzhen-august-2025/13-forum-192.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Participants following the discussion"),
photo("/images/articles/about-denny-shenzhen-august-2025/14-forum-175.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Participants together on stage"),
photo("/images/articles/about-denny-shenzhen-august-2025/15-forum-058.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Conversations outside the auditorium"),
photo("/images/articles/about-denny-shenzhen-august-2025/16-forum-041.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Product and supplier discussions"),
photo("/images/articles/about-denny-shenzhen-august-2025/17-forum-277.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 Denny with forum participants"),
photo("/images/articles/about-denny-shenzhen-august-2025/18-forum-079.webp", "9 August 2025 \u00b7 Shenzhen \u00b7 A wide view of the gathering")
],
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
<a className="textlink" href="/contact">Discuss a speaking engagement</a>
</div>
</div>
</div>
</section>

<section className="wrap section media-section" id="writing" aria-labelledby="media-title">
<div className="sectionhead"><div><div className="eyebrow">03 / WRITING, VIDEO &amp; FOUNDER’S JOURNAL</div>
<h2 id="media-title">Sharing the industry’s stories.</h2></div>
<p>Since 2017, I’ve shared the industry’s stories through articles and video. My founder’s journal tells the story of my own journey.</p></div>
<div className="media-grid">
<div className="media-column"><h3>Selected writing</h3>
<a className="media-feature" href="/blog/story-of-hard-floor-washers">
<ProfileImage photo={photo("/images/articles/story-of-hard-floor-washers/01-cover.webp", "The Story of Hard Floor Washers")} />
<h4>The Story of Hard Floor Washers</h4></a>
<div className="media-links">
<a href="/blog/irobot-decline-and-the-new-robot-vacuum-order">iRobot’s Decline and the New Order in Robot Vacuums</a>
</div>
<a className="textlink" href="/blog/archive">Explore all analysis</a>
</div>
<div className="media-column" id="watch"><h3>Watch &amp; follow</h3>
<a className="media-feature" href="https://www.youtube.com/watch?v=kCa9-2gsSVE" rel="noopener" target="_blank">
<div className="videoimage"><img alt="Segway-Ninebot: From Mobility to Robot Mowers" loading="lazy" src="https://i.ytimg.com/vi/kCa9-2gsSVE/hq720.jpg" width={1280} height={720} decoding="async" /><span className="play" aria-hidden="true">▶</span></div>
<h4>Segway-Ninebot: From Mobility to Robot Mowers</h4></a>
<p className="media-caption">Company stories and product strategy.<br />Mandarin audio · English &amp; Chinese subtitles</p>
<div className="media-actions"><a className="textlink" href="https://www.youtube.com/@WCBdenny/videos" rel="noopener" target="_blank">Denny on YouTube</a>
<a className="textlink" href="/videos">All WCB videos</a></div>
</div>
<div className="media-column"><h3>Founder’s journal</h3>
<a className="media-feature" href="/blog/series/building-worlds-no-1-cleaning-show-from-scratch">
<ProfileImage photo={photo("/images/articles/building-worlds-no-1-cleaning-show-from-scratch-episode-06/01-cover.webp", "Building the World’s No.1 Cleaning Show from Scratch — founder’s journal")} sizes="(max-width: 800px) calc(100vw - 40px), 390px" />
<h4>Building the World’s No.1 Cleaning Show from Scratch</h4></a>
<p className="media-caption">A personal account of building products, navigating setbacks and bringing the cleaning industry together through WCB.</p>
<a className="textlink" href="/blog/series/building-worlds-no-1-cleaning-show-from-scratch">Read the founder’s journal</a>
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
<article className="event" id="august-2025"><div className="event-intro"><span className="date">9 AUG 2025 · SHENZHEN</span>
<h3>The conversation continued in Shenzhen.</h3>
<div className="event-facts"><div><strong>500</strong><span>industry participants</span></div><div><strong>Shenzhen</strong><span>9 August 2025</span></div></div>
<div className="event-body"><p>The fourth Cleaning Appliance Industry Forum brought 500 professionals together in Shenzhen under the theme “The Age of Global Expansion.” Brands, manufacturers and supply-chain partners joined presentations and a roundtable on products, technology and overseas markets.</p>
<p>From a full auditorium to product discussions outside the main room, the gathering connected industry knowledge with face-to-face exchange. These photographs show the speakers, audience and conversations behind the event.</p></div>
</div>
<ProfileGallery label="AUG 2025 · SHENZHEN photo gallery" photos={galleryPhotos["about-denny-shenzhen-august-2025"]} /></article>
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
<article className="expo-finale" id="wcb-2026" aria-labelledby="expo-finale-title">
<header className="expo-finale-heading"><span className="date">NOV 2026 · THE NEXT CHAPTER</span>
<h3 id="expo-finale-title">Bringing the cleaning industry together.</h3></header>
<div className="expo-finale-grid">
<div className="expo-finale-copy">
<p>WCB Expo 2026 grows from our forums and supply-chain exhibitions into an international meeting place for cleaning brands, manufacturers, suppliers and professional buyers.</p>
<p>Alongside the exhibition, the planned programme includes industry forums, procurement matchmaking, product launches and exhibitor networking.</p>
<p className="expo-finale-ambition">My ambition: to build the world’s No.1 specialist cleaning exhibition.</p>
</div>
<div className="expo-finale-visual"><ProfileGallery single label="WCB Expo 2026 promotional artwork" photos={[photo("/images/articles/about-denny-profile/03-wcb-2026-key-visual.webp", "WCB Expo 2026 · Promotional key visual")]} /></div>
</div>
<div className="expo-finale-footer"><div><strong>18–20 November 2026</strong><span>Suzhou Shishan Convention Center · Suzhou, China</span></div>
<a className="btn" href="/wcb-expo">Explore WCB Expo 2026</a></div>
</article>
</section>

</div>;
}
