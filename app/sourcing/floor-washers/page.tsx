import type { Metadata } from "next";
import { SourcingProductPage } from "@/components/SourcingProductPage";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["floor-washers"];

export const metadata: Metadata = {
  title: "Hard Floor Washer Manufacturers & Sourcing in China",
  description: product.metaDescription,
  alternates: { canonical: "/sourcing/floor-washers" },
  robots: { index: true, follow: true }
};

export default function Page() {
  return <SourcingProductPage product={product} />;
}
