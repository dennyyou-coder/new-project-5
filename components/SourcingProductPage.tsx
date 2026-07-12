import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { LawnRobotProductSelector } from "@/components/LawnRobotProductSelector";
import { getInsights } from "@/lib/content";
import type { SourcingProduct } from "@/lib/sourcingProducts";

const siteUrl = "https://worldcleanbiz.com";

export function SourcingProductPage({ product }: { product: SourcingProduct }) {
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
              <p className="sourcing-v3-kicker">Robotic Lawn Mower Sourcing in China</p>
              <h1>Choose the Right Robotic Mower Platform Before You Choose a Supplier</h1>
              <p className="sourcing-product-intro">Compare six robotic mower product directions from China, then request supplier matching for the platform closest to your market, channel and price position.</p>
              <div className="sourcing-lawn-hero-actions">
                <a className="sourcing-v3-button" href="#product-options">Explore Product Options</a>
                <TallyButton className="sourcing-lawn-secondary-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_hero_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>I Already Have a Product Brief</TallyButton>
              </div>
              <p className="sourcing-lawn-hero-fit">For brands, importers, distributors and retailers sourcing robotic mower products from China.</p>
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
            <p className="sourcing-v3-kicker">Who This Is For</p>
            <h2>Built for Buyers Developing or Expanding a Robotic Mower Range</h2>
            <div className="sourcing-lawn-audience-grid">
              <article><span>Brands</span><h3>Brands developing a new robotic mower line</h3></article>
              <article><span>Importers</span><h3>Importers looking for supplier alternatives</h3></article>
              <article><span>Distributors</span><h3>Distributors expanding into backyard robotics</h3></article>
              <article><span>Retailers</span><h3>Retailers testing a new product category</h3></article>
            </div>
          </div>
        </section>
      ) : null}
      {product.directions ? <LawnRobotProductSelector products={product.directions} /> : null}
      {isLawnRobotPage ? (
        <>
          <section className="section sourcing-lawn-problems-section">
            <div className="sourcing-v3-container">
              <p className="sourcing-v3-kicker">Buyer Risks</p>
              <h2>Why a Supplier List Is Not Enough</h2>
              <div className="sourcing-lawn-problems-grid">
                <article><span>01</span><h3>Similar quotations can hide different product platforms</h3><p>Comparable prices and specifications may conceal major differences in navigation architecture, testing depth and long-term reliability.</p></article>
                <article><span>02</span><h3>Real-world performance is difficult to judge from specifications</h3><p>Slopes, edges, tree cover, changing light and app stability need to be tested in conditions that reflect the target market.</p></article>
                <article><span>03</span><h3>The lowest quotation may not produce the lowest total cost</h3><p>Certification, spare parts, returns, service preparation and quality problems can change the economics of the entire program.</p></article>
              </div>
            </div>
          </section>

          <section className="section section-muted sourcing-lawn-deliverables">
            <div className="sourcing-v3-container">
              <p className="sourcing-v3-kicker">What World Clean Biz Does</p>
              <h2>What You Receive Before Making a Supplier Decision</h2>
              <div className="sourcing-product-grid">
                <article><span>01</span><h3>Product Direction Review</h3><p>Confirm the navigation route, target lawn, market, channel and product position before supplier outreach.</p></article>
                <article><span>02</span><h3>Manufacturer Screening</h3><p>Identify manufacturer types with relevant platforms, testing capability and export readiness.</p></article>
                <article><span>03</span><h3>Sample Comparison</h3><p>Compare navigation, mowing performance, app stability, safety and terrain capability.</p></article>
                <article><span>04</span><h3>Pre-production Risk Review</h3><p>Review tooling, certification, spare parts, quality control and after-sales preparation.</p></article>
              </div>
            </div>
          </section>

          <section className="section sourcing-lawn-trust-section">
            <div className="sourcing-v3-container sourcing-lawn-trust">
              <img src="/images/industry/about-denny-portrait-event.jpg" alt="Denny, founder of World Clean Biz, at a cleaning industry event" />
              <div>
                <p className="sourcing-v3-kicker">Industry Judgment Behind the Match</p>
                <h2>Product and supplier decisions reviewed by Denny</h2>
                <p>World Clean Biz combines product direction, supplier screening and market context before recommending the next sourcing step.</p>
                <p>Denny leads the product, supplier and industry judgment. The team supports research, coordination and day-to-day execution.</p>
                <ul>
                  <li>Founder, World Clean Biz</li>
                  <li>Organizer, World Clean Expo</li>
                  <li>Inside the cleaning industry since 2006</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section section-muted sourcing-lawn-process-section">
            <div className="sourcing-v3-container sourcing-lawn-process">
              <div><p className="sourcing-v3-kicker">What happens after you share your brief</p><h2>How the Sourcing Discussion Works</h2><p>The first discussion clarifies the product direction, market and verification priorities before supplier decisions are made.</p></div>
              <ol>
                <li><strong>Share the direction</strong><span>Tell us your market, channel and preferred product route.</span></li>
                <li><strong>Review the match</strong><span>World Clean Biz reviews the product route and relevant supplier types.</span></li>
                <li><strong>Define next steps</strong><span>We identify the supplier, sample and verification questions for discussion.</span></li>
              </ol>
            </div>
          </section>

          <section className="section sourcing-lawn-framework-section">
            <div className="sourcing-v3-container">
              <p className="sourcing-v3-kicker">Decision Framework</p>
              <h2>What We Look at Before Recommending the Next Step</h2>
              <div className="sourcing-lawn-framework-grid">
                <article><span>Product</span><h3>Is the product route credible?</h3><ul><li>Navigation system</li><li>Terrain performance</li><li>App stability</li></ul></article>
                <article><span>Supplier</span><h3>Can the supplier support it?</h3><ul><li>Platform ownership</li><li>Testing capability</li><li>Production experience</li></ul></article>
                <article><span>Market</span><h3>Does it fit the commercial plan?</h3><ul><li>Target channel</li><li>Price position</li><li>Service expectations</li></ul></article>
                <article><span>Execution</span><h3>Can the program be delivered?</h3><ul><li>Certification</li><li>Spare parts</li><li>Quality control</li></ul></article>
              </div>
            </div>
          </section>

          <section className="section section-muted sourcing-lawn-faq-section">
            <div className="sourcing-v3-container sourcing-lawn-faq">
              <div><p className="sourcing-v3-kicker">Frequently Asked Questions</p><h2>Questions buyers often ask before starting</h2><p>These answers clarify how the product directions and sourcing discussion are intended to work.</p></div>
              <div>
                <details><summary>Are the products shown verified factory models?</summary><p>No. The images represent illustrative product directions. Final supplier models, specifications and availability must be verified against your brief.</p></details>
                <details><summary>Do you disclose factory names publicly?</summary><p>No. Factory information is not published as an open directory. Relevant supplier types and next steps are discussed in the context of a defined sourcing project.</p></details>
                <details><summary>Can I submit my own product specification?</summary><p>Yes. You can use the custom Product Brief entry if you already have target specifications, reference products or channel requirements.</p></details>
                <details><summary>Can you help compare samples from different suppliers?</summary><p>Sample comparison can cover navigation, mowing performance, app stability, safety, terrain capability and other agreed priorities.</p></details>
                <details><summary>Do you support private-label and brand projects?</summary><p>Yes. The sourcing discussion can support established brands, private-label programs and buyers developing a new product range.</p></details>
                <details><summary>Which markets do you support?</summary><p>Projects can be evaluated for North America, Europe, the UK and other markets when the target channel and requirements are clear.</p></details>
                <details><summary>What information should I prepare before contacting you?</summary><p>Prepare your target market, sales channel, preferred product direction, project stage and any available specifications or reference products.</p></details>
              </div>
            </div>
          </section>

          <section className="section sourcing-lawn-final-section">
            <div className="sourcing-v3-container sourcing-lawn-final-cta">
              <div><p className="sourcing-v3-kicker">World Clean Biz Sourcing</p><h2>Turn Your Product Direction Into a Focused Supplier Search</h2><p>Share your market, channel and product requirements. World Clean Biz will use that context to identify the relevant product route, supplier types and verification priorities.</p></div>
              <div className="sourcing-lawn-final-actions">
                <TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_final_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Start My Sourcing Brief</TallyButton>
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
