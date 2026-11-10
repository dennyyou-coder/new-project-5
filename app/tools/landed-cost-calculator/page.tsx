import type { Metadata } from "next";
import Link from "next/link";
import { LandedCostCalculator } from "@/components/tools/LandedCostCalculator";
import { ToolPage } from "@/components/tools/ToolPage";
import { RATES_AS_OF } from "@/lib/tools/landedCost";
import "../../styles/tools.css";

export const metadata: Metadata = {
  title: "Landed Cost and US Tariff Calculator for Vacuums, Pool Robots and Mowers",
  description:
    "Work out the landed cost of robot vacuums, pool robots and robotic mowers shipped from China or Southeast Asia to the US, EU or UK: Section 301 duties, EU and UK duty, customs fees and import VAT.",
  alternates: { canonical: "/tools/landed-cost-calculator" }
};

export default function LandedCostPage() {
  return (
    <ToolPage
      id="landed-cost"
      title="Landed cost and tariff calculator"
      lead="From factory price to landed cost in the US, the EU or the UK. Pick the product and where it is made; the calculator applies the current duties, customs fees and import VAT."
      updated={RATES_AS_OF}
      method={
        <>
          <p>
            The US charges duty on the factory (FOB) value. A product of China pays the 2018–2019 Section 301 duty for its tariff line plus the 12.5% Section 301 forced-labor duty in force since 24 July 2026. Other origins pay only the forced-labor duty for their country. The Merchandise Processing Fee and, for sea freight, the Harbor Maintenance Fee are added.
          </p>
          <p>
            The EU and the UK charge duty on the CIF value (goods, freight and insurance), and import VAT on the CIF value plus duty. Retail sales taxes and the US state sales tax are not included.
          </p>
          <p>
            Background: <Link href="/topics/us-tariffs-chinese-cleaning-appliances">US tariffs on Chinese cleaning appliances</Link> and the{" "}
            <Link href="/topics/eu-robotic-mower-anti-dumping">EU anti-dumping case on robotic mowers</Link>.
          </p>
        </>
      }
      sources={[
        { label: "WCB topic: US tariffs on Chinese cleaning appliances", href: "/topics/us-tariffs-chinese-cleaning-appliances" },
        { label: "CBP ruling N352394: robotic pool cleaner, 8421.21", href: "https://rulings.cbp.gov/ruling/N352394" },
        { label: "CBP ruling N351254: lawn mowers, 8433.11", href: "https://rulings.cbp.gov/ruling/N351254" },
        { label: "CBP customs user fees for fiscal year 2027" },
        { label: "UK Trade Tariff and EU rates (via the Northern Ireland tariff)", href: "https://www.trade-tariff.service.gov.uk/" }
      ]}
    >
      <LandedCostCalculator />
    </ToolPage>
  );
}
