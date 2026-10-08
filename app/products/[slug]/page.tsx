import { getNews } from "@/lib/news";
import { ProductRelatedNews } from "@/components/products/ProductRelatedNews";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productModels, getProduct, productCover, productDate, productSourcingRoutes } from "@/lib/products";
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
  const guide = model.guide;
  // Classify by the existing section headings: newer guides do not all use the same indexes.
  const versions = model.sections.filter((section) => /versions? and market differences/i.test(section.title));
  const maintenance = model.sections.filter((section) => /maintenance and ownership/i.test(section.title));
  const maintenanceIndex = model.sections.findIndex((section) => /maintenance and ownership/i.test(section.title));
  const buying = maintenanceIndex < 0 ? [] : model.sections.slice(maintenanceIndex + 1).filter((section) => !versions.includes(section));
  const features = model.sections.filter((section) => !versions.includes(section) && !maintenance.includes(section) && !buying.includes(section));
  const overview = features.slice(0, 2);
  const suitability = features.slice(2);
  const careFact = model.facts.find((fact) => /care|maintenance|drying/i.test(fact.label));
  const partsPrices = guide?.prices.filter((price) => /replacement|consumable|spare/i.test(price.kind)) ?? [];
  const modelPrices = guide?.prices.filter((price) => !partsPrices.includes(price)) ?? [];
  const priceBoundary = "Launch prices are historical. Store snapshots are dated reference points, not live offers; taxes, discounts, stock and included accessories vary.";
  function renderSections(sections: NonNullable<ReturnType<typeof getProduct>>["sections"]) {
    return sections.map((section) => <section key={section.id} id={section.id} className="product-editorial"><h2>{section.title}</h2><div dangerouslySetInnerHTML={{ __html: markdownToHtml(section.content) }} /></section>);
  }
  function renderPrices(prices: typeof modelPrices) {
    return <div className="product-price-list">{prices.map((price) => <div key={`${price.market}-${price.kind}`} className="product-price-card"><p className="product-eyebrow">{price.market}</p><h3>{price.amount}</h3><p className="product-note">{price.kind} · {productDate(price.date)}</p><p>{price.note}</p><a href={price.source}>Check official price source</a></div>)}</div>;
  }
  const specifications = guide?.specifications ?? model.facts.map((fact) => ({ ...fact, source: model.sources[0].url }));
  const related = productModels.filter((item) => model.related.includes(item.slug));
  const articles = getInsights().filter((article) => model.articles.includes(article.slug));
  const relatedNews = getNews().filter((article) => article.productSlugs.includes(model.slug));
  const url = `https://worldcleanbiz.com/products/${model.slug}`;
  // These are sourced product reference pages, not live offers or rated reviews.
  // Keep page discovery metadata without emitting an ineligible Product snippet.
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebPage", url, name: model.name, description: model.summary, image: `https://worldcleanbiz.com${model.coverImage}`, dateModified: model.verifiedAt, about: { "@type": "Thing", name: model.name }, citation: model.sources.map((source) => source.url) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://worldcleanbiz.com" }, { "@type": "ListItem", position: 2, name: "Products", item: "https://worldcleanbiz.com/products" }, { "@type": "ListItem", position: 3, name: model.name, item: url }] }
  ];
  return <div className="products-page product-detail approved-catalog"><div className="product-container">
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/products">Products</Link><span aria-hidden="true">/</span><span>{model.name}</span></nav>
    <article className="product-model-main">
      <header className="product-detail-hero"><figure className="product-model-cover"><img {...responsiveImageProps(model.coverImage, "cover")} sizes="(max-width: 800px) calc(100vw - 40px), 560px" alt={`${model.name} — official manufacturer product image`} /><figcaption>Manufacturer image · <a href={model.imageSource}>Image source</a></figcaption></figure><div className="product-detail-intro">
        <p className="product-eyebrow"><Link href={`/brands/${model.brandSlug}`}>{model.brand}</Link> / {model.category}</p><h1>{model.name}</h1><p className="product-company-link">Company profile: <Link href={`/brands/${model.brandSlug}`}>{model.brand}</Link></p><p className="product-lead">{model.summary}</p><div className="product-meta"><span>{model.market}</span><span>{model.launchYear} model</span></div><p className="product-note">Sources checked {productDate(model.verifiedAt)}{model.announced ? ` · Announced ${productDate(model.announced)}` : ""}</p>
        <p className="product-note">{model.launchNote} <a href={model.launchSource}>Launch source</a></p>
        <div className="product-actions"><a href={model.sources[0].url} className="product-text-link">Official product page</a></div>
      </div></header>
      <nav className="product-section-nav" aria-label="On this page">
        <a href={guide && overview.length ? `#${overview[0].id}` : "#ownership"}>Product &amp; operation</a><a href="#fit">Fit &amp; limitations</a><a href="#specifications">Specifications</a>{guide && <a href={versions.length ? `#${versions[0].id}` : "#pricing"}>Versions &amp; price</a>}<a href="#compare">Model comparison</a>{maintenance.length > 0 && <a href={`#${maintenance[0].id}`}>Maintenance &amp; parts</a>}<a href="#faq">FAQ &amp; sources</a>
      </nav>
      <div className="product-reading-layout">
        <aside className="product-buying-note product-professional-brief" aria-labelledby="professional-brief-heading"><p className="product-eyebrow">Professional reading</p><h2 id="professional-brief-heading">Product intelligence brief</h2><dl><div><dt>Positioning</dt><dd>{model.summary}</dd></div><div><dt>Reference market</dt><dd>{model.market}. Sources checked {productDate(model.verifiedAt)}.</dd></div><div><dt>Maintenance</dt><dd>{careFact?.value ?? "Review the cited maintenance instructions for the exact regional model."}</dd></div>{guide && <div><dt>Comparable models</dt><dd>{guide.comparison.takeaway}</dd></div>}</dl></aside>
        <div className="product-reader-content">
          {guide ? renderSections(overview) : <section id="ownership" className="product-editorial" dangerouslySetInnerHTML={{ __html: markdownToHtml(model.content) }} />}
      <section id="fit" className="product-fit-grid"><div><p className="product-eyebrow">Worth considering for</p><h2>Where it makes sense</h2><p>{guide?.verdict ?? model.fit}</p></div><div><p className="product-eyebrow">Before you commit</p><h2>{guide ? "When to look elsewhere" : "The detail to verify"}</h2><p>{guide?.notFor ?? model.caution}</p></div></section>
          {renderSections(suitability)}
          {renderSections(buying)}
        <section id="specifications" className="product-content-section"><p className="product-eyebrow">Beyond the headline number</p><h2>Specifications, with context</h2><p className="product-note">Values below are manufacturer claims for the stated reference market. WCB has not independently bench-tested this model. <a href={model.sources[0].url}>Check the official specifications and conditions</a></p><dl className="product-key-facts">{model.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><div className="product-table-wrap"><table><caption className="sr-only">{model.name} specifications and buying implications</caption><thead><tr><th scope="col">Specification</th><th scope="col">Official claim</th><th scope="col">What it means for you</th></tr></thead><tbody>{specifications.map((fact) => <tr key={fact.label}><th scope="row">{fact.label}</th><td>{fact.value}</td><td>{fact.meaning} <a className="product-spec-source" href={fact.source} aria-label={`Official source for ${fact.label}`}>Source</a></td></tr>)}</tbody></table></div></section>
          {renderSections(versions)}
          {guide && <section id="pricing" className="product-content-section"><p className="product-eyebrow">The package behind the price</p><h2>Price, market &amp; availability</h2><p className="product-note">{priceBoundary}</p>{renderPrices(modelPrices)}</section>}
      <section id="compare" className="product-content-section"><p className="product-eyebrow">Build your shortlist</p><h2>Compare models. Understand the tradeoffs.</h2>{guide && <><p className="product-note">Manufacturer specifications for the stated reference markets. Rows compare features and workflows, not results from a shared WCB test. Different runtime modes and storage locations are not interchangeable.</p><div className="product-table-wrap product-comparison" role="region" aria-label="Model comparison table" tabIndex={0}><table><caption>{model.name} and two alternatives</caption><thead><tr><th scope="col">Decision point</th>{guide.comparison.models.map((item) => <th key={item.name} scope="col"><a href={item.url}>{item.name}</a><small>{item.market}</small></th>)}</tr></thead><tbody>{guide.comparison.rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody></table></div><p className="product-comparison-takeaway"><strong>WCB interpretation:</strong> {guide.comparison.takeaway}</p></>}{related.length > 0 && <div className="product-related-grid">{related.map((item) => <Link href={`/products/${item.slug}`} className="product-related-card" key={item.slug}><img {...responsiveImageProps(productCover(item.slug), "card")} alt={item.name} /><div><span>{item.category}</span><h3>{item.name}</h3><p>{item.summary}</p><strong>View model</strong></div></Link>)}</div>}{articles.length > 0 && <div className="product-article-links"><h3>Related guides &amp; analysis</h3>{articles.map((article) => <Link key={article.slug} href={`/blog/${article.slug}`}>{article.title}</Link>)}</div>}</section>
          {guide && <div id="ownership">{renderSections(maintenance)}</div>}
          {partsPrices.length > 0 && <section id="replacement-parts" className="product-content-section product-replacement-parts"><h2>Replacement parts</h2><p className="product-note">{priceBoundary}</p>{renderPrices(partsPrices)}</section>}
        <section id="faq" className="product-content-section"><h2>Questions about {model.name}</h2><div className="product-faq-list">{model.faq.map((faq) => <details className="product-faq" key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>
        {guide && <section id="resources" className="product-content-section"><h2>Manuals, setup &amp; demonstrations</h2><div className="product-resource-list">{guide.resources.map((resource) => <article key={resource.label}><a href={resource.url}>{resource.label}</a><p>{resource.note}</p></article>)}</div></section>}
        <ProductRelatedNews name={model.name} articles={relatedNews} />
        </div>
      </div>
      <section id="sources" className="product-sources"><div><p className="product-eyebrow">Trace every specification</p><h2>Official sources &amp; support</h2><p>Checked {productDate(model.verifiedAt)} · {model.market}</p><p>Editorial interpretation by World Clean Biz. Specifications, availability and service terms may change; confirm the exact regional SKU before ordering.</p></div><ul>{model.sources.map((source) => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul></section>
      <section className="product-reading-next-step"><h2>Sourcing for business?</h2><p>Use the model as a reference for category requirements, service and channel planning.</p><Link className="product-button" href={productSourcingRoutes[model.category]}>Explore category sourcing</Link></section>
    </article><div className="product-back"><Link href="/products"> Back to all product models</Link></div>
  </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} /></div>;
}
