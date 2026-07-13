import type { Metadata } from "next";
import { SourcingProductPage } from "@/components/SourcingProductPage";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["commercial-cleaning"];

export const metadata: Metadata = {
  title: product.title,
  description: product.metaDescription,
  alternates: { canonical: "/sourcing/commercial-cleaning" },
  robots: { index: true, follow: true }
};

export default function CommercialCleaningPage() {
  return <SourcingProductPage product={product} />;
}
