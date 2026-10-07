import Link from "next/link";
import type { BrandProfile } from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";
import { BrandLogo } from "./BrandLogo";

export function BrandDirectoryCard({ profile }: { profile: BrandProfile }) {
  const categories = [...new Set(profile.productPortfolio.map((product) => product.name))];
  const visibleCategories = categories.slice(0, 3);
  return <article className="guide-card brand-directory-card">
    <Link className="brand-card-link" href={`/brands/${profile.slug}`}><BrandLogo profile={profile} variant="card" /><h2>{profile.name}</h2></Link>
    <div className="guide-card-copy">
      <p className="brand-business-focus">{visibleCategories.join(" · ")}</p>
      <div className="brand-base"><span>Headquarters / operating base</span><p>{profile.headquarters}</p></div>
      <details className="brand-card-details"><summary>Profile overview</summary><p>{profile.description}</p></details>
      <small>Updated {formatBrandDate(profile.lastVerified)}</small>
    </div>
  </article>;
}
