import Image from "next/image";
import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { LawnRobotProductSelector } from "@/components/LawnRobotProductSelector";
import { getInsights } from "@/lib/content";
import type { ProductDirection, SourcingProduct } from "@/lib/sourcingProducts";

const fits = [
  ["RV-01", ["Strong fit", "Strong fit", "Conditional fit", "Conditional fit", "—"]],
  ["RV-02", ["Conditional fit", "Strong fit", "Strong fit", "Conditional fit", "—"]],
  ["RV-03", ["Conditional fit", "Strong fit", "Strong fit", "—", "—"]],
  ["RV-04", ["Conditional fit", "Strong fit", "Strong fit", "Conditional fit", "—"]],
  ["RV-05", ["Conditional fit", "Strong fit", "Conditional fit", "Strong fit", "—"]],
  ["RV-06", ["Strong fit", "Conditional fit", "Strong fit", "—", "—"]]
] as const;

const channels = ["Retail", "Ecommerce", "Specialist dealer", "Private label", "Professional / project sales"];

const faqs = [
  ["Which robot vacuum direction is most credible for a new entrant?", "Start with a specific household, channel and ownership problem. A focused retail starter or value platform can be more credible than an attempt to copy every flagship feature."],
  ["Is the market moving toward premium dock systems or value platforms?", "Both routes can work. Premium must make maintenance easier in daily use; value must avoid return and service costs that erase the apparent saving."],
  ["Which features create real customer value?", "Reliable navigation, clear pickup, useful mopping, low maintenance and predictable recovery matter more than a longer feature list."],
  ["Which platforms fit ecommerce and mass retail?", "A clear use case, consumer-led setup, resilient packaging and controlled support demand are critical channel conditions."],
  ["Where can Chinese suppliers still differentiate?", "The opportunity is in turning iteration speed into stable navigation, dock systems, software, consumables and global service readiness."],
  ["Which claims create the greatest sourcing risk?", "Obstacle avoidance, edge coverage, mopping, dock hygiene and navigation recovery must be tested in target-market homes—not accepted from a showroom demonstration."],
  ["What separates a scalable platform from a one-season product?", "A scalable platform has controlled quality, stable firmware, serviceable systems and a parts plan that survives warranty and model updates."],
  ["What should buyers verify before selecting a platform?", "Verify the customer problem, repeatable in-home performance, supplier control of critical systems and after-sale economics."],
  ["How should buyers compare suppliers without a public factory list?", "Compare navigation and software control, cleaning-system evidence, dock reliability, testing depth, parts and service readiness against the selected platform. A generic ranking cannot replace product-specific evidence."]
] as const;

function SuccessCard({ number, item, title, text }: { number: string; item?: ProductDirection; title: string; text: string }) {
  if (!item) return null;
  return <article><div className="sourcing-lawn-success-image"><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>;
}

