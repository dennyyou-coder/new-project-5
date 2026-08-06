import type { BrandProfile } from "@/lib/brands";

export function BrandLogo({
  profile,
  variant
}: {
  profile: BrandProfile;
  variant: "card" | "hero";
}) {
  return (
    <div className={`brand-logo brand-logo--${variant} brand-logo--${profile.slug}`}>
      <img
        src={profile.logoImage}
        alt={profile.logoImageAlt}
        loading={variant === "card" ? "lazy" : "eager"}
        decoding="async"
      />
    </div>
  );
}
