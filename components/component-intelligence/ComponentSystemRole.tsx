import type { ComponentProfile } from "@/lib/componentProfiles";
import { ComponentEvidenceMeta } from "./ComponentEvidence";

export function ComponentSystemRole({ profile }: { profile: ComponentProfile }) {
  return <section className="section component-intelligence-section" id="system-role"><div className="insights-page-container"><header><p className="eyebrow">Functional boundary</p><h2>Where the component sits in the larger system</h2><p>This WCB flow describes documented functions, not one universal product construction.</p></header><ol className="component-intelligence-flow">{[...profile.systemRole].sort((a, b) => a.order - b.order).map((item) => <li key={item.order}><span>{String(item.order).padStart(2, "0")}</span><h3>{item.name}</h3><p>{item.role}</p><ComponentEvidenceMeta item={item} /></li>)}</ol></div></section>;
}
