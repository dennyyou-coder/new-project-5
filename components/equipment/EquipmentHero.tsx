import Link from "next/link";
import { BrandDataTable } from "@/components/brands/BrandDataTable";
import type { EquipmentProfile } from "@/lib/equipment";

export function EquipmentHero({ profile, isDraft }: { profile: EquipmentProfile; isDraft: boolean }) {
  const keyFacts = profile.keyFacts.map((item) => ({
    fact: item.label,
    detail: item.value,
    scope: item.scope
  }));

  return (
    <section className="guides-category-hero equipment-hero">
      <div className="insights-page-container">
        <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/equipment">Equipment Intelligence</Link><span>/</span>
          <span>{profile.name}</span>
        </nav>

        <div className="equipment-hero-grid">
          <div className="equipment-hero-copy">
            <div className="equipment-kicker-row">
              <p className="eyebrow">Independent Technical Reference</p>
              {isDraft ? <span className="equipment-draft-label">Draft preview</span> : null}
            </div>
            <h1>{profile.name}</h1>
            <p className="equipment-hero-headline">{profile.headline}</p>
            <p>{profile.description}</p>
            <div className="equipment-scope-grid">
              <div>
                <strong>Included</strong>
                <ul>{profile.includedScope.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <strong>Excluded</strong>
                <ul>{profile.excludedScope.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
            <p className="equipment-verification-line">
              First published {profile.publishedAt} · Last verified {profile.lastVerified}
            </p>
            <p className="equipment-disclaimer">{profile.disclaimer}</p>
          </div>

          <figure className="equipment-hero-media">
            <div className="equipment-hero-media__eyebrow">Official equipment reference</div>
            <img src={profile.heroImage} alt={profile.heroImageAlt} width={1600} height={1000} decoding="async" />
            <figcaption>
              {profile.heroImageCaption}{" "}
              <a href={profile.heroSourceUrl} target="_blank" rel="noopener noreferrer">Official image source</a>
            </figcaption>
          </figure>
        </div>

        <div className="equipment-key-facts">
          <BrandDataTable
            caption="Floor scrubber key facts"
            columns={[
              { key: "fact", label: "Fact" },
              { key: "detail", label: "Technical reference" },
              { key: "scope", label: "Scope boundary" }
            ]}
            rows={keyFacts}
          />
        </div>

        <nav className="equipment-section-nav" aria-label="Equipment profile sections">
          <a href="#working-system">Working system</a>
          <a href="#equipment-types">Types</a>
          <a href="#performance-metrics">Metrics</a>
          <a href="#application-fit">Applications</a>
          <a href="#component-stack">Components</a>
          <a href="#representative-models">Models</a>
          <a href="#procurement">Procurement</a>
          <a href="#engineering">Engineering</a>
          <a href="#standards">Standards</a>
          <a href="#developments">Developments</a>
          <a href="#sources">Sources</a>
        </nav>
      </div>
    </section>
  );
}
