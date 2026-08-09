import type { ComponentProfile } from "@/lib/componentProfiles";

export function ComponentSources({ profile }: { profile: ComponentProfile }) {
  return <section className="section component-intelligence-section component-intelligence-section--soft" id="sources"><div className="insights-page-container"><header><p className="eyebrow">Audit trail</p><h2>Primary and technical sources</h2><p>Last material modification {profile.lastModified} · Last verified {profile.lastVerified}</p></header><ol className="component-intelligence-source-list">{profile.sources.map((source) => <li id={`source-${source.id}`} key={source.id}><span>{source.sourceType}</span><h3>{source.title}</h3><p>{source.publisher}</p><p>Accessed {source.accessedAt}</p><a href={source.url} target="_blank" rel="noopener noreferrer">Open source</a></li>)}</ol></div></section>;
}
