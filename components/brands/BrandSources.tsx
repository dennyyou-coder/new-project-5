import type { BrandProfile } from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";

export function BrandSources({ profile }: { profile: BrandProfile }) {
  if (profile.sources.length === 0) return null;

  return (
    <section className="section brand-sources">
      <div className="insights-page-container">
        <div className="section-heading guides-section-heading">
          <p className="eyebrow">Research Record</p>
          <h2>Sources</h2>
        </div>
        <ol>
          {profile.sources.map((source, index) => (
            <li id={`source-${index + 1}`} key={source.id}>
              <a href={source.url} rel="noopener noreferrer">
                {source.title}
              </a>
              {" — "}
              {source.publisher}
              {source.publishedAt ? (
                <> · Published {formatBrandDate(source.publishedAt)}</>
              ) : null}
              {" · "}Accessed {formatBrandDate(source.accessedAt)}
            </li>
          ))}
        </ol>
        <p>First published: {formatBrandDate(profile.publishedAt)}</p>
        <p>Last verified: {formatBrandDate(profile.lastVerified)}</p>
        <p>Last material modification: {formatBrandDate(profile.lastModified)}</p>
      </div>
    </section>
  );
}
