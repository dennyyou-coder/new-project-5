import type { Metadata } from "next";
import Link from "next/link";
import { BatteryChecker } from "@/components/tools/BatteryChecker";
import { ToolPage } from "@/components/tools/ToolPage";
import "../../styles/tools.css";

export const metadata: Metadata = {
  title: "Lithium Battery Shipping Checker: Wh, UN3480/UN3481, Air and Sea",
  description:
    "Work out a battery's watt-hours and what air and sea freight need for cordless vacuums, floor washers and power tools under the 2026 IATA and IMDG rules.",
  alternates: { canonical: "/tools/lithium-battery-shipping-checker" }
};

export default function BatteryShippingPage() {
  return (
    <ToolPage
      id="battery-shipping"
      title="Lithium battery shipping checker"
      lead="Enter the battery's voltage and capacity to get its watt-hour rating, its UN number and what passenger aircraft, cargo aircraft and sea freight each require, including the 2026 charge-level rule."
      updated="November 2026"
      method={
        <>
          <p>
            Watt-hours are the nominal voltage times the rated capacity in amp-hours. The two limits that decide almost everything are 20 Wh for a cell and 100 Wh for a battery: at or under both, a battery fitted in or packed with a product ships under lighter rules (IATA Section II, IMDG special provision 188). Over either, it is fully regulated dangerous goods.
          </p>
          <p>
            Batteries shipped on their own (UN3480) cannot fly on passenger aircraft at all and must be charged to 30% or less. Since 1 January 2026, the 30% limit also applies to batteries packed with equipment. For batteries fitted in the product, IATA recommends it and some airlines require it.
          </p>
          <p>
            Airlines, couriers and Chinese airports add their own rules, so treat this as the starting point for a conversation with your forwarder. Battery products also need the right certifications to sell: see the <Link href="/tools/export-compliance-checklist">export compliance checklist</Link>.
          </p>
        </>
      }
      sources={[
        { label: "IATA Dangerous Goods Regulations, 67th edition (2026): packing instructions 965, 966 and 967" },
        { label: "FAA lithium battery shipping guide (2026)", href: "https://www.faa.gov/sites/faa.gov/files/Lithium-Battery-Shipping-Guide_508_2026.pdf" },
        { label: "IMDG Code special provision 188 for small lithium batteries" },
        { label: "UN Manual of Tests and Criteria, section 38.3" }
      ]}
    >
      <BatteryChecker />
    </ToolPage>
  );
}
