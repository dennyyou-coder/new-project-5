import Link from "next/link";
import { getNews, newsDate, newsTopicLabel } from "@/lib/news";
import { NewsImage } from "@/components/news/NewsImage";
import "@/app/styles/home-news.css";

export function HomeNews() {
  const articles = getNews().slice(0, 4);
  if (!articles.length) return null;
  return (
    <section className="home-news" aria-labelledby="home-news-title">
      <div className="home-v9-container">
        <div className="home-news-heading">
          <div><p className="home-v9-eyebrow">News &amp; Updates</p><h2 id="home-news-title">Latest Industry News</h2></div>
          <Link className="home-v9-inline-link" href="/news">View All News</Link>
        </div>
        <div className="home-news-grid">
          {articles.map((article) => (
            <article className={article.imageProduct || article.brandSlugs.length ? "has-image" : undefined} key={article.slug}>
              {article.imageProduct || article.brandSlugs.length ? <Link className="home-news-image" href={`/news/${article.slug}`} aria-label={article.title}><NewsImage article={article} /></Link> : null}
              <div className="home-news-copy">
                <div className="home-news-meta"><span>{newsTopicLabel(article.topic)}</span></div>
                <h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3>
                <p>{article.excerpt}</p>
                <div className="home-news-bottom"><span>News date <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time></span><Link href={`/news/${article.slug}`} aria-label={`Read news: ${article.title}`}>Read news</Link></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
