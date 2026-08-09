import type { ComponentProfile } from "@/lib/componentProfiles";
import { ComponentEvidenceMeta } from "./ComponentEvidence";

export function ComponentServiceSections({ profile }: { profile: ComponentProfile }) {
  return <section className="section component-intelligence-section component-intelligence-section--soft" id="failure-modes"><div className="insights-page-container"><header><p className="eyebrow">Service boundary</p><h2>Failure signals and required checks</h2><p>Symptoms narrow inspection work; they are not a remote diagnosis or repair instruction.</p></header><div className="component-intelligence-grid">{profile.failureModes.map((item) => <article key={item.symptom}><h3>{item.symptom}</h3><span className="component-intelligence-label">WCB inspection categories</span><ul>{item.possibleCauses.map((cause) => <li key={cause}>{cause}</li>)}</ul><p><strong>Safety boundary</strong>{item.safetyBoundary}</p><p><strong>Service action</strong>{item.serviceAction}</p><ComponentEvidenceMeta item={item} /></article>)}</div></div></section>;
}
