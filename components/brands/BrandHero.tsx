import Link from "next/link";
import {
  normalizeOptionalBrandText,
  type BrandProfile
} from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";

export function BrandHero({ profile }: { profile: BrandProfile }) {
  const legalName = normalizeOptionalBrandText(profile.legalName);
  const legalEntityNote = normalizeOptionalBrandText(profile.legalEntityNote);

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

        <dl className="brand-snapshot-grid">
          {legalName ? (
            <div>
              <dt>Legal name</dt>
              <dd>{legalName}</dd>
            </div>
          ) : null}
          {legalEntityNote ? (
            <div>
              <dt>Legal entity scope</dt>
              <dd>{legalEntityNote}</dd>
            </div>
          ) : null}
          <div>
            <dt>Headquarters</dt>
            <dd>{profile.headquarters}</dd>
          </div>
          <div>
            <dt>Founded</dt>
            <dd>{profile.founded}</dd>
          </div>
          <div>
            <dt>Official website</dt>
            <dd>
              <a href={profile.officialWebsite} rel="noopener noreferrer">
                {profile.officialWebsite}
              </a>
            </dd>
          </div>
        </dl>

      </div>
    </section>
  );
}
