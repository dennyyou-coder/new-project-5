import Image from "next/image";
import Link from "next/link";

export type CatalogCard = { slug: string; href: string; name: string; image: string; alt: string; text: string };
export type CatalogCardGroup = { id: string; label: string; items: CatalogCard[] };

/** Grouped directory: jump links, then one compact card grid per group. */
export function CatalogGroupedGrid({ groups, label }: { groups: CatalogCardGroup[]; label: string }) {
  return (
    <div className="cg">
      <nav className="cg-jump" aria-label={label}>
        {groups.map((group) => (
          <a key={group.id} href={`#${group.id}`}>{group.label}<span>{group.items.length}</span></a>
        ))}
      </nav>
      {groups.map((group) => (
        <section className="cg-group" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
          <div className="cg-group-head">
            <h2 id={`${group.id}-title`}>{group.label}</h2>
            <span>{group.items.length} profiles</span>
          </div>
          <div className="cg-grid">
            {group.items.map((item) => (
              <Link className="cg-card" href={item.href} key={item.slug}>
                <span className="cg-card-image"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 560px) 112px, (max-width: 860px) 50vw, 320px" /></span>
                <span className="cg-card-copy">
                  <b>{item.name}</b>
                  <span>{item.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
