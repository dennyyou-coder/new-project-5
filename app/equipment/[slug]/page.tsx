import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EquipmentDecisionSections } from "@/components/equipment/EquipmentDecisionSections";
import { EquipmentHero } from "@/components/equipment/EquipmentHero";
import { EquipmentRelationships } from "@/components/equipment/EquipmentRelationships";
import { EquipmentSources } from "@/components/equipment/EquipmentSources";
import { EquipmentSystemFlow } from "@/components/equipment/EquipmentSystemFlow";
import { EquipmentTechnicalSections } from "@/components/equipment/EquipmentTechnicalSections";
import { EquipmentTimeline } from "@/components/equipment/EquipmentTimeline";
import { EquipmentTypeComparison } from "@/components/equipment/EquipmentTypeComparison";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import {
  buildEquipmentPageSchemas,
  buildEquipmentPageTitle,
  buildEquipmentStaticParams,
  getEquipmentPageData,
  getPublishedEquipmentProfiles,
  isEquipmentDraftVisible
} from "@/lib/equipment";

const siteUrl = "https://worldcleanbiz.com";
type PageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = true;

function brandSlugs() {
  return new Set(getPublishedBrandProfiles(getInsights()).map(({ slug }) => slug));
}

function loadProfile(slug: string) {
  return getEquipmentPageData(slug, brandSlugs(), {
    includeDrafts: isEquipmentDraftVisible(process.env.VERCEL_ENV)
  });
}

export function generateStaticParams() {
  const publishedBrandSlugs = brandSlugs();
  return buildEquipmentStaticParams(getPublishedEquipmentProfiles(publishedBrandSlugs));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = loadProfile(slug);
  if (!profile) return {};
  const title = buildEquipmentPageTitle(profile);
  const canonical = `/equipment/${profile.slug}`;
  return {
    title,
    description: profile.metaDescription,
    alternates: { canonical },
    robots: profile.status === "draft" ? { index: false, follow: false } : undefined,
    openGraph: { title, description: profile.metaDescription, type: "website", url: canonical, images: [profile.heroImage] }
  };
}

export default async function EquipmentPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = loadProfile(slug);
  if (!profile) notFound();
  const schemas = buildEquipmentPageSchemas(profile, siteUrl);
  return (
    <div className="guides-hub equipment-hub equipment-detail">
      <EquipmentHero profile={profile} isDraft={profile.status === "draft"} />
      <EquipmentSystemFlow profile={profile} />
      <EquipmentTypeComparison profile={profile} />
      <EquipmentTechnicalSections profile={profile} />
      <EquipmentRelationships profile={profile} />
      <EquipmentDecisionSections profile={profile} />
      <EquipmentTimeline profile={profile} />
      <EquipmentSources profile={profile} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
    </div>
  );
}
