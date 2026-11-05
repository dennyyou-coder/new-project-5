import Link from "next/link";
import type { BrandTaggedArticle } from "@/lib/brands";
import { newsDate, type NewsArticle } from "@/lib/news";

type Item = { href: string; title: string; label: string; date: string };

function sortKey(value: string) {
  const time = Date.parse(value.length === 10 ? `${value}T00:00:00+08:00` : value);
  return Number.isNaN(time) ? 0 : time;
}

/** The three newest news stories and analyses about this company. */
export function BrandLatest({ news, articles }: { news: NewsArticle[]; articles: BrandTaggedArticle[] }) {
  const items: Item[] = [
    ...news.map((item) => ({ href: `/news/${item.slug}`, title: item.title, label: "News", date: item.eventDate })),
    ...articles.map((item) => ({ href: `/blog/${item.slug}`, title: item.title, label: "Analysis", date: item.sortDate }))
  ]
    .sort((a, b) => sortKey(b.date) - sortKey(a.date))
    .slice(0, 3);
  if (!items.length) return null;
  return (
    <section className="brand-latest" aria-labelledby="brand-latest-title">
      <div className="insights-page-container">
        <h2 id="brand-latest-title">Latest</h2>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <span className="brand-latest-meta">{item.label} · <time dateTime={item.date}>{newsDate(item.date)}</time></span>
              <Link href={item.href}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
