import Link from "next/link";
import { BrandDataTable } from "@/components/brands/BrandDataTable";
import type { EquipmentProfile } from "@/lib/equipment";
import { EquipmentSourceLinks } from "./EquipmentEvidence";

export function EquipmentRelationships({ profile }: { profile: EquipmentProfile }) {
  const rows = profile.representativeModels.map((model) => ({
    brand: <Link href={`/brands/${model.brandSlug}`}>{model.brandName}</Link>,
    model: model.modelName,
    subtype: model.subtype,
    specifications: <ul>{model.distinguishingSpecifications.map((item) => <li key={item}>{item}</li>)}</ul>,
    scope: model.marketScope,
    verified: model.verifiedAt,
    sources: <EquipmentSourceLinks sourceIds={model.sourceIds} />
  }));

  return (
    <section className="section equipment-section equipment-section--soft" id="representative-models">
      <div className="insights-page-container">
        <div className="equipment-section-heading equipment-section-heading--split">
          <div>
            <p className="eyebrow">Verified relationships</p>
            <h2>Related brands and representative models</h2>
            <p>Representative, not exhaustive. A link means the official source connects the named brand and model; it does not establish a factory, OEM or component-supplier relationship.</p>
          </div>
          <span className="equipment-count-badge">{profile.representativeModels.length} verified models</span>
        </div>
        <div className="equipment-table-scroll">
          <BrandDataTable
            caption={`Representative ${profile.name.toLowerCase()} models`}
            columns={[
              { key: "brand", label: "Brand" },
              { key: "model", label: "Model" },
              { key: "subtype", label: "Subtype" },
              { key: "specifications", label: "Official specification reference" },
              { key: "scope", label: "Market scope" },
              { key: "verified", label: "Verified" },
              { key: "sources", label: "Source" }
            ]}
            rows={rows}
          />
        </div>
      </div>
    </section>
  );
}
