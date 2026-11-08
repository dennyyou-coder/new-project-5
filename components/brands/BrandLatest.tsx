import Link from "next/link";
import { Icon } from "@/components/Icon";

export type BrandLatestItem = { kind: "News" | "Results" | "New product" | "Analysis"; title: string; href: string; date: string; dateLabel: string; note?: string };

/** What happened at this company most recently: newest news, results, product and analysis, newest first. */
export function BrandLatest({ name, items }: { name: string; items: BrandLatestItem[] }) {
  if (!items.length) return null;
  return (
    <section className="bp-card bp-latest" id="latest" aria-labelledby="latest-title">
      <div className="bp-card-head">
        <h2 id="latest-title"><span className="bp-card-icon"><Icon name="activity" /></span>Latest at {name}</h2>
        <span className="bp-latest-updated">Updated {items[0].dateLabel}</span>
      </div>
      <ul className="bp-latest-list">
        {items.map((item) => (
          <li key={`${item.kind}-${item.href}`}>
            <span className={`bp-latest-kind bp-latest-kind--${item.kind.toLowerCase().replace(/\s+/g, "-")}`}>{item.kind}</span>
            <span className="bp-latest-copy">
              <Link href={item.href}>{item.title}</Link>
              {item.note ? <span className="bp-latest-note">{item.note}</span> : null}
            </span>
            <time dateTime={item.date}>{item.dateLabel}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
