import type { Metadata } from "next";
import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
import { RadarHero } from "@/components/radar/RadarHero";
import { SECTORS, shortDate } from "@/lib/radar/classify";
import { daysUntil, recentRules, upcomingRules, type RuleDate } from "@/lib/radar/rules";
import "../styles/tools.css";
import "../styles/radar.css";

export const metadata: Metadata = {
  title: "Trade and Product Rules Calendar for Appliances and Power Tools",
  description:
    "US tariff deadlines, the FCC robot rule and EU regulations for appliances, cleaning machines and power tools: the Machinery Regulation, Batteries Regulation, Cyber Resilience Act and more, with days to go.",
  alternates: { canonical: "/rules-calendar" }
};

// Keeps the countdowns current without a deploy.
export const revalidate = 86400;

function Rule({ rule, upcoming }: { rule: RuleDate; upcoming: boolean }) {
  const days = daysUntil(rule.date);
  return (
    <li className="radar-rule">
      <div className="radar-rule-date">
        <strong>{shortDate(rule.date)}</strong>
        {upcoming ? <span>{days === 0 ? "Today" : `in ${days} day${days === 1 ? "" : "s"}`}</span> : null}
      </div>
      <div className="radar-rule-body">
        <div className="radar-item-meta">
          <span className={`radar-badge is-${rule.region.toLowerCase()}`}>{rule.region}</span>
          {rule.sectors.length === 3 ? <span className="radar-sector">All sectors</span> : rule.sectors.map((sector) => <span key={sector} className="radar-sector">{SECTORS.find((item) => item.value === sector)?.label}</span>)}
          {rule.reported ? <span className="radar-sector is-reported">Reported, not yet published</span> : null}
        </div>
        <h3>{rule.title}</h3>
        <p>{rule.detail}</p>
        {rule.href ? <Link href={rule.href}>Details →</Link> : null}
      </div>
    </li>
  );
}

export default function RulesCalendarPage() {
  const upcoming = upcomingRules();
  const recent = recentRules();
  return (
    <div className="tool-page radar-page">
      <RadarHero
        title="Trade and product rules calendar"
        lead="The dates that change what it costs to sell appliances, cleaning machines and power tools in the US and Europe, and what the products must do."
        updated="10 Nov 2026"
        sources="USTR, FCC, EUR-Lex and WCB reporting"
      />
      <section className="tool-body">
        <div className="container radar-layout">
          <div>
            <h2 className="radar-h2">Coming up</h2>
            <ol className="radar-rules">{upcoming.map((rule) => <Rule key={rule.id} rule={rule} upcoming />)}</ol>
            <h2 className="radar-h2">Recently in force</h2>
            <ol className="radar-rules is-past">{recent.map((rule) => <Rule key={rule.id} rule={rule} upcoming={false} />)}</ol>
          </div>
          <aside className="radar-aside">
            <div className="radar-card">
              <h2>Never miss a deadline</h2>
              <p>Rule changes and new dates go out in the WCB weekly brief every Friday.</p>
              <TallyButton className="radar-button" ctaLocation="rules_calendar_alerts" form="newsletter">Get the weekly brief</TallyButton>
            </div>
            <div className="radar-card">
              <h2>Work out what it means for you</h2>
              <Link href="/tools/landed-cost-calculator">Landed cost and tariff calculator →</Link>
              <Link href="/tools/export-compliance-checklist">Export compliance checklist →</Link>
              <Link href="/recalls">Product recall tracker →</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
