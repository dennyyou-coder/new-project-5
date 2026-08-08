import type { EquipmentEvidence } from "@/lib/equipment";

export function EquipmentSourceLinks({ sourceIds }: { sourceIds: string[] }) {
  return (
    <span className="equipment-source-links">
      {sourceIds.map((sourceId, index) => (
        <span key={sourceId}>
          {index > 0 ? ", " : null}
          <a href={`#source-${sourceId}`}>{sourceId}</a>
        </span>
      ))}
    </span>
  );
}

export function EquipmentEvidenceMeta({ item }: { item: EquipmentEvidence }) {
  return (
    <div className="equipment-evidence-meta">
      <p><strong>Evidence</strong>{item.evidence}</p>
      <p><strong>Scope</strong>{item.scope}</p>
      <p><strong>Verified</strong>{item.verifiedAt}</p>
      <p><strong>Sources</strong><EquipmentSourceLinks sourceIds={item.sourceIds} /></p>
    </div>
  );
}
