import type { Metadata } from "next";
import { CollectionSchema } from "@/components/seo/CollectionSchema";
import { CatalogGroupedGrid } from "@/components/ui/CatalogGroupedGrid";
import { EQUIPMENT_GROUPS, groupCatalog } from "@/lib/catalogGroups";
import "../styles/catalog-groups.css";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import { getPublishedEquipmentProfiles } from "@/lib/equipment";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cleaning Equipment Technical Intelligence",
  description: "Evidence-backed technical profiles for commercial cleaning equipment, systems, specifications, components and buyer verification.",
  alternates: { canonical: "/equipment" },
  openGraph: { title: "Cleaning Equipment Technical Intelligence", description: "Evidence-backed technical profiles for commercial cleaning equipment, systems, specifications, components and buyer verification.", type: "website", url: "/equipment", images: [DEFAULT_SOCIAL_IMAGE] },
  twitter: { card: "summary_large_image", title: "Cleaning Equipment Technical Intelligence", description: "Evidence-backed technical profiles for commercial cleaning equipment, systems, specifications, components and buyer verification.", images: [DEFAULT_SOCIAL_IMAGE] }
};

export default function EquipmentDirectoryPage() {
  const brandSlugs = new Set(getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug));
  const profiles = getPublishedEquipmentProfiles(brandSlugs);
  return (
    <div className="guides-hub equipment-hub">
      <section className="guides-hero">
        <div className="insights-page-container equipment-directory-hero">
          <div>
            <p className="eyebrow">Independent Technical Intelligence</p>
            <h1>Cleaning Equipment Technical Intelligence</h1>
            <p>Structured equipment profiles connect operating principles, performance metrics, components, representative brands and concrete buyer checks without turning unlike specifications into rankings.</p>
          </div>
          <div className="guides-hero-stat"><strong>{profiles.length}</strong><span>Published equipment profiles</span></div>
        </div>
      </section>
      <section className="section">
        <div className="insights-page-container">
          {profiles.length ? (
            <CatalogGroupedGrid
              label="Equipment groups"
              groups={groupCatalog(profiles, EQUIPMENT_GROUPS).map((group) => ({
                id: group.id,
                label: group.label,
                items: group.items.map((profile) => ({ slug: profile.slug, href: `/equipment/${profile.slug}`, name: profile.name, image: profile.heroImage, alt: "", text: profile.definition }))
              }))}
            />
          ) : (
            <div className="equipment-directory-empty">
              <h2>Technical profiles are under review</h2>
              <p>Draft equipment records stay outside the public directory until evidence and responsive verification are complete.</p>
            </div>
          )}
        </div>
      </section>
      <CollectionSchema name="Cleaning Equipment Technical Intelligence" description="Evidence-backed technical profiles for commercial cleaning equipment, systems, specifications, components and buyer verification." path="/equipment" items={profiles.map((profile) => ({ name: profile.name, url: `/equipment/${profile.slug}` }))} />
    </div>
  );
}
