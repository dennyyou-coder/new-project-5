import Link from "next/link";
import { NewsImage, NewsImageCaption } from "@/components/news/NewsImage";
import { newsDate, type NewsArticle } from "@/lib/news";

export function ProductRelatedNews({ name, articles }: { name: string; articles: NewsArticle[] }) {
  if (!articles.length) return null;
  return <section className="product-content-section product-related-news" aria-labelledby="product-news-heading">
    <h2 id="product-news-heading">News about {name}</h2>
    <div>{articles.slice(0, 3).map((article) => <div className="product-related-news-item" key={article.slug}>
      <figure>
        <Link href={`/news/${article.slug}`} aria-label={`Read ${article.title}`}><NewsImage article={article} /></Link>
        <figcaption><NewsImageCaption article={article} full /></figcaption>
      </figure>
      <div>
        <time dateTime={article.eventDate}>{newsDate(article.eventDate)}</time>
        <h3><Link href={`/news/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
      </div>
    </div>)}</div>
  </section>;
}
