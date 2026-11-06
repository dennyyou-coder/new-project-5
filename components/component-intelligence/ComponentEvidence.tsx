import { sourceLabel } from "@/lib/sourceLabel";
import type { ComponentEvidence } from "@/lib/componentProfiles";

/**
 * One compact line under each claim: a meaningful applicability note and the
 * source links. The profile-wide verification date is shown once in the header.
 */
export function ComponentEvidenceMeta({ item }: { item: ComponentEvidence }) {
  const scope = item.scope.trim();
  return (
    <p className="component-intelligence-evidence">
      {scope.length >= 30 ? <span className="evidence-scope">{scope}</span> : null}
      <span className="evidence-sources">Sources: {item.sourceIds.map((id, index) => <span key={id}>{index ? ", " : ""}<a href={`#source-${id}`}>{sourceLabel(id)}</a></span>)}</span>
    </p>
  );
}
