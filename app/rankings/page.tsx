import type { Metadata } from "next";
import Link from "next/link";
import "../styles/rankings.css";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { buildBrandMarkIndex } from "@/lib/brandMarks";
import { CompanyMark } from "@/components/ui/CompanyMark";
import { getInsights } from "@/lib/content";
import { formatAmount } from "@/lib/financials";
import { newsDate } from "@/lib/news";
import { revenueGrowthRanking, type RankingRow } from "@/lib/rankings";

const siteUrl = "https://worldcleanbiz.com";
const ranking = revenueGrowthRanking();

export const metadata: Metadata = {
  title: `Cleaning Industry Company Rankings: ${ranking.period} Revenue Growth`,
  description: `Listed cleaning appliance, pool and outdoor equipment companies ranked by ${ranking.period} revenue growth, from Roborock and ECOVACS to SharkNinja, Midea and Whirlpool, with each company's reported figures and source.`,
  alternates: { canonical: "/rankings" }
};

function RankingTable({ rows, id, title, note, marks }: { rows: RankingRow[]; id: string; title: string; note: string; marks: ReturnType<typeof buildBrandMarkIndex> }) {
  if (!rows.length) return null;
  const max = Math.max(1, ...rows.map((row) => Math.abs(row.growth)));
  return (
    <section className="rank-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <p className="rank-note">{note}</p>
      <ol className="rank-list">
        {rows.map(({ result, change, growth }, index) => {
          const mark = marks.get(result.brand);
          return (
            <li key={result.company}>
              <span className="rank-pos">{index + 1}</span>
              <Link className="rank-name" href={`/brands/${result.brand}`}>
                {mark ? <CompanyMark mark={mark} size="xs" /> : null}
                <span>{result.name}</span>
              </Link>
              <span className="rank-revenue">
                {formatAmount(result.revenue, result.currency)}
                <small>{result.revenueLabel}</small>
              </span>
              <span className="rank-bar" aria-hidden="true"><span className={growth < 0 ? "is-down" : "is-up"} style={{ width: `${(Math.abs(growth) / max) * 100}%` }} /></span>
              <span className={`rank-change ${growth < 0 ? "is-down" : "is-up"}`}>{change}</span>
              <span className="rank-source">
                {result.news ? <Link href={`/news/${result.news}`}>WCB story</Link> : null}
                <a href={result.source.url} target="_blank" rel="noopener noreferrer">{result.source.label}</a>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function RankingsPage() {
  const profiles = getPublishedBrandProfiles(getInsights());
  const marks = buildBrandMarkIndex(profiles);
  const latestReport = ranking.all.map((row) => row.result.reported ?? row.result.periodEnd).sort().at(-1);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Cleaning industry companies ranked by ${ranking.period} revenue growth`,
    url: `${siteUrl}/rankings`,
    itemListElement: ranking.all.map((row, index) => ({ "@type": "ListItem", position: index + 1, name: row.result.name, url: `${siteUrl}/brands/${row.result.brand}` }))
  };

  return (
    <div className="rankings-page">
      <header className="rankings-hero">
        <div className="rank-container">
          <nav className="rankings-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/markets">Markets</Link> / <span aria-current="page">Rankings</span></nav>
          <h1>{ranking.period} Revenue Growth Ranking</h1>
          <p>Listed companies in cleaning appliances, pool and outdoor equipment, ranked by the year-on-year revenue change each one reported for {ranking.period}.{latestReport ? ` Updated ${newsDate(latestReport)}.` : ""}</p>
        </div>
      </header>
      <div className="rank-container rank-body">
        <RankingTable
          rows={ranking.specialists}
          id="rank-specialists"
          title="Cleaning, pool and outdoor specialists"
          note="Companies whose business is mainly cleaning appliances, pool equipment or outdoor power equipment."
          marks={marks}
        />
        <RankingTable
          rows={ranking.diversified}
          id="rank-diversified"
          title="Diversified appliance and tool groups"
          note="Groups for which cleaning is one business among several; their figures cover the whole group."
          marks={marks}
        />
        <section className="rank-method" aria-labelledby="rank-method-title">
          <h2 id="rank-method-title">How this ranking works</h2>
          <ul>
            <li>Each company appears with the revenue change it reported for {ranking.period}, in its own currency, so exchange rates do not move the order.</li>
            <li>Where a company states only organic or like-for-like growth, that figure is used and marked as such. Revenue amounts are as reported and are not converted.</li>
            <li>Companies on a different reporting calendar (half-year or fiscal-year reporters such as TTI, Chervon, Makita, Fluidra, Toro and Breville) are not ranked; their latest figures are on the <Link href="/markets">Markets</Link> page.</li>
            <li>Every row links to the company&apos;s own release; see our <Link href="/editorial-policy">editorial standards</Link>.</li>
          </ul>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
