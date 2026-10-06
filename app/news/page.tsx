import type { Metadata } from "next";
import Link from "next/link";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { NewsImage } from "@/components/news/NewsImage";
import { getInsights } from "@/lib/content";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getNews, NEWS_TOPICS, newsDate, newsTopicLabel, newsHref, selectNews } from "@/lib/news";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
const siteUrl = "https://worldcleanbiz.com";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const { topic, page } = selectNews(getNews(), first(params.topic), first(params.page));
  const title = topic ? `${newsTopicLabel(topic)} News` : "Cleaning Industry News";
  return {
    title: page > 1 ? `${title} — Page ${page}` : title,
    description: "Latest cleaning industry news: product launches, company moves, market and channel updates, with original sources and related WCB company and product profiles.",
    alternates: { canonical: newsHref(topic, page) },
    robots: { index: !topic, follow: true },
    openGraph: { title, type: "website", url: newsHref(topic, page) }
  };
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const allNews = getNews();
  const selected = selectNews(allNews, first(params.topic), first(params.page));
  const brands = getPublishedBrandProfiles(getInsights());
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Cleaning Industry News", url: `${siteUrl}${newsHref(selected.topic, selected.page)}`, mainEntity: { "@type": "ItemList", itemListElement: selected.articles.map((article, index) => ({ "@type": "ListItem", position: (selected.page - 1) * 12 + index + 1, name: article.title, url: `${siteUrl}/news/${article.slug}` })) } };
  return <>
    <header className="news-intro news-container"><p className="news-eyebrow">World Clean Biz News</p><h1>Cleaning Industry News</h1><p>Product launches, company moves and market updates. Ordered by original news date, with sources and the date each story was added to WCB.</p></header>
    <div className="news-container">
      <nav className="news-filters" aria-label="News topics"><Link href="/news" aria-current={!selected.topic ? "page" : undefined}>All News</Link>{NEWS_TOPICS.filter((topic) => allNews.some((article) => article.topic === topic.slug)).map((topic) => <Link key={topic.slug} href={newsHref(topic.slug)} aria-current={selected.topic === topic.slug ? "page" : undefined}>{topic.label}</Link>)}</nav>
      <div className="news-columns"><section aria-labelledby="latest-news-heading"><div className="news-list-heading"><h2 id="latest-news-heading">{selected.topic ? newsTopicLabel(selected.topic) : "Latest News"}</h2><span>{selected.total} {selected.total === 1 ? "story" : "stories"}</span></div>
        <div className="news-list">{selected.articles.map((article) => <article className={`news-row${article.imageProduct || article.brandSlugs.length ? " has-image" : ""}`} key={article.slug}>
          {article.imageProduct || article.brandSlugs.length ? <Link className="news-row-image" href={`/news/${article.slug}`} aria-label={article.title}><NewsImage article={article} /></Link> : null}
          <div className="news-row-content"><div className="news-meta"><span>{newsTopicLabel(article.topic)}</span><span>{article.category}</span></div><h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><div className="news-dates"><span>News date <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time></span><span>Added to WCB <time dateTime={article.publishedAt}>{newsDate(article.publishedAt)}</time> · {article.readingTime}</span></div><div className="news-row-footer"><div>{brands.filter((brand) => article.brandSlugs.includes(brand.slug)).map((brand) => <Link className="news-company-link" key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name} <span aria-hidden="true">↗</span></Link>)}</div><Link className="news-read-link" href={`/news/${article.slug}`}>Read news <span aria-hidden="true">→</span></Link></div></div>
        </article>)}</div>
        {!selected.articles.length ? <p>No stories in this category yet. <Link href="/news">Browse all news →</Link></p> : null}
        {selected.totalPages > 1 ? <nav className="news-pagination" aria-label="News pages">{selected.page > 1 ? <Link href={newsHref(selected.topic, selected.page - 1)}>← Previous</Link> : null}{Array.from({ length: selected.totalPages }, (_, index) => index + 1).filter(page => page === 1 || page === selected.totalPages || Math.abs(page - selected.page) <= 1).map((page,index,visible) => <span className="refresh-page-number" key={page}>{index > 0 && page - visible[index-1] > 1 ? <span aria-hidden="true">…</span> : null}<Link href={newsHref(selected.topic, page)} aria-current={page === selected.page ? "page" : undefined}>{page}</Link></span>)}{selected.page < selected.totalPages ? <Link href={newsHref(selected.topic, selected.page + 1)}>Next →</Link> : null}</nav> : null}
      </section><NewsSidebar /></div>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </>;
}
