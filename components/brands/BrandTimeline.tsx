import { Icon } from "@/components/Icon";
import {
  sortBrandDevelopmentsNewestFirst,
  type BrandProfile
} from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";

/** The newest milestones on a horizontal line, oldest to newest; earlier ones fold away. */
export function BrandTimeline({ profile }: { profile: BrandProfile }) {
  if (profile.developments.length === 0) return null;

  const sourceNumbers = new Map(
    profile.sources.map((source, index) => [source.id, index + 1])
  );
  const newestFirst = sortBrandDevelopmentsNewestFirst(profile.developments);
  const shown = newestFirst.slice(0, 4).reverse();
  const earlier = newestFirst.slice(4);

  const sourceLinks = (sourceIds: string[]) =>
    sourceIds.map((sourceId) => {
      const sourceNumber = sourceNumbers.get(sourceId);
      return sourceNumber ? <a key={sourceId} href={`#source-${sourceNumber}`}>[{sourceNumber}]</a> : null;
    });

  return (
    <section className="bp-card" id="timeline" aria-labelledby="timeline-title">
      <div className="bp-card-head">
        <h2 id="timeline-title"><span className="bp-card-icon"><Icon name="calendar" /></span>Timeline</h2>
      </div>
      <ol className="brand-timeline bp-timeline">
        {shown.map((development) => (
          <li key={`${development.date}-${development.title}`}>
            <time dateTime={development.date}>{formatBrandDate(development.date)}</time>
            <h3>{development.title}</h3>
            <p>{development.summary}</p>
            <p className="bp-timeline-sources">Sources: {sourceLinks(development.sourceIds)}</p>
          </li>
        ))}
      </ol>
      {earlier.length ? (
        <details className="bp-more">
          <summary>Earlier milestones ({earlier.length})</summary>
          <ul>
            {earlier.map((development) => (
              <li key={`${development.date}-${development.title}`}>
                <time dateTime={development.date}>{formatBrandDate(development.date)}</time> · {development.title} {sourceLinks(development.sourceIds)}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
