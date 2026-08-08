import type { EquipmentProfile } from "@/lib/equipment";
import { EquipmentEvidenceMeta } from "./EquipmentEvidence";

export function EquipmentDecisionSections({ profile }: { profile: EquipmentProfile }) {
  return (
    <>
      <section className="section equipment-section" id="procurement">
        <div className="insights-page-container">
          <div className="equipment-section-heading">
            <p className="eyebrow">WCB decision support</p>
            <h2>Procurement decision matrix</h2>
            <p>No composite score or brand ranking. Each row identifies a comparison trap and the next verification action.</p>
          </div>
          <div className="equipment-decision-grid">
            {profile.procurementDecisions.map((item) => (
              <article key={item.intendedTask} className="equipment-decision-card">
                <span className="equipment-wcb-label">WCB assessment</span>
                <h3>{item.intendedTask}</h3>
                <dl>
                  <div><dt>Verify</dt><dd>{item.attributeToVerify}</dd></div>
                  <div><dt>Comparison trap</dt><dd>{item.comparisonTrap}</dd></div>
                  <div><dt>Assessment</dt><dd>{item.assessment}</dd></div>
                  <div><dt>Basis</dt><dd>{item.basis}</dd></div>
                  <div><dt>Limitations</dt><dd>{item.limitations}</dd></div>
                  <div><dt>Buyer action</dt><dd>{item.buyerAction}</dd></div>
                  {item.engineeringCheck ? <div><dt>Engineering check</dt><dd>{item.engineeringCheck}</dd></div> : null}
                </dl>
                <EquipmentEvidenceMeta item={item} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section equipment-section equipment-section--soft" id="engineering">
        <div className="insights-page-container">
          <div className="equipment-section-heading">
            <p className="eyebrow">Engineering validation</p>
            <h2>Checks before parts, configuration or service decisions</h2>
            <p>This checklist narrows verification work; it is not a compatibility guarantee or repair manual.</p>
          </div>
          <div className="equipment-engineering-list">
            {profile.engineeringChecks.map((item, index) => (
              <article key={item.check}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.check}</h3>
                  <p>{item.reason}</p>
                  <p><strong>Required action</strong>{item.buyerAction}</p>
                  <EquipmentEvidenceMeta item={item} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section equipment-section" id="standards">
        <div className="insights-page-container">
          <div className="equipment-section-heading">
            <p className="eyebrow">Standards boundary</p>
            <h2>Safety and performance references</h2>
          </div>
          <div className="equipment-standards-grid">
            {profile.standards.map((standard) => (
              <article key={standard.name}>
                <h3>{standard.name}</h3>
                <p><strong>Jurisdiction</strong>{standard.jurisdiction}</p>
                {standard.version ? <p><strong>Version</strong>{standard.version}</p> : null}
                <p><strong>Applicability</strong>{standard.applicability}</p>
                <EquipmentEvidenceMeta item={standard} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
