import Link from "next/link";
import type { ComponentProfile } from "@/lib/componentProfiles";

export function ComponentDirectoryCard({ profile }: { profile: ComponentProfile }) {
  return (
    <Link className="component-intelligence-directory-card" href={`/components/${profile.slug}`}>
      <img src={profile.heroImage} alt={profile.heroImageAlt} width={1600} height={1000} loading="lazy" />
      <div><p className="eyebrow">Component intelligence</p><h2>{profile.name}</h2><p>{profile.description}</p></div>
    </Link>
  );
}
