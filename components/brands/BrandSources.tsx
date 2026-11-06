import { Icon } from "@/components/Icon";
import type { BrandProfile } from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";

/** Research record, folded by default: the count shows, the list opens on demand. */
export function BrandSources({ profile }: { profile: BrandProfile }) {
  if (profile.sources.length === 0) return null;
  const publishers = [...new Set(profile.sources.map((source) => source.publisher))].slice(0, 4).join(", ");

  return (
    <section className="bp-card brand-sources" id="sources" aria-labelledby="sources-title">
      <details className="bp-sources">
        <summary>
          <span className="bp-card-head">
            <h2 id="sources-title"><span className="bp-card-icon"><Icon name="files" /></span>Sources ({profile.sources.length})</h2>
          </span>
          <span className="bp-sources-hint">{publishers}{profile.sources.length > 4 ? " and more" : ""} · Show all</span>
        </summary>
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
        <p>First published: {formatBrandDate(profile.publishedAt)} · Last verified: {formatBrandDate(profile.lastVerified)} · Last updated: {formatBrandDate(profile.lastModified)}</p>
      </details>
    </section>
  );
}
