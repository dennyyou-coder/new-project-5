import type { Metadata } from "next";
import { SourcingProductPage } from "@/components/SourcingProductPage";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["vacuum-cleaners"];

export const metadata: Metadata = {
  title: product.title,
  description: product.metaDescription,
  alternates: { canonical: "/sourcing/vacuum-cleaners" },
  robots: { index: true, follow: true }
};

export default function VacuumCleanerPage() {
  return <SourcingProductPage product={product} />;
}
