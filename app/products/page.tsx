import Link from "next/link";
import { ProductDirectory } from "@/components/products/ProductDirectory";
import { featuredProductModels, productSelectionYear, productCover } from "@/lib/products";
import { responsiveImageProps } from "@/lib/articleImages";
import { buildWebsiteMetadata } from "@/lib/seo";

export const metadata = buildWebsiteMetadata({ title: "2026 New Cleaning Product Models & Specifications | World Clean Biz", description: "Explore new 2026 robot vacuums, pool cleaners and robot mowers. Compare official specifications, regional versions and buying considerations.", canonical: "/products" });

export default function ProductsPage() {
  const cards = featuredProductModels.map(({ slug, name, brand, category, summary, market, announced, launchYear }) => ({ slug, name, brand, category, summary, market, announced, launchYear, image: responsiveImageProps(productCover(slug), "card") }));
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "World Clean Biz 2026 New Product Model Library", url: "https://worldcleanbiz.com/products", mainEntity: { "@type": "ItemList", itemListElement: featuredProductModels.map((model, index) => ({ "@type": "ListItem", position: index + 1, name: model.name, url: `https://worldcleanbiz.com/products/${model.slug}` })) } };
  return <div className="products-page">
    <header className="product-library-hero"><div className="product-container"><p className="product-eyebrow">World Clean Biz / {productSelectionYear} new models</p><h1>Know the model.<br /><span>Make a better choice.</span></h1><div className="product-hero-bottom"><p>Start with new models introduced in {productSelectionYear}. Clear specifications, regional differences and practical buying context.</p><a className="product-button" href="#model-directory">Explore {featuredProductModels.length} new models <span aria-hidden="true">↓</span></a></div></div></header>
    <div className="product-container"><div className="product-library-note"><p><strong>2026 launches. Official sources.</strong> Manufacturer specifications with WCB editorial interpretation. These profiles are not hands-on test ratings.</p><Link href="/brands">Explore the brands →</Link></div><ProductDirectory models={cards} />
      <section className="product-sourcing"><div><p className="product-eyebrow">For distributors &amp; professional buyers</p><h2>Turn a shortlist into a sourcing decision.</h2><p>Explore category requirements, supplier questions and routes to market.</p></div><Link href="/sourcing" className="product-button">Explore sourcing support →</Link></section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </div>;
}
