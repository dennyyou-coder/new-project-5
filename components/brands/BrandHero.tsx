import Link from "next/link";
import { ShareBar } from "@/components/share/ShareBar";
import type { BrandProfile } from "@/lib/brands";
import { formatBrandDate } from "@/lib/brandDates";
import { getBrandCategoryForProfile } from "@/lib/brandCategories";
import { buildBrandTagline } from "@/lib/brandProfileView";
import { TallyButton } from "@/components/LeadForms";
import { BrandLogo } from "./BrandLogo";

/**
 * Company page header: logo, name, one-line identity, chips, actions and
 * the sticky section tabs. Facts live in the side rail (BrandFactRail).
 */
export function BrandHero({
  profile,
  modelCount,
  hasAnalysis
}: {
  profile: BrandProfile;
  modelCount: number;
  hasAnalysis: boolean;
}) {
  const category = getBrandCategoryForProfile(profile.slug);
  const tagline = buildBrandTagline(profile, category?.name);

  return (
    <>
      <section className="bp-band" aria-labelledby="bp-name">
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

          <div className="bp-identity">
            <div className="brand-hero-identity">
              <BrandLogo profile={profile} variant="hero" />
            </div>
            <div className="bp-identity-copy">
              <p className="eyebrow">Independent Brand Intelligence</p>
              <h1 id="bp-name">{profile.name}</h1>
              <p className="bp-tagline">{tagline}</p>
              <ul className="bp-chips" aria-label="Profile highlights">
                {category ? (
                  <li><Link className="bp-chip bp-chip--key" href={`/brands/${category.slug}`}>{category.name}</Link></li>
                ) : null}
                {modelCount > 0 ? <li><a className="bp-chip" href="#product-portfolio">{modelCount} {modelCount === 1 ? "model" : "models"} tracked</a></li> : null}
                <li><span className="bp-chip">Verified {formatBrandDate(profile.lastVerified, "long")}</span></li>
              </ul>
            </div>
            <div className="bp-actions">
              <a className="bp-button bp-button--primary" href={profile.officialWebsite} rel="noopener noreferrer" target="_blank">
                Official site ↗
              </a>
              <TallyButton className="bp-button" ctaLocation={`brand_follow_${profile.slug}`} form="newsletter">
                Follow updates
              </TallyButton>
              <Link className="bp-button" href="/contact?inquiry=correction#project-form">Suggest a correction</Link>
            </div>
            <ShareBar className="bp-share" title={`${profile.name}: company profile`} url={`https://worldcleanbiz.com/brands/${profile.slug}`} />
          </div>
        </div>
      </section>

      <nav className="brand-section-nav brand-section-nav--sticky" aria-label="Brand profile sections">
        <div className="insights-page-container">
          <a href="#overview">Overview</a>
          <a href="#company-ownership">Ownership</a>
          <a href="#product-portfolio">Products</a>
          <a href="#manufacturing-channels">Operations</a>
          <a href="#competitive-position">Competition</a>
          <a href="#timeline">Timeline</a>
          {hasAnalysis ? <a href="#analysis">News &amp; analysis</a> : null}
          <a href="#sources">Sources</a>
        </div>
      </nav>
    </>
  );
}
