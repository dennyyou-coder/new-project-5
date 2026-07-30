import Link from "next/link";
import type { Insight } from "@/lib/content";
import { DirectorySeriesFeature } from "@/components/DirectorySeriesFeature";
import {
  DirectorySidebar,
  type DirectorySidebarProps
} from "@/components/DirectorySidebar";

const fallbackImages = [
  "/images/industry/about-forum-stage-2025.jpg",
  "/images/industry/sourcing-product-components-2025.jpg",
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/about-forum-audience-2025.jpg"
];

export type DirectoryFilter = {
  label: string;
  href: string;
  active: boolean;
};

export type DirectoryLink = {
  label: string;
  href: string;
  active?: boolean;
};

export type DirectoryPaginationItem = {
  page: number;
  href: string;
  current: boolean;
};

type ContentDirectoryProps = {
  variant: "analysis" | "guides";
  eyebrow: string;
  title: string;
  description: string;
  totalLabel: string;
  articles: Insight[];
  filters: DirectoryFilter[];
  pagination: DirectoryPaginationItem[];
  previousHref?: string;
  nextHref?: string;
  featuredSeriesArticle?: Insight;
  sidebar: DirectorySidebarProps;
};

function imageFor(article: Insight, index: number) {
  return article.coverImage || fallbackImages[index % fallbackImages.length];
}

export function ContentDirectory({
  variant,
  eyebrow,
  title,
  description,
  totalLabel,
  articles,
  filters,
  pagination,
  previousHref,
  nextHref,
  featuredSeriesArticle,
  sidebar
}: ContentDirectoryProps) {
  return (
    <div className="content-directory" data-variant={variant}>
      <section className="content-directory-hero">
        <div className="insights-page-container content-directory-hero-inner">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <strong>{totalLabel}</strong>
        </div>
      </section>

      {featuredSeriesArticle ? (
        <DirectorySeriesFeature article={featuredSeriesArticle} />
      ) : null}

      <nav
        className="content-directory-filters"
        aria-label={`${title} filters`}
      >
        <div className="insights-page-container">
          {filters.map((filter) => (
            <Link
              aria-current={filter.active ? "page" : undefined}
              className={filter.active ? "active" : undefined}
              href={filter.href}
              key={filter.href}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="section content-directory-body">
        <div
          className="insights-page-container content-directory-layout"
          data-sidebar-mode={sidebar.mode}
        >
          <section
            className="content-directory-feed"
            aria-label={`${title} articles`}
          >
            {articles.length ? (
              articles.map((article, index) => (
                <Link
                  className="content-directory-feed-item"
                  href={`/blog/${article.slug}`}
                  aria-label={`Read ${article.title}`}
                  key={article.slug}
                >
                  <div className="content-directory-feed-image">
                    <img
                      src={imageFor(article, index)}
                      alt={article.coverAlt || `${article.title} cover`}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <div className="content-directory-feed-copy">
                    <span className="insights-category">
                      {article.category}
                    </span>
                    <h2>{article.title}</h2>
                    <p>{article.excerpt}</p>
                    <div className="insights-card-meta">
                      {article.date ? <span>{article.date}</span> : null}
                      <span>{article.readingTime}</span>
                    </div>
                    <strong>Read Article →</strong>
                  </div>
                </Link>
              ))
            ) : (
              <div className="content-directory-empty">
                <h2>No articles found</h2>
                <p>Choose another category to continue browsing.</p>
              </div>
            )}

            {pagination.length > 1 ? (
              <nav
                className="content-directory-pagination"
                aria-label={`${title} pagination`}
              >
                {previousHref ? (
                  <Link href={previousHref}>Previous</Link>
                ) : (
                  <span aria-disabled="true">Previous</span>
                )}
                {pagination.map((item) =>
                  item.current ? (
                    <strong aria-current="page" key={item.page}>
                      {item.page}
                    </strong>
                  ) : (
                    <Link href={item.href} key={item.page}>
                      {item.page}
                    </Link>
                  )
                )}
                {nextHref ? (
                  <Link href={nextHref}>Next</Link>
                ) : (
                  <span aria-disabled="true">Next</span>
                )}
              </nav>
            ) : null}
          </section>

          <aside
            className="content-directory-sidebar"
            aria-label={`${title} sidebar`}
          >
            <DirectorySidebar {...sidebar} />
          </aside>
        </div>
      </section>
    </div>
  );
}
