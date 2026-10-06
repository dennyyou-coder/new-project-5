import Link from "next/link";
import { FiBookOpen, FiBox, FiFileText, FiGrid, FiMail } from "react-icons/fi";
import { TallyButton } from "@/components/LeadForms";

const exploreLinks = [
  { href: "/brands", label: "Company profiles", detail: "Brands & manufacturers", icon: FiGrid },
  { href: "/products", label: "Product directory", detail: "Models & specifications", icon: FiBox },
  { href: "/blog", label: "Industry analysis", detail: "Perspectives & context", icon: FiFileText },
  { href: "/guides", label: "Buying guides", detail: "Selection & sourcing", icon: FiBookOpen }
];

export function NewsSidebar() {
  return <aside className="news-sidebar" aria-label="Explore World Clean Biz">
    <section className="news-side-card news-explore-card" aria-labelledby="news-explore-heading">
      <h2 id="news-explore-heading">Explore WCB</h2>
      <nav className="news-explore-links" aria-label="WCB resources">
        {exploreLinks.map(({ href, label, detail, icon: Icon }) => <Link href={href} key={href}>
          <span className="news-resource-icon"><Icon aria-hidden="true" /></span>
          <span className="news-resource-copy"><strong>{label}</strong><span>{detail}</span></span>
        </Link>)}
      </nav>
    </section>
    <section className="news-side-card news-expo-card" aria-labelledby="news-expo-heading">
      <p className="news-side-kicker">Meet the industry</p>
      <h2 id="news-expo-heading">WCB Expo</h2>
      <p>Connect with cleaning brands, manufacturers and industry partners.</p>
      <Link className="news-expo-link" href="/wcb-expo">Explore the exhibition</Link>
    </section>
    <section className="news-side-card news-updates-card" aria-labelledby="news-updates-heading">
      <span className="news-updates-icon"><FiMail aria-hidden="true" /></span>
      <h2 id="news-updates-heading">Industry updates</h2>
      <p>Choose the WCB news and insights relevant to your work.</p>
      <TallyButton form="newsletter" ctaLocation="news_newsletter" className="button news-subscribe-button">Get updates</TallyButton>
    </section>
  </aside>;
}
