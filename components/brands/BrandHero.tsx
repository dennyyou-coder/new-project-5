import Link from "next/link";
import {
  normalizeOptionalBrandText,
  type BrandProfile
} from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";
import { getBrandCategoryForProfile } from "@/lib/brandCategories";
import { BrandLogo } from "./BrandLogo";

export function BrandHero({ profile, hasAnalysis }: { profile: BrandProfile; hasAnalysis: boolean }) {
  const category = getBrandCategoryForProfile(profile.slug);
  const legalName = normalizeOptionalBrandText(profile.legalName);
  const legalEntityNote = normalizeOptionalBrandText(profile.legalEntityNote);
  const legalEntityScope = legalName || legalEntityNote;
  const ownershipType = normalizeOptionalBrandText(profile.ownership.displayLabel)
    || (profile.ownership.parentCompany
      ? `Part of ${profile.ownership.parentCompany}`
      : "See verified ownership analysis");
  const keyFacts = [
    { fact: "Brand", detail: profile.name },
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
    { fact: "Main businesses", detail: profile.productPortfolio.map((item) => item.name).join(" · ") },
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
  // Facts the reviewed sources do not state are listed together in one row
  // instead of repeating "Not disclosed" in several rows.
  const undisclosedPattern = /^not (disclosed|publicly identified|stated|identified)/i;
  const isUndisclosed = (detail: unknown) => typeof detail === "string" && undisclosedPattern.test(detail.trim());
  const undisclosed = keyFacts.filter(({ detail }) => isUndisclosed(detail)).map(({ fact }) => fact);
  if (profile.leadership.length === 0) undisclosed.push("Named leadership");
  const shownFacts = [
    ...keyFacts.filter(({ detail }) => !isUndisclosed(detail)),
    ...(undisclosed.length ? [{ fact: "Not disclosed", detail: `${undisclosed.join(" · ")} (not stated in the reviewed sources)` }] : [])
  ];

  return (
    <section className="guides-category-hero">
      <div className="insights-page-container">
        <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/brands">Brand Intelligence</Link>
          <span>/</span>
          {category ? (
            <>
              <Link href={`/brands/${category.slug}`}>{category.name}</Link>
              <span>/</span>
            </>
          ) : null}
          <span>{profile.name}</span>
        </nav>

        <div className="brand-detail-hero">
          <div>
            <div className="brand-hero-identity">
              <BrandLogo profile={profile} variant="hero" />
            </div>
            <p className="eyebrow">Independent Brand Intelligence</p>
            {category ? (
              <Link className="brand-category-link" href={`/brands/${category.slug}`}>
                {category.name}
              </Link>
            ) : null}
            <h1>{profile.name}</h1>
            <p className="company-positioning">{profile.headline}</p>
            <p>
              First published {formatBrandDate(profile.publishedAt, "long")} · Last verified{" "}
              {formatBrandDate(profile.lastVerified, "long")}
            </p>
          </div>

          {profile.heroImage ? (
            <figure className="brand-hero-media">
              <div className="brand-hero-media__eyebrow">Brand product reference</div>
              <img
                src={profile.heroImage}
                alt={profile.heroImageAlt || ""}
                decoding="async"
              />
              {profile.heroImageCaption ? (
                <figcaption>{profile.heroImageCaption}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>

        <div className="brand-key-facts">
          <dl className="company-overview-facts" aria-label="Key facts">{shownFacts.map(({ fact, detail }) => <div key={fact}><dt>{fact}</dt><dd>{detail}</dd></div>)}</dl>
        </div>

        <p className="brand-correction">
          Spot something out of date? <Link href="/contact">Suggest a correction</Link>
        </p>

        <details className="company-profile-context"><summary>About this profile &amp; verification</summary><p>{profile.description}</p><p>{profile.disclaimer}</p></details>

        <nav className="brand-section-nav" aria-label="Brand profile sections">
          <a href="#product-portfolio">Products</a>
          <a href="#competitive-position">Competition</a>
          <a href="#manufacturing-channels">Supply Chain</a>
          <a href="#company-ownership">Ownership</a>
          <a href="#timeline">Timeline</a>
          {hasAnalysis ? <a href="#analysis">Articles &amp; News</a> : null}
          <a href="#sources">Sources</a>
        </nav>
      </div>
    </section>
  );
}
