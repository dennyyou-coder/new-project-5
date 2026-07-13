import Image from "next/image";
import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { LawnRobotProductSelector } from "@/components/LawnRobotProductSelector";
import { getInsights } from "@/lib/content";
import type { ProductDirection, SourcingProduct } from "@/lib/sourcingProducts";

const fits = [
  ["VC-01", ["Strong fit", "Strong fit", "Conditional fit", "Strong fit", "—"]],
  ["VC-02", ["Conditional fit", "Strong fit", "Strong fit", "Conditional fit", "—"]],
  ["VC-03", ["Strong fit", "Strong fit", "Strong fit", "Conditional fit", "—"]],
  ["VC-04", ["Conditional fit", "Strong fit", "Conditional fit", "Strong fit", "—"]],
  ["VC-05", ["Strong fit", "Conditional fit", "Strong fit", "Strong fit", "—"]],
  ["VC-06", ["—", "Conditional fit", "Strong fit", "—", "Strong fit"]]
] as const;

const channels = ["Retail", "Ecommerce", "Specialist dealer", "Private label", "Professional / project sales"];

const faqs = [
  ["Which vacuum cleaner direction is most credible for a new entrant?", "Start with one customer problem and one channel. An accessible cordless stick, compact handheld or focused pet platform can be more credible than a generic flagship built around maximum specifications."],
  ["Is the market moving entirely toward cordless products?", "Cordless continues to expand, but canisters, uprights and professional machines remain relevant where duty cycle, carpet performance, filtration, familiar ownership or service economics matter more than mobility."],
  ["Which performance claims create the greatest sourcing risk?", "Suction, runtime and filtration claims can look strong in isolation. Buyers should test pickup under load, battery and thermal behaviour, sealed-system performance, brush interaction and usable performance over a complete cleaning cycle."],
  ["Which product platforms fit ecommerce and mass retail?", "The strongest platforms have an instantly understood use case, resilient packaging, consumer-led setup, low maintenance friction and return economics that protect channel margin."],
  ["When does a premium dock create real customer value?", "A dock creates value when it reliably improves storage, charging, dust disposal and accessory management. It becomes a liability when added complexity raises cost, footprint, noise or service demand without reducing real ownership work."],
  ["Where can Chinese vacuum cleaner suppliers still differentiate?", "The opportunity is in combining motor, battery and manufacturing depth with better ergonomics, accessories, filtration, industrial design and after-sales preparation. Cost alone is not durable differentiation."],
  ["What separates a scalable platform from a one-season product?", "A scalable platform combines repeatable cleaning, controlled components, serviceable architecture, stable consumables and a supplier roadmap that can support warranty and model evolution."],
  ["What should buyers verify before choosing a vacuum platform?", "Verify the customer problem, cleaning evidence, supplier control of critical systems and economics after batteries, filters, accessories, returns and service."],
  ["How should buyers compare suppliers without a public factory list?", "Compare engineering control, testing depth, production consistency, parts and service readiness against the selected product direction. A generic supplier ranking cannot replace platform-specific evidence."]
] as const;

