import Link from "next/link";
import type { BrandProfile } from "@/lib/brands";

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

  return (
    <article className="guide-card">
      <Link href={`/brands/${profile.slug}`}>
        {profile.heroImage ? (
          <img
            src={profile.heroImage}
            alt={profile.heroImageAlt || ""}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className="guide-card-copy">
          <span>{categories.join(" · ")}</span>
          <h2>{profile.name}</h2>
          <p>{profile.description}</p>
          <small>Updated {formatDate(profile.lastVerified)}</small>
        </div>
      </Link>
    </article>
  );
}
