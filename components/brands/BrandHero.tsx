import Link from "next/link";
import type { BrandProfile } from "@/lib/brands";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function BrandHero({ profile }: { profile: BrandProfile }) {
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
              First published {formatDate(profile.publishedAt)} · Last verified{" "}
              {formatDate(profile.lastVerified)}
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
          {profile.legalName ? (
            <div>
              <dt>Legal name</dt>
              <dd>{profile.legalName}</dd>
            </div>
          ) : null}
          {profile.legalEntityNote ? (
            <div>
              <dt>Legal entity scope</dt>
              <dd>{profile.legalEntityNote}</dd>
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
