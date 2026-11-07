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
  firstSentence,
  splitSentences
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
  const ownershipVisual = visuals.get("ownership");
  const portfolioVisual = visuals.get("portfolio");
  const competitionVisual = visuals.get("competition");
  const ownershipSentences = splitSentences(profile.ownership.summary);
  const ownershipLead = ownershipSentences.slice(0, 2).join(" ");
  const ownershipRest = ownershipSentences.slice(2).join(" ");
  const quickAnswer = buildBrandQuickAnswer(profile);
  const view = splitSentences(buildCompetitiveView(profile));
  const written = buildBrandOverview(profile);
  // Without a written overview, the first two sentences of the WCB view open the page.
  const overview = written ?? view.slice(0, 2).join(" ");
  const viewRest = (written ? view : view.slice(2)).slice(0, 2).join(" ");
  const legalEntity = normalizeOptionalBrandText(profile.legalName);
  const leader = profile.leadership[0];
  const checks = buildBuyerChecks(profile);
  // The chain already shows the first leader when there is no parent company.
  const chainLeader = !parentMark && leader ? leader : undefined;
  const otherLeaders = profile.leadership.filter((person) => person !== chainLeader);

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
            {ownershipAnalysisHref ? <> · <Link className="wcb-more" href={ownershipAnalysisHref}>Full ownership analysis</Link></> : null}
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
        <div className={ownershipVisual ? "bp-split" : undefined}>
          <div>
            <p className="bp-text">{ownershipLead}</p>
            {ownershipRest ? (
              <details className="bp-more">
                <summary>Full ownership note</summary>
                <p className="bp-text">{ownershipRest}</p>
              </details>
            ) : null}
            {otherLeaders.length && profile.leadership.length > 1 ? (
              <ul className="bp-people" aria-label="Leadership">
                {otherLeaders.map((person) => (
                  <li key={person.name}>
                    {person.portrait ? (
                      <Image className="bp-person-photo" src={person.portrait.src} alt={person.portrait.alt} width={128} height={128} sizes="64px" style={{ objectPosition: person.portrait.objectPosition || "center top" }} />
                    ) : (
                      <span className="bp-person-photo bp-person-photo--monogram" aria-hidden="true">{brandMonogram(person.name)}</span>
                    )}
                    <span><b>{person.name}</b><small>{person.role}</small></span>
                  </li>
                ))}
              </ul>
            ) : null}
            {profile.leadership.some((person) => person.portrait) ? (
              <p className="bp-credit">
                Photos:{" "}
                {profile.leadership.filter((person) => person.portrait).map((person, index) => (
                  <span key={person.name}>
                    {index > 0 ? "; " : ""}
                    {person.name}: <a href={person.portrait!.sourceUrl} target="_blank" rel="noopener noreferrer">{person.portrait!.credit}</a>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          {ownershipVisual ? <BrandVisual visual={ownershipVisual} /> : null}
        </div>
      </Card>

      <Card
        id="product-portfolio"
        title="Products"
        icon="package"
        action={models.length ? <Link className="bp-card-more wcb-more" href="/products">Product library</Link> : undefined}
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
        {portfolioVisual ? <div className="bp-ops-visual"><BrandVisual visual={portfolioVisual} /></div> : null}
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
          <details className="bp-checks">
            <summary>For buyers and distributors: what to verify ({checks.length})</summary>
            <ol>{checks.map((check) => <li key={check}>{check}</li>)}</ol>
          </details>
        ) : null}
      </Card>

      <Card id="competitive-position" title="Competition" icon="bar-chart">
        <div className={competitionVisual ? "bp-split" : undefined}>
          <div>
            {viewRest ? <p className="bp-text"><b>WCB view:</b> {viewRest}</p> : null}
            {competitors.length ? (
              <div className={`bp-competitors${competitors.length % 3 === 0 ? "" : " bp-competitors--pairs"}`}>
                {competitors.map((competitor) => (
                  <Link key={competitor.mark.slug ?? competitor.mark.name} className="bp-competitor" href={competitor.href}>
                    <CompanyMark mark={competitor.mark} size="md" />
                    <b>{competitor.mark.name}</b>
                    {competitor.caption ? <small>{competitor.caption}</small> : null}
                    <span className="wcb-more-label">{competitor.linkLabel}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {competitionVisual ? <BrandVisual visual={competitionVisual} /> : null}
        </div>
      </Card>
    </>
  );
}