function SuccessCard({ number, item, title, text }: { number: string; item?: ProductDirection; title: string; text: string }) {
  if (!item) return null;
  return (
    <article>
      <div className="sourcing-lawn-success-image">
        <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" />
        <span>{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function VacuumCleanerLanding({ product }: { product: SourcingProduct }) {
  const directions = product.directions ?? [];
  const related = product.relatedArticleSlugs.flatMap((slug) => {
    const article = getInsights().find((item) => item.slug === slug);
    return article ? [article] : [];
  });
  const pageUrl = "https://worldcleanbiz.com/sourcing/vacuum-cleaners";

  return (
    <main className="sourcing-v3-page sourcing-lawn-page sourcing-vacuum-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: product.title, description: product.metaDescription, provider: { "@type": "Organization", name: "World Clean Biz", url: "https://worldcleanbiz.com" }, areaServed: "Worldwide", url: pageUrl }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://worldcleanbiz.com" }, { "@type": "ListItem", position: 2, name: "Sourcing", item: "https://worldcleanbiz.com/sourcing" }, { "@type": "ListItem", position: 3, name: product.eyebrow, item: pageUrl }] }) }} />

      <section className="section-hero sourcing-product-hero sourcing-lawn-hero">
        <div className="sourcing-v3-container sourcing-product-hero-grid">
          <div>
            <p className="sourcing-v3-kicker">Where the Next Vacuum Cleaner Opportunities Are Forming</p>
            <h1>Choose the Market Opportunity Before You Choose the Factory</h1>
            <p className="sourcing-product-intro">Vacuum cleaners are separating into distinct platforms—from accessible cordless sticks and premium docked systems to pet uprights, compact handhelds, canisters and light-commercial backpack machines. The opportunity depends on the cleaning problem, customer and channel the platform is built to serve.</p>
            <div className="sourcing-lawn-hero-actions">
              <a className="sourcing-v3-button" href="#product-options">Explore the Product Opportunities</a>
              <TallyButton className="sourcing-lawn-secondary-button" form="sourcing" conversionGroup="sourcing" ctaLocation="vacuum_cleaner_hero_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Test My Product Thesis</TallyButton>
            </div>
            <p className="sourcing-lawn-hero-fit">For brands, importers, distributors and retailers deciding where to compete in vacuum cleaners—and which product platform can support that position.</p>
          </div>
          <img src={product.image} alt={product.imageAlt} />
        </div>
      </section>

      <section className="section sourcing-lawn-audience-section">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">The Decisions Buyers Are Facing</p>
          <h2>Built for Buyers Deciding Where to Play in Vacuum Cleaners</h2>
          <div className="sourcing-lawn-audience-grid">
            <article><span>Enter</span><h3>Choose a credible first platform for entering floorcare</h3></article>
            <article><span>Expand</span><h3>Add a product for a new user, surface or price position</h3></article>
            <article><span>Differentiate</span><h3>Build a visible reason to win beyond a suction claim</h3></article>
            <article><span>De-risk</span><h3>Replace a weak supplier or short-lived product before scaling</h3></article>
          </div>
        </div>
      </section>

      <LawnRobotProductSelector products={directions} productCategory={product.productCategory} ctaPrefix="vacuum_cleaner" ariaLabel="Choose a vacuum cleaner product direction" />

      <section className="section sourcing-lawn-landscape-section">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Six-Platform Opportunity Landscape</p>
          <div className="sourcing-lawn-visual-heading"><h2>Where the Six Product Platforms Compete</h2><p>Different vacuum platforms create value through different cleaning problems, ownership expectations and channels.</p></div>
          <figure className="sourcing-lawn-landscape">
            <figcaption><span>World Clean Biz editorial assessment</span><small>Directional positioning, not measured market data. Final decisions require target-market and supplier evidence.</small></figcaption>
            <div className="sourcing-lawn-landscape-y"><span>Specialist and professional use</span><span>Broad residential adoption</span></div>
            <div className="sourcing-lawn-landscape-plot">{directions.map((item, index) => <div className={`sourcing-lawn-landscape-marker is-rm0${index + 1}`} key={item.id}><strong>{item.id}</strong><span>{item.name}</span></div>)}</div>
            <div className="sourcing-lawn-landscape-x"><span>Accessible entry</span><span>Premium product and service value</span></div>
          </figure>
        </div>
      </section>

      <section className="section section-muted sourcing-lawn-channel-section">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Platform × Channel Fit</p>
          <div className="sourcing-lawn-visual-heading"><h2>Which Channels Fit Each Product Platform?</h2><p>Fit depends on the cleaning story, customer education, ownership friction and service capability after the sale.</p></div>
          <div className="sourcing-lawn-assessment-legend"><strong>World Clean Biz editorial assessment</strong><span><i className="is-strong" />Strong fit</span><span><i className="is-conditional" />Conditional fit</span><span>— Not a natural primary route</span></div>
          <div className="sourcing-lawn-table-wrap" tabIndex={0}>
            <table className="sourcing-lawn-channel-matrix">
              <thead><tr><th>Product platform</th>{channels.map((channel) => <th key={channel}>{channel}</th>)}</tr></thead>
              <tbody>{fits.map(([id, cells]) => <tr key={id}><th><strong>{id}</strong><span>{directions.find((item) => item.id === id)?.name}</span></th>{cells.map((cell, index) => <td className={cell === "Strong fit" ? "is-strong" : cell === "Conditional fit" ? "is-conditional" : ""} key={index}><span>{cell}</span></td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section sourcing-lawn-success-section">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Opportunity Conditions</p>
          <h2>Three Conditions That Decide Whether the Opportunity Can Scale</h2>
          <div className="sourcing-lawn-success-grid">
            <SuccessCard number="01" item={directions[0]} title="A clear cleaning problem" text="The platform must solve a visible issue in surfaces, debris, pets, reach, speed or professional workflow." />
            <SuccessCard number="02" item={directions[2]} title="Repeatable real-home performance" text="Pickup, filtration, battery or corded duty, brush behaviour and handling must work in the conditions the customer actually has." />
            <SuccessCard number="03" item={directions[5]} title="Channel economics after the sale" text="Returns, batteries, filters, accessories, warranty and service cannot consume the margin that made the quotation attractive." />
          </div>
        </div>
      </section>

      <section className="section sourcing-lawn-trust-section">
        <div className="sourcing-v3-container sourcing-lawn-trust">
          <img src="/images/industry/about-denny-portrait-event.jpg" alt="Denny, founder of World Clean Biz, at a cleaning industry event" />
          <div><p className="sourcing-v3-kicker">Industry judgment behind the product decision</p><h2>A strong specification is not yet a sustainable vacuum cleaner business</h2><p>Denny reviews whether market opportunity, cleaning evidence, supplier capability and execution economics reinforce one another strongly enough to justify the next investment—not whether the sample looks impressive.</p><ul><li>Founder, World Clean Biz</li><li>Organizer, World Clean Expo</li><li>Inside the cleaning industry since 2006</li></ul></div>
        </div>
      </section>

      <section className="section section-muted sourcing-lawn-evidence-section">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Commercial Go / No-Go</p>
          <div className="sourcing-lawn-visual-heading"><h2>Four Decisions Before You Back a Platform</h2><p>Move forward only when the opportunity, performance evidence, supplier capability and after-sale economics reinforce one another.</p></div>
          <ol className="sourcing-lawn-evidence-flow">{[
            ["Opportunity", "Is the cleaning problem valuable?", ["Reason to switch", "Addressable user", "Channel relevance"]],
            ["Platform", "Does real-use performance prove it?", ["Pickup and filtration", "Runtime or duty cycle", "Ownership experience"]],
            ["Supplier", "Can capability survive scale?", ["Critical-system control", "Test depth", "Parts and service"]],
            ["Economics", "Does margin survive after the sale?", ["Price and margin", "Returns and warranty", "Consumables and compliance"]]
          ].map(([label, question, proof], index) => <li key={label as string}><span>0{index + 1}</span><strong>{label as string}</strong><h3>{question as string}</h3><ul>{(proof as string[]).map((item) => <li key={item}>{item}</li>)}</ul></li>)}</ol>
        </div>
      </section>

      <section className="section section-muted sourcing-lawn-faq-section">
        <div className="sourcing-v3-container sourcing-lawn-faq">
          <div><p className="sourcing-v3-kicker">Industry Opportunity Questions</p><h2>The Product Decisions Buyers Are Debating Now</h2><p>These commercial and technical choices shape where vacuum cleaner growth can come from next.</p><img className="sourcing-lawn-faq-visual" src={directions[4]?.image || product.image} alt={directions[4]?.imageAlt || product.imageAlt} /></div>
          <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="section sourcing-lawn-final-section">
        <div className="sourcing-v3-container sourcing-lawn-final-cta">
          <div><p className="sourcing-v3-kicker">Make the Opportunity Specific</p><h2>Turn a Market Opportunity Into a Product Brief</h2><p>Define the target customer, cleaning environment, sales channel, price position, reason to win and technical evidence that must be verified.</p></div>
          <div className="sourcing-lawn-final-actions"><TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="vacuum_cleaner_final_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Evaluate My Product Opportunity</TallyButton><a href="#product-options">Discuss a Selected Product</a></div>
        </div>
      </section>

      <section className="section">
        <div className="sourcing-v3-container">
          <p className="sourcing-v3-kicker">Related Intelligence</p>
          <h2>Research the category before choosing a supplier</h2>
          <div className="sourcing-product-grid">{related.map((article) => <article className="sourcing-pool-related-card" key={article.slug}>{article.coverImage ? <img src={article.coverImage} alt={article.coverAlt || article.title} /> : null}<h3>{article.title}</h3><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`}>Read the analysis</Link></article>)}</div>
        </div>
      </section>
    </main>
  );
}
