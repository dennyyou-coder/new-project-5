import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productModels, featuredProductModels, getProduct, productCover, productDate, productSourcingRoutes } from "@/lib/products";
import { getInsights, markdownToHtml } from "@/lib/content";
import { responsiveImageProps } from "@/lib/articleImages";
import { buildWebsiteMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return productModels.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = getProduct((await params).slug);
  return model ? buildWebsiteMetadata({ title: `${model.name}: Specs & Buying Guide`, description: model.summary, canonical: `/products/${model.slug}`, image: model.coverImage }) : {};
}
export default async function ProductPage({ params }: Props) {
  const model = getProduct((await params).slug);
  if (!model) notFound();
  const related = featuredProductModels.filter((item) => model.related.includes(item.slug));
  const articles = getInsights().filter((article) => model.articles.includes(article.slug));
  const url = `https://worldcleanbiz.com/products/${model.slug}`;
  const schemas = [
    { "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, name: model.name, model: model.name, description: model.summary, image: `https://worldcleanbiz.com${model.coverImage}`, brand: { "@type": "Brand", name: model.brand }, category: model.category, url, additionalProperty: model.facts.map((fact) => ({ "@type": "PropertyValue", name: fact.label, value: fact.value })) },
    { "@context": "https://schema.org", "@type": "WebPage", url, name: model.name, dateModified: model.verifiedAt, about: { "@id": `${url}#product` }, citation: model.sources.map((source) => source.url) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://worldcleanbiz.com" }, { "@type": "ListItem", position: 2, name: "Products", item: "https://worldcleanbiz.com/products" }, { "@type": "ListItem", position: 3, name: model.name, item: url }] }
  ];
  return <div className="products-page product-detail"><div className="product-container">
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/products">Products</Link><span aria-hidden="true">/</span><span>{model.name}</span></nav>
    <article className="product-model-main">
      <header className="product-detail-hero"><figure className="product-model-cover"><img {...responsiveImageProps(model.coverImage, "cover")} sizes="(max-width: 800px) calc(100vw - 40px), 560px" alt={`${model.name} — official manufacturer product image`} /><figcaption>Manufacturer image · <a href={model.imageSource}>Image source ↗</a></figcaption></figure><div className="product-detail-intro">
        <p className="product-eyebrow"><Link href={`/brands/${model.brandSlug}`}>{model.brand}</Link> / {model.category}</p><h1>{model.name}</h1><p className="product-lead">{model.summary}</p><div className="product-meta"><span>{model.market}</span><span>{model.launchYear} model</span></div><p className="product-note">Sources checked {productDate(model.verifiedAt)}{model.announced ? ` · Announced ${productDate(model.announced)}` : ""}</p>
        <p className="product-note">{model.launchNote} <a href={model.launchSource}>Launch source ↗</a></p>
        <dl className="product-key-facts">{model.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <div className="product-actions"><a href="#specifications" className="product-button">Explore specifications ↓</a><a href={model.sources[0].url} className="product-text-link">Official product page ↗</a></div>
      </div></header>
      <nav className="product-section-nav" aria-label="On this page"><a href="#fit">Who it suits</a><a href="#specifications">Specifications</a><a href="#ownership">Versions &amp; care</a><a href="#compare">Compare &amp; read</a><a href="#sources">Sources &amp; support</a></nav>
      <section id="fit" className="product-fit-grid"><div><p className="product-eyebrow">Worth considering for</p><h2>Where it makes sense</h2><p>{model.fit}</p></div><div><p className="product-eyebrow">Before you commit</p><h2>The detail to verify</h2><p>{model.caution}</p></div></section>
      <div className="product-reading-layout"><div>
        <section id="specifications" className="product-content-section"><p className="product-eyebrow">Beyond the headline number</p><h2>Specifications, with context</h2><p className="product-note">Values below are manufacturer claims for the stated reference market. WCB has not independently bench-tested this model. <a href={model.sources[0].url}>Check the official specifications and conditions ↗</a></p><div className="product-table-wrap"><table><caption className="sr-only">{model.name} specifications and buying implications</caption><thead><tr><th scope="col">Specification</th><th scope="col">Official claim</th><th scope="col">What it means for you</th></tr></thead><tbody>{model.facts.map((fact) => <tr key={fact.label}><th scope="row">{fact.label}</th><td>{fact.value}</td><td>{fact.meaning}</td></tr>)}</tbody></table></div></section>
        <section id="ownership" className="product-editorial" dangerouslySetInnerHTML={{ __html: markdownToHtml(model.content) }} />
        <section className="product-content-section"><h2>A question worth asking</h2>{model.faq.map((faq) => <details className="product-faq" key={faq.question} open><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
      </div><aside className="product-buying-note"><p className="product-eyebrow">Your next step</p><h2>Buying for yourself?</h2><p>Match the local model, accessories and warranty to your needs.</p><a href={model.sources[0].url}>Visit the manufacturer ↗</a><hr /><h2>Sourcing for business?</h2><p>Use the model as a reference for category requirements, service and channel planning.</p><Link href={productSourcingRoutes[model.category]}>Explore category sourcing →</Link><Link href={`/brands/${model.brandSlug}`}>Read {model.brand} intelligence →</Link></aside></div>
      <section id="compare" className="product-content-section"><p className="product-eyebrow">Build your shortlist</p><h2>Compare models. Understand the tradeoffs.</h2>{related.length > 0 && <div className="product-related-grid">{related.map((item) => <Link href={`/products/${item.slug}`} className="product-related-card" key={item.slug}><img {...responsiveImageProps(productCover(item.slug), "card")} alt={item.name} /><div><span>{item.category}</span><h3>{item.name}</h3><p>{item.summary}</p><strong>View model →</strong></div></Link>)}</div>}<div className="product-article-links">{articles.map((article) => <Link key={article.slug} href={`/blog/${article.slug}`}>{article.title}<span aria-hidden="true">↗</span></Link>)}</div></section>
      <section id="sources" className="product-sources"><div><p className="product-eyebrow">Trace every specification</p><h2>Official sources &amp; support</h2><p>Checked {productDate(model.verifiedAt)} · {model.market}</p><p>Editorial interpretation by World Clean Biz. Specifications, availability and service terms may change; confirm the exact regional SKU before ordering.</p></div><ul>{model.sources.map((source) => <li key={source.url}><a href={source.url}>{source.label} ↗</a></li>)}</ul></section>
    </article><div className="product-back"><Link href="/products">← Back to all product models</Link></div>
  </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} /></div>;
}
