import type { Metadata } from "next";
import { EquipmentDirectoryCard } from "@/components/equipment/EquipmentDirectoryCard";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import { getPublishedEquipmentProfiles } from "@/lib/equipment";

export const metadata: Metadata = {
  title: "Cleaning Equipment Technical Intelligence",
  description: "Evidence-backed technical profiles for commercial cleaning equipment, systems, specifications, components and buyer verification.",
  alternates: { canonical: "/equipment" }
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
        <div className="insights-page-container equipment-directory-grid">
          {profiles.length ? profiles.map((profile) => <EquipmentDirectoryCard key={profile.slug} profile={profile} />) : (
            <div className="equipment-directory-empty">
              <h2>Technical profiles are under review</h2>
              <p>Draft equipment records stay outside the public directory until evidence and responsive verification are complete.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
