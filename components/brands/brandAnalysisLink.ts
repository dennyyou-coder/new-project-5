import type { BrandProfile } from "@/lib/brands";
import type { CompanyKeyword } from "@/lib/companyKeywords";

function normalizeName(value: string) {
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[’']/g, "").trim();
}

export function buildBrandAnalysisLink(
  profile: Pick<BrandProfile, "slug" | "name" | "aliases">,
  availableKeywords: readonly CompanyKeyword[]
) {
  const names = new Set([profile.name, ...profile.aliases].map(normalizeName));
  const matches = availableKeywords.filter((keyword) => keyword.value === profile.slug
    || keyword.aliases.some((alias) => names.has(normalizeName(alias))));
  if (matches.length !== 1) return undefined;
  const keyword = matches[0];
  return { href: `/blog/archive?company=${encodeURIComponent(keyword.value)}`, label: `More ${keyword.label} analysis` };
}
