import Image from "next/image";
import type { ComponentContentVisual } from "@/lib/componentProfiles";

export function ComponentVisual({ visual, guidance }: { visual: ComponentContentVisual; guidance: string }) {
  return (
    <figure className={`component-intelligence-visual component-intelligence-visual--${visual.placement}`}>
      <div className="component-intelligence-visual__media">
        <picture>
          {visual.mobileSrc ? <source media="(max-width: 760px)" srcSet={visual.mobileSrc} /> : null}
          <Image src={visual.src} alt={visual.alt} width={1600} height={1000} />
        </picture>
      </div>
      <figcaption>
        <span>{visual.visualType === "official-photo" ? "Official technical image" : "WCB explanatory visual"}</span>
        <p>{visual.caption}</p>
        <p className="component-intelligence-visual__guidance"><strong>How to use this visual</strong>{guidance}</p>
        {visual.sourceUrl ? <a href={visual.sourceUrl} target="_blank" rel="noopener noreferrer">Official image source</a> : (
          <p><strong>Diagram sources</strong>{visual.sourceIds?.join(", ")}</p>
        )}
      </figcaption>
    </figure>
  );
}
