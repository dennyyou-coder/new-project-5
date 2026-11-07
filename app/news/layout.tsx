import "../styles/news.css";
import "../styles/approved-editorial.css";
import "../styles/topics.css";
export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <div className="news-page approved-editorial">{children}</div>;
}
