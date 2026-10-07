import Link from "next/link";
import type {
  DirectoryArticle,
  DirectoryLink,
} from "@/components/ContentDirectory";
import { directoryArticleImageProps } from "@/lib/contentDirectory";

const fallbackImages = [
  "/images/industry/about-forum-stage-2025.jpg",
  "/images/industry/sourcing-product-components-2025.jpg",
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/about-forum-audience-2025.jpg",
];

export type DirectorySidebarProps = {
  mode: "analysis" | "guides";
  navigationTitle: string;
  navigationLinks: DirectoryLink[];
  importantTitle: string;
  importantArticles: DirectoryArticle[];
  importantMeta: "date" | "readingTime";
};

export function DirectorySidebar({
  mode,
  navigationTitle,
  navigationLinks,
  importantTitle,
  importantArticles,
  importantMeta,
}: DirectorySidebarProps) {
  return (
    <>
      {mode === "analysis" && navigationLinks.length ? (
        <section className="content-directory-sidebar-box content-directory-company-index">
          <h2>{navigationTitle}</h2>
          <nav className="content-directory-keywords" aria-label="Filter analysis by company or brand">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className={link.active ? "active" : undefined} aria-current={link.active ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      ) : null}
      {importantArticles.length ? (
        <section className="content-directory-sidebar-box content-directory-important">
          <h2>{importantTitle}</h2>
          <div>
            {importantArticles.slice(0, 4).map((article, index) => (
              <Link href={`/blog/${article.slug}`} key={article.slug}>
                <img
                  {...directoryArticleImageProps(
                    article,
                    fallbackImages[index % fallbackImages.length],
                  )}
                  alt=""
                />
                <span>
                  <strong>{article.title}</strong>
                  <small>
                    {importantMeta === "date"
                      ? article.date
                      : article.readingTime}
                  </small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
