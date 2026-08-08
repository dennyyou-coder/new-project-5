import Image from "next/image";
import type { EquipmentContentVisual } from "@/lib/equipment";
import { EquipmentSourceLinks } from "./EquipmentEvidence";

export function EquipmentContentVisualFigure({
  visual,
  guidance
}: {
  visual: EquipmentContentVisual;
  guidance: string;
}) {
  const label = visual.visualType === "official-photo"
    ? "Official field reference"
    : "WCB technical diagram";

  return (
    <figure className={`equipment-content-visual equipment-content-visual--${visual.visualType}`}>
      <div className="equipment-content-visual__media">
        <Image
          src={visual.src}
          alt={visual.alt}
          width={1600}
          height={1000}
          sizes="(max-width: 840px) calc(100vw - 28px), 62vw"
        />
      </div>
      <figcaption>
        <span className="equipment-content-visual__label">{label}</span>
        <p>{visual.caption}</p>
        <p className="equipment-content-visual__guidance"><strong>Buyer focus</strong>{guidance}</p>
        {visual.sourceUrl ? (
          <a href={visual.sourceUrl} target="_blank" rel="noopener noreferrer">Official image source</a>
        ) : visual.sourceIds ? (
          <p className="equipment-content-visual__sources">
            <strong>Evidence sources</strong><EquipmentSourceLinks sourceIds={visual.sourceIds} />
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
