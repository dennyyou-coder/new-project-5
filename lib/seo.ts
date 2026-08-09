import type { Metadata } from "next";

export const DEFAULT_SOCIAL_IMAGE = "/images/expo/wcb-expo-2026-hero.webp";

function truncateSnippet(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const candidate = normalized.slice(0, maxLength - 1);
  const wordBoundary = candidate.lastIndexOf(" ");
  const cutoff = wordBoundary >= Math.floor(maxLength * 0.65)
    ? candidate.slice(0, wordBoundary)
    : candidate;

  return `${cutoff.replace(/[\s,;:|\-–—.]+$/g, "")}…`;
}

export function seoTitle(value: string) {
  return truncateSnippet(value, 60);
}

export function seoDescription(value: string) {
  return truncateSnippet(value, 155);
}

export function buildWebsiteMetadata({
  title,
  description,
  canonical,
  image = DEFAULT_SOCIAL_IMAGE,
  robots
}: {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  robots?: Metadata["robots"];
}): Metadata {
  const metadataTitle = seoTitle(title);
  const metadataDescription = seoDescription(description);

  return {
    title: { absolute: metadataTitle },
    description: metadataDescription,
    alternates: { canonical },
    robots,
    openGraph: {
      title: metadataTitle,
      description: metadataDescription,
      type: "website",
      url: canonical,
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: metadataDescription,
      images: [image]
    }
  };
}
