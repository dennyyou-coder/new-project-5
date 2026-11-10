import type { Metadata } from "next";
import { ComplianceChecklist } from "@/components/tools/ComplianceChecklist";
import { ToolPage } from "@/components/tools/ToolPage";
import { CHECKLIST_AS_OF } from "@/lib/tools/certifications";
import "../../styles/tools.css";

export const metadata: Metadata = {
  title: "Export Compliance Checklist: Robot Vacuums, Pool Robots and Mowers (US, EU, UK)",
  description:
    "What a robot vacuum, cordless vacuum, pool robot or robotic mower needs to be sold in the US, EU and UK: FCC, CE and RED cybersecurity, UKCA and PSTI, batteries, WEEE and the key 2026–2027 deadlines.",
  alternates: { canonical: "/tools/export-compliance-checklist" }
};

// Keeps "Coming up" dates current without a deploy.
export const revalidate = 86400;

export default function ComplianceChecklistPage() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <ToolPage
      id="export-compliance"
      title="Export compliance checklist"
      lead="The certifications and rules a cleaning appliance needs before it can be sold in the US, the EU or the UK, with the deadlines that change in 2026 and 2027."
      updated={CHECKLIST_AS_OF}
      method={
        <>
          <p>
            Choose the product, the market and whether it connects to Wi-Fi, Bluetooth or an app. The list separates what the law requires from what retailers and marketplaces expect, and flags items that depend on the exact product.
          </p>
          <p>
            It is a starting point for planning tests and budgets with an accredited lab. The exact standards depend on the design, power supply and features of your product.
          </p>
        </>
      }
      sources={[
        { label: "WCB topic: FCC restrictions on foreign-produced robots", href: "/topics/us-fcc-robot-restrictions" },
        { label: "EU Radio Equipment Directive and Delegated Regulation (EU) 2022/30", href: "https://single-market-economy.ec.europa.eu/sectors/electrical-and-electronic-engineering-industries-eei/radio-equipment-directive-red_en" },
        { label: "EU Batteries Regulation (EU) 2023/1542", href: "https://eur-lex.europa.eu/eli/reg/2023/1542/oj" },
        { label: "EU Machinery Regulation (EU) 2023/1230", href: "https://eur-lex.europa.eu/eli/reg/2023/1230/oj" },
        { label: "EU Cyber Resilience Act (EU) 2024/2847", href: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj" },
        { label: "UK product security (PSTI) regime", href: "https://www.gov.uk/government/publications/the-uk-product-security-and-telecommunications-infrastructure-product-security-regime" }
      ]}
    >
      <ComplianceChecklist today={today} />
    </ToolPage>
  );
}
