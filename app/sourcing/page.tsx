import type { Metadata } from "next";
import Link from "next/link";
import { InlineIcon } from "@/components/Icon";
import { TallyButton } from "@/components/LeadForms";
import { SOURCING_CATEGORIES } from "@/lib/inquiryConversion";

export const metadata: Metadata = {
  title: "Cleaning Product Opportunities & China Sourcing",
  description:
    "Discover emerging cleaning product opportunities with Denny You, then develop, source and deliver market-ready OEM/ODM products from China.",
  alternates: { canonical: "/sourcing" },
  openGraph: {
    title: "Cleaning Product Opportunities & China Sourcing",
    description:
      "Find the next cleaning industry opportunity and turn it into a product you can source, brand and sell.",
    url: "/sourcing",
    images: ["/images/site-refresh/system/product-engineering.webp"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Product Opportunities & China Sourcing",
    description:
      "Find the next cleaning industry opportunity and turn it into a product you can source, brand and sell.",
    images: ["/images/site-refresh/system/product-engineering.webp"]
  }
};

const marketDrivers = [
  { icon: "bot" as const, title: "Automation Is Expanding", text: "More cleaning tasks are moving from manual tools and traditional machines to intelligent equipment." },
  { icon: "sparkles" as const, title: "New Categories Are Forming", text: "Floor washers, pool robots, robotic mowers and commercial robots show how quickly a niche can become global." },
  { icon: "globe" as const, title: "Distribution Is Moving Faster", text: "E-commerce and global supply chains allow new products and brands to reach buyers faster than before." }
];

const industryShifts = [
  { icon: "factory" as const, label: "Supply", then: "Finding a reliable supplier could be the advantage.", today: "Suppliers and products are abundant. The difficult part is knowing what to choose." },
  { icon: "search" as const, label: "Selection", then: "The sourcing question was: Who can make this?", today: "The question is: What should we sell next?" },
  { icon: "rocket" as const, label: "Speed", then: "A 12–15 month development cycle could still fit the market.", today: "Fast-moving categories can compress to roughly 6–8 months." },
  { icon: "handshake" as const, label: "Channels", then: "Long relationships could protect sales across product cycles.", today: "Channels now demand price, speed and stronger products—even from long-term partners." }
];

const riskCards = [
  { icon: "cpu" as const, title: "Outdated Before Launch", text: "A technical solution can be replaced while your product is still being developed." },
  { icon: "dollar" as const, title: "More Expensive Than Competitors", text: "Old components or the wrong factory architecture can leave you with a higher cost base." },
  { icon: "activity" as const, title: "Slower To Market", text: "Immature or mismatched solutions create more redesign, tooling and compatibility work." }
];

const opportunitySignals = [
  { number: "01", title: "Core Factory Pipeline Signals", text: "New projects moving through important Chinese cleaning equipment factories." },
  { number: "02", title: "Product Experience Since 2006", text: "Experience that separates a durable category shift from a short-lived novelty." },
  { number: "03", title: "Components, Molds & Technology", text: "Changes that reveal when a product direction becomes technically and commercially viable." },
  { number: "04", title: "Overseas Channel Feedback", text: "Buyer and distributor input that reveals unsolved needs in specific markets." }
];

const shortlistItems = [
  "2–3 relevant category or product directions",
  "Available product images",
  "Basic specifications",
  "Indicative pricing",
  "An initial view of OEM/ODM feasibility"
];

const deliveryStages = [
  { title: "Discover", steps: ["Product Opportunity", "Selection", "Pricing"], image: "/images/site-refresh/real/product-detail.webp", alt: "Product technology being evaluated" },
  { title: "Develop", steps: ["Paid Samples", "OEM/ODM", "Production"], image: "/images/site-refresh/real/business-office.webp", alt: "Product development planning and review" },
  { title: "Deliver", steps: ["Quality & Compliance", "Export & Delivery", "After-Sales"], image: "/images/site-refresh/real/modern-factory.webp", alt: "Modern manufacturing and delivery environment" }
];

const faqs = [
  { question: "What New Cleaning Products Are Growing Fast?", answer: "The answer changes as factory projects, components, technologies and overseas demand move. For a relevant B2B request, Denny reviews your market and the World Clean Biz team normally prepares 2–3 initial product or category directions within 1–2 business days." },
  { question: "Is World Clean Biz A Factory Or A Trading Company?", answer: "World Clean Biz is an industry-focused product and sourcing partner, not a single factory. You can buy directly from us while we select and coordinate the right supply-chain resources for your project." },
  { question: "Can You Support OEM/ODM Projects?", answer: "Yes. We can coordinate product features, appearance, packaging, branding, accessories, specifications and target-market requirements. Feasibility and MOQ depend on the product and level of customization." },
  { question: "Can I Order Samples First?", answer: "Yes. Paid samples are available. Trial orders are welcome when they meet the applicable product or factory MOQ." },
  { question: "How Do You Manage Product Quality?", answer: "We connect supplier evaluation, sample confirmation, production requirements, follow-up, inspection and issue resolution in one managed process." }
];

export default function SourcingPage() {
  return (
    <div className="sourcing-opportunity-page">
      <section className="sourcing-opportunity-hero">
        <div className="sourcing-opportunity-shell sourcing-opportunity-hero-grid">
          <div className="sourcing-opportunity-hero-copy">
            <p className="sourcing-opportunity-eyebrow">Cleaning Product Opportunity Sourcing</p>
            <h1>Don’t Just Source Another Product.<span>Find The Next Cleaning Industry Opportunity.</span></h1>
            <p className="sourcing-opportunity-lead">Tell me what market you serve. I will help identify promising product directions, while the World Clean Biz team turns them into products you can source, brand and sell.</p>
            <div className="sourcing-opportunity-actions">
              <TallyButton className="sourcing-opportunity-button" ctaLocation="sourcing_hero_opportunity" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>
                Get My Free Product Opportunity Shortlist
              </TallyButton>
              <TallyButton className="sourcing-opportunity-button-secondary" ctaLocation="sourcing_hero_specific_product" form="sourcing" inquiryIntent="specific_product" trackClick>
                I Already Have A Product Request
              </TallyButton>
            </div>
            <p className="sourcing-opportunity-hero-offer">Receive 2–3 product directions, images, basic specifications and indicative pricing. Free for relevant B2B requests.</p>
            <ul className="sourcing-opportunity-trust-signals">
              <li>B2B Buyers Only</li><li>Serving Global Markets</li><li>Initial Response Within 8 Hours</li>
            </ul>
          </div>
          <figure className="sourcing-opportunity-hero-proof">
            <img src="/images/site-refresh/about/about-hero-denny.webp" alt="Denny You discussing cleaning product opportunities" />
            <figcaption><strong>Denny You</strong><span>Founder, World Clean Biz</span><small>Inside the cleaning industry since 2006</small></figcaption>
          </figure>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-market">
        <div className="sourcing-opportunity-shell">
          <div className="sourcing-opportunity-heading"><p>Why This Market Matters Now</p><h2>The Cleaning Industry Is Entering A New Growth Cycle.</h2></div>
          <div className="sourcing-opportunity-market-story"><div className="sourcing-opportunity-market-number"><div><small>Today</small><strong>Approx. USD 40B+</strong></div><span aria-hidden="true">→</span><div><small>Over The Next Decade</small><strong>Toward USD 140B</strong></div></div><figure className="sourcing-opportunity-market-visual"><img src="/images/site-refresh/real/product-detail.webp" alt="Product technology selected for market evaluation" /><figcaption>Product categories are expanding faster than traditional sourcing cycles.</figcaption></figure></div>
          <p className="sourcing-opportunity-estimate"><strong>World Clean Biz Industry Estimate.</strong> Based on less than RMB 300 billion today toward RMB 1 trillion over the next decade. Scope includes major global indoor and outdoor cleaning equipment categories; USD values are approximate.</p>
          <div className="sourcing-opportunity-driver-grid">{marketDrivers.map((item) => <article key={item.title}><span className="sourcing-opportunity-driver-icon"><InlineIcon name={item.icon} /></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-shift">
        <div className="sourcing-opportunity-shell">
          <div className="sourcing-opportunity-heading"><p>The Competitive Reality</p><h2>The Market Is Growing. The Old Advantages Are Disappearing.</h2></div>
          <div className="sourcing-opportunity-shift-grid">{industryShifts.map((item) => <article key={item.label}><h3><span className="sourcing-opportunity-shift-icon"><InlineIcon name={item.icon} /></span>{item.label}</h3><div><small>Then</small><p>{item.then}</p></div><div><small>Today</small><p>{item.today}</p></div></article>)}</div>
          <div className="sourcing-opportunity-shift-close"><strong>Access Is No Longer The Advantage. Judgment Is.</strong><span>Relationships still matter. But relationships cannot compensate for an uncompetitive product.</span></div>
          <div className="sourcing-opportunity-risk-panel">
            <div><p>The Old Sourcing Model Is Too Slow</p><h3>Your Product Can Fall Behind Before It Reaches The Market.</h3></div>
            <div className="sourcing-opportunity-risk-flow" aria-label="Supply chain change from technology to time to market">Technology <span>→</span> Components <span>→</span> Molds <span>→</span> Factories <span>→</span> Cost <span>→</span> Time To Market</div>
            <div className="sourcing-opportunity-risk-grid">{riskCards.map((item) => <article key={item.title}><span className="sourcing-opportunity-risk-icon"><InlineIcon name={item.icon} /></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
            <p className="sourcing-opportunity-risk-close">Faster Sourcing Is Not Enough. You Need Earlier Judgment.</p>
          </div>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-denny-method">
        <div className="sourcing-opportunity-shell sourcing-opportunity-method-grid">
          <div><div className="sourcing-opportunity-heading"><p>Industry Signals Before Supplier Search</p><h2>How Denny Sees Opportunities Earlier</h2><p>The newest technology is not automatically the right choice. The advantage comes from knowing which solution is current, commercially mature and appropriate for your market.</p></div><div className="sourcing-opportunity-signal-grid">{opportunitySignals.map((item) => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div>
          <figure><img src="/images/site-refresh/real/city-architecture.webp" alt="Global market and business environment" /><figcaption>Early Signals → Market Judgment → Product Direction → Supply Chain Execution</figcaption></figure>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-shortlist">
        <div className="sourcing-opportunity-shell sourcing-opportunity-shortlist-grid">
          <div><p className="sourcing-opportunity-eyebrow">Free For Relevant B2B Requests</p><h2>Free Product Opportunity Shortlist</h2><p>Share your company, market and product interests. Denny reviews the opportunity and our team prepares a practical starting point.</p><TallyButton className="sourcing-opportunity-button" ctaLocation="sourcing_shortlist" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>Get My Free Product Opportunity Shortlist</TallyButton></div>
          <div><div className="sourcing-opportunity-shortlist-preview"><img src="/images/site-refresh/real/product-detail.webp" alt="Cleaning industry product opportunity analysis" /><div><small>Example Opportunity Snapshot</small><strong>Product Direction 01</strong><span>Images · Basic Specs · Indicative Price</span><span>OEM/ODM Feasibility · Market Fit</span></div></div><ul>{shortlistItems.map((item) => <li key={item}>{item}</li>)}</ul><div className="sourcing-opportunity-timing"><p><strong>Within 8 Hours</strong><span>Initial human contact</span></p><p><strong>Normally Within 1–2 Business Days</strong><span>Initial product or category directions</span></p></div></div>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-categories" id="opportunity-areas">
        <div className="sourcing-opportunity-shell">
          <div className="sourcing-opportunity-heading"><p>Product Opportunity Areas</p><h2>Where The Next Opportunity Could Begin.</h2></div>
          <div className="sourcing-opportunity-category-grid">{SOURCING_CATEGORIES.map((item) => <Link className="sourcing-opportunity-category-card" href={item.href} key={item.value}><span className="sourcing-opportunity-category-image"><img src={item.image} alt={`${item.title} opportunity area`} /></span><span className="sourcing-opportunity-category-copy"><span><InlineIcon name={item.icon} /><strong>{item.title}</strong></span><em>{item.description}</em><span className="sourcing-opportunity-category-cta">Explore This Opportunity</span></span></Link>)}</div>
          <p className="sourcing-opportunity-secondary-scope">We can also support relevant projects involving cleaning tools, consumables, chemicals, hygiene products, components and replacement parts.</p>
        </div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-process">
        <div className="sourcing-opportunity-shell"><div className="sourcing-opportunity-heading"><p>From Insight To Execution</p><h2>One Partner From Opportunity Discovery To Delivery.</h2></div><ol>{deliveryStages.map((stage, index) => <li key={stage.title}><img className="sourcing-opportunity-stage-image" src={stage.image} alt={stage.alt} /><div className="sourcing-opportunity-stage-copy"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{stage.title}</h3><p>{stage.steps.join(" → ")}</p></div></div></li>)}</ol><p className="sourcing-opportunity-compliance">Products are managed toward the compliance requirements agreed in writing for the specified target market, with testing and compliance partners involved where needed.</p></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-models">
        <div className="sourcing-opportunity-shell"><div className="sourcing-opportunity-heading"><p>Two Ways To Work With Us</p><h2>One Goal: A More Competitive Product.</h2></div><div className="sourcing-opportunity-model-grid"><article className="sourcing-opportunity-model-primary"><div className="sourcing-opportunity-model-image"><img src="/images/site-refresh/real/product-detail.webp" alt="Product technology selected for managed delivery" /><span>One Quotation · Managed Delivery</span></div><small>Primary</small><h3>Buy Directly From World Clean Biz</h3><p>We recommend products, provide one quotation and manage sourcing, OEM/ODM, production, quality, export and delivery.</p></article><article><div className="sourcing-opportunity-model-image"><img src="/images/site-refresh/real/business-office.webp" alt="International specialists reviewing a sourcing project" /><span>Supplier Search · China-Side Control</span></div><small>Also Available</small><h3>Your China Sourcing Office</h3><p>We can find new suppliers or manage suppliers you already work with through a defined sourcing partnership.</p></article></div><p className="sourcing-opportunity-model-note">You do not need to choose a model now. We recommend the right approach after understanding your project.</p><TallyButton className="sourcing-opportunity-button" ctaLocation="sourcing_models" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>Discuss My Product Opportunity</TallyButton></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-team">
        <div className="sourcing-opportunity-shell sourcing-opportunity-team-grid"><img src="/images/industry/sourcing-supplier-meeting-2026.jpg" alt="Denny You reviewing cleaning products with suppliers" /><div><p className="sourcing-opportunity-eyebrow">Personal Judgment. Team Execution.</p><h2>Denny Reviews. The Team Executes.</h2><p>Every sourcing project is reviewed and guided by Denny. The World Clean Biz team manages day-to-day communication, quotation, samples, supplier coordination, production, quality and delivery.</p><ul><li>Inside the cleaning industry since 2006</li><li>Cleaning industry hardware entrepreneur</li><li>Network across manufacturers, suppliers, brands and buyers</li><li>Currently supporting cross-border sellers and international brands</li></ul><Link href="/about">About Denny & World Clean Biz →</Link></div></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-final-cta" id="shortlist-form">
        <div className="sourcing-opportunity-shell sourcing-opportunity-final-cta-card"><p className="sourcing-opportunity-eyebrow">Tell Denny About Your Market</p><h2>Get Your Free Product Opportunity Shortlist.</h2><p>For relevant B2B requests, we respond within 8 hours and normally prepare 2–3 initial product or category directions within 1–2 business days.</p><ul><li>Business buyers only</li><li>Paid samples available</li><li>Trial orders subject to applicable MOQ</li></ul><TallyButton className="sourcing-opportunity-button sourcing-opportunity-final-button" ctaLocation="sourcing_footer" form="sourcing" inquiryIntent="opportunity_discovery" trackClick>Get My Free Product Opportunity Shortlist</TallyButton></div>
      </section>

      <section className="sourcing-opportunity-section sourcing-opportunity-faq"><div className="sourcing-opportunity-shell"><div className="sourcing-opportunity-heading"><p>Before You Start</p><h2>Frequently Asked Questions</h2></div><div className="sourcing-opportunity-faq-list">{faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
    </div>
  );
}
