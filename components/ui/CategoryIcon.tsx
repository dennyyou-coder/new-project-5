import type { CSSProperties, ReactNode } from "react";

/** Line icons for the hub categories, drawn on a 24px grid. */
const CATEGORY_ICON_PATHS: Record<string, ReactNode> = {
  "robot-vacuums": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="9" r="2.2" />
      <path d="M7.5 15.5h9" />
    </>
  ),
  "vacuum-cleaners": (
    <>
      <path d="M15 3 10 17" />
      <rect x="5" y="16" width="9" height="4" rx="1.5" />
      <rect x="14" y="3" width="4" height="6" rx="1.5" />
    </>
  ),
  "floor-washers": (
    <>
      <path d="m14 3-3 12" />
      <rect x="5" y="15" width="11" height="4" rx="2" />
      <path d="M4 21.5c1.5-.8 3-.8 4.5 0s3 .8 4.5 0 3-.8 4.5 0" />
    </>
  ),
  "pool-robots": (
    <>
      <rect x="6" y="6" width="12" height="8" rx="3" />
      <path d="M8 14v2M16 14v2" />
      <path d="M3 19.5c1.5-.9 3-.9 4.5 0s3 .9 4.5 0 3-.9 4.5 0 3 .9 4.5 0" />
    </>
  ),
  "robotic-mowers": (
    <>
      <path d="M5 15a7 4 0 0 1 14 0v1H5z" />
      <circle cx="8" cy="18" r="1.6" />
      <circle cx="16" cy="18" r="1.6" />
      <path d="M3 21h18" />
    </>
  ),
  "commercial-cleaning": (
    <>
      <rect x="4" y="9" width="12" height="8" rx="2" />
      <path d="M16 11h3l1 3v3h-4" />
      <circle cx="8" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </>
  ),
  "carpet-spot-cleaners": (
    <>
      <rect x="7" y="4" width="8" height="9" rx="2" />
      <path d="M15 7h2.5a1.5 1.5 0 0 1 1.5 1.5V10" />
      <path d="M9 13v3h4v-3" />
      <path d="M3 20.5h18M6 18c.8-.6 1.6-.6 2.4 0s1.6.6 2.4 0 1.6-.6 2.4 0 1.6.6 2.4 0" />
    </>
  ),
  "window-robots": (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M12 3v18M4 12h16" />
      <rect x="13.5" y="5" width="5" height="5" rx="1.2" />
    </>
  ),
  "small-appliances": (
    <>
      <path d="M7 8h9l-1 12H8z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2.4" />
      <path d="M9 5h5M11.5 5V8" />
    </>
  ),
  "power-tools-outdoor": (
    <>
      <path d="M4 7h11v5H4z" />
      <path d="M15 8.5h5" />
      <path d="M8 12v3l-1.5 6h4L12 15v-3" />
    </>
  )
};

export function hasCategoryIcon(slug: string): boolean {
  return slug in CATEGORY_ICON_PATHS;
}

export function CategoryIcon({ slug, color, size = "md" }: { slug: string; color?: string; size?: "sm" | "md" | "lg" }) {
  const paths = CATEGORY_ICON_PATHS[slug];
  if (!paths) return null;
  return (
    <span
      className={`category-icon category-icon--${size}`}
      style={color ? ({ "--category-color": color } as CSSProperties) : undefined}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {paths}
        </g>
      </svg>
    </span>
  );
}
