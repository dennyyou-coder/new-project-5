import {
  sortBrandDevelopmentsNewestFirst,
  type BrandProfile
} from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";

export function BrandTimeline({ profile }: { profile: BrandProfile }) {
  if (profile.developments.length === 0) return null;

  const sourceNumbers = new Map(
    profile.sources.map((source, index) => [source.id, index + 1])
  );
  const developments = sortBrandDevelopmentsNewestFirst(profile.developments);

  return (
    <section className="section">
      <div className="insights-page-container">
        <div className="section-heading guides-section-heading">
          <p className="eyebrow">Company Developments</p>
          <h2>Verified Timeline</h2>
        </div>
        <ol className="brand-timeline">
          {developments.map((development) => (
            <li key={`${development.date}-${development.title}`}>
              <time dateTime={development.date}>{formatBrandDate(development.date)}</time>
              <h3>{development.title}</h3>
              <p>{development.summary}</p>
              <p>
                Sources:{" "}
                {development.sourceIds.map((sourceId, index) => {
                  const sourceNumber = sourceNumbers.get(sourceId);
                  if (!sourceNumber) return null;

                  return (
                    <span key={sourceId}>
                      {index > 0 ? " " : ""}
                      <a href={`#source-${sourceNumber}`}>[{sourceNumber}]</a>
                    </span>
                  );
                })}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
