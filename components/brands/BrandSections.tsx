import Link from "next/link";
import { BrandAdditionalPhoto } from "./BrandAdditionalPhoto";
import { ProductLinks } from "@/components/products/ProductLinks";
import { BrandDataTable } from "@/components/brands/BrandDataTable";
import { BrandFounderCard } from "@/components/brands/BrandFounderCard";
import { BrandVisual } from "@/components/brands/BrandVisual";
import { CompanyMark } from "@/components/ui/CompanyMark";
import type { BrandMark } from "@/lib/brandMarks";
import {
  buildLeadershipRows,
  partitionFeaturedLeadership,
  selectBrandContentVisuals
} from "@/components/brands/brandSectionData";
import {
  buildBrandCompetitorReferences,
  type BrandContentVisual,
  type BrandProfile
} from "@/lib/brands";

function sectionLayoutClassName(visual?: BrandContentVisual) {
  return visual
    ? "brand-section-layout brand-section-layout--visual"
    : "brand-section-layout";
}

export function BrandSections({
  profile,
  allowedCompetitorSlugs,
  brandMark,
  parentMark,
  markIndex
}: {
  profile: BrandProfile;
  allowedCompetitorSlugs: ReadonlySet<string> | ReadonlyMap<string, string>;
  brandMark: BrandMark;
  parentMark?: BrandMark;
  markIndex?: ReadonlyMap<string, BrandMark>;
}) {
  const visualByPlacement = selectBrandContentVisuals(profile.contentVisuals);
  const ownershipVisual = visualByPlacement.get("ownership");
  const portfolioVisual = visualByPlacement.get("portfolio");
  const operationsVisual = visualByPlacement.get("operations");
  const competitionVisual = visualByPlacement.get("competition");
  const competitorReferences = buildBrandCompetitorReferences(
    profile.competitivePosition.competitorSlugs,
    allowedCompetitorSlugs
  );
  const { featuredLeader, tableLeaders } = partitionFeaturedLeadership(
    profile.leadership
  );

  return (
    <section className="section">
      <div className="insights-page-container">
        <div className="brand-content-sections">
          <section className="brand-content-section" id="company-ownership">
            <h2>Company &amp; Ownership</h2>
            <div className={sectionLayoutClassName(ownershipVisual)}>
              <div className="brand-section-main">
                {parentMark ? (
                  <div className="brand-ownership-chain" aria-label="Ownership">
                    <CompanyMark mark={parentMark} size="sm" link showName caption="Parent company" />
                    <span className="brand-ownership-chain__arrow" aria-hidden="true">→</span>
                    <CompanyMark mark={brandMark} size="sm" showName caption="Brand" />
                  </div>
                ) : null}
                <div className={profile.slug === "miele" ? "company-ownership-intro" : undefined}><div className="company-ownership-copy">
                <p className="brand-section-summary">{profile.ownership.summary}</p>
                {profile.ownership.parentCompany && !parentMark ? (
                  <p className="brand-section-parent">
                    <strong>Parent company:</strong>{" "}
                    {profile.ownership.parentCompany}
                  </p>
                ) : null}
                </div><BrandAdditionalPhoto slug={profile.slug} placement="ownership" /></div>
                <div className="company-leadership">
                <h3>Leadership</h3>
                <div className="brand-table-group">
                  {featuredLeader ? (
                    <BrandFounderCard leader={featuredLeader} />
                  ) : null}
                  {!featuredLeader || tableLeaders.length > 0 ? (
                    <BrandDataTable
                      caption="Leadership"
                      columns={[
                        { key: "person", label: "Person" },
                        { key: "role", label: "Role" },
                        { key: "evidenceNote", label: "Source note" }
                      ]}
                      rows={buildLeadershipRows(tableLeaders)}
                    />
                  ) : null}
                </div>
                </div>
              </div>
              {ownershipVisual ? <BrandVisual visual={ownershipVisual} /> : null}
            </div>
          </section>

          <section className="brand-content-section" id="product-portfolio">
            <h2>Product Portfolio</h2>
            <div className={sectionLayoutClassName(portfolioVisual)}>
              <div className="brand-section-main">
                <BrandDataTable
                  caption="Product portfolio"
                  columns={[
                    { key: "category", label: "Category" },
                    { key: "positioning", label: "Positioning" },
                    { key: "buyerRelevance", label: "What to check" }
                  ]}
                  rows={profile.productPortfolio.map((product) => ({
                    category: product.name,
                    positioning: product.positioning,
                    buyerRelevance:
                      product.buyerRelevance ||
                      "Review model and regional fit for the intended assortment."
                  }))}
                />
              </div>
              {portfolioVisual || profile.slug === "miele" ? <div className="company-portfolio-visuals">{portfolioVisual ? <BrandVisual visual={portfolioVisual} /> : null}<BrandAdditionalPhoto slug={profile.slug} placement="portfolio" /></div> : null}
            </div>
          </section>
          <ProductLinks brand={profile.slug} />

          <section className="brand-content-section" id="manufacturing-channels">
            <h2>Manufacturing &amp; Channels</h2>
            <div className="brand-section-layout brand-section-layout--operations">
              {operationsVisual ? <BrandVisual visual={operationsVisual} /> : null}
              <div className="brand-section-tables">
                <div className="brand-table-group">
                  <h3>Manufacturing &amp; Supply Chain</h3>
                  <BrandDataTable
                    caption="Manufacturing and supply-chain evidence"
                    columns={[
                      { key: "evidence", label: "What we found" },
                      { key: "scope", label: "Where it applies" },
                      { key: "buyerCheck", label: "What to check" }
                    ]}
                    rows={profile.manufacturingSupplyChain.map((item) => ({
                      evidence: item.evidence,
                      scope: item.scope,
                      buyerCheck: item.buyerCheck
                    }))}
                  />
                </div>
                <div className="brand-table-group">
                  <h3>Markets &amp; Channels</h3>
                  <BrandDataTable
                    caption="Markets and channels evidence"
                    columns={[
                      { key: "evidence", label: "What we found" },
                      { key: "scope", label: "Where it applies" },
                      { key: "buyerCheck", label: "What to check" }
                    ]}
                    rows={profile.marketsChannels.map((item) => ({
                      evidence: item.evidence,
                      scope: item.scope,
                      buyerCheck: item.buyerCheck
                    }))}
                  />
                </div>
              </div>
            </div>
            <BrandAdditionalPhoto slug={profile.slug} placement="manufacturing" />
          </section>

          <section className="brand-content-section" id="competitive-position">
            <h2>Competitive Position</h2>
            <div className={sectionLayoutClassName(competitionVisual)}>
              <div className="brand-section-main">
                <p className="brand-section-summary">
                  {profile.competitivePosition.summary}
                </p>
                {competitorReferences.length > 0 ? (
                  <div className="brand-competitor-links">
                    <strong>Related brand profiles</strong>
                    <div>
                      {competitorReferences.map((competitor) => {
                        const mark = competitor.href ? markIndex?.get(competitor.slug) : undefined;
                        return (
                          <span key={competitor.slug}>
                            {mark ? (
                              <CompanyMark mark={mark} size="xs" link showName />
                            ) : competitor.href ? (
                              <Link href={competitor.href}>{competitor.name ?? competitor.slug}</Link>
                            ) : competitor.slug}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
              {competitionVisual ? (
                <BrandVisual visual={competitionVisual} />
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
