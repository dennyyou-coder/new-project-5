import Link from "next/link";
import type { BrandProfile } from "@/lib/brands";
import { LogoTileImage } from "@/components/ui/LogoTileImage";

export function ArticleBrandLinks({
  brandSlugs,
  profiles
}: {
  brandSlugs: string[];
  profiles: BrandProfile[];
}) {
  const publishedProfiles = new Map(
    profiles
      .filter((profile) => profile.status === "published")
      .map((profile) => [profile.slug, profile])
  );
  const linkedProfiles = [...new Set(brandSlugs)].flatMap((slug) => {
    const profile = publishedProfiles.get(slug);
    return profile ? [profile] : [];
  });

  if (!linkedProfiles.length) return null;

  return (
    <nav className="article-brand-links" aria-label="Brand Intelligence">
      <span>Brand Intelligence</span>
      <div>
        {linkedProfiles.map((profile) => (
          <Link href={`/brands/${profile.slug}`} key={profile.slug}>
            <span className="article-brand-logo" aria-hidden="true">
              <LogoTileImage slug={profile.slug} fallbackSrc={profile.logoImage} boxRatio={1.64} />
            </span>
            {profile.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
