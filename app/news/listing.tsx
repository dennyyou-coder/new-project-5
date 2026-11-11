import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { NewsImage, NewsImageCaption } from "@/components/news/NewsImage";
import { NewsKeyFigureThumb } from "@/components/news/NewsKeyFigures";
import { HUB_CATEGORIES, getHubCategory, hubCategoriesForNews } from "@/lib/hubCategories";
import { getInsights } from "@/lib/content";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getNews, getNewsVisual, isBorrowedNewsVisual, NEWS_TOPICS, newsDate, newsTopicLabel, newsHref, selectNews } from "@/lib/news";
import { LogoTileImage } from "@/components/ui/LogoTileImage";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
const siteUrl = "https://worldcleanbiz.com";

export async function newsListingMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const { topic, category, page } = selectNews(getNews(), first(params.topic), first(params.page), first(params.category));
  const hub = category ? getHubCategory(category) : undefined;
  const title = hub ? `${hub.name} News` : topic ? `${newsTopicLabel(topic)} News` : "Cleaning Industry News";
  // Category-filtered views are noindex and point their canonical at /news,
  // as /blog/archive does for its filters.
  const canonical = category ? "/news" : newsHref(topic, page);
  return {
    title: page > 1 ? `${title} — Page ${page}` : title,
    description: "Cleaning industry news from World Clean Biz: product launches, company developments and market updates, with related company and product profiles.",
    alternates: { canonical },
    robots: { index: !topic && !category, follow: true },
    openGraph: { title, type: "website", url: canonical, images: [DEFAULT_SOCIAL_IMAGE] },
    twitter: { card: "summary_large_image", title, images: [DEFAULT_SOCIAL_IMAGE] }
  };
}

export async function NewsListing({ searchParams }: Props) {
  const params = await searchParams;
  const allNews = getNews();
  const selected = selectNews(allNews, first(params.topic), first(params.page), first(params.category));
  const hubCounts = new Map(HUB_CATEGORIES.map((hub) => [hub.slug, allNews.filter((article) => (!selected.topic || article.topic === selected.topic) && hubCategoriesForNews(article).includes(hub.slug)).length]));
  const brands = getPublishedBrandProfiles(getInsights());
  const hub = selected.category ? getHubCategory(selected.category) : undefined;
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Cleaning Industry News", url: `${siteUrl}${newsHref(selected.topic, selected.page, selected.category)}`, mainEntity: { "@type": "ItemList", itemListElement: selected.articles.map((article, index) => ({ "@type": "ListItem", position: (selected.page - 1) * 12 + index + 1, name: article.title, url: `${siteUrl}/news/${article.slug}` })) } };
  return <>
    <header className="news-intro news-container"><h1>Cleaning Industry News</h1><p>Product launches, company developments and market updates from across the cleaning industry.</p></header>
    <div className="news-container">
      <div className="news-filter-bar">
        <nav className="news-filters" aria-label="News topics"><Link href={newsHref(undefined, 1, selected.category)} aria-current={!selected.topic ? "page" : undefined}>All News</Link>{NEWS_TOPICS.filter((topic) => allNews.some((article) => article.topic === topic.slug)).map((topic) => <Link key={topic.slug} href={newsHref(topic.slug, 1, selected.category)} aria-current={selected.topic === topic.slug ? "page" : undefined}>{topic.label}</Link>)}</nav>
        <details className="news-category-menu">
          <summary>
            {selected.category && hub ? <span className="news-category-dot" style={{ background: hub.color }} aria-hidden="true" /> : null}
            {selected.category && hub ? hub.name : "All categories"}
          </summary>
          <nav aria-label="News categories">
            <Link href={newsHref(selected.topic)} aria-current={!selected.category ? "page" : undefined}>All categories</Link>
            {HUB_CATEGORIES.filter((item) => (hubCounts.get(item.slug) ?? 0) > 0).map((item) => <Link key={item.slug} href={newsHref(selected.topic, 1, item.slug)} aria-current={selected.category === item.slug ? "page" : undefined}><span className="news-category-dot" style={{ background: item.color }} aria-hidden="true" />{item.name}</Link>)}
          </nav>
        </details>
      </div>
      <div className="news-columns"><section aria-labelledby="latest-news-heading"><div className="news-list-heading"><h2 id="latest-news-heading">{[selected.category ? getHubCategory(selected.category)?.name : undefined, selected.topic ? newsTopicLabel(selected.topic) : undefined].filter(Boolean).join(" · ") || "Latest stories"}</h2><span>{selected.total} {selected.total === 1 ? "story" : "stories"}</span></div>
        <div className="news-list">{selected.articles.map((article, index) => { const visual = getNewsVisual(article); const figureThumb = article.keyFigures[0] && (!visual || isBorrowedNewsVisual(visual)); const lead = index === 0 && selected.page === 1 && Boolean(visual || figureThumb); return <article className={`news-row${visual || figureThumb ? " has-image" : ""}${lead ? " news-row--lead" : ""}`} key={article.slug}>
          {figureThumb ? <figure className="news-row-media"><Link className="news-row-image news-row-figure" href={`/news/${article.slug}`} aria-label={article.title}><NewsKeyFigureThumb company={brands.find((brand) => article.brandSlugs.includes(brand.slug))?.name} logo={brands.find((brand) => article.brandSlugs.includes(brand.slug))?.logoImage} logoSlug={brands.find((brand) => article.brandSlugs.includes(brand.slug))?.slug} figure={article.keyFigures[0]} /></Link></figure> : visual ? <figure className="news-row-media"><Link className="news-row-image" href={`/news/${article.slug}`} aria-label={article.title}><NewsImage article={article} /></Link><figcaption><NewsImageCaption article={article} /></figcaption></figure> : null}
          <div className="news-row-content"><div className="news-meta"><span>{newsTopicLabel(article.topic)}</span><span>{article.category}</span></div><h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><div className="news-dates"><span>News date <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time></span><span>Added to WCB <time dateTime={article.publishedAt}>{newsDate(article.publishedAt)}</time> · {article.readingTime}</span></div><div className="news-row-footer"><div>{brands.filter((brand) => article.brandSlugs.includes(brand.slug)).map((brand) => <Link className="news-company-link" key={brand.slug} href={`/brands/${brand.slug}`}><span className="news-company-logo" aria-hidden="true"><LogoTileImage slug={brand.slug} fallbackSrc={brand.logoImage} boxRatio={1.8} /></span>{brand.name}</Link>)}</div><Link className="news-read-link" href={`/news/${article.slug}`}>Read news</Link></div></div>
        </article>; })}</div>
        {!selected.articles.length ? <p>No stories in this category yet. <Link href="/news">Browse all news</Link></p> : null}
        {selected.totalPages > 1 ? <nav className="news-pagination" aria-label="News pages">{selected.page > 1 ? <Link href={newsHref(selected.topic, selected.page - 1, selected.category)}> Previous</Link> : null}{Array.from({ length: selected.totalPages }, (_, index) => index + 1).filter(page => page === 1 || page === selected.totalPages || Math.abs(page - selected.page) <= 1).map((page,index,visible) => <span className="refresh-page-number" key={page}>{index > 0 && page - visible[index-1] > 1 ? <span aria-hidden="true">…</span> : null}<Link href={newsHref(selected.topic, page, selected.category)} aria-current={page === selected.page ? "page" : undefined}>{page}</Link></span>)}{selected.page < selected.totalPages ? <Link href={newsHref(selected.topic, selected.page + 1, selected.category)}>Next</Link> : null}</nav> : null}
      </section><NewsSidebar /></div>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </>;
}
