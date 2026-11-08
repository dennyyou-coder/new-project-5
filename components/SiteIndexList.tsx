import Link from "next/link";
import type { IndexGroup } from "@/lib/siteIndex";

export function SiteIndexHero({ title, lead, back }: { title: string; lead: string; back?: boolean }) {
  return (
    <section className="trust-hero trust-legal-hero">
      <div className="container trust-hero-inner">
        <p className="eyebrow">{back ? <Link href="/site-index">Site index</Link> : "World Clean Biz"}</p>
        <h1>{title}</h1>
        <p className="trust-hero-lead">{lead}</p>
      </div>
    </section>
  );
}

export function SiteIndexGroups({ groups }: { groups: IndexGroup[] }) {
  return (
    <section className="section site-index">
      <div className="container">
        {groups.map((group) => (
          <section className="site-index-group" key={group.title} aria-labelledby={`si-${slug(group.title)}`}>
            <h2 id={`si-${slug(group.title)}`}>{group.title} <span>{group.links.length}</span></h2>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}><Link href={link.href} prefetch={false}>{link.label}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
