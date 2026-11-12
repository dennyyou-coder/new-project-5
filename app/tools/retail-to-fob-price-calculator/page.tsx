import type { Metadata } from "next";
import Link from "next/link";
import { PricingCalculator } from "@/components/tools/PricingCalculator";
import { ToolPage } from "@/components/tools/ToolPage";
import "../../styles/tools.css";

export const metadata: Metadata = {
  title: "Retail Price to FOB Calculator for Appliances and Tools",
  description:
    "Work back from a shelf price on Amazon or in a retail chain to the highest FOB factory price that still leaves the brand its margin, or from FOB to retail.",
  alternates: { canonical: "/tools/retail-to-fob-price-calculator" }
};

export default function RetailToFobPage() {
  return (
    <ToolPage
      id="retail-to-fob"
      title="Retail price to FOB calculator"
      lead="Start from the price a shopper pays and work back through VAT, the marketplace or retailer, returns, the brand's margin, duty and freight to the highest factory price that still works. Or start from an FOB quote and see the shelf price it needs."
      updated="November 2026"
      method={
        <>
          <p>
            In the EU and UK the shelf price includes VAT, which comes off first; US shelf prices exclude sales tax. On a marketplace, the referral fee is charged on the full price the shopper pays, then the fulfilment fee and advertising come off. In retail, the retailer keeps its margin on its selling price before VAT, and a distributor takes its own margin from what is left.
          </p>
          <p>
            Returns and warranty come off the brand&apos;s revenue, then the brand margin. What remains is the landed cost the product can carry. US duty is charged on the FOB value; EU and UK duty on the value including freight and insurance. Working forward from FOB runs the same steps in reverse.
          </p>
          <p>
            Duty rates by product and origin are in the <Link href="/tools/landed-cost-calculator">landed cost calculator</Link>, and the <Link href="/tools/container-loading-calculator">container loading calculator</Link> gives sea freight per unit.
          </p>
        </>
      }
      sources={[
        { label: "Default US duty: Section 301 List 3 (25%) plus the forced-labor duty on Chinese goods (12.5%), as in the landed cost calculator", href: "/tools/landed-cost-calculator" },
        { label: "Amazon referral fees: 15% for most home and kitchen products; fulfilment fees depend on size tier and change each year" },
        { label: "Margins and other fees are the figures you enter" }
      ]}
    >
      <PricingCalculator />
    </ToolPage>
  );
}
