import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { CompanyMark } from "@/components/ui/CompanyMark";
import { BrandVisual } from "@/components/brands/BrandVisual";
import { selectBrandContentVisuals } from "@/components/brands/brandSectionData";
import { normalizeOptionalBrandText, type BrandProfile } from "@/lib/brands";
import { brandMonogram, type BrandMark } from "@/lib/brandMarks";
import {
  buildBrandOverview,
  buildBrandQuickAnswer,
  buildBuyerChecks,
  buildCompetitiveView,
  firstSentence
} from "@/lib/brandProfileView";
import { formatBrandDate } from "@/lib/brandDates";

export type BrandModelCard = { slug: string; name: string; category: string; cover: string; specs: string[] };
export type BrandCompetitorCard = { mark: BrandMark; caption?: string; href: string; linkLabel: string };

function Card({ id, title, icon, action, children }: { id: string; title: string; icon: IconName; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="bp-card brand-content-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="bp-card-head">
        <h2 id={`${id}-title`}><span className="bp-card-icon"><Icon name={icon} /></span>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Splits text into sentences so the overview and the WCB view do not repeat each other. */
function sentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((part) => part.trim()) ?? [text];
}

export function BrandSections({
  profile,
  brandMark,
  parentMark,
  models,
  competitors,
  ownershipAnalysisHref
}: {
  profile: BrandProfile;
  brandMark: BrandMark;
  parentMark?: BrandMark;
  models: BrandModelCard[];
  competitors: BrandCompetitorCard[];
  ownershipAnalysisHref?: string;
}) {
  const visuals = selectBrandContentVisuals(profile.contentVisuals);
  const operationsVisual = visuals.get("operations");
  const quickAnswer = buildBrandQuickAnswer(profile);
  const view = sentences(buildCompetitiveView(profile));
  const written = buildBrandOverview(profile);
  // Without a written overview, the first two sentences of the WCB view open the page.
  const overview = written ?? view.slice(0, 2).join(" ");
  const viewRest = written ? view.join(" ") : view.slice(2).join(" ");
  const legalEntity = normalizeOptionalBrandText(profile.legalName);
  const leader = profile.leadership[0];
  const checks = buildBuyerChecks(profile);

  // Ownership chain: parent or leader → operating company → brand.
  const chain: Array<{ key: string; label: string; node: ReactNode }> = [];
  if (parentMark) {
    chain.push({ key: "parent", label: "Parent company", node: <CompanyMark mark={parentMark} size="sm" link showName /> });
  } else if (leader) {
    chain.push({
      key: "leader",
      label: leader.role,
      node: (
        <span className="bp-person">
          {leader.portrait ? (
            <Image className="bp-person-photo" src={leader.portrait.src} alt={leader.portrait.alt} width={72} height={72} sizes="44px" style={{ objectPosition: leader.portrait.objectPosition || "center top" }} />
          ) : (
            <span className="bp-person-photo bp-person-photo--monogram" aria-hidden="true">{brandMonogram(leader.name)}</span>
          )}
          <b>{leader.name}</b>
        </span>
      )
    });
  }
  if (legalEntity && legalEntity.toLowerCase() !== profile.name.toLowerCase()) {
    chain.push({ key: "entity", label: "Operating company", node: <b className="bp-chain-entity">{legalEntity}</b> });
  }
  chain.push({ key: "brand", label: "Brand", node: <CompanyMark mark={brandMark} size="sm" showName /> });

  return (
    <>
      {quickAnswer ? (
        <section className="bp-card bp-answer" aria-label={`Who owns ${profile.name}`}>
          <p className="bp-answer-question">Who owns {profile.name}?</p>
          <p className="bp-answer-text">{quickAnswer}</p>
          <p className="bp-answer-meta">
            Verified {formatBrandDate(profile.lastVerified, "long")} · {profile.sources.length} sources
            {ownershipAnalysisHref ? <> · <Link href={ownershipAnalysisHref}>Full ownership analysis →</Link></> : null}
          </p>
        </section>
      ) : null}

      <section className={`bp-card bp-overview${profile.heroImage ? "" : " bp-overview--text"}`} id="overview" aria-label="Overview">
        <p>{overview}</p>
        {profile.heroImage ? (
          <figure>
            <img src={profile.heroImage} alt={profile.heroImageAlt || ""} decoding="async" />
            {profile.heroImageCaption ? <figcaption>{profile.heroImageCaption}</figcaption> : null}
          </figure>
        ) : null}
      </section>

      <Card id="company-ownership" title="Ownership" icon="user">
        {chain.length > 1 ? (
          <ol className="bp-chain" aria-label="Ownership chain">
            {chain.map((step) => (
              <li key={step.key}>
                <small>{step.label}</small>
                {step.node}
              </li>
            ))}
          </ol>
        ) : null}
        <p className="bp-text">{profile.ownership.summary}</p>
        {profile.leadership.length > 1 ? (
          <ul className="bp-people" aria-label="Leadership">
            {profile.leadership.map((person) => (
              <li key={person.name}>
                <span className="bp-person-photo bp-person-photo--monogram" aria-hidden="true">{brandMonogram(person.name)}</span>
                <span><b>{person.name}</b><small>{person.role}</small></span>
              </li>
            ))}
          </ul>
        ) : null}
        {leader?.portrait ? (
          <p className="bp-credit">Photo: <a href={leader.portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{leader.portrait.credit}</a></p>
        ) : null}
      </Card>

      <Card
        id="product-portfolio"
        title="Products"
        icon="package"
        action={models.length ? <Link className="bp-card-more" href="/products">Product library →</Link> : undefined}
      >
        {models.length ? (
          <div className="bp-models">
            {models.slice(0, 8).map((model) => (
              <Link key={model.slug} className="bp-model" href={`/products/${model.slug}`}>
                <span className="bp-model-image"><img src={model.cover} alt="" loading="lazy" decoding="async" /></span>
                <span className="bp-model-copy">
                  <small>{model.category}</small>
                  <b>{model.name}</b>
                  {model.specs.length ? <span className="bp-specs">{model.specs.map((spec) => <span key={spec}>{spec}</span>)}</span> : null}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
        <ul className="bp-lines">
          {profile.productPortfolio.map((line) => (
            <li key={line.name}>
              <b>{line.name}</b>
              <span>{firstSentence(line.positioning)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card id="manufacturing-channels" title="Operations" icon="factory">
        <div className="bp-ops">
          <div>
            <h3>Made by</h3>
            <ul>{profile.manufacturingSupplyChain.slice(0, 3).map((item) => <li key={item.evidence}>{firstSentence(item.evidence)}</li>)}</ul>
          </div>
          <div>
            <h3>Sold through</h3>
            <ul>{profile.marketsChannels.slice(0, 3).map((item) => <li key={item.evidence}>{firstSentence(item.evidence)}</li>)}</ul>
          </div>
        </div>
        {operationsVisual ? <div className="bp-ops-visual"><BrandVisual visual={operationsVisual} /></div> : null}
        {checks.length ? (
          <details className="bp-checks" open>
            <summary>For buyers and distributors: what to verify ({checks.length})</summary>
            <ol>{checks.map((check) => <li key={check}>{check}</li>)}</ol>
          </details>
        ) : null}
      </Card>

      <Card id="competitive-position" title="Competition" icon="bar-chart">
        {viewRest ? <p className="bp-text"><b>WCB view:</b> {viewRest}</p> : null}
        {competitors.length ? (
          <div className="bp-competitors">
            {competitors.map((competitor) => (
              <div key={competitor.mark.slug ?? competitor.mark.name} className="bp-competitor">
                <CompanyMark mark={competitor.mark} size="md" />
                <b>{competitor.mark.name}</b>
                {competitor.caption ? <small>{competitor.caption}</small> : null}
                <Link href={competitor.href}>{competitor.linkLabel} →</Link>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </>
  );
}
