import type { Metadata } from "next";
import Link from "next/link";
import { ContainerCalculator } from "@/components/tools/ContainerCalculator";
import { ToolPage } from "@/components/tools/ToolPage";
import "../../styles/tools.css";

export const metadata: Metadata = {
  title: "Container Loading Calculator: Cartons per 20GP, 40GP and 40HQ",
  description:
    "Enter your carton size and weight to see how many cartons and units fit in a 20GP, 40GP or 40HQ container, which limit binds and the sea freight per unit.",
  alternates: { canonical: "/tools/container-loading-calculator" }
};

export default function ContainerLoadingPage() {
  return (
    <ToolPage
      id="container-loading"
      title="Container loading calculator"
      lead="How many cartons of your product fit in a 20GP, 40GP or 40HQ, whether space or weight runs out first, and what the sea freight comes to per unit."
      updated="November 2026"
      method={
        <>
          <p>
            The calculator stacks cartons in layers inside the container&apos;s internal space, keeping 10 cm free at the doors and 5 cm under the roof for loading by hand. On each layer it tries the carton both ways round and the mixed layouts loaders use, where the strip left at the end or side is filled with cartons turned 90°. With &ldquo;Any side&rdquo; it also tries the carton on its side or end.
          </p>
          <p>
            The count is then capped by the container&apos;s rated payload. Road weight limits are often lower than the payload, especially in the US, so check with your forwarder when the result says the load is limited by weight. Real loads often differ by a few cartons; ask for a load plan before you fix the order quantity.
          </p>
          <p>
            Next step: turn the freight per unit into a full import cost with the <Link href="/tools/landed-cost-calculator">landed cost calculator</Link>.
          </p>
        </>
      }
      sources={[
        { label: "Typical ISO dry container internal dimensions: 20GP 5.89 × 2.35 × 2.39 m, 40GP 12.03 × 2.35 × 2.39 m, 40HQ 12.03 × 2.35 × 2.69 m" },
        { label: "Rated payloads: 20GP 28,200 kg, 40GP 26,700 kg, 40HQ 26,500 kg (individual containers vary)" },
        { label: "Freight figures are examples only: enter your own quotes" }
      ]}
    >
      <ContainerCalculator />
    </ToolPage>
  );
}
