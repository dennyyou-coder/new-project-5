import type { EquipmentProfile } from "@/lib/equipment";

export function EquipmentSources({ profile }: { profile: EquipmentProfile }) {
  return (
    <section className="section equipment-section equipment-sources" id="sources">
      <div className="insights-page-container">
        <div className="equipment-section-heading">
          <p className="eyebrow">Evidence record</p>
          <h2>Sources</h2>
          <p>First published {profile.publishedAt} · Last verified {profile.lastVerified} · Last material modification {profile.lastModified}</p>
        </div>
        <ol className="equipment-source-list">
          {profile.sources.map((source) => (
            <li id={`source-${source.id}`} key={source.id}>
              <span className="equipment-source-type">{source.sourceType}</span>
              <h3>{source.title}</h3>
              <p>{source.publisher}</p>
              <a href={source.url} target="_blank" rel="noopener noreferrer">Open official source</a>
              <p>Accessed {source.accessedAt}{source.publishedAt ? ` · Published ${source.publishedAt}` : ""}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
