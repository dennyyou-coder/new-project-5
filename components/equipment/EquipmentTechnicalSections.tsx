import { BrandDataTable } from "@/components/brands/BrandDataTable";
import type { EquipmentProfile } from "@/lib/equipment";
import { EquipmentContentVisualFigure } from "./EquipmentContentVisual";
import { EquipmentEvidenceMeta } from "./EquipmentEvidence";

export function EquipmentTechnicalSections({ profile }: { profile: EquipmentProfile }) {
  const applicationVisual = profile.contentVisuals?.find(({ placement }) => placement === "application-fit");
  const componentVisual = profile.contentVisuals?.find(({ placement }) => placement === "component-stack");
  const metrics = profile.performanceMetrics.map((metric) => ({
    metric: metric.name,
    meaning: metric.purchasingMeaning,
    boundary: metric.reportingBoundary,
    caution: metric.comparisonCaution
  }));

  return (
    <>
      <section className="section equipment-section" id="performance-metrics">
        <div className="insights-page-container">
          <div className="equipment-section-heading">
            <p className="eyebrow">Specification dictionary</p>
            <h2>What the performance metrics do—and do not—mean</h2>
          </div>
          <BrandDataTable
            caption={`${profile.name} performance metric dictionary`}
            columns={[
              { key: "metric", label: "Metric" },
              { key: "meaning", label: "Purchasing meaning" },
              { key: "boundary", label: "Reporting boundary" },
              { key: "caution", label: "Comparison caution" }
            ]}
            rows={metrics}
          />
          <div className="equipment-metric-evidence">
            {profile.performanceMetrics.map((metric) => (
              <details key={metric.name}>
                <summary>{metric.name} evidence</summary>
                <EquipmentEvidenceMeta item={metric} />
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section equipment-section equipment-section--soft" id="application-fit">
        <div className="insights-page-container">
          <div className="equipment-section-heading">
            <p className="eyebrow">Evidence + WCB interpretation</p>
            <h2>Application-fit matrix</h2>
            <p>Official application evidence does not establish automatic suitability. Each row shows what still needs to be tested.</p>
          </div>
          {applicationVisual ? (
            <EquipmentContentVisualFigure
              visual={applicationVisual}
              guidance="Treat the photographed setting as context only. Validate utilities, surface compatibility, operating space, operator controls, environmental conditions and the planned work process on site."
            />
          ) : null}
          <div className="equipment-assessment-list">
            {profile.applicationFit.map((item) => (
              <article key={item.application} className="equipment-assessment-card">
                <h3>{item.application}</h3>
                <EquipmentEvidenceMeta item={item} />
                <div className="equipment-wcb-block">
                  <span>WCB assessment</span>
                  <p>{item.wcbAssessment}</p>
                  <dl>
                    <div><dt>Basis</dt><dd>{item.basis}</dd></div>
                    <div><dt>Limitations</dt><dd>{item.limitations}</dd></div>
                    <div><dt>Buyer action</dt><dd>{item.buyerAction}</dd></div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section equipment-section" id="component-stack">
        <div className="insights-page-container">
          <div className="equipment-section-heading">
            <p className="eyebrow">System component map</p>
            <h2>Component families and compatibility boundaries</h2>
            <p>Component families are labels only. No component link or cross-model compatibility is claimed.</p>
          </div>
          {componentVisual ? (
            <EquipmentContentVisualFigure
              visual={componentVisual}
              guidance="Before substitution or service work, match the current manual, model and serial range, part number, physical interface, approved material or chemistry, and electrical configuration."
            />
          ) : null}
          <div className="equipment-component-grid">
            {profile.componentStack.map((component) => (
              <article key={component.name} className="equipment-component-card">
                <h3>{component.name}</h3>
                <p>{component.role}</p>
                <div><strong>Common variants</strong><ul>{component.variants.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><strong>Critical checks</strong><ul>{component.criticalChecks.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <EquipmentEvidenceMeta item={component} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
