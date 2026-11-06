import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import type { BrandProfile } from "@/lib/brands";
import { buildBrandQuickAnswer, buildOwnershipFact } from "@/lib/brandProfileView";
import { LogoTileImage } from "@/components/ui/LogoTileImage";

/**
 * "At a glance" card for ownership guides: the company's logo, the short
 * ownership answer and three facts from its profile, linking to the profile.
 */
export function ArticleCompanyCard({ profile }: { profile: BrandProfile }) {
  const answer = buildBrandQuickAnswer(profile);
  const facts: Array<{ label: string; value: string; icon: IconName }> = [
    { label: "Ownership", value: buildOwnershipFact(profile), icon: "user" },
    { label: "Headquarters", value: profile.headquarters, icon: "building" },
    { label: "Founded", value: profile.founded, icon: "calendar" }
  ];

  return (
    <aside className="article-company-card" aria-labelledby="article-company-card-title">
      <div className="article-company-card__head">
        <span className="article-company-card__logo">
          <LogoTileImage slug={profile.slug} fallbackSrc={profile.logoImage} alt={profile.logoImageAlt} boxRatio={1.85} eager />
        </span>
        <div>
          <p className="article-company-card__eyebrow">Company at a glance</p>
          <h2 id="article-company-card-title">{profile.name}</h2>
        </div>
      </div>
      {answer ? <p className="article-company-card__answer">{answer}</p> : null}
      <dl className="article-company-card__facts">
        {facts.map((fact) => (
          <div key={fact.label}>
            <span className="article-company-card__icon"><Icon name={fact.icon} /></span>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <Link className="article-company-card__link" href={`/brands/${profile.slug}`}>
        Full {profile.name} company profile →
      </Link>
    </aside>
  );
}
