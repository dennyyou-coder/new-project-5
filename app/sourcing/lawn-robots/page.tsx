import type { Metadata } from "next";
import { SourcingProductPage } from "@/components/SourcingProductPage";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["lawn-robots"];
export const metadata: Metadata = { title: "Robotic Lawn Mower Manufacturers & Sourcing in China", description: product.metaDescription, alternates: { canonical: "/sourcing/lawn-robots" }, robots: { index: true, follow: true } };
export default function Page() { return <SourcingProductPage product={product} />; }
