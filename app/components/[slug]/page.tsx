import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentArchitecture } from "@/components/component-intelligence/ComponentArchitecture";
import { ComponentCompatibility } from "@/components/component-intelligence/ComponentCompatibility";
import { ComponentDecisionSections } from "@/components/component-intelligence/ComponentDecisionSections";
import { ComponentHero } from "@/components/component-intelligence/ComponentHero";
import { ComponentRelationships } from "@/components/component-intelligence/ComponentRelationships";
import { ComponentServiceSections } from "@/components/component-intelligence/ComponentServiceSections";
import { ComponentSources } from "@/components/component-intelligence/ComponentSources";
import { ComponentSystemRole } from "@/components/component-intelligence/ComponentSystemRole";
import { ComponentTechnicalSections } from "@/components/component-intelligence/ComponentTechnicalSections";
import { ComponentTimeline } from "@/components/component-intelligence/ComponentTimeline";
import { buildComponentPageSchemas, buildComponentPageTitle, buildComponentStaticParams, getComponentPageData, getPublishedComponentProfiles, isComponentDraftVisible } from "@/lib/componentProfiles";
import { buildWebsiteMetadata } from "@/lib/seo";

const siteUrl = "https://worldcleanbiz.com";
type PageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = true;

function loadProfile(slug: string) {
  return getComponentPageData(slug, { includeDrafts: isComponentDraftVisible(process.env.VERCEL_ENV) });
}

export function generateStaticParams() {
  return buildComponentStaticParams(getPublishedComponentProfiles());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = loadProfile(slug);
  if (!profile) return {};
  const title = buildComponentPageTitle(profile);
  const canonical = `/components/${profile.slug}`;
  return buildWebsiteMetadata({ title, description: profile.metaDescription, canonical, image: profile.heroImage, robots: profile.status === "draft" ? { index: false, follow: false } : undefined });
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = loadProfile(slug);
  if (!profile) notFound();
  const schemas = buildComponentPageSchemas(profile, siteUrl);
  return <div className="guides-hub component-intelligence-hub component-intelligence-detail"><ComponentHero profile={profile} isDraft={profile.status === "draft"} /><ComponentSystemRole profile={profile} /><ComponentArchitecture profile={profile} /><ComponentTechnicalSections profile={profile} /><ComponentCompatibility profile={profile} /><ComponentServiceSections profile={profile} /><ComponentRelationships profile={profile} /><ComponentDecisionSections profile={profile} /><ComponentTimeline profile={profile} /><ComponentSources profile={profile} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} /></div>;
}
