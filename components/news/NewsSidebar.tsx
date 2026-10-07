import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";

const exploreLinks = [
  { href: "/brands", label: "Company profiles", detail: "Brands & manufacturers", image: "/images/blog/wcb-episode-04-roborock-headquarters.webp", alt: "Roborock headquarters building" },
  { href: "/products", label: "Product directory", detail: "Models & specifications", image: "/images/brands/roborock/hero-saros-z70.webp", alt: "Roborock Saros Z70 product image" },
  { href: "/blog", label: "Industry analysis", detail: "Perspectives & context", image: "/images/articles/miele-two-families-company-story/01-cover.webp", alt: "Miele company analysis cover" },
  { href: "/guides", label: "Buying guides", detail: "Selection & sourcing", image: "/images/blog/robot-vacuum-for-pet-hair-buying-guide.webp", alt: "Robot vacuum pet hair buying guide cover" }
];

export function NewsSidebar() {
  return <aside className="news-sidebar" aria-label="Explore World Clean Biz">
    <section className="news-side-card news-explore-card" aria-labelledby="news-explore-heading">
      <h2 id="news-explore-heading">Explore WCB</h2>
      <nav className="news-explore-links" aria-label="WCB resources">
        {exploreLinks.map(({ href, label, detail, image, alt }) => <Link href={href} key={href}>
          <img className="news-resource-photo" src={image} alt={alt} width={56} height={42} loading="lazy" decoding="async" />
          <span className="news-resource-copy"><strong>{label}</strong><span>{detail}</span></span>
        </Link>)}
      </nav>
    </section>
    <section className="news-side-card news-expo-card" aria-labelledby="news-expo-heading">
      <p className="news-side-kicker">Meet the industry</p>
      <h2 id="news-expo-heading">WCB Expo</h2>
      <img className="news-side-expo-photo" src="/images/industry/expo-hall-shenzhen-2026.jpg" alt="A previous WCB industry exhibition" width={245} height={107} loading="lazy" decoding="async" />
      <p>Connect with cleaning brands, manufacturers and industry partners.</p>
      <Link className="news-expo-link" href="/wcb-expo">Explore the exhibition</Link>
    </section>
    <section className="news-side-card news-updates-card" aria-labelledby="news-updates-heading">
      <h2 id="news-updates-heading">Industry updates</h2>
      <p>Choose the WCB news and insights relevant to your work.</p>
      <TallyButton form="newsletter" ctaLocation="news_newsletter" className="button news-subscribe-button">Get updates</TallyButton>
    </section>
  </aside>;
}
