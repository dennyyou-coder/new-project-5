import Link from "next/link";
import { BrandDataTable } from "@/components/brands/BrandDataTable";
import { BrandVisual } from "@/components/brands/BrandVisual";
import {
  buildLeadershipRows,
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
  allowedCompetitorSlugs
}: {
  profile: BrandProfile;
  allowedCompetitorSlugs: ReadonlySet<string>;
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

  return (
    <section className="section">
      <div className="insights-page-container">
        <div className="brand-content-sections">
          <section className="brand-content-section" id="company-ownership">
            <h2>Company &amp; Ownership</h2>
            <div className={sectionLayoutClassName(ownershipVisual)}>
              <div className="brand-section-main">
                <p className="brand-section-summary">{profile.ownership.summary}</p>
                {profile.ownership.parentCompany ? (
                  <p className="brand-section-parent">
                    <strong>Parent company:</strong>{" "}
                    {profile.ownership.parentCompany}
                  </p>
                ) : null}
                <div className="brand-table-group">
                  <h3>Leadership</h3>
                  <BrandDataTable
                    caption="Leadership"
                    columns={[
                      { key: "person", label: "Person" },
                      { key: "role", label: "Role" },
                      { key: "evidenceNote", label: "Evidence note" }
                    ]}
                    rows={buildLeadershipRows(profile.leadership)}
                  />
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
                    { key: "buyerRelevance", label: "Buyer relevance" }
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
              {portfolioVisual ? <BrandVisual visual={portfolioVisual} /> : null}
            </div>
          </section>

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
                      { key: "evidence", label: "Evidence" },
                      { key: "scope", label: "Scope" },
                      { key: "buyerCheck", label: "Buyer check" }
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
                      { key: "evidence", label: "Evidence" },
                      { key: "scope", label: "Scope" },
                      { key: "buyerCheck", label: "Buyer check" }
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
                      {competitorReferences.map((competitor) => (
                        <span key={competitor.slug}>
                          {competitor.href ? (
                            <Link href={competitor.href}>{competitor.slug}</Link>
                          ) : competitor.slug}
                        </span>
                      ))}
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
