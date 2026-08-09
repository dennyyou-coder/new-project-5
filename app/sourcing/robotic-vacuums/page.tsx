import { SourcingProductPage } from "@/components/SourcingProductPage";
import { buildWebsiteMetadata } from "@/lib/seo";
import { sourcingProducts } from "@/lib/sourcingProducts";

const product = sourcingProducts["robotic-vacuums"];

export const metadata = buildWebsiteMetadata({ title: product.title, description: product.metaDescription, canonical: "/sourcing/robotic-vacuums", image: product.image, robots: { index: true, follow: true } });

export default function RoboticVacuumsPage() {
  return <SourcingProductPage product={product} />;
}
