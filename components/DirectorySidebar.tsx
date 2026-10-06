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
  importantTitle,
  importantArticles,
  importantMeta,
}: DirectorySidebarProps) {
  return (
    <>
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
