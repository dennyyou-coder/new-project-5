import type { ReactNode } from "react";
import "../styles/article.css";
import "../styles/article-editorial.css";
import "../styles/content-directories.css";
import "../styles/approved-editorial.css";
import "../styles/approved-reading.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="approved-editorial">{children}</div>;
}
