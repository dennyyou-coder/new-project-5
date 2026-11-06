/** Reader-facing groups for the equipment and component directories. */
export type CatalogGroup = { id: string; label: string; slugs: string[] };

export const EQUIPMENT_GROUPS: CatalogGroup[] = [
  {
    id: "commercial-floor-machines",
    label: "Commercial floor machines",
    slugs: ["floor-scrubber", "walk-behind-floor-scrubber", "ride-on-floor-scrubber", "autonomous-floor-scrubber", "combination-sweeper-scrubber", "floor-sweeper", "walk-behind-floor-sweeper", "ride-on-floor-sweeper", "floor-burnisher", "single-disc-floor-machine", "escalator-cleaner"]
  },
  {
    id: "commercial-vacuums-extraction",
    label: "Commercial vacuums & extraction",
    slugs: ["commercial-dry-vacuum", "upright-commercial-vacuum", "backpack-vacuum", "wide-area-vacuum", "wet-dry-vacuum", "industrial-dust-extractor", "commercial-robot-vacuum", "carpet-extractor", "carpet-spot-extractor", "commercial-air-mover"]
  },
  {
    id: "pressure-steam",
    label: "Pressure washers & steam",
    slugs: ["commercial-pressure-washer", "cold-water-pressure-washer", "hot-water-pressure-washer", "electric-pressure-washer", "commercial-steam-cleaner"]
  },
  {
    id: "household-floorcare",
    label: "Household floorcare",
    slugs: ["household-robot-vacuum", "cordless-stick-vacuum", "upright-vacuum-cleaner", "canister-vacuum-cleaner", "handheld-vacuum-cleaner", "cordless-wet-dry-floor-cleaner", "steam-mop", "household-carpet-cleaner", "portable-carpet-upholstery-cleaner"]
  },
  {
    id: "pool-cleaning",
    label: "Pool cleaning",
    slugs: ["robotic-pool-cleaner", "robotic-pool-skimmer"]
  },
  {
    id: "home-appliances-air",
    label: "Home appliances & air care",
    slugs: ["front-load-washing-machine", "washer-dryer-combo", "heat-pump-dryer", "dishwasher", "air-purifier", "dehumidifier"]
  }
];

export const COMPONENT_GROUPS: CatalogGroup[] = [
  { id: "floor-scrubber-parts", label: "Floor scrubber parts", slugs: ["floor-scrubber-battery", "floor-scrubber-brush", "floor-scrubber-pad", "floor-scrubber-squeegee-blade", "floor-scrubber-vacuum-motor"] },
  { id: "vacuum-cleaner-parts", label: "Vacuum cleaner parts", slugs: ["vacuum-cleaner-motor", "vacuum-cleaner-battery", "vacuum-cleaner-filter", "vacuum-cleaner-brush-roll", "vacuum-cleaner-belt", "vacuum-cleaner-hose"] },
  { id: "pressure-washer-parts", label: "Pressure washer parts", slugs: ["pressure-washer-pump", "pressure-washer-unloader-valve", "pressure-washer-hose", "pressure-washer-nozzle", "pressure-washer-spray-gun"] }
];

/** Orders items into the groups; anything not listed lands in a final "More" group so nothing disappears. */
export function groupCatalog<T extends { slug: string }>(items: T[], groups: CatalogGroup[]) {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const placed = new Set<string>();
  const result = groups
    .map((group) => {
      const members = group.slugs.map((slug) => bySlug.get(slug)).filter((item): item is T => Boolean(item));
      members.forEach((item) => placed.add(item.slug));
      return { ...group, items: members };
    })
    .filter((group) => group.items.length);
  const rest = items.filter((item) => !placed.has(item.slug));
  if (rest.length) result.push({ id: "more", label: "More", slugs: rest.map((item) => item.slug), items: rest });
  return result;
}
