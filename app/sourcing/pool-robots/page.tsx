import type { Metadata } from "next";
import { SourcingProductPage } from "@/components/SourcingProductPage";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["pool-robots"];
export const metadata: Metadata = { title: "Robotic Pool Cleaner Manufacturers & Sourcing in China", description: product.metaDescription, alternates: { canonical: "/sourcing/pool-robots" }, robots: { index: true, follow: true } };
export default function Page() { return <SourcingProductPage product={product} />; }
