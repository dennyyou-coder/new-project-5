import fs from "node:fs";
import path from "node:path";

// Component guides are grouped by the machine type in their slug prefix.
// These links point to general guides; they do not claim that a part fits a machine.
export const COMPONENT_MACHINES = [
  { prefix: "floor-scrubber", label: "floor scrubber", equipment: ["floor-scrubber", "walk-behind-floor-scrubber", "ride-on-floor-scrubber", "autonomous-floor-scrubber", "combination-sweeper-scrubber"] },
  { prefix: "pressure-washer", label: "pressure washer", equipment: ["cold-water-pressure-washer", "hot-water-pressure-washer", "electric-pressure-washer", "commercial-pressure-washer"] },
  { prefix: "vacuum-cleaner", label: "vacuum cleaner", equipment: ["upright-vacuum-cleaner", "canister-vacuum-cleaner", "cordless-stick-vacuum", "handheld-vacuum-cleaner", "upright-commercial-vacuum", "backpack-vacuum", "commercial-dry-vacuum", "wet-dry-vacuum"] }
] as const;

export type LinkItem = { slug: string; name: string };

export function machineForComponent(slug: string) {
  return COMPONENT_MACHINES.find(({ prefix }) => slug.startsWith(`${prefix}-`));
}

export function machineForEquipment(slug: string) {
  return COMPONENT_MACHINES.find(({ equipment }) => (equipment as readonly string[]).includes(slug));
}

export function siblingComponents(slug: string, components: readonly LinkItem[]): LinkItem[] {
  const machine = machineForComponent(slug);
  if (!machine) return [];
  return components.filter((item) => item.slug !== slug && item.slug.startsWith(`${machine.prefix}-`)).sort((a, b) => a.name.localeCompare(b.name));
}

export function componentsForEquipment(slug: string, components: readonly LinkItem[]): LinkItem[] {
  const machine = machineForEquipment(slug);
  if (!machine) return [];
  return components.filter((item) => item.slug.startsWith(`${machine.prefix}-`)).sort((a, b) => a.name.localeCompare(b.name));
}

let equipmentCache: LinkItem[] | undefined;
// Published equipment names, read directly so component pages do not depend on brand data.
export function publishedEquipmentLinks(): LinkItem[] {
  if (equipmentCache) return equipmentCache;
  const dir = path.join(process.cwd(), "content/equipment");
  equipmentCache = fs.readdirSync(dir).filter((file) => file.endsWith(".json")).flatMap((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    return data.status === "published" && data.slug && data.name ? [{ slug: String(data.slug), name: String(data.name) }] : [];
  });
  return equipmentCache;
}

export function equipmentForComponent(slug: string, equipment: readonly LinkItem[] = publishedEquipmentLinks()): LinkItem[] {
  const machine = machineForComponent(slug);
  if (!machine) return [];
  return (machine.equipment as readonly string[]).flatMap((target) => equipment.filter((item) => item.slug === target));
}
