import type { EquipmentProfile } from "@/lib/equipment";
import { EquipmentEvidenceMeta } from "./EquipmentEvidence";

export function EquipmentTimeline({ profile }: { profile: EquipmentProfile }) {
  const developments = [...profile.developments].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return (
    <section className="section equipment-section equipment-section--soft" id="developments">
      <div className="insights-page-container">
        <div className="equipment-section-heading">
          <p className="eyebrow">Technical developments</p>
          <h2>Selected changes in floor scrubber systems</h2>
        </div>
        <ol className="equipment-timeline">
          {developments.map((item) => (
            <li key={`${item.date}-${item.title}`}>
              <time dateTime={item.date}>{item.date}</time>
              <div><h3>{item.title}</h3><p>{item.summary}</p><EquipmentEvidenceMeta item={item} /></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
