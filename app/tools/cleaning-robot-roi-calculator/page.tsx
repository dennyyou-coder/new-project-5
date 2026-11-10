import type { Metadata } from "next";
import Link from "next/link";
import { RoiCalculator } from "@/components/tools/RoiCalculator";
import { ToolPage } from "@/components/tools/ToolPage";
import "../../styles/tools.css";

export const metadata: Metadata = {
  title: "Commercial Cleaning Robot ROI and Payback Calculator",
  description:
    "Work out how many cleaning hours a commercial floor-scrubbing or vacuum robot frees up, what it saves each year and how many months it takes to pay back, in USD, EUR, GBP or CNY.",
  alternates: { canonical: "/tools/cleaning-robot-roi-calculator" }
};

export default function RoiPage() {
  return (
    <ToolPage
      id="cleaning-robot-roi"
      title="Cleaning robot payback calculator"
      lead="How many cleaning hours a commercial floor robot frees up, what that is worth each year and how many months the robot takes to pay for itself."
      updated="November 2026"
      method={
        <>
          <p>
            Manual hours today are the floor area divided by what one cleaner covers in an hour. The robot takes over the share of that work you set, minus the staff time it needs each day. Freed hours are valued at the full labour cost, and running costs are subtracted to give the net saving per year.
          </p>
          <p>
            Payback is the robot price divided by the net saving. Savings only become cash when the freed hours are no longer paid for or move to work that would otherwise need extra staff, so ask the supplier for a site trial to confirm the coverage and cleaning rate.
          </p>
          <p>
            Comparing robots? See WCB&apos;s coverage of <Link href="/categories/commercial-cleaning">commercial cleaning equipment</Link>.
          </p>
        </>
      }
      sources={[
        { label: "Manual cleaning rates: typical published productivity figures for mopping and walk-behind scrubbers" },
        { label: "Full-time equivalent: 2,080 working hours a year" },
        { label: "WCB commercial cleaning coverage", href: "/categories/commercial-cleaning" }
      ]}
    >
      <RoiCalculator />
    </ToolPage>
  );
}
