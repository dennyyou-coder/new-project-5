import type { ComponentProfile } from "@/lib/componentProfiles";
import { ComponentEvidenceMeta } from "./ComponentEvidence";
import { ComponentVisual } from "./ComponentVisual";

export function ComponentCompatibility({ profile }: { profile: ComponentProfile }) {
  const visual = profile.contentVisuals.find(({ placement }) => placement === "compatibility-gate");
  return <section className="section component-intelligence-section" id="compatibility"><div className="insights-page-container"><header><p className="eyebrow">Compatibility gate</p><h2>Family similarity is not replacement compatibility</h2><p>Physical resemblance, group ownership, generic family names, seller claims, and matching wattage do not establish compatibility.</p></header>{visual ? <ComponentVisual visual={visual} guidance="Pass every relevant gate using current manufacturer documents before approving a substitute, service part or design change." /> : null}<div className="component-intelligence-grid">{profile.compatibilityChecks.map((item, index) => <article key={item.check}><span className="component-intelligence-number">{String(index + 1).padStart(2, "0")}</span><h3>{item.check}</h3><dl><div><dt>Required match</dt><dd>{item.requiredMatch}</dd></div><div><dt>Why it matters</dt><dd>{item.why}</dd></div><div><dt>Required action</dt><dd>{item.buyerAction}</dd></div></dl><ComponentEvidenceMeta item={item} /></article>)}</div></div></section>;
}
