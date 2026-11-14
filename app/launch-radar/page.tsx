import type { Metadata } from "next";
import Link from "next/link";
import { CiteNote, DatasetSchema } from "@/components/radar/DatasetSchema";
import { FccFilingList } from "@/components/radar/FccFilingList";
import { RadarHero } from "@/components/radar/RadarHero";
import { SECTORS, shortDate } from "@/lib/radar/classify";
import { FCC_FROM, FCC_UPDATED, getFccCompanies, getFccFilings, lastFilingByCompany } from "@/lib/radar/data";
import { fccIdUrl } from "@/lib/radar/fcc";
import { LATEST_ISSUE, monthLabel } from "@/lib/radar/monthly";
import "../styles/tools.css";
import "../styles/radar.css";

export const metadata: Metadata = {
  title: "Launch Radar: New FCC Filings from Robot, Appliance and Tool Makers",
  description:
    "New FCC equipment authorizations from Roborock, Ecovacs, Dyson, SharkNinja, Mammotion, Husqvarna, Milwaukee, Whirlpool and more, and which Chinese robot makers have filed nothing since the FCC Covered List rule.",
  alternates: { canonical: "/launch-radar" }
};

const COVERED_LIST_DATE = "2026-07-28";

export default function LaunchRadarPage() {
  const filings = getFccFilings();
  const companies = getFccCompanies();
  const latest = lastFilingByCompany();
  const robotsSilent = latest.filter(({ company, last }) => company.robotMaker && last!.date < COVERED_LIST_DATE);
  const robotsActive = latest.filter(({ company, last }) => company.robotMaker && last!.date >= COVERED_LIST_DATE);
  return (
    <div className="tool-page radar-page">
      <RadarHero
        title="Launch radar: FCC filings"
        lead="Any product with Wi-Fi, Bluetooth or another radio needs FCC authorization before it can be sold in the US, so a new FCC ID is often the first public sign of a launch. WCB tracks the filings of the main robot, appliance and power tool makers."
        updated={shortDate(FCC_UPDATED)}
        sources="FCC Equipment Authorization System"
      />
      <section className="tool-body">
        <div className="container">
          <div className="radar-callout">
            <p className="radar-kicker">Since the FCC Covered List rule of 28 July 2026</p>
            <h2 className="radar-callout-title">{robotsSilent.length} of {robotsSilent.length + robotsActive.length} tracked robot makers have no new FCC grant</h2>
            <p>
              New robots produced outside the US need Conditional Approval before they can be authorized.{" "}
              {robotsSilent.map(({ company, last }, index) => (
                <span key={company.name}>
                  {company.name} (last {shortDate(last!.date)}){index < robotsSilent.length - 1 ? ", " : ". "}
                </span>
              ))}
              Filings on or after the rule date came from {robotsActive.map(({ company }) => company.name).join(", ") || "none of them"}.{" "}
              <Link href="/topics/us-fcc-robot-restrictions">Follow the FCC story</Link>
            </p>
          </div>

          <h2 className="radar-h2">Latest filing by company</h2>
          <div className="radar-company-grid">
            {SECTORS.map((sector) => (
              <section key={sector.value} className="radar-card">
                <h3>{sector.label}</h3>
                <ul className="radar-company-list">
                  {latest
                    .filter(({ company }) => company.sector === sector.value)
                    .map(({ company, last }) => (
                      <li key={company.name}>
                        <span>
                          {company.profile ? <Link href={`/brands/${company.profile}`}>{company.name}</Link> : company.name}
                          {company.robotMaker && last!.date < COVERED_LIST_DATE ? <em className="radar-flag">No filing since the rule</em> : null}
                        </span>
                        <a href={fccIdUrl(last!.fccId)} target="_blank" rel="noopener noreferrer">{shortDate(last!.date)}</a>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>

          <h2 className="radar-h2">All filings since {shortDate(FCC_FROM)}</h2>
          <FccFilingList filings={filings} companies={companies} />

          <div className="radar-card radar-method">
            <h2>How to read this</h2>
            <p>
              A new product filing is a new FCC ID; changes and new IDs are updates to products already authorized. The FCC record shows the company and the radios, but usually not the product name, and photos and manuals can stay confidential until launch. Companies sometimes file under a subsidiary or a module maker, so a quiet company is not proof that nothing is coming. Brands whose filings are mostly phones, chargers or TVs are left out. Each ID links to its public record on fccid.io.
            </p>
            <p><Link href={`/radar/${LATEST_ISSUE.month}`}>Monthly report: {monthLabel(LATEST_ISSUE.month)} →</Link></p>
            <CiteNote name="WCB Launch Radar" path="/launch-radar" />
          </div>
        </div>
      </section>
      <DatasetSchema
        name="WCB Launch Radar: FCC filings from robot, appliance and power tool makers"
        description="FCC equipment authorizations filed by the main robot vacuum, robot mower, pool robot, home appliance and power tool makers, with company, FCC ID, grant date and filing type."
        path="/launch-radar"
        updated={FCC_UPDATED}
        from={FCC_FROM}
        sources={[{ name: "FCC Equipment Authorization System", url: "https://www.fcc.gov/oet/ea/fccid" }]}
        keywords={["FCC ID", "FCC equipment authorization", "robot vacuum", "robot lawn mower", "home appliances", "power tools", "product launches"]}
      />
    </div>
  );
}
