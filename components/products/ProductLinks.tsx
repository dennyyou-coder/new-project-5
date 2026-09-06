import Link from "next/link";
import { productModels } from "@/lib/products";
import styles from "./ProductLinks.module.css";

export function ProductLinks({ brand, article }: { brand?: string; article?: string }) {
  const models = productModels.filter((model) => brand ? model.brandSlug === brand : article && model.articles.includes(article));
  if (!models.length) return null;
  return <section className={styles.section} aria-label="Product model profiles">
    <div className={styles.heading}><div><p>Explore the products</p><h2>From brand to model</h2></div><Link href="/products">All product models →</Link></div>
    <div className={styles.links}>{models.map((model) => <Link href={`/products/${model.slug}`} key={model.slug}>
      <span>{model.category}</span><strong>{model.name} <b aria-hidden="true">↗</b></strong><p>Specifications, versions &amp; buying considerations</p>
    </Link>)}</div>
  </section>;
}
