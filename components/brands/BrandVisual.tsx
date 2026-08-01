import type { BrandContentVisual } from "@/lib/brands";

const visualLabels: Record<BrandContentVisual["placement"], string> = {
  ownership: "Ownership & entity evidence",
  portfolio: "Product portfolio reference",
  operations: "Manufacturing & channel evidence",
  competition: "Competitive context"
};

export function BrandVisual({ visual }: { visual: BrandContentVisual }) {
  return (
    <figure className="brand-visual">
      <div className="brand-visual__eyebrow">{visualLabels[visual.placement]}</div>
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
