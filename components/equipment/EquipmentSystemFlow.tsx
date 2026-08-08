import type { EquipmentProfile } from "@/lib/equipment";
import { EquipmentEvidenceMeta } from "./EquipmentEvidence";

export function EquipmentSystemFlow({ profile }: { profile: EquipmentProfile }) {
  const ordered = [...profile.systemFlow].sort((a, b) => a.order - b.order);
  return (
    <section className="section equipment-section" id="working-system">
      <div className="insights-page-container">
        <div className="equipment-section-heading">
          <p className="eyebrow">WCB explanatory visual</p>
          <h2>{profile.name} working system</h2>
          <p>An original system map synthesized from reviewed operator manuals. It explains functional flow, not a universal machine architecture.</p>
        </div>
        <ol className="equipment-system-flow">
          {ordered.map((item) => (
            <li key={item.order}>
              <span className="equipment-flow-number">{String(item.order).padStart(2, "0")}</span>
              <h3>{item.name}</h3>
              <p className="equipment-flow-component">{item.componentFamily}</p>
              <p>{item.role}</p>
              <EquipmentEvidenceMeta item={item} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
