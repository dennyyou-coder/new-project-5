import Link from "next/link";
import { BrandDataTable } from "@/components/brands/BrandDataTable";
import type { ComponentProfile } from "@/lib/componentProfiles";

export function ComponentHero({ profile, isDraft }: { profile: ComponentProfile; isDraft: boolean }) {
  return (
    <section className="guides-category-hero component-intelligence-hero">
      <div className="insights-page-container">
        <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/components">Component Intelligence</Link><span>/</span><span>{profile.name}</span></nav>
        <div className="component-intelligence-hero-grid">
          <div className="component-intelligence-hero-copy">
            <div className="component-intelligence-kicker"><p className="eyebrow">Independent Component Reference</p>{isDraft ? <span>Draft preview</span> : null}</div>
            <h1>{profile.name}</h1><p className="component-intelligence-headline">{profile.headline}</p><p>{profile.description}</p>
            <details className="detail-fold hero-scope-fold"><summary>What this profile covers</summary><div className="component-intelligence-scope"><div><strong>Included</strong><ul>{profile.includedScope.map((item) => <li key={item}>{item}</li>)}</ul></div><div><strong>Excluded</strong><ul>{profile.excludedScope.map((item) => <li key={item}>{item}</li>)}</ul></div></div></details>
            <p className="component-intelligence-date">First published {profile.publishedAt} · Last verified {profile.lastVerified}</p>
            <p className="component-intelligence-disclaimer">{profile.disclaimer}</p>
          </div>
          <figure className="component-intelligence-hero-media"><span>Official component reference</span><img src={profile.heroImage} alt={profile.heroImageAlt} width={1600} height={1000} /><figcaption>{profile.heroImageCaption} <a href={profile.heroSourceUrl} target="_blank" rel="noopener noreferrer">Official image source</a></figcaption></figure>
        </div>
        <div className="component-intelligence-key-facts"><BrandDataTable caption={`${profile.name} key facts`} columns={[{ key: "fact", label: "Fact" }, { key: "detail", label: "Technical reference" }, { key: "scope", label: "Scope boundary" }]} rows={profile.keyFacts.map((item) => ({ fact: item.label, detail: item.value, scope: item.scope }))} /></div>
      </div>
    </section>
  );
}
