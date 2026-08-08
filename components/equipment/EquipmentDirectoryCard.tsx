import Link from "next/link";
import type { EquipmentProfile } from "@/lib/equipment";

export function EquipmentDirectoryCard({ profile }: { profile: EquipmentProfile }) {
  return (
    <article className="equipment-directory-card">
      <img src={profile.heroImage} alt="" width={640} height={400} loading="lazy" />
      <div>
        <p className="eyebrow">Technical profile</p>
        <h2><Link href={`/equipment/${profile.slug}`}>{profile.name}</Link></h2>
        <p>{profile.definition}</p>
        <span>Last verified {profile.lastVerified}</span>
      </div>
    </article>
  );
}
