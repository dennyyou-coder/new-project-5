import type { EquipmentEvidence } from "@/lib/equipment";
import { sourceLabel } from "@/lib/sourceLabel";

export function EquipmentSourceLinks({ sourceIds }: { sourceIds: string[] }) {
  return (
    <span className="equipment-source-links">
      {sourceIds.map((sourceId, index) => (
        <span key={sourceId}>
          {index > 0 ? ", " : null}
          <a href={`#source-${sourceId}`}>{sourceLabel(sourceId)}</a>
        </span>
      ))}
    </span>
  );
}

/**
 * One compact line under each claim: a meaningful applicability note (short
 * labels such as "Exact model." add nothing) and the source links. The
 * verification date is the same for the whole profile and is shown once in the
 * header and the source list.
 */
export function EquipmentEvidenceMeta({ item }: { item: EquipmentEvidence }) {
  const scope = item.scope.trim();
  return (
    <p className="equipment-evidence-meta">
      {scope.length >= 30 ? <span className="evidence-scope">{scope}</span> : null}
      <span className="evidence-sources">Sources: <EquipmentSourceLinks sourceIds={item.sourceIds} /></span>
    </p>
  );
}
