import type { ReactNode } from "react";
import "../styles/approved-editorial.css";
import "../styles/topics.css";

export default function TopicsLayout({ children }: { children: ReactNode }) {
  return <div className="approved-editorial">{children}</div>;
}
