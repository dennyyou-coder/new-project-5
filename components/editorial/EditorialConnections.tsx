import Link from "next/link";
import { responsiveImageProps } from "@/lib/articleImages";
import { productCover, type ProductModel } from "@/lib/products";
import type { Insight } from "@/lib/content";
import type { WcbVideo } from "@/lib/wcbVideos";
import styles from "./EditorialConnections.module.css";

export function ArticleProductLinks({ products }: { products: readonly ProductModel[] }) {
  if (!products.length) return null;
  const featured = products.slice(0, 4);
  const remaining = products.slice(4);
  return <section className={styles.products} aria-labelledby="related-product-profiles-title">
    <h2 id="related-product-profiles-title">Related product profiles</h2>
    <div className={styles.productGrid}>{featured.map((product) => <Link className={styles.productCard} href={`/products/${product.slug}`} key={product.slug}>
      <img {...responsiveImageProps(productCover(product.slug), "card")} alt={product.name} />
      <div><span>{product.category}</span><strong>{product.name}</strong><small>Specifications, versions &amp; buying considerations</small></div>
    </Link>)}</div>
    {remaining.length ? <details className={styles.moreModels}><summary>More related models ({remaining.length})</summary><ul>{remaining.map((product) => <li key={product.slug}><Link href={`/products/${product.slug}`}>{product.name}</Link></li>)}</ul></details> : null}
  </section>;
}

export function ArticleVideoLinks({ videos }: { videos: readonly WcbVideo[] }) {
  if (!videos.length) return null;
  return <section className={styles.videos} aria-labelledby="related-videos-title">
    <h2 id="related-videos-title">Related videos</h2>
    <div className={styles.videoGrid}>{videos.map((video) => <Link className={styles.videoCard} href={`/videos#video-${video.key}`} key={video.key}>
      <img src={video.poster} alt="" width={1280} height={720} loading="lazy" decoding="async" />
      <span>{video.category}</span><strong>{video.title}</strong><p>{video.description}</p><small>{video.duration} · Watch video</small>
    </Link>)}</div>
  </section>;
}

export function NewsReadingCards({ articles }: { articles: readonly Insight[] }) {
  return <div className={styles.readingGrid}>{articles.map((article) => <Link className={styles.readingCard} href={`/blog/${article.slug}`} key={article.slug}>
    {article.coverImage ? <img {...responsiveImageProps(article.coverImage, "card")} alt={article.coverAlt || ""} /> : null}
    <span>{article.contentClass === "search" ? "Practical guide" : "Analysis"}</span><strong>{article.title}</strong><p>{article.excerpt}</p><small>Read article</small>
  </Link>)}</div>;
}
