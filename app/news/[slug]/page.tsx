import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleShareActions } from "@/components/ArticleShareActions";
import { TallyButton } from "@/components/LeadForms";
import { NewsImage, NewsImageCaption } from "@/components/news/NewsImage";
import { responsiveImageProps } from "@/lib/articleImages";
import { productCover, productModels } from "@/lib/products";
import { getInsights, markdownToHtml } from "@/lib/content";
import { getNewsReading } from "@/lib/editorialConnections";
import { NewsReadingCards } from "@/components/editorial/EditorialConnections";
import { getNews, getNewsArticle, getNewsContext, getNewsVisual, newsDate, newsTopicLabel, newsHref } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };
const siteUrl = "https://worldcleanbiz.com";
export const dynamicParams = false;
export function generateStaticParams() { return getNews().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getNewsArticle((await params).slug);
  if (!article) return {};
  const visual = getNewsVisual(article);
  return { title: article.title, description: article.excerpt, alternates: { canonical: `/news/${article.slug}` }, openGraph: { title: article.title, description: article.excerpt, type: "article", url: `/news/${article.slug}`, publishedTime: article.publishedAt, modifiedTime: article.updatedAt, authors: [article.author], ...(visual ? { images: [visual.src] } : {}) }, twitter: { card: visual ? "summary_large_image" : "summary", title: article.title, description: article.excerpt, ...(visual ? { images: [visual.src] } : {}) } };
}

export default async function NewsArticlePage({ params }: Props) {
  const article = getNewsArticle((await params).slug);
  if (!article) notFound();
  const { brands, products } = getNewsContext(article);
  const articles = getNewsReading(article, getInsights(), productModels);
  const visual = getNewsVisual(article);
  const url = `${siteUrl}/news/${article.slug}`;
  const schema = [{ "@context": "https://schema.org", "@type": "NewsArticle", headline: article.title, description: article.excerpt, datePublished: article.publishedAt, dateModified: article.updatedAt, mainEntityOfPage: url, url, ...(visual ? { image: [visual.src.startsWith("https://") ? visual.src : `${siteUrl}${visual.src}`] } : {}), articleSection: newsTopicLabel(article.topic), author: { "@type": "Organization", name: article.author, url: `${siteUrl}/about` }, publisher: { "@type": "Organization", name: "World Clean Biz", url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/brand/wcb-favicon-512.png` } }, citation: article.sources.map((source) => source.url), about: brands.map((brand) => ({ "@type": "Organization", name: brand.name, url: `${siteUrl}/brands/${brand.slug}` })), mentions: products.map((product) => ({ "@type": "Product", name: product.name, url: `${siteUrl}/products/${product.slug}` })) }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "News", item: `${siteUrl}/news` }, { "@type": "ListItem", position: 3, name: article.title, item: url }] }];
  return <>
    <article className="news-article">
      <header><nav className="news-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/news">News</Link><span>/</span><Link href={newsHref(article.topic)}>{newsTopicLabel(article.topic)}</Link></nav><div className="news-meta"><span>{newsTopicLabel(article.topic)}</span><span>{article.category}</span><span>{article.readingTime}</span></div><h1>{article.title}</h1><p className="news-deck">{article.excerpt}</p><div className="news-byline">By <Link href="/about">{article.author}</Link><span>Added to WCB <time dateTime={article.publishedAt}>{newsDate(article.publishedAt)}</time></span>{article.updatedAt !== article.publishedAt ? <span>Updated <time dateTime={article.updatedAt}>{newsDate(article.updatedAt)}</time></span> : null}</div><p className="news-announcement">News date: <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time></p></header>
      {visual ? <figure className="news-cover"><NewsImage article={article} context="cover" /><figcaption><NewsImageCaption article={article} full /></figcaption></figure> : null}
      <div className="article-prose news-prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }} />
      <section className="news-sources" aria-labelledby="news-sources-title"><h2 id="news-sources-title">Sources</h2><ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.title}</a></li>)}</ul></section>
      {brands.length || products.length || articles.length ? <section className="news-context" aria-labelledby="news-context-title"><p className="news-eyebrow">Explore The Story</p><h2 id="news-context-title">Related companies &amp; products</h2>{brands.length ? <div><h3>Company &amp; brand profiles</h3><div className="news-context-cards">{brands.map((brand) => <Link href={`/brands/${brand.slug}`} key={brand.slug}><img className="news-context-logo" src={brand.logoImage} alt={brand.logoImageAlt} width={96} height={64} loading="lazy" decoding="async" /><div>{brand.name}<span>Company &amp; brand profile</span></div></Link>)}</div></div> : null}{products.length ? <div><h3>Products mentioned</h3><div className="news-context-cards">{products.map((product) => <Link href={`/products/${product.slug}`} key={product.slug}><img {...responsiveImageProps(productCover(product.slug), "card")} alt={product.name} /><div>{product.name}<span>View product profile</span></div></Link>)}</div></div> : null}{articles.length ? <div><h3>Related analysis &amp; guides</h3><NewsReadingCards articles={articles} /></div> : null}</section> : null}
      <ArticleShareActions title={article.title} url={url} heading="Share this news" />
      <footer className="news-article-footer"><Link href="/news"> Back to News</Link><TallyButton form="newsletter" ctaLocation="news_article_newsletter">Get Industry Updates</TallyButton></footer>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </>;
}
