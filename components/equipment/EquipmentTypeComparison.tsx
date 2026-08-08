import type { EquipmentProfile } from "@/lib/equipment";
import { EquipmentEvidenceMeta } from "./EquipmentEvidence";

export function EquipmentTypeComparison({ profile }: { profile: EquipmentProfile }) {
  return (
    <section className="section equipment-section equipment-section--soft" id="equipment-types">
      <div className="insights-page-container">
        <div className="equipment-section-heading">
          <p className="eyebrow">Equipment taxonomy</p>
          <h2>Main floor scrubber formats</h2>
          <p>These formats describe operator relationship and task scale. None is a universal winner.</p>
        </div>
        <div className="equipment-type-grid">
          {profile.variants.map((variant) => (
            <article key={variant.name} className="equipment-type-card">
              <h3>{variant.name}</h3>
              <dl>
                <div><dt>Task scale</dt><dd>{variant.taskScale}</dd></div>
                <div><dt>Operator</dt><dd>{variant.operatorRelationship}</dd></div>
                <div><dt>Space</dt><dd>{variant.spaceConstraints}</dd></div>
                <div><dt>Limit</dt><dd>{variant.limitations}</dd></div>
              </dl>
              <EquipmentEvidenceMeta item={variant} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
