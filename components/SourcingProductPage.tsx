import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { LawnRobotProductSelector } from "@/components/LawnRobotProductSelector";
import { LawnRobotChannelMatrix, LawnRobotEvidenceFlow, LawnRobotOpportunityLandscape, LawnRobotSuccessConditions } from "@/components/LawnRobotDecisionVisuals";
import { PoolRobotLanding } from "@/components/PoolRobotLanding";
import { FloorWasherLanding } from "@/components/FloorWasherLanding";
import { RobotVacuumLanding } from "@/components/RobotVacuumLanding";
import { getInsights } from "@/lib/content";
import type { SourcingProduct } from "@/lib/sourcingProducts";

const siteUrl = "https://worldcleanbiz.com";

export function SourcingProductPage({ product }: { product: SourcingProduct }) {
  if (product.slug === "pool-robots") return <PoolRobotLanding product={product} />;
  if (product.slug === "floor-washers") return <FloorWasherLanding product={product} />;
  if (product.slug === "robotic-vacuums") return <RobotVacuumLanding product={product} />;
  const pageUrl = `${siteUrl}/sourcing/${product.slug}`;
  const isLawnRobotPage = Boolean(product.directions);
  const articles = getInsights();
  const related = product.relatedArticleSlugs.flatMap((slug) => {
    const article = articles.find((item) => item.slug === slug);
    return article ? [article] : [];
  });
  const schemas = [
    { "@context": "https://schema.org", "@type": "Service", name: product.title, description: product.metaDescription, provider: { "@type": "Organization", name: "World Clean Biz", url: siteUrl }, areaServed: "Worldwide", url: pageUrl },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Sourcing", item: `${siteUrl}/sourcing` },
      { "@type": "ListItem", position: 3, name: product.eyebrow, item: pageUrl }
    ] }
  ];

  return (
    <main className={`sourcing-v3-page${isLawnRobotPage ? " sourcing-lawn-page" : ""}`}>
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      {isLawnRobotPage ? (
        <section className="section-hero sourcing-product-hero sourcing-lawn-hero">
          <div className="sourcing-v3-container sourcing-product-hero-grid">
            <div>
              <p className="sourcing-v3-kicker">Where the Next Robotic Mower Opportunities Are Forming</p>
              <h1>Choose the Market Opportunity Before You Choose the Factory</h1>
              <p className="sourcing-product-intro">Robotic mowers are separating into distinct product platforms—from mass-market vision models to RTK, slope specialists and professional large-area machines. The opportunity depends on which customer, channel and ownership problem the product is built to solve.</p>
              <div className="sourcing-lawn-hero-actions">
                <a className="sourcing-v3-button" href="#product-options">Explore the Product Opportunities</a>
                <TallyButton className="sourcing-lawn-secondary-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_hero_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Test My Product Thesis</TallyButton>
              </div>
              <p className="sourcing-lawn-hero-fit">For brands, importers, distributors and retailers deciding where to compete in robotic mowers—and which Chinese product platform can support that position.</p>
            </div>
            <img src={product.image} alt={product.imageAlt} />
          </div>
        </section>
      ) : (
        <section className="section-hero sourcing-product-hero">
          <div className="sourcing-v3-container sourcing-product-hero-grid">
            <div>
              <p className="sourcing-v3-kicker">{product.eyebrow}</p>
              <h1>{product.title}</h1>
              <p className="sourcing-product-intro">{product.intro}</p>
              <TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation={`${product.slug}_hero`} inquiryIntent="product_sourcing" productCategory={product.productCategory}>Start A Sourcing Inquiry</TallyButton>
            </div>
            <img src={product.image} alt={product.imageAlt} />
          </div>
        </section>
      )}
      {isLawnRobotPage ? (
        <section className="section sourcing-lawn-audience-section">
          <div className="sourcing-v3-container">
            <p className="sourcing-v3-kicker">The Decisions Buyers Are Facing</p>
            <h2>Built for Buyers Deciding Where to Play in Robotic Mowers</h2>
            <div className="sourcing-lawn-audience-grid">
              <article><span>Enter</span><h3>Choose a credible first platform for entering the category</h3></article>
              <article><span>Expand</span><h3>Add a product that opens a new customer or price position</h3></article>
              <article><span>Differentiate</span><h3>Find a platform with a visible reason to win beyond specifications</h3></article>
              <article><span>De-risk</span><h3>Replace a weak supplier or one-season product before scaling</h3></article>
            </div>
          </div>
        </section>
      ) : null}
      {product.directions ? <LawnRobotProductSelector products={product.directions} /> : null}
      {isLawnRobotPage ? (
        <>
          <LawnRobotOpportunityLandscape />
          <LawnRobotChannelMatrix />
          <LawnRobotSuccessConditions />

          <section className="section sourcing-lawn-trust-section">
            <div className="sourcing-v3-container sourcing-lawn-trust">
              <img src="/images/industry/about-denny-portrait-event.jpg" alt="Denny, founder of World Clean Biz, at a cleaning industry event" />
              <div>
                <p className="sourcing-v3-kicker">Industry judgment behind the product decision</p>
                <h2>A platform can look convincing long before it becomes a viable business</h2>
                <p>Denny reviews whether the opportunity, product evidence, supplier capability and execution model reinforce one another strongly enough to justify the next investment—not whether the quotation looks attractive.</p>
                <ul>
                  <li>Founder, World Clean Biz</li>
                  <li>Organizer, World Clean Expo</li>
                  <li>Inside the cleaning industry since 2006</li>
                </ul>
              </div>
            </div>
          </section>

          <LawnRobotEvidenceFlow />

          <section className="section section-muted sourcing-lawn-faq-section">
            <div className="sourcing-v3-container sourcing-lawn-faq">
              <div><p className="sourcing-v3-kicker">Industry Opportunity Questions</p><h2>The Product Decisions Buyers Are Debating Now</h2><p>These are not generic sourcing questions. They are the commercial and technical choices that shape where robotic mower growth can come from next.</p><img className="sourcing-lawn-faq-visual" src="/images/sourcing/lawn-robots/rm-03-awd-slope.png" alt="All-wheel-drive robotic mower being evaluated on difficult residential terrain" /></div>
              <div>
                <details><summary>Which robotic mower segment offers the strongest opportunity for new market entrants?</summary><p>The most accessible opening is often not the most technically ambitious machine. Installation-light products for smaller lawns and focused retail use cases can reach buyers that dealer-installed premium products do not. A new entrant still needs a sharp position: mass adoption, difficult terrain, large-area service or value—not a generic mower aimed at every lawn.</p></details>
                <details><summary>Is the European market still led by premium products, or is it moving toward value models?</summary><p>Premium products remain important because reliability, installation and dealer support carry real value. The expansion opportunity is broader: simpler boundary-free products and proven value platforms can address households that rejected earlier prices or installation requirements. Value will grow only where lower price does not create higher returns, weak apps or unsustainable service cost.</p></details>
                <details><summary>Can vision-based robotic mowers replace boundary-wire products?</summary><p>Vision can remove one of the category's largest adoption barriers, but it will not replace boundary wire in every environment. Smaller structured lawns are a strong opportunity when edges, obstacles and changing light are handled consistently. Boundary wire can remain commercially relevant where predictable operation and mature cost matter more than installation convenience.</p></details>
                <details><summary>When does RTK create real customer value rather than functioning as a marketing feature?</summary><p>RTK creates value when it enables faster setup, reliable zone control and efficient coverage of medium or large open lawns. The feature becomes weak when trees, buildings, antenna placement or map recovery make ownership complicated. Buyers should evaluate the complete navigation system and installation journey, not the presence of RTK alone.</p></details>
                <details><summary>Is there a meaningful market for AWD and slope-capable robotic mowers?</summary><p>Yes—when terrain capability solves a clearly underserved problem and the customer will pay for it. Sloped and uneven gardens give dealers a visible reason to recommend a specialist product. The opportunity depends on proving safe usable slope performance, turf protection and drivetrain durability rather than publishing an impressive maximum-angle claim.</p></details>
                <details><summary>Which product direction is most suitable for ecommerce and mass retail?</summary><p>A compact, installation-light platform is easier to merchandise and explain, but simplicity must continue after delivery. Ecommerce and mass retail require resilient packaging, consumer-led setup, low support demand and return economics that protect channel margin. A technically advanced product with a difficult first-use experience is often a poor retail product.</p></details>
                <details><summary>Where can Chinese robotic mower suppliers still differentiate from established European brands?</summary><p>The strongest openings are faster platform iteration, broader product portfolios, integration of new navigation approaches and adaptation to emerging channel needs. Cost alone is not durable differentiation. Buyers should look for suppliers that can turn manufacturing speed into stable software, repeatable field performance, parts support and a product position competitors cannot copy immediately.</p></details>
                <details><summary>Which technical claims create the greatest sourcing risk?</summary><p>Maximum area, slope capability, obstacle avoidance and boundary-free navigation can all look stronger in specifications than in ordinary gardens. The risk is greatest where performance depends on signal conditions, lighting, lawn edges, moisture or software recovery. Claims should be converted into repeatable target-market test scenarios before they become packaging promises.</p></details>
                <details><summary>What separates a scalable robotic mower platform from a one-season product?</summary><p>A scalable platform has a stable navigation architecture, controlled quality, software ownership, serviceable components and a supplier roadmap that supports more than one launch. A one-season product can still look competitive at sample stage but becomes difficult to sustain when returns, updates, spare parts and model changes begin to accumulate.</p></details>
                <details><summary>What should buyers verify before committing to a product platform?</summary><p>Verify that the customer problem is valuable, field performance proves the product promise, the supplier controls the required technology, and the channel economics still work after setup, returns and service. If any one of those four conditions is weak, a lower quotation or impressive demonstration is not enough reason to commit.</p></details>
              </div>
            </div>
          </section>

          <section className="section sourcing-lawn-final-section">
            <div className="sourcing-v3-container sourcing-lawn-final-cta">
              <div><p className="sourcing-v3-kicker">Make the Opportunity Specific</p><h2>Turn a Market Opportunity Into a Product Brief</h2><p>Define the customer, lawn environment, channel, price position and reason the product should win. That is the starting point for identifying the platform, supplier capability and evidence worth pursuing.</p></div>
              <div className="sourcing-lawn-final-actions">
                <TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_final_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Evaluate My Product Opportunity</TallyButton>
                <a href="#product-options">Discuss a Selected Product</a>
              </div>
            </div>
          </section>

          <section className="section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Related Intelligence</p><h2>Research the category before choosing a supplier</h2><div className="sourcing-product-grid">{related.map((article) => <article key={article.slug}><h3>{article.title}</h3><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`}>Read the analysis</Link></article>)}</div></div></section>
        </>
      ) : (
        <>
          <section className="section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Buyer Challenges</p><h2>Why supplier lists are not enough</h2><div className="sourcing-product-grid">{product.buyerProblems.map((item) => <article key={item}><p>{item}</p></article>)}</div></div></section>
          <section className="section section-muted"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">How We Help</p><h2>Support from product direction to execution</h2><div className="sourcing-product-grid">{product.services.map((item) => <article key={item}><h3>{item}</h3><p>Focused support shaped around your market, product stage and supplier requirements.</p></article>)}</div></div></section>
          <section className="section"><div className="sourcing-v3-container sourcing-product-columns"><div><p className="sourcing-v3-kicker">Supplier Evaluation</p><h2>What buyers should verify</h2><ul>{product.evaluationPoints.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="sourcing-v3-kicker">Market Preparation</p><h2>One product does not fit every market</h2>{product.marketNotes.map((item) => <p key={item}>{item}</p>)}</div></div></section>
          <section className="section section-muted"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Related Intelligence</p><h2>Research the category before choosing a supplier</h2><div className="sourcing-product-grid">{related.map((article) => <article key={article.slug}><h3>{article.title}</h3><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`}>Read the analysis</Link></article>)}</div></div></section>
          <section className="section"><div className="sourcing-v3-container sourcing-product-cta"><p className="sourcing-v3-kicker">World Clean Biz Sourcing</p><h2>Tell us what you are trying to build or source.</h2><p>Share your target product, market and project stage. We will use that context to understand where support may be useful.</p><TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation={`${product.slug}_final`} inquiryIntent="product_sourcing" productCategory={product.productCategory}>Start A Sourcing Inquiry</TallyButton></div></section>
        </>
      )}
    </main>
  );
}
