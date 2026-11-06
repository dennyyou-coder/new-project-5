import type { Metadata } from "next";
import { CatalogGroupedGrid } from "@/components/ui/CatalogGroupedGrid";
import { COMPONENT_GROUPS, groupCatalog } from "@/lib/catalogGroups";
import "../styles/catalog-groups.css";
import { getPublishedComponentProfiles } from "@/lib/componentProfiles";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cleaning Equipment Component Intelligence",
  description: "Evidence-backed profiles of cleaning-equipment components, specifications, failure boundaries and buyer verification actions.",
  alternates: { canonical: "/components" },
  openGraph: { title: "Cleaning Equipment Component Intelligence", description: "Evidence-backed profiles of cleaning-equipment components, specifications, failure boundaries and buyer verification actions.", type: "website", url: "/components", images: [DEFAULT_SOCIAL_IMAGE] },
  twitter: { card: "summary_large_image", title: "Cleaning Equipment Component Intelligence", description: "Evidence-backed profiles of cleaning-equipment components, specifications, failure boundaries and buyer verification actions.", images: [DEFAULT_SOCIAL_IMAGE] }
};

export default function ComponentDirectoryPage() {
  const profiles = getPublishedComponentProfiles();
  return <div className="guides-hub component-intelligence-hub"><section className="guides-hero"><div className="insights-page-container component-intelligence-directory-hero"><div><p className="eyebrow">Independent Component Intelligence</p><h1>Cleaning Equipment Component Intelligence</h1><p>Structured component profiles connect architecture, measurement boundaries, applications, failure signals and compatibility checks without turning family labels into replacement claims.</p></div><div className="guides-hero-stat"><strong>{profiles.length}</strong><span>Published component profiles</span></div></div></section><section className="section"><div className="insights-page-container">{profiles.length ? <CatalogGroupedGrid label="Component groups" groups={groupCatalog(profiles, COMPONENT_GROUPS).map((group) => ({ id: group.id, label: group.label, items: group.items.map((profile) => ({ slug: profile.slug, href: `/components/${profile.slug}`, name: profile.name, image: profile.heroImage, alt: profile.heroImageAlt, text: profile.description })) }))} /> : <div className="component-intelligence-directory-empty"><h2>Component profiles are under review</h2><p>Draft component records stay outside the public directory until evidence, visuals and responsive verification are complete.</p></div>}</div></section></div>;
}
