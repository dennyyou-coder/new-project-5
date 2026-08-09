import { SourcingProductPage } from "@/components/SourcingProductPage";
import { buildWebsiteMetadata } from "@/lib/seo";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["commercial-cleaning"];

export const metadata = buildWebsiteMetadata({ title: product.title, description: product.metaDescription, canonical: "/sourcing/commercial-cleaning", image: product.image, robots: { index: true, follow: true } });

export default function CommercialCleaningPage() {
  return <SourcingProductPage product={product} />;
}
