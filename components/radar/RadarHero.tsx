import Link from "next/link";

export function RadarHero({ title, lead, updated, sources }: { title: string; lead: string; updated: string; sources: string }) {
  return (
    <section className="tool-hero">
      <div className="container">
        <p className="tool-crumbs">
          <Link href="/tools">Tools</Link> <span aria-hidden="true">/</span> Industry radar
        </p>
        <h1>{title}</h1>
        <p className="tool-hero-lead">{lead}</p>
        <p className="tool-updated">Updated {updated} · {sources}</p>
      </div>
    </section>
  );
}
