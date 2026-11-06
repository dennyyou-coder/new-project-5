import { Icon, type IconName } from "@/components/Icon";
import { CompanyMark } from "@/components/ui/CompanyMark";
import { normalizeOptionalBrandText, type BrandProfile } from "@/lib/brands";
import type { BrandMark } from "@/lib/brandMarks";
import { formatBrandDate } from "@/lib/brandDates";
import { buildOwnershipFact } from "@/lib/brandProfileView";

const undisclosedPattern = /^not (disclosed|publicly identified|stated|identified)/i;

/** The always-visible fact sheet beside the company page content. */
export function BrandFactRail({
  profile,
  competitors
}: {
  profile: BrandProfile;
  competitors: BrandMark[];
}) {
  const legalEntity = normalizeOptionalBrandText(profile.legalName);
  const leader = profile.leadership[0];
  const facts: Array<{ label: string; value: string; icon: IconName }> = [
    { label: "Ownership", value: buildOwnershipFact(profile), icon: "user" },
    ...(legalEntity ? [{ label: "Operating company", value: legalEntity, icon: "building" as IconName }] : []),
    ...(leader ? [{ label: leader.role, value: leader.name, icon: "users" as IconName }] : []),
    { label: "Headquarters", value: profile.headquarters, icon: "globe" },
    { label: "Founded", value: profile.founded, icon: "calendar" }
  ];
  const undisclosed = facts.filter(({ value }) => undisclosedPattern.test(value.trim())).map(({ label }) => label);
  if (profile.leadership.length === 0) undisclosed.push("Named leadership");
  const shown = facts.filter(({ value }) => !undisclosedPattern.test(value.trim()));
  const website = profile.officialWebsite.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  return (
    <aside className="bp-rail" aria-label={`${profile.name} fact sheet`}>
      <section className="bp-card bp-facts">
        <h2 className="bp-rail-title">Fact sheet</h2>
        <dl aria-label="Key facts">
          {shown.map(({ label, value, icon }) => (
            <div key={label}>
              <span className="bp-fact-icon"><Icon name={icon} /></span>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div>
            <span className="bp-fact-icon"><Icon name="send" /></span>
            <dt>Website</dt>
            <dd><a href={profile.officialWebsite} rel="noopener noreferrer" target="_blank">{website}</a></dd>
          </div>
          {undisclosed.length ? (
            <div className="bp-fact--undisclosed">
              <span className="bp-fact-icon"><Icon name="file" /></span>
              <dt>Not disclosed</dt>
              <dd>{undisclosed.join(" · ")}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {competitors.length ? (
        <section className="bp-card">
          <h2 className="bp-rail-title">Competes with</h2>
          <div className="bp-rail-marks">
            {competitors.map((mark) => (
              <CompanyMark key={mark.slug ?? mark.name} mark={mark} size="md" link />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bp-card bp-verified">
        <p className="bp-verified-line">✓ Verified {formatBrandDate(profile.lastVerified, "long")}</p>
        <p>First published {formatBrandDate(profile.publishedAt, "long")} · {profile.sources.length} sources</p>
        <details className="company-profile-context">
          <summary>About this profile</summary>
          <p>{profile.description}</p>
          <p>{profile.disclaimer}</p>
        </details>
      </section>
    </aside>
  );
}
