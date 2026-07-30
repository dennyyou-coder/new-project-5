import Link from "next/link";
import {
  normalizeOptionalBrandText,
  type BrandProfile
} from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";
import { BrandDataTable } from "./BrandDataTable";
import { BrandLogo } from "./BrandLogo";

export function BrandHero({ profile }: { profile: BrandProfile }) {
  const legalName = normalizeOptionalBrandText(profile.legalName);
  const legalEntityNote = normalizeOptionalBrandText(profile.legalEntityNote);
  const legalEntityScope = legalName || legalEntityNote;
  const ownershipType = profile.ownership.parentCompany
    ? `Part of ${profile.ownership.parentCompany}`
    : "See verified ownership analysis";
  const keyFacts = [
    {
      fact: "Legal entity scope",
      detail: legalEntityScope
    },
    {
      fact: "Ownership type",
      detail: ownershipType
    },
    {
      fact: "Headquarters",
      detail: profile.headquarters
    },
    {
      fact: "Founded",
      detail: profile.founded
    },
    {
      fact: "Official website",
      detail: (
        <a href={profile.officialWebsite} rel="noopener noreferrer">
          {profile.officialWebsite}
        </a>
      )
    },
    {
      fact: "Last verified",
      detail: formatBrandDate(profile.lastVerified, "long")
    }
  ];

  return (
    <section className="guides-category-hero">
      <div className="insights-page-container">
        <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/brands">Brand Intelligence</Link>
          <span>/</span>
          <span>{profile.name}</span>
        </nav>

        <div className="brand-detail-hero">
          <div>
            <div className="brand-hero-identity">
              <BrandLogo profile={profile} variant="hero" />
            </div>
            <p className="eyebrow">Independent Brand Intelligence</p>
            <h1>{profile.name}</h1>
            <p>{profile.headline}</p>
            <p>
              First published {formatBrandDate(profile.publishedAt, "long")} · Last verified{" "}
              {formatBrandDate(profile.lastVerified, "long")}
            </p>
            <p>{profile.description}</p>
            <p>{profile.disclaimer}</p>
          </div>

          {profile.heroImage ? (
            <img
              src={profile.heroImage}
              alt={profile.heroImageAlt || ""}
              decoding="async"
            />
          ) : null}
        </div>

        <div className="brand-key-facts">
          <BrandDataTable
            caption="Key facts"
            columns={[
              { key: "fact", label: "Fact" },
              { key: "detail", label: "Details" }
            ]}
            rows={keyFacts}
          />
        </div>
      </div>
    </section>
  );
}
