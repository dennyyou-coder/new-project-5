import type { Metadata } from "next";
import Link from "next/link";
import "../styles/search.css";
import { SEARCH_KINDS, searchLimit, searchSite } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search World Clean Biz for companies, products, topics, news and analysis across the cleaning industry.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true }
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const SUGGESTIONS = ["Roborock", "FCC", "anti-dumping", "pool robots", "Dreame", "SharkNinja", "robotic mowers", "OEM"];

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 100);
  const { groups, total } = searchSite(query);
  const shown = SEARCH_KINDS.filter((kind) => (groups.get(kind)?.length ?? 0) > 0);

  return (
    <div className="search-page">
      <header className="search-hero">
        <div className="search-container">
          <h1>{query ? `Results for “${query}”` : "Search World Clean Biz"}</h1>
          <form className="search-form" action="/search" method="get" role="search">
            <label className="search-sr-only" htmlFor="site-search-input">Search companies, products, topics, news and analysis</label>
            <input id="site-search-input" name="q" type="search" defaultValue={query} placeholder="Company, product, topic or keyword" autoComplete="off" autoFocus={!query} />
            <button type="submit">Search</button>
          </form>
          {query ? (
            <p className="search-count">{total ? `${total} result${total === 1 ? "" : "s"}` : "No results"}</p>
          ) : null}
        </div>
      </header>

      <div className="search-container search-body">
        {!query || !total ? (
          <div className="search-empty">
            <p>{query ? "Nothing matched every word. Try fewer or shorter words, or one of these:" : "Try a company, product, category or topic:"}</p>
            <ul>
              {SUGGESTIONS.map((term) => (
                <li key={term}><Link href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link></li>
              ))}
            </ul>
          </div>
        ) : null}

        {shown.length > 1 ? (
          <nav className="search-jump" aria-label="Result groups">
            {shown.map((kind) => (
              <a key={kind} href={`#results-${kind.toLowerCase()}`}>{kind} <span>{groups.get(kind)!.length}</span></a>
            ))}
          </nav>
        ) : null}

        {shown.map((kind) => {
          const hits = groups.get(kind)!;
          const limit = searchLimit(kind);
          return (
            <section key={kind} className="search-group" id={`results-${kind.toLowerCase()}`} aria-labelledby={`results-${kind.toLowerCase()}-title`}>
              <h2 id={`results-${kind.toLowerCase()}-title`}>{kind} <span>{hits.length}</span></h2>
              <ul>
                {hits.slice(0, limit).map(({ entry }) => (
                  <li key={entry.href}>
                    <Link href={entry.href}>
                      <span className="search-title">{entry.title}</span>
                      {entry.meta ? <span className="search-meta">{entry.meta}</span> : null}
                      {entry.summary ? <span className="search-summary">{entry.summary}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
              {hits.length > limit ? (
                <p className="search-more">Showing {limit} of {hits.length}. Add a word to narrow the results.</p>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
