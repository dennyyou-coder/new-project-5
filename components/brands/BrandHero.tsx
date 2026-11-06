import Link from "next/link";
import {
  normalizeOptionalBrandText,
  type BrandProfile
} from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";
import { getBrandCategoryForProfile } from "@/lib/brandCategories";
import { buildBrandQuickAnswer, buildOwnershipFact } from "@/lib/brandProfileView";
import { Icon, type IconName } from "@/components/Icon";
import { BrandLogo } from "./BrandLogo";

const undisclosedPattern = /^not (disclosed|publicly identified|stated|identified)/i;
const isUndisclosed = (detail: unknown) => typeof detail === "string" && undisclosedPattern.test(detail.trim());

export function BrandHero({ profile, hasAnalysis }: { profile: BrandProfile; hasAnalysis: boolean }) {
  const category = getBrandCategoryForProfile(profile.slug);
  const legalName = normalizeOptionalBrandText(profile.legalName);
  const legalEntityNote = normalizeOptionalBrandText(profile.legalEntityNote);
  const legalEntityScope = legalName || legalEntityNote;
  const quickAnswer = buildBrandQuickAnswer(profile);
  const ownershipFact = buildOwnershipFact(profile);

  // The four facts readers look for first, each with an icon.
  const primaryFacts: Array<{ fact: string; detail: string; icon: IconName }> = [
    { fact: "Ownership", detail: ownershipFact, icon: "user" },
    { fact: "Headquarters", detail: profile.headquarters, icon: "building" },
    { fact: "Founded", detail: profile.founded, icon: "calendar" },
    { fact: "Main businesses", detail: profile.productPortfolio.map((item) => item.name).join(" · "), icon: "layers" }
  ];
  // Facts the reviewed sources do not state are listed together in one line.
  const undisclosed = primaryFacts.filter(({ detail }) => isUndisclosed(detail)).map(({ fact }) => fact);
  if (profile.leadership.length === 0) undisclosed.push("Named leadership");
  const shownFacts = primaryFacts.filter(({ detail }) => !isUndisclosed(detail));

  return (
    <>
    <section className="brand-profile-top">
      <div className="insights-page-container">
        <nav className="blog-visible-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/brands">Companies</Link>
          <span>/</span>
          {category ? (
            <>
              <Link href={`/brands/${category.slug}`}>{category.name}</Link>
              <span>/</span>
            </>
          ) : null}
          <span>{profile.name}</span>
        </nav>

        <div className="brand-profile-hero">
          <div className="brand-profile-identity">
            <div className="brand-hero-identity">
              <BrandLogo profile={profile} variant="hero" />
            </div>
            <p className="eyebrow">Independent Brand Intelligence</p>
            <h1>{profile.name}</h1>
            {category ? (
              <Link className="brand-category-link" href={`/brands/${category.slug}`}>
                {category.name}
              </Link>
            ) : null}
            {quickAnswer ? (
              <div className="brand-quick-answer">
                <p className="brand-quick-answer__question">Who owns {profile.name}?</p>
                <p className="brand-quick-answer__text">{quickAnswer}</p>
                <p className="brand-quick-answer__meta">
                  Last verified {formatBrandDate(profile.lastVerified, "long")} · {profile.sources.length} sources ·{" "}
                  <a href="#company-ownership">Ownership details</a>
                </p>
              </div>
            ) : (
              <p className="company-positioning">{profile.headline}</p>
            )}
          </div>

          {profile.heroImage ? (
            <figure className="brand-hero-media">
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
          <dl className="brand-fact-cards" aria-label="Key facts">
            {shownFacts.map(({ fact, detail, icon }) => (
              <div key={fact}>
                <span className="brand-fact-icon"><Icon name={icon} /></span>
                <dt>{fact}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
          <dl className="brand-fact-line">
            {legalEntityScope ? (
              <div><dt>Legal entity</dt><dd>{legalEntityScope}</dd></div>
            ) : null}
            <div>
              <dt>Official website</dt>
              <dd>
                <a href={profile.officialWebsite} rel="noopener noreferrer">
                  {profile.officialWebsite.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </dd>
            </div>
            {undisclosed.length ? (
              <div><dt>Not disclosed</dt><dd>{undisclosed.join(" · ")} (not stated in the reviewed sources)</dd></div>
            ) : null}
            <div>
              <dt>Profile</dt>
              <dd>
                First published {formatBrandDate(profile.publishedAt, "long")}
                {quickAnswer ? null : ` · Last verified ${formatBrandDate(profile.lastVerified, "long")}`} ·{" "}
                <Link href="/contact?inquiry=correction#project-form">Suggest a correction</Link>
              </dd>
            </div>
          </dl>
        </div>

        <details className="company-profile-context"><summary>About this profile &amp; verification</summary><p>{profile.description}</p><p>{profile.disclaimer}</p></details>
      </div>
    </section>

    <nav className="brand-section-nav brand-section-nav--sticky" aria-label="Brand profile sections">
        <div className="insights-page-container">
          <a href="#company-ownership">Ownership</a>
          <a href="#product-portfolio">Products</a>
          <a href="#manufacturing-channels">Manufacturing</a>
          <a href="#competitive-position">Competition</a>
          <a href="#timeline">Timeline</a>
          {hasAnalysis ? <a href="#analysis">Articles &amp; News</a> : null}
          <a href="#sources">Sources</a>
        </div>
    </nav>
    </>
  );
}
