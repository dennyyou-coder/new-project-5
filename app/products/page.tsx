import Link from "next/link";
import { ProductDirectory } from "@/components/products/ProductDirectory";
import { productModels, productCover } from "@/lib/products";
import { responsiveImageProps } from "@/lib/articleImages";
import { buildWebsiteMetadata } from "@/lib/seo";

export const metadata = buildWebsiteMetadata({ title: "Cleaning Product Models & Specifications | World Clean Biz", description: "Explore robot vacuums, pool cleaners, robot mowers and cordless vacuums. Compare official specifications, regional versions and buying considerations.", canonical: "/products" });

export default function ProductsPage() {
  const cards = productModels.map(({ slug, name, brand, category, summary, market, announced }) => ({ slug, name, brand, category, summary, market, announced, image: responsiveImageProps(productCover(slug), "card") }));
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "World Clean Biz Product Model Library", url: "https://worldcleanbiz.com/products", mainEntity: { "@type": "ItemList", itemListElement: productModels.map((model, index) => ({ "@type": "ListItem", position: index + 1, name: model.name, url: `https://worldcleanbiz.com/products/${model.slug}` })) } };
  return <div className="products-page">
    <header className="product-library-hero"><div className="product-container"><p className="product-eyebrow">World Clean Biz / Product intelligence</p><h1>Know the model.<br /><span>Make a better choice.</span></h1><div className="product-hero-bottom"><p>Explore the machines shaping home and outdoor cleaning. Clear specifications, regional differences and practical buying context.</p><a className="product-button" href="#model-directory">Explore {productModels.length} models <span aria-hidden="true">↓</span></a></div></div></header>
    <div className="product-container"><div className="product-library-note"><p><strong>Official sources. Practical context.</strong> Manufacturer specifications with WCB editorial interpretation. These profiles are not hands-on test ratings.</p><Link href="/brands">Explore the brands →</Link></div><ProductDirectory models={cards} />
      <section className="product-sourcing"><div><p className="product-eyebrow">For distributors &amp; professional buyers</p><h2>Turn a shortlist into a sourcing decision.</h2><p>Explore category requirements, supplier questions and routes to market.</p></div><Link href="/sourcing" className="product-button">Explore sourcing support →</Link></section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </div>;
}
