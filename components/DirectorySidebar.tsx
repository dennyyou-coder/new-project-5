import Link from "next/link";
import type { DirectoryArticle, DirectoryLink } from "@/components/ContentDirectory";

const fallbackImages = [
  "/images/industry/about-forum-stage-2025.jpg",
  "/images/industry/sourcing-product-components-2025.jpg",
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/about-forum-audience-2025.jpg"
];

export type DirectorySidebarProps = {
  mode: "analysis" | "guides";
  navigationTitle: string;
  navigationLinks: DirectoryLink[];
  importantTitle: string;
  importantArticles: DirectoryArticle[];
  importantMeta: "date" | "readingTime";
};

function imageFor(article: DirectoryArticle, index: number) {
  return article.coverImage || fallbackImages[index % fallbackImages.length];
}

export function DirectorySidebar({
  mode,
  navigationTitle,
  navigationLinks,
  importantTitle,
  importantArticles,
  importantMeta
}: DirectorySidebarProps) {
  return (
    <>
      <section className="content-directory-sidebar-box content-directory-profile">
        <img
          src="/images/industry/about-denny-portrait-event.jpg"
          alt="Denny You at a cleaning industry event"
          loading="lazy"
          decoding="async"
        />
        <p className="eyebrow">World Clean Biz</p>
        <h2>Denny You</h2>
        <p className="content-directory-profile-roles">
          Founder, World Clean Biz
          <br />
          Organizer, WCB Expo
          <br />
          Inside the cleaning industry since 2006.
        </p>
        <p>
          Combining industry analysis, sourcing judgment and global cleaning
          industry connections for buyers, brands and manufacturers.
        </p>
        <Link href="/about">About Denny You →</Link>
      </section>

      <section className="content-directory-sidebar-box">
        <h2>{navigationTitle}</h2>
        <nav
          aria-label={navigationTitle}
          className={
            mode === "analysis" ? "content-directory-keywords" : undefined
          }
        >
          {navigationLinks.map((item) => (
            <Link
              aria-current={item.active ? "page" : undefined}
              className={item.active ? "active" : undefined}
              href={item.href}
              key={`${item.href}-${item.label}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </section>

      {importantArticles.length ? (
        <section className="content-directory-sidebar-box content-directory-important">
          <h2>{importantTitle}</h2>
          <div>
            {importantArticles.map((article, index) => (
              <Link href={`/blog/${article.slug}`} key={article.slug}>
                <img
                  src={imageFor(article, index)}
                  alt=""
                  width={article.coverWidth}
                  height={article.coverHeight}
                  loading="lazy"
                  decoding="async"
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
