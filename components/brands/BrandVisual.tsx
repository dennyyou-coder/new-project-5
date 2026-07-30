import type { BrandContentVisual } from "@/lib/brands";

export function BrandVisual({ visual }: { visual: BrandContentVisual }) {
  return (
    <figure className="brand-visual">
      <a
        className="brand-visual-link"
        href={visual.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${visual.alt} in full size`}
      >
        <img
          src={visual.src}
          alt={visual.alt}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}
