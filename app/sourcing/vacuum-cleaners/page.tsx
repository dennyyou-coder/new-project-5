import { SourcingProductPage } from "@/components/SourcingProductPage";
import { buildWebsiteMetadata } from "@/lib/seo";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["vacuum-cleaners"];

export const metadata = buildWebsiteMetadata({ title: product.title, description: product.metaDescription, canonical: "/sourcing/vacuum-cleaners", image: product.image, robots: { index: true, follow: true } });

export default function VacuumCleanerPage() {
  return <SourcingProductPage product={product} />;
}
