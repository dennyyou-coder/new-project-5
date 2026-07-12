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
    <main className="sourcing-v3-page">
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
      {product.directions ? <LawnRobotProductSelector products={product.directions} /> : null}
      {isLawnRobotPage ? (
        <>
          <section className="section sourcing-lawn-trust-section">
            <div className="sourcing-v3-container sourcing-lawn-trust">
              <img src="/images/industry/about-denny-portrait-event.jpg" alt="Denny, founder of World Clean Biz, at a cleaning industry event" />
              <div>
                <p className="sourcing-v3-kicker">Industry Judgment Behind the Match</p>
                <h2>Product and supplier decisions reviewed by Denny</h2>
                <p>World Clean Biz combines product direction, supplier screening and market context before recommending the next sourcing step.</p>
                <ul>
                  <li>Founder, World Clean Biz</li>
                  <li>Organizer, World Clean Expo</li>
                  <li>Inside the cleaning industry since 2006</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section section-muted sourcing-lawn-deliverables">
            <div className="sourcing-v3-container">
              <p className="sourcing-v3-kicker">What World Clean Biz Does</p>
              <h2>From product direction to supplier verification</h2>
              <div className="sourcing-product-grid">
                <article><span>01</span><h3>Product Direction Review</h3><p>Confirm the navigation route, target lawn, market, channel and product position before supplier outreach.</p></article>
                <article><span>02</span><h3>Manufacturer Screening</h3><p>Identify manufacturer types with relevant platforms, testing capability and export readiness.</p></article>
                <article><span>03</span><h3>Sample Comparison</h3><p>Compare navigation, mowing performance, app stability, safety and terrain capability.</p></article>
                <article><span>04</span><h3>Pre-production Risk Review</h3><p>Review tooling, certification, spare parts, quality control and after-sales preparation.</p></article>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="sourcing-v3-container sourcing-product-columns sourcing-lawn-checks">
              <div><p className="sourcing-v3-kicker">Supplier Evaluation</p><h2>What buyers should verify</h2><ul>{product.evaluationPoints.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><p className="sourcing-v3-kicker">Market Preparation</p><h2>One product does not fit every market</h2>{product.marketNotes.map((item) => <p key={item}>{item}</p>)}</div>
            </div>
          </section>

          <section className="section section-muted sourcing-lawn-final-section">
            <div className="sourcing-v3-container sourcing-lawn-final">
              <div>
                <p className="sourcing-v3-kicker">What happens after you share your brief</p>
                <h2>Turn a product direction into a focused supplier discussion.</h2>
                <p>Share your market, channel and target product direction. We will use that context to define the relevant supplier types and the next verification steps.</p>
                <TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_final_custom_brief" inquiryIntent="product_sourcing" productCategory={product.productCategory}>Share My Product Brief</TallyButton>
              </div>
              <ol>
                <li><strong>Share the direction</strong><span>Tell us your market, channel and preferred product route.</span></li>
                <li><strong>Review the match</strong><span>World Clean Biz reviews the product route and relevant supplier types.</span></li>
                <li><strong>Define next steps</strong><span>We identify the supplier, sample and verification questions for discussion.</span></li>
              </ol>
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
