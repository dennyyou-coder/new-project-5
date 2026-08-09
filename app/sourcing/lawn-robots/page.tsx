import { SourcingProductPage } from "@/components/SourcingProductPage";
import { buildWebsiteMetadata } from "@/lib/seo";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["lawn-robots"];
export const metadata = buildWebsiteMetadata({ title: "Robotic Lawn Mower Manufacturers & Sourcing in China", description: product.metaDescription, canonical: "/sourcing/lawn-robots", image: product.image, robots: { index: true, follow: true } });
export default function Page() { return <SourcingProductPage product={product} />; }
