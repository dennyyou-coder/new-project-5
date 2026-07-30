import type { BrandContentVisual } from "@/lib/brands";

export function BrandVisual({ visual }: { visual: BrandContentVisual }) {
  return (
    <figure className="brand-visual">
      <img
        src={visual.src}
        alt={visual.alt}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
      />
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}
