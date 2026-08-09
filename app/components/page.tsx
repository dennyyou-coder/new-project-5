import type { Metadata } from "next";
import { ComponentDirectoryCard } from "@/components/component-intelligence/ComponentDirectoryCard";
import { getPublishedComponentProfiles } from "@/lib/componentProfiles";

export const metadata: Metadata = {
  title: "Cleaning Equipment Component Intelligence",
  description: "Evidence-backed profiles of cleaning-equipment components, specifications, failure boundaries and buyer verification actions.",
  alternates: { canonical: "/components" }
};

export default function ComponentDirectoryPage() {
  const profiles = getPublishedComponentProfiles();
  return <div className="guides-hub component-intelligence-hub"><section className="guides-hero"><div className="insights-page-container component-intelligence-directory-hero"><div><p className="eyebrow">Independent Component Intelligence</p><h1>Cleaning Equipment Component Intelligence</h1><p>Structured component profiles connect architecture, measurement boundaries, applications, failure signals and compatibility checks without turning family labels into replacement claims.</p></div><div className="guides-hero-stat"><strong>{profiles.length}</strong><span>Published component profiles</span></div></div></section><section className="section"><div className="insights-page-container component-intelligence-directory-grid">{profiles.length ? profiles.map((profile) => <ComponentDirectoryCard key={profile.slug} profile={profile} />) : <div className="component-intelligence-directory-empty"><h2>Component profiles are under review</h2><p>Draft component records stay outside the public directory until evidence, visuals and responsive verification are complete.</p></div>}</div></section></div>;
}
