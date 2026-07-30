import Link from "next/link";
import type { BrandProfile } from "@/lib/brands";
import { BrandLogo } from "./BrandLogo";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function BrandDirectoryCard({ profile }: { profile: BrandProfile }) {
  const categories = [...new Set(
    profile.productPortfolio.map((product) => product.name)
  )];
  const visibleCategories = categories.slice(0, 3);

  return (
    <article className="guide-card brand-directory-card">
      <Link href={`/brands/${profile.slug}`}>
        <BrandLogo profile={profile} variant="card" />
        <div className="guide-card-copy">
          <span>{visibleCategories.join(" · ")}</span>
          <h2>{profile.name}</h2>
          <p>{profile.description}</p>
          <small>Updated {formatDate(profile.lastVerified)}</small>
        </div>
      </Link>
    </article>
  );
}
