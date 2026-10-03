import "../styles/news.css";
export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <div className="news-page">{children}</div>;
}
