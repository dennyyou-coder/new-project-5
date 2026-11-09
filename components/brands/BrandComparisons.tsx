import Link from "next/link";
import { Icon } from "@/components/Icon";

/** Head-to-head comparison guides that involve this company. */
export function BrandComparisons({ name, guides }: { name: string; guides: { slug: string; title: string; excerpt?: string }[] }) {
  if (!guides.length) return null;
  return (
    <section className="bp-card bp-compare" id="compare" aria-labelledby="compare-title">
      <div className="bp-card-head">
        <h2 id="compare-title"><span className="bp-card-icon"><Icon name="target" /></span>Compare {name}</h2>
        <Link className="wcb-more" href="/guides/comparison">All comparisons</Link>
      </div>
      <ul className="bp-compare-list">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/blog/${guide.slug}`}>{guide.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
