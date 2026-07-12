import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { getInsights } from "@/lib/content";
import type { SourcingProduct } from "@/lib/sourcingProducts";

const siteUrl = "https://worldcleanbiz.com";

export function SourcingProductPage({ product }: { product: SourcingProduct }) {
  const pageUrl = `${siteUrl}/sourcing/${product.slug}`;
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
      <section className="section"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Buyer Challenges</p><h2>Why supplier lists are not enough</h2><div className="sourcing-product-grid">{product.buyerProblems.map((item) => <article key={item}><p>{item}</p></article>)}</div></div></section>
      <section className="section section-muted"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">How We Help</p><h2>Support from product direction to execution</h2><div className="sourcing-product-grid">{product.services.map((item) => <article key={item}><h3>{item}</h3><p>Focused support shaped around your market, product stage and supplier requirements.</p></article>)}</div></div></section>
      <section className="section"><div className="sourcing-v3-container sourcing-product-columns"><div><p className="sourcing-v3-kicker">Supplier Evaluation</p><h2>What buyers should verify</h2><ul>{product.evaluationPoints.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="sourcing-v3-kicker">Market Preparation</p><h2>One product does not fit every market</h2>{product.marketNotes.map((item) => <p key={item}>{item}</p>)}</div></div></section>
      <section className="section section-muted"><div className="sourcing-v3-container"><p className="sourcing-v3-kicker">Related Intelligence</p><h2>Research the category before choosing a supplier</h2><div className="sourcing-product-grid">{related.map((article) => <article key={article.slug}><h3>{article.title}</h3><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`}>Read the analysis</Link></article>)}</div></div></section>
      <section className="section"><div className="sourcing-v3-container sourcing-product-cta"><p className="sourcing-v3-kicker">World Clean Biz Sourcing</p><h2>Tell us what you are trying to build or source.</h2><p>Share your target product, market and project stage. We will use that context to understand where support may be useful.</p><TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation={`${product.slug}_final`} inquiryIntent="product_sourcing" productCategory={product.productCategory}>Start A Sourcing Inquiry</TallyButton></div></section>
    </main>
  );
}
