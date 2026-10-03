import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";

export function NewsSidebar() {
  return <aside className="news-sidebar" aria-label="Explore World Clean Biz">
    <section><p className="news-eyebrow">Explore More</p><h2>Follow the story.</h2><Link href="/brands">Company &amp; brand profiles <span>↗</span></Link><Link href="/products">Product models <span>↗</span></Link><Link href="/blog">Industry analysis <span>↗</span></Link><Link href="/guides">Buying &amp; sourcing guides <span>↗</span></Link></section>
    <section><p className="news-eyebrow">Meet The Industry</p><h2>WCB Expo</h2><p>Connect with the people and products shaping cleaning.</p><Link href="/wcb-expo">Explore WCB Expo <span>↗</span></Link></section>
    <section><p className="news-eyebrow">Industry Updates</p><h2>Stay informed.</h2><p>Choose the WCB updates relevant to your work.</p><TallyButton form="newsletter" ctaLocation="news_newsletter">Get Industry Updates</TallyButton></section>
  </aside>;
}
