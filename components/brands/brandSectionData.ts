import type {
  BrandContentVisual,
  BrandLeadershipPerson,
  BrandLeadershipPortrait,
  BrandProfile,
  BrandVisualPlacement
} from "@/lib/brands";

type FeaturedLeadershipPerson = BrandLeadershipPerson & {
  portrait: BrandLeadershipPortrait;
};

export function selectBrandContentVisuals(
  visuals: readonly BrandContentVisual[]
) {
  const visualByPlacement = new Map<
    BrandVisualPlacement,
    BrandContentVisual
  >();
  const seenVisualSources = new Set<string>();

  for (const visual of visuals) {
    if (
      seenVisualSources.has(visual.src) ||
      visualByPlacement.has(visual.placement)
    ) {
      continue;
    }

    seenVisualSources.add(visual.src);
    visualByPlacement.set(visual.placement, visual);
  }

  return visualByPlacement;
}

export function buildLeadershipRows(
  leadership: BrandProfile["leadership"]
) {
  if (leadership.length === 0) {
    return [
      {
        person: "Not publicly identified",
        role: "Not publicly identified",
        evidenceNote: "No named leader was identified in reviewed sources."
      }
    ];
  }

  return leadership.map((leader) => ({
    person: leader.name,
    role: leader.role,
    evidenceNote:
      leader.context || "Role identified in the reviewed sources."
  }));
}

export function partitionFeaturedLeadership(
  leadership: BrandProfile["leadership"]
): {
  featuredLeader: FeaturedLeadershipPerson | undefined;
  tableLeaders: BrandProfile["leadership"];
} {
  const featuredIndex = leadership.findIndex((leader) => leader.portrait);

  if (featuredIndex < 0) {
    return {
      featuredLeader: undefined,
      tableLeaders: [...leadership]
    };
  }

  return {
    featuredLeader: leadership[featuredIndex] as FeaturedLeadershipPerson,
    tableLeaders: leadership.filter((_, index) => index !== featuredIndex)
  };
}
