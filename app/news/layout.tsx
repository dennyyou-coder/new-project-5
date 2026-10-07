import "../styles/news.css";
import "../styles/approved-editorial.css";
export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <div className="news-page approved-editorial">{children}</div>;
}
