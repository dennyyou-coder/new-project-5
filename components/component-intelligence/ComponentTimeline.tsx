import type { ComponentProfile } from "@/lib/componentProfiles";
import { ComponentEvidenceMeta } from "./ComponentEvidence";

export function ComponentTimeline({ profile }: { profile: ComponentProfile }) {
  return <section className="section component-intelligence-section" id="developments"><div className="insights-page-container"><header><p className="eyebrow">Technical developments</p><h2>Documented changes affecting design or procurement</h2></header><ol className="component-intelligence-timeline">{[...profile.developments].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).map((item) => <li key={`${item.date}-${item.title}`}><time dateTime={item.date}>{item.date}</time><div><h3>{item.title}</h3><p>{item.summary}</p><ComponentEvidenceMeta item={item} /></div></li>)}</ol></div></section>;
}
