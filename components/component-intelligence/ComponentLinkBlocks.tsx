import Link from "next/link";
import "../../app/styles/related-links.css";
import { componentsForEquipment, equipmentForComponent, machineForComponent, machineForEquipment, siblingComponents, type LinkItem } from "@/lib/componentLinks";

function LinkList({ items, base }: { items: readonly LinkItem[]; base: string }) {
  return <ul className="wcb-link-list">{items.map((item) => <li key={item.slug}><Link href={`${base}/${item.slug}`}>{item.name}</Link></li>)}</ul>;
}

export function ComponentRelatedLinks({ slug, components }: { slug: string; components: readonly LinkItem[] }) {
  const machine = machineForComponent(slug);
  const siblings = siblingComponents(slug, components);
  const machines = equipmentForComponent(slug);
  if (!machine || (!siblings.length && !machines.length)) return null;
  return <section className="section component-intelligence-section wcb-related-links" id="related-components" aria-labelledby="related-components-title"><div className="insights-page-container"><header><p className="eyebrow">Keep exploring</p><h2 id="related-components-title">Other {machine.label} components</h2><p>General guides to the same machine type. A link here does not mean two parts fit each other or a particular machine.</p></header><div className="wcb-related-links-grid">{siblings.length ? <div><h3>Components</h3><LinkList items={siblings} base="/components" /></div> : null}{machines.length ? <div><h3>Machine profiles</h3><LinkList items={machines} base="/equipment" /></div> : null}</div></div></section>;
}

export function EquipmentComponentGuides({ slug, components }: { slug: string; components: readonly LinkItem[] }) {
  const machine = machineForEquipment(slug);
  const items = componentsForEquipment(slug, components);
  if (!machine || !items.length) return null;
  return <section className="section equipment-section wcb-related-links" id="component-guides" aria-labelledby="component-guides-title"><div className="insights-page-container"><header><p className="eyebrow">Component guides</p><h2 id="component-guides-title">{machine.label[0].toUpperCase() + machine.label.slice(1)} components</h2><p>General guides to parts used across this machine type. They do not confirm that a part fits this machine or a particular model.</p></header><LinkList items={items} base="/components" /></div></section>;
}
