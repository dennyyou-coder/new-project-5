import type { Metadata } from "next";
import { SourcingProductPage } from "@/components/SourcingProductPage";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["robotic-vacuums"];

export const metadata: Metadata = {
  title: product.title,
  description: product.metaDescription,
  alternates: { canonical: "/sourcing/robotic-vacuums" },
  robots: { index: true, follow: true }
};

export default function RoboticVacuumsPage() {
  return <SourcingProductPage product={product} />;
}
