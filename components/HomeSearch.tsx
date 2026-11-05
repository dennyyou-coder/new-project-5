"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";

export type HomeSearchEntry = { label: string; kind: string; href: string; terms: string };

// First version: jumps to existing directory and profile pages. There is no
// full-text search yet; unmatched queries point to the main directories.
export function HomeSearch({ entries }: { entries: HomeSearchEntry[] }) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    // Each query word must start a word in the entry (so "pool" finds
    // "Pool robots" but not "Whirlpool").
    return entries
      .filter((entry) => {
        const tokens = entry.terms.split(/[^a-z0-9]+/).filter(Boolean);
        return words.every((word) => tokens.some((token) => token.startsWith(word)));
      })
      .slice(0, 8);
  }, [entries, query]);
  const hasQuery = query.trim().length > 0;

  return (
    <form
      className="home-b-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        if (results[0]) router.push(results[0].href);
      }}
    >
      <label htmlFor={inputId}>Search companies, products and categories</label>
      <div className="home-b-search-row">
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          placeholder="e.g. Roborock, pool robots, Saros"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </div>
      <p className="home-b-search-status" role="status" aria-live="polite">
        {hasQuery ? (results.length ? `${results.length} match${results.length === 1 ? "" : "es"}` : "No direct match") : ""}
      </p>
      {results.length > 0 ? (
        <ul className="home-b-search-results">
          {results.map((entry) => (
            <li key={entry.href}>
              <Link href={entry.href}>
                <span>{entry.label}</span>
                <span className="home-b-search-kind">{entry.kind}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : hasQuery ? (
        <p className="home-b-search-empty">
          Try <Link href="/news">News</Link>, <Link href="/blog/archive">Analysis</Link> or{" "}
          <Link href="/guides">Guides</Link>.
        </p>
      ) : null}
    </form>
  );
}