export function RobotVacuumLanding({ product }: { product: SourcingProduct }) {
  const directions = product.directions ?? [];
  const related = product.relatedArticleSlugs.flatMap((slug) => {
    const article = getInsights().find((item) => item.slug === slug);
    return article ? [article] : [];
  });
  const pageUrl = "https://worldcleanbiz.com/sourcing/robotic-vacuums";

  return (
    <main className="sourcing-v3-page sourcing-lawn-page sourcing-robot-vacuum-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: product.title, description: product.metaDescription, provider: { "@type": "Organization", name: "World Clean Biz", url: "https://worldcleanbiz.com" }, areaServed: "Worldwide", url: pageUrl }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://worldcleanbiz.com" }, { "@type": "ListItem", position: 2, name: "Sourcing", item: "https://worldcleanbiz.com/sourcing" }, { "@type": "ListItem", position: 3, name: product.eyebrow, item: pageUrl }] }) }} />

      <section className="section-hero sourcing-product-hero sourcing-lawn-hero">
        <div className="sourcing-v3-container sourcing-product-hero-grid">
          <div><p className="sourcing-v3-kicker">Where the Next Robot Vacuum Opportunities Are Forming</p><h1>Choose the Market Opportunity Before You Choose the Factory</h1><p className="sourcing-product-intro">Robot vacuums are separating into distinct platforms—from retail navigation starters to all-in-one premium docks, low-profile reach, pet-and-carpet specialists and ecommerce value offers. The opportunity depends on the household, channel and ownership problem the product solves.</p><div className="sourcing-lawn-hero-actions"><a className="sourcing-v3-button" href="#product-options">Explore the Product Opportunities</a><TallyButton className="sourcing-lawn-secondary-button" form="sourcing" conversionGroup="sourcing" ctaLocation="robot_vacuum_hero_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Test My Product Thesis</TallyButton></div><p className="sourcing-lawn-hero-fit">For brands, importers, distributors and retailers deciding where to compete in robot vacuums—and which product platform can support that position.</p></div>
          <img src={product.image} alt={product.imageAlt} />
        </div>
      </section>

      <section className="section sourcing-lawn-audience-section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">The Decisions Buyers Are Facing</p><h2>Built for Buyers Deciding Where to Play in Robot Vacuums</h2><div className="sourcing-lawn-audience-grid">{[["Enter", "Choose a credible first platform for entering robot vacuums"], ["Expand", "Add a product that opens a new household or price position"], ["Differentiate", "Find a visible reason to win beyond a longer specification sheet"], ["De-risk", "Replace a weak supplier or short-lived product before scaling"]].map(([label, title]) => <article key={label}><span>{label}</span><h3>{title}</h3></article>)}</div></div></section>

      <LawnRobotProductSelector products={directions} productCategory={product.productCategory} ctaPrefix="robot_vacuum" ariaLabel="Choose a robot vacuum product direction" />

      <section className="section sourcing-lawn-landscape-section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Six-Platform Opportunity Landscape</p><div className="sourcing-lawn-visual-heading"><h2>Where the Six Product Platforms Compete</h2><p>Different robot vacuum platforms create value through different households, channels and ownership models.</p></div><figure className="sourcing-lawn-landscape"><figcaption><span>World Clean Biz editorial assessment</span><small>Directional positioning, not measured market data. Final decisions require target-market and supplier evidence.</small></figcaption><div className="sourcing-lawn-landscape-y"><span>Specialist and premium ownership</span><span>Broad household adoption</span></div><div className="sourcing-lawn-landscape-plot">{directions.map((item, index) => <div className={`sourcing-lawn-landscape-marker is-rm0${index + 1}`} key={item.id}><strong>{item.id}</strong><span>{item.name}</span></div>)}</div><div className="sourcing-lawn-landscape-x"><span>Accessible entry</span><span>Premium product and service value</span></div></figure></div></section>

      <section className="section section-muted sourcing-lawn-channel-section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Platform × Channel Fit</p><div className="sourcing-lawn-visual-heading"><h2>Which Channels Fit Each Product Platform?</h2><p>Fit depends on education, ownership friction, service capability and the clarity of the reason to buy.</p></div><div className="sourcing-lawn-assessment-legend"><strong>World Clean Biz editorial assessment</strong><span><i className="is-strong" />Strong fit</span><span><i className="is-conditional" />Conditional fit</span><span>— Not a natural primary route</span></div><div className="sourcing-lawn-table-wrap" tabIndex={0}><table className="sourcing-lawn-channel-matrix"><thead><tr><th>Product platform</th>{channels.map((channel) => <th key={channel}>{channel}</th>)}</tr></thead><tbody>{fits.map(([id, cells]) => <tr key={id}><th><strong>{id}</strong><span>{directions.find((item) => item.id === id)?.name}</span></th>{cells.map((cell, index) => <td key={index} className={cell === "Strong fit" ? "is-strong" : cell === "Conditional fit" ? "is-conditional" : ""}><span>{cell}</span></td>)}</tr>)}</tbody></table></div></div></section>

      <section className="section sourcing-lawn-success-section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Opportunity Conditions</p><h2>Three Conditions That Decide Whether the Opportunity Can Scale</h2><div className="sourcing-lawn-success-grid"><SuccessCard number="01" item={directions[0]} title="A clear household problem" text="The platform must solve a visible issue in cleaning coverage, maintenance, pets, rugs or home layout." /><SuccessCard number="02" item={directions[3]} title="Repeatable in-home performance" text="Navigation, pickup, mopping and recovery must work in the conditions the customer actually has." /><SuccessCard number="03" item={directions[1]} title="Channel economics after the sale" text="Returns, consumables, warranty, replacement parts and service cannot consume the margin." /></div></div></section>

      <section className="section sourcing-lawn-trust-section"><div className="sourcing-v3-container sourcing-lawn-trust"><img src="/images/industry/about-denny-portrait-event.jpg" alt="Denny, founder of World Clean Biz, at a cleaning industry event" /><div><p className="sourcing-v3-kicker">Industry judgment behind the product decision</p><h2>A convincing robot vacuum sample is not yet a sustainable business</h2><p>Denny reviews whether market opportunity, in-home evidence, supplier capability and execution economics reinforce one another strongly enough to justify the next investment—not whether the demonstration looks impressive.</p><ul><li>Founder, World Clean Biz</li><li>Organizer, World Clean Expo</li><li>Inside the cleaning industry since 2006</li></ul></div></div></section>

      <section className="section section-muted sourcing-lawn-evidence-section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Commercial Go / No-Go</p><div className="sourcing-lawn-visual-heading"><h2>Four Decisions Before You Back a Platform</h2><p>Move forward only when the opportunity, product evidence, supplier capability and after-sale economics reinforce one another.</p></div><ol className="sourcing-lawn-evidence-flow">{[["Opportunity", "Is the household problem valuable?", ["Reason to switch", "Addressable home use", "Channel relevance"]], ["Platform", "Does real-home performance prove it?", ["Navigation and recovery", "Pickup and mopping", "Ownership experience"]], ["Supplier", "Can capability survive scale?", ["Critical-system control", "Firmware and test depth", "Parts and service"]], ["Economics", "Does margin survive after the sale?", ["Price and margin", "Returns and warranty", "Consumables and compliance"]]].map(([label, question, proof], index) => <li key={label as string}><span>0{index + 1}</span><strong>{label as string}</strong><h3>{question as string}</h3><ul>{(proof as string[]).map((item) => <li key={item}>{item}</li>)}</ul></li>)}</ol></div></section>

      <section className="section section-muted sourcing-lawn-faq-section"><div className="sourcing-v3-container sourcing-lawn-faq"><div><p className="sourcing-v3-kicker">Industry Opportunity Questions</p><h2>The Product Decisions Buyers Are Debating Now</h2><p>These commercial and technical choices shape where robot vacuum growth can come from next.</p><img className="sourcing-lawn-faq-visual" src={directions[5]?.image || product.image} alt={directions[5]?.imageAlt || product.imageAlt} /></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

      <section className="section sourcing-lawn-final-section"><div className="sourcing-v3-container sourcing-lawn-final-cta"><div><p className="sourcing-v3-kicker">Make the Opportunity Specific</p><h2>Turn a Market Opportunity Into a Product Brief</h2><p>Define the target household, use environment, channel, price position, reason to win and technical evidence that must be verified.</p></div><div className="sourcing-lawn-final-actions"><TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="robot_vacuum_final_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Evaluate My Product Opportunity</TallyButton><a href="#product-options">Discuss a Selected Product</a></div></div></section>

      <section className="section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Related Intelligence</p><h2>Research the category before choosing a supplier</h2><div className="sourcing-product-grid">{related.map((article) => <article className="sourcing-pool-related-card" key={article.slug}>{article.coverImage ? <img src={article.coverImage} alt={article.coverAlt || article.title} /> : null}<h3>{article.title}</h3><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`}>Read the analysis</Link></article>)}</div></div></section>
    </main>
  );
}
