import type { ComponentProfile } from "@/lib/componentProfiles";
import { ComponentEvidenceMeta } from "./ComponentEvidence";
import { ComponentVisual } from "./ComponentVisual";

export function ComponentArchitecture({ profile }: { profile: ComponentProfile }) {
  const visual = profile.contentVisuals.find(({ placement }) => placement === "architecture-families");
  return <section className="section component-intelligence-section component-intelligence-section--soft" id="architectures"><div className="insights-page-container"><header><p className="eyebrow">Architecture families</p><h2>Different component architectures solve different constraints</h2><p>No architecture is a universal winner, and a family label is not a replacement-part specification.</p></header>{visual ? <ComponentVisual visual={visual} guidance="Use the photographed family only to understand documented construction context; do not infer exact product fit." /> : null}<div className="component-intelligence-grid">{profile.architectures.map((item) => <article key={item.name}><h3>{item.name}</h3><dl><div><dt>Principle</dt><dd>{item.operatingPrinciple}</dd></div><div><dt>Application boundary</dt><dd>{item.applicationBoundary}</dd></div><div><dt>Benefits</dt><dd><ul>{item.benefits.map((value) => <li key={value}>{value}</li>)}</ul></dd></div><div><dt>Limitations</dt><dd><ul>{item.limitations.map((value) => <li key={value}>{value}</li>)}</ul></dd></div><div><dt>Buyer check</dt><dd>{item.buyerCheck}</dd></div></dl><ComponentEvidenceMeta item={item} /></article>)}</div></div></section>;
}
