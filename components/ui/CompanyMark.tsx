import Link from "next/link";
import { brandMonogram, type BrandMark } from "@/lib/brandMarks";

type Size = "xs" | "sm" | "md" | "lg";

/** A company's logo tile, or a monogram tile when no logo is published. */
export function CompanyMark({
  mark,
  size = "md",
  link = false,
  showName = false,
  caption
}: {
  mark: BrandMark;
  size?: Size;
  link?: boolean;
  showName?: boolean;
  caption?: string;
}) {
  const tile = (
    <span className={`company-mark company-mark--${size}${mark.logo ? "" : " company-mark--monogram"}`}>
      {mark.logo ? (
        <img src={mark.logo} alt={showName ? "" : mark.name} loading="lazy" decoding="async" />
      ) : (
        <span aria-hidden={showName ? "true" : undefined} aria-label={showName ? undefined : mark.name}>
          {brandMonogram(mark.name)}
        </span>
      )}
    </span>
  );

  const body = showName || caption ? (
    <>
      {tile}
      <span className="company-mark-text">
        {showName ? <span className="company-mark-name">{mark.name}</span> : null}
        {caption ? <span className="company-mark-caption">{caption}</span> : null}
      </span>
    </>
  ) : tile;

  if (link && mark.href) {
    return (
      <Link className="company-mark-link" href={mark.href}>
        {body}
      </Link>
    );
  }
  return showName || caption ? <span className="company-mark-link">{body}</span> : tile;
}
