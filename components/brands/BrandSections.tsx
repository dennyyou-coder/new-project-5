import Link from "next/link";
import {
  buildBrandCompetitorReferences,
  type BrandProfile
} from "@/lib/brands";

function TextList({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="guides-category-panel">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function BrandSections({
  profile,
  allowedCompetitorSlugs
}: {
  profile: BrandProfile;
  allowedCompetitorSlugs: ReadonlySet<string>;
}) {
  const competitorReferences = buildBrandCompetitorReferences(
    profile.competitivePosition.competitorSlugs,
    allowedCompetitorSlugs
  );

  return (
    <section className="section">
      <div className="insights-page-container">
        <div className="guides-category-grid brand-section-grid">
          {profile.ownership.summary ? (
            <section className="guides-category-panel">
              <h2>Ownership</h2>
              <p>{profile.ownership.summary}</p>
              {profile.ownership.parentCompany ? (
                <p>Parent company: {profile.ownership.parentCompany}</p>
              ) : null}
            </section>
          ) : null}

          {profile.leadership.length > 0 ? (
            <section className="guides-category-panel">
              <h2>Leadership</h2>
              <dl>
                {profile.leadership.map((leader) => (
                  <div key={`${leader.name}-${leader.role}`}>
                    <dt>{leader.name}</dt>
                    <dd>
                      {leader.role}
                      {leader.context ? ` — ${leader.context}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {profile.productPortfolio.length > 0 ? (
            <section className="guides-category-panel">
              <h2>Product Portfolio</h2>
              <dl>
                {profile.productPortfolio.map((product) => (
                  <div key={product.name}>
                    <dt>{product.name}</dt>
                    <dd>{product.positioning}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <TextList
            title="Manufacturing & Supply Chain"
            items={profile.manufacturingSupplyChain}
          />
          <TextList
            title="Markets & Channels"
            items={profile.marketsChannels}
          />

          {profile.competitivePosition.summary ? (
            <section className="guides-category-panel">
              <h2>Competitive Position</h2>
              <p>{profile.competitivePosition.summary}</p>
              {competitorReferences.length > 0 ? (
                <p>
                  Related brand profiles:{" "}
                  {competitorReferences.map((competitor, index) => (
                    <span key={competitor.slug}>
                      {index > 0 ? ", " : ""}
                      {competitor.href ? (
                        <Link href={competitor.href}>{competitor.slug}</Link>
                      ) : competitor.slug}
                    </span>
                  ))}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
