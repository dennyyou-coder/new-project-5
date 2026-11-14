import Link from "next/link";
import { ProductDirectory } from "@/components/products/ProductDirectory";
import { featuredProductModels, productSelectionYear, productCover } from "@/lib/products";
import { responsiveImageProps } from "@/lib/articleImages";
import { buildWebsiteMetadata } from "@/lib/seo";
import { productCategoryAliases, productCategoryLabel } from "@/lib/hubCategories";

export const metadata = buildWebsiteMetadata({ title: "2026 New Cleaning Product Models & Specifications | World Clean Biz", description: "Explore new 2026 robot vacuums, pool cleaners and robot mowers. Compare official specifications, regional versions and buying considerations.", canonical: "/products" });

export default function ProductsPage() {
  const cards = featuredProductModels.map(({ slug, name, brand, brandSlug, category, summary, market, launchYear, facts }) => ({ slug, name, brand, brandSlug, category: productCategoryLabel(category), summary, market, launchYear, facts: facts.map(({ label, value }) => ({ label, value })), image: responsiveImageProps(productCover(slug), "card") }));
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "World Clean Biz 2026 New Product Model Library", url: "https://worldcleanbiz.com/products", mainEntity: { "@type": "ItemList", itemListElement: featuredProductModels.map((model, index) => ({ "@type": "ListItem", position: index + 1, name: model.name, url: `https://worldcleanbiz.com/products/${model.slug}` })) } };
  return <div className="products-page approved-catalog">
    <header className="product-library-hero"><div className="product-container"><h1>Product Library</h1><p className="product-hero-line">{featuredProductModels.length} new {productSelectionYear} models from official specs, not hands-on tests. <Link href="/brands">Explore the brands</Link></p></div></header>
    <div className="product-container"><ProductDirectory models={cards} aliases={productCategoryAliases()} />
      <section className="product-sourcing"><div><p className="product-eyebrow">For distributors &amp; professional buyers</p><h2>Turn a shortlist into a sourcing decision.</h2><p>Explore category requirements, supplier questions and routes to market.</p></div><Link href="/sourcing" className="product-button">Explore sourcing support</Link></section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </div>;
}
