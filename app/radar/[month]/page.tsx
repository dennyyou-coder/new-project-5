import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TallyButton } from "@/components/LeadForms";
import { CiteNote, DatasetSchema } from "@/components/radar/DatasetSchema";
import { SECTORS, recallName, shortDate } from "@/lib/radar/classify";
import { getFccCompanies, getFccFilings, getRecalls } from "@/lib/radar/data";
import { FILING_TYPE_LABELS, fccIdUrl } from "@/lib/radar/fcc";
import { MONTHLY_ISSUES, SECTOR_ORDER, buildMonthlyRadar, getIssue, monthLabel, monthShort, shiftMonth } from "@/lib/radar/monthly";
import { RULE_DATES } from "@/lib/radar/rules";
import "../../styles/tools.css";
import "../../styles/radar.css";

type Props = { params: Promise<{ month: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return MONTHLY_ISSUES.map(({ month }) => ({ month }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const label = monthLabel(month);
  return {
    title: `Recalls and FCC Filings, ${label}: Appliances, Cleaning and Power Tools`,
    description: `The ${label} US and EU recalls of appliances, cleaning machines and power tools, new FCC filings from robot and appliance makers, and the trade rule dates ahead.`,
    alternates: { canonical: `/radar/${month}` }
  };
}

const COVERED_LIST_MONTH = "2026-07";
const sectorLabel = (value: string) => SECTORS.find((sector) => sector.value === value)?.label ?? value;
const SECTOR_SHORT: Record<string, string> = { cleaning: "Cleaning", appliances: "Home appliances", tools: "Tools and outdoor" };

function Bars({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <ul className="rm-bars">
      {rows.map((row) => (
        <li key={row.label}>
          <span>{row.label}</span>
          <i style={{ width: `${(row.count / max) * 100}%` }} className={row.count ? undefined : "is-zero"} />
          <b>{row.count}</b>
        </li>
      ))}
    </ul>
  );
}

function RobotChart({ trend, month, makers }: { trend: { month: string; count: number }[]; month: string; makers: number }) {
  const w = 560;
  const h = 230;
  const pad = { top: 46, right: 8, bottom: 30, left: 8 };
  const max = Math.max(1, ...trend.map((point) => point.count));
  const step = (w - pad.left - pad.right) / trend.length;
  const bar = step * 0.62;
  const y = (count: number) => pad.top + (h - pad.top - pad.bottom) * (1 - count / max);
  const ruleIndex = trend.findIndex((point) => point.month === COVERED_LIST_MONTH);
  return (
    <figure className="rm-chart">
      <figcaption>
        <strong>FCC grants to the robot makers WCB tracks, by month</strong>
        <span>{makers} makers of robot vacuums, mowers and commercial robots, including Roborock, Ecovacs, SharkNinja and Mammotion</span>
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={trend.map((point) => `${monthShort(point.month)}: ${point.count}`).join(", ")}>
        <line x1={pad.left} x2={w - pad.right} y1={h - pad.bottom} y2={h - pad.bottom} className="rm-axis" />
        {ruleIndex >= 0 && (
          <g>
            <line x1={pad.left + step * (ruleIndex + 0.95)} x2={pad.left + step * (ruleIndex + 0.95)} y1={2} y2={h - pad.bottom} className="rm-rule" />
            <text x={pad.left + step * (ruleIndex + 0.95) - 6} y={14} className="rm-rule-label">Covered List, 28 Jul</text>
          </g>
        )}
        {trend.map((point, i) => {
          const x = pad.left + step * i + (step - bar) / 2;
          const top = y(point.count);
          return (
            <g key={point.month}>
              <rect x={x} y={top} width={bar} height={h - pad.bottom - top} rx={2} className={point.month === month ? "rm-bar is-current" : point.month > COVERED_LIST_MONTH ? "rm-bar is-after" : "rm-bar"} />
              <text x={x + bar / 2} y={top - 6} className="rm-value">{point.count}</text>
              <text x={x + bar / 2} y={h - pad.bottom + 18} className="rm-month">{monthShort(point.month)}</text>
            </g>
          );
        })}
      </svg>
      <p className="rm-source">Source: FCC Equipment Authorization System, compiled by World Clean Biz</p>
    </figure>
  );
}

export default async function RadarMonthPage({ params }: Props) {
  const { month } = await params;
  const issue = getIssue(month);
  if (!issue) notFound();
  const label = monthLabel(month);
  const report = buildMonthlyRadar(month, { recalls: getRecalls(), filings: getFccFilings(), companies: getFccCompanies(), rules: RULE_DATES });
  const companies = new Map(getFccCompanies().map((company) => [company.name, company]));
  const previous = getIssue(shiftMonth(month, -1));
  const next = getIssue(shiftMonth(month, 1));
  const robotFilings = report.robotTrend.at(-1)?.count ?? 0;
  const monthEnd = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).toISOString().slice(0, 10);

  return (
    <div className="tool-page radar-page">
      <section className="tool-hero">
        <div className="container">
          <p className="tool-crumbs">
            <Link href="/tools">Tools</Link> <span aria-hidden="true">/</span> Industry radar <span aria-hidden="true">/</span> Monthly report
          </p>
          <h1>Recalls and FCC filings: {label}</h1>
          <p className="tool-hero-lead">US and EU recalls and new FCC filings for appliance, cleaning and power tool makers, with the rule dates ahead.</p>
          <p className="tool-updated">Published {shortDate(issue.published)} · US CPSC, EU Safety Gate and the FCC</p>
        </div>
      </section>
      <section className="tool-body">
        <div className="container">
          <div className="radar-stats">
            <div><strong>{report.recalls.length}</strong><span>recalls and safety alerts</span></div>
            <div><strong>{report.us} / {report.eu}</strong><span>US / EU</span></div>
            <div><strong>{report.china} of {report.withOrigin}</strong><span>made in China, where the notice says</span></div>
            <div><strong>{report.bySector.cleaning}</strong><span>cleaning appliances recalled</span></div>
            <div><strong>{report.filings.length}</strong><span>FCC grants to tracked makers</span></div>
            <div><strong>{robotFilings}</strong><span>of them to robot makers</span></div>
          </div>

          <div className="radar-layout">
            <div className="rm-main">
              <div className="rm-brief"><h2>The month in brief</h2><p>{issue.summary}</p></div>
              <h2 className="radar-h2">Recalls and safety alerts</h2>
              <div className="rm-pair">
                <div className="rm-panel">
                  <h3>By sector</h3>
                  <Bars rows={SECTOR_ORDER.map((sector) => ({ label: SECTOR_SHORT[sector], count: report.bySector[sector] }))} />
                </div>
                <div className="rm-panel">
                  <h3>By hazard</h3>
                  <Bars rows={report.hazards.slice(0, 5)} />
                  <p className="rm-note">A notice can name more than one hazard.</p>
                </div>
              </div>
              <div className="radar-table-wrap">
                <table className="radar-table rm-table">
                  <thead><tr><th>Date</th><th>Product</th><th>Hazard</th><th>Made in</th></tr></thead>
                  <tbody>
                    {report.recalls.map((recall) => (
                      <tr key={recall.id}>
                        <td className="rm-date"><span className={`radar-badge ${recall.source === "CPSC" ? "is-us" : "is-eu"}`}>{recall.source === "CPSC" ? "US" : "EU"}</span>{shortDate(recall.date).replace(/ \d{4}$/, "")}</td>
                        <td><a href={recall.url}>{recallName(recall)}</a><small>{sectorLabel(recall.sector)}{recall.units ? ` · ${recall.units} units` : ""}</small></td>
                        <td>{recall.risk ?? recall.hazard}</td>
                        <td>{recall.madeIn ?? "Not stated"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="radar-h2">FCC filings</h2>
              <RobotChart trend={report.robotTrend} month={month} makers={getFccCompanies().filter((company) => company.robotMaker).length} />
              {report.filings.length > 0 ? (
                <div className="radar-table-wrap">
                  <table className="radar-table rm-table">
                    <thead><tr><th>Date</th><th>Company</th><th>Filing</th><th>Radios</th></tr></thead>
                    <tbody>
                      {report.filings.map((filing) => {
                        const company = companies.get(filing.company);
                        return (
                          <tr key={filing.fccId}>
                            <td className="rm-date">{shortDate(filing.date).replace(/ \d{4}$/, "")}</td>
                            <td>{company?.profile ? <Link href={`/brands/${company.profile}`}>{filing.company}</Link> : filing.company}<small><a href={fccIdUrl(filing.fccId)}>{filing.fccId}</a></small></td>
                            <td>{FILING_TYPE_LABELS[filing.type]}</td>
                            <td>{filing.bands.join(", ") || "Not stated"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rm-note">No new FCC grants from the companies WCB tracks this month.</p>
              )}

              {report.ahead.length > 0 && (
                <>
                  <h2 className="radar-h2">Coming up in the next three months</h2>
                  <ul className="rm-ahead">
                    {report.ahead.map((rule) => (
                      <li key={rule.id}>
                        <span className="rm-ahead-date">{shortDate(rule.date)}</span>
                        <span className={`radar-badge is-${rule.region.toLowerCase()}`}>{rule.region}</span>
                        <span>
                          {rule.href ? <Link href={rule.href}>{rule.title}</Link> : <strong>{rule.title}</strong>}
                          {rule.reported && <em> · reported, not yet official</em>}
                          <small>{rule.detail}</small>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside className="radar-aside">
              <div className="radar-card">
                <h2>Every recall, as it happens</h2>
                <p>This report sums up the month. The trackers are updated every week.</p>
                <Link href="/recalls">Product recall tracker →</Link>
                <Link href="/launch-radar">Launch radar: FCC filings →</Link>
                <Link href="/rules-calendar">Trade and product rules calendar →</Link>
              </div>
              <div className="radar-card">
                <h2>Get the next report</h2>
                <p>The monthly report and new recalls in your categories, in the WCB weekly brief every Friday.</p>
                <TallyButton className="radar-button" ctaLocation="radar_monthly" form="newsletter">Get the weekly brief</TallyButton>
              </div>
              {(previous || next) && (
                <div className="radar-card rm-issues">
                  <h2>Other months</h2>
                  {previous && <Link href={`/radar/${previous.month}`}>← {monthLabel(previous.month)}</Link>}
                  {next && <Link href={`/radar/${next.month}`}>{monthLabel(next.month)} →</Link>}
                </div>
              )}
              <div className="radar-card radar-method">
                <h2>How this report is built</h2>
                <p>
                  Recalls come from the US Consumer Product Safety Commission and the EU Safety Gate weekly reports, limited to cleaning appliances, home appliances and power tools. FCC grants cover {getFccCompanies().length} robot, appliance and tool makers. Every entry links to the official record.
                </p>
                <CiteNote name={`WCB Industry Radar, ${label}`} path={`/radar/${month}`} />
              </div>
            </aside>
          </div>
        </div>
      </section>
      <DatasetSchema
        name={`WCB Industry Radar, ${label}: recalls and FCC filings for appliances, cleaning machines and power tools`}
        description={`US CPSC recalls, EU Safety Gate alerts and FCC equipment authorizations for appliance, cleaning and power tool makers in ${label}, with sector, hazard and country of manufacture.`}
        path={`/radar/${month}`}
        updated={monthEnd}
        from={`${month}-01`}
        sources={[
          { name: "US Consumer Product Safety Commission recalls", url: "https://www.cpsc.gov/Recalls" },
          { name: "EU Safety Gate", url: "https://ec.europa.eu/safety-gate-alerts/screen/webReport" },
          { name: "FCC Equipment Authorization System", url: "https://apps.fcc.gov/oetcf/eas/" }
        ]}
        keywords={["product recalls", "FCC", "monthly report", "home appliances", "cleaning appliances", "power tools", label]}
      />
    </div>
  );
}
