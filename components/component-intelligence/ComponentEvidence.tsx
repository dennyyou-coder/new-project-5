import type { ComponentEvidence } from "@/lib/componentProfiles";

export function ComponentEvidenceMeta({ item }: { item: ComponentEvidence }) {
  return (
    <div className="component-intelligence-evidence">
      <p><strong>Evidence</strong>{item.evidence}</p>
      <p><strong>Scope</strong>{item.scope}</p>
      <p><strong>Verified</strong>{item.verifiedAt}</p>
      <p><strong>Sources</strong>{item.sourceIds.map((id, index) => <span key={id}>{index ? ", " : ""}<a href={`#source-${id}`}>{id}</a></span>)}</p>
    </div>
  );
}
