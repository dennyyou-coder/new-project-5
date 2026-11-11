import { siteVisualProps } from "@/lib/siteVisuals";
import type { Metadata } from "next";
import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { SourcingOpportunityCard } from "@/components/SourcingOpportunityCard";
import { SOURCING_CATEGORIES } from "@/lib/inquiryConversion";
import { CollectionSchema } from "@/components/seo/CollectionSchema";

export const metadata: Metadata = {
  title: "Cleaning Product Sourcing",
  description:
    "Discover emerging cleaning product opportunities with Denny You, then develop, source and deliver market-ready OEM/ODM products from China.",
  alternates: { canonical: "/sourcing" },
  openGraph: {
    title: "Cleaning Product Opportunities & China Sourcing",
    description:
      "Find the next cleaning industry opportunity and turn it into a product you can source, brand and sell.",
    url: "/sourcing",
    images: ["/images/articles/about-denny-expo-2026/17-photo-95.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Product Opportunities & China Sourcing",
    description:
      "Find the next cleaning industry opportunity and turn it into a product you can source, brand and sell.",
    images: ["/images/articles/about-denny-expo-2026/17-photo-95.webp"]
  }
};

const opportunitySignals = [
  { number: "01", title: "What core factories are developing", text: "New projects moving through important Chinese cleaning equipment factories." },
  { number: "02", title: "Product experience since 2006", text: "Experience that separates a durable category shift from a short-lived novelty." },
  { number: "03", title: "Components, molds and technology", text: "Changes that reveal when a product direction becomes technically and commercially viable." },
  { number: "04", title: "Feedback from overseas channels", text: "Buyer and distributor input that reveals unsolved needs in specific markets." }
];

const shortlistItems = [
  "2–3 relevant category or product directions",
  "Available product images",
  "Basic specifications",
  "Indicative pricing",
  "An initial view of OEM/ODM feasibility"
];

const deliveryStages = [
  { title: "Discover", steps: ["Product Opportunity", "Selection", "Pricing"], image: "/images/articles/about-denny-expo-2026/17-photo-95.webp", alt: "Buyers examining products at a supplier booth, Shenzhen 2026" },
  { title: "Develop", steps: ["Paid Samples", "OEM/ODM", "Production"], image: "/images/articles/about-denny-expo-2025/18-photo-78.webp", alt: "Motors and drive components shown by a supplier" },
  { title: "Deliver", steps: ["Quality & Compliance", "Export & Delivery", "After-Sales"], image: "/images/articles/about-denny-expo-2025/12-photo-81.webp", alt: "Buyers checking vacuum parts at a supplier booth" }
];

const faqs = [
  { question: "What new cleaning products are growing fast?", answer: "The answer changes as factory projects, components, technologies and overseas demand move. For a relevant B2B request, Denny reviews your market and the World Clean Biz team normally prepares 2–3 initial product or category directions within 1–2 business days." },
  { question: "Is World Clean Biz a factory or a trading company?", answer: "World Clean Biz is an industry-focused product and sourcing partner, not a single factory. You can buy directly from us while we select and coordinate the right supply-chain resources for your project." },
  { question: "Can you support OEM/ODM projects?", answer: "Yes. We can coordinate product features, appearance, packaging, branding, accessories, specifications and target-market requirements. Feasibility and MOQ depend on the product and level of customization." },
  { question: "Can I order samples first?", answer: "Yes. Paid samples are available. Trial orders are welcome when they meet the applicable product or factory MOQ." },
  { question: "How do you manage product quality?", answer: "We connect supplier evaluation, sample confirmation, production requirements, follow-up, inspection and issue resolution in one managed process." }
];

export default function SourcingPage() {
  return (
    <div className="sourcing-opportunity-page">
      <section className="sourcing-opportunity-hero">
        <div className="sourcing-opportunity-shell sourcing-opportunity-hero-grid">
          <div className="sourcing-opportunity-hero-copy">
            <p className="sourcing-opportunity-eyebrow">Cleaning product sourcing</p>
            <h1>Cleaning product sourcing</h1>
            <p className="sourcing-opportunity-lead">Tell me what market you serve. I will help identify promising product directions, while the World Clean Biz team turns them into products you can source, brand and sell.</p>
            <div className="sourcing-opportunity-actions">
              <TallyButton className="sourcing-opportunity-button" ctaLocation="sourcing_hero_opportunity" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>
                Get a free product shortlist
              </TallyButton>
              <TallyButton className="sourcing-opportunity-button-secondary" ctaLocation="sourcing_hero_specific_product" form="sourcing" inquiryIntent="specific_product" trackClick>
                I already have a product request
              </TallyButton>
            </div>
            <p className="sourcing-opportunity-hero-offer">Receive 2–3 product directions, images, basic specifications and indicative pricing. Free for relevant B2B requests.</p>
            <ul className="sourcing-opportunity-trust-signals">
              <li>B2B buyers only</li><li>Serving global markets</li><li>Initial response within 8 hours</li>
            </ul>
          </div>
          <figure className="sourcing-opportunity-hero-proof">
            <img src="/images/site-refresh/about/about-hero-denny.webp" width={1600} height={1200} decoding="async" alt="Denny You discussing cleaning product opportunities" />
            <figcaption><strong>Denny You</strong><span>Founder, World Clean Biz</span><small>Inside the cleaning industry since 2006</small></figcaption>
          </figure>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-shortlist">
        <div className="sourcing-opportunity-shell sourcing-opportunity-shortlist-grid">
          <div><p className="sourcing-opportunity-eyebrow">Free For Relevant B2B Requests</p><h2>Free product shortlist</h2><p>Share your company, market and product interests. Denny reviews the opportunity and our team prepares a practical starting point.</p><TallyButton className="sourcing-opportunity-button" ctaLocation="sourcing_shortlist" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>Get a free product shortlist</TallyButton><div className="sourcing-opportunity-timing"><p><strong>Within 8 Hours</strong><span>Initial human contact</span></p><p><strong>Normally Within 1–2 business days</strong><span>Initial product or category directions</span></p></div></div>
          <div><div className="sourcing-opportunity-shortlist-preview"><img {...siteVisualProps("/images/articles/about-denny-expo-2025/17-photo-74.webp")} alt="Brush rolls and cleaning materials from component suppliers" /><div><small>Example product snapshot</small><strong>Product Direction 01</strong><span>Images · Basic Specs · Indicative Price</span><span>OEM/ODM Feasibility · Market Fit</span></div></div><ul>{shortlistItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-categories" id="opportunity-areas">
        <div className="sourcing-opportunity-shell">
          <div className="sourcing-opportunity-heading"><p>Product areas</p><h2>Where the next opportunity could start</h2></div>
          <div className="sourcing-opportunity-category-grid">{SOURCING_CATEGORIES.map((item) => <SourcingOpportunityCard item={item} key={item.value} />)}</div>
          <p className="sourcing-opportunity-secondary-scope">We can also support relevant projects involving cleaning tools, consumables, chemicals, hygiene products, components and replacement parts.</p>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-process">
        <div className="sourcing-opportunity-shell"><div className="sourcing-opportunity-heading"><p>From insight to execution</p><h2>One team from product idea to delivery</h2></div><ol>{deliveryStages.map((stage, index) => <li key={stage.title}><img className="sourcing-opportunity-stage-image" {...siteVisualProps(stage.image, "(max-width: 760px) 100vw, 33vw")} alt={stage.alt} /><div className="sourcing-opportunity-stage-copy"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{stage.title}</h3><p>{stage.steps.join(" → ")}</p></div></div></li>)}</ol><p className="sourcing-opportunity-compliance">Products are managed toward the compliance requirements agreed in writing for the specified target market, with testing and compliance partners involved where needed.</p></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-models">
        <div className="sourcing-opportunity-shell"><div className="sourcing-opportunity-heading"><p>Two ways to work with us</p><h2>The goal: a product that can compete</h2></div><div className="sourcing-opportunity-model-grid"><article className="sourcing-opportunity-model-primary"><div className="sourcing-opportunity-model-image"><img {...siteVisualProps("/images/articles/about-denny-expo-2026/20-photo-105.webp")} alt="Robot vacuum parts on show at the 2026 Shenzhen exhibition" /><span>One Quotation · Managed Delivery</span></div><small>Primary</small><h3>Buy directly from World Clean Biz</h3><p>We recommend products, provide one quotation and manage sourcing, OEM/ODM, production, quality, export and delivery.</p></article><article><div className="sourcing-opportunity-model-image"><img {...siteVisualProps("/images/articles/about-denny-expo-2026/16-photo-92.webp")} alt="A supplier and buyers discussing products at the 2026 Shenzhen exhibition" /><span>Supplier Search · China-Side Control</span></div><small>Also Available</small><h3>Your sourcing office in China</h3><p>We can find new suppliers or manage suppliers you already work with through a defined sourcing partnership.</p></article></div><p className="sourcing-opportunity-model-note">You do not need to choose a model now. We recommend the right approach after understanding your project.</p><TallyButton className="sourcing-opportunity-button" ctaLocation="sourcing_models" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>Discuss a product idea</TallyButton></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-denny-method">
        <div className="sourcing-opportunity-shell sourcing-opportunity-method-grid">
          <div><div className="sourcing-opportunity-heading"><p>Industry signals before the supplier search</p><h2>How Denny spots opportunities early</h2><p>The newest technology is not automatically the right choice. The advantage comes from knowing which solution is current, commercially mature and appropriate for your market.</p></div><div className="sourcing-opportunity-signal-grid">{opportunitySignals.map((item) => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div>
          <figure><img {...siteVisualProps("/images/articles/about-denny-expo-2026/13-photo-90.webp")} alt="Supplier booths at the 2026 Shenzhen exhibition" /><figcaption>Early Signals → Market Judgment → Product Direction → Supply Chain Execution</figcaption></figure>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-team">
        <div className="sourcing-opportunity-shell sourcing-opportunity-team-grid"><img src="/images/industry/sourcing-supplier-meeting-2026.jpg" width={2200} height={1651} loading="lazy" decoding="async" alt="Denny You reviewing cleaning products with suppliers" /><div><p className="sourcing-opportunity-eyebrow">Personal Judgment. Team Execution.</p><h2>Denny reviews, the team carries it out</h2><p>Every sourcing project is reviewed and guided by Denny. The World Clean Biz team manages day-to-day communication, quotation, samples, supplier coordination, production, quality and delivery.</p><ul><li>Inside the cleaning industry since 2006</li><li>Cleaning industry hardware entrepreneur</li><li>Network across manufacturers, suppliers, brands and buyers</li><li>Currently supporting cross-border sellers and international brands</li></ul><Link href="/about">About Denny and World Clean Biz</Link></div></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-final-cta" id="shortlist-form">
        <div className="sourcing-opportunity-shell sourcing-opportunity-final-cta-card"><p className="sourcing-opportunity-eyebrow">Tell Denny about your market</p><h2>Get a free product shortlist</h2><p>For relevant B2B requests, we respond within 8 hours and normally prepare 2–3 initial product or category directions within 1–2 business days.</p><ul><li>Business buyers only</li><li>Paid samples available</li><li>Trial orders subject to applicable MOQ</li></ul><TallyButton className="sourcing-opportunity-button sourcing-opportunity-final-button" ctaLocation="sourcing_footer" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>Get a free product shortlist</TallyButton></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-faq"><div className="sourcing-opportunity-shell"><div className="sourcing-opportunity-heading"><p>Before you start</p><h2>Frequently asked questions</h2></div><div className="sourcing-opportunity-faq-list">{faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
      <CollectionSchema name="China sourcing for cleaning products" description="Product directions and sourcing support for robotic, floor care, vacuum, commercial and outdoor cleaning products." path="/sourcing" items={SOURCING_CATEGORIES.map((item) => ({ name: item.title, url: item.href }))} />
    </div>
  );
}
