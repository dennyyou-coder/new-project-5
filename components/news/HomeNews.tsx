import Link from "next/link";
import { getNews, newsDate, newsTopicLabel } from "@/lib/news";
import "@/app/styles/home-news.css";

export function HomeNews() {
  const articles = getNews().slice(0, 4);
  if (!articles.length) return null;
  return <section className="home-news" aria-labelledby="home-news-title"><div className="home-v9-container"><div className="home-news-heading"><div><p className="home-v9-eyebrow">News &amp; Updates</p><h2 id="home-news-title">Latest Industry News</h2></div><Link className="home-v9-inline-link" href="/news">View All News →</Link></div><div className="home-news-grid">{articles.map((article) => <article key={article.slug}><div className="home-news-meta"><span>{newsTopicLabel(article.topic)}</span><span>Announced <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time></span></div><h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p></article>)}</div></div></section>;
}
