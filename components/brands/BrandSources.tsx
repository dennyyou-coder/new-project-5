import type { BrandProfile } from "@/lib/brands";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(new Date(value));
}

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
                <> · Published {formatDate(source.publishedAt)}</>
              ) : null}
              {" · "}Accessed {formatDate(source.accessedAt)}
            </li>
          ))}
        </ol>
        <p>First published: {formatDate(profile.publishedAt)}</p>
        <p>Last verified: {formatDate(profile.lastVerified)}</p>
        <p>Last material modification: {formatDate(profile.lastModified)}</p>
      </div>
    </section>
  );
}
