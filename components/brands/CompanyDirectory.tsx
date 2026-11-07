"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

export type CompanyDirectoryEntry = {
  slug: string;
  name: string;
  logo: string;
  logoAlt: string;
  headquarters: string;
  country?: string;
  ownership?: string;
  categories: string[];
  search: string;
};

export function CompanyDirectory({
  companies,
  categories,
  countries
}: {
  companies: CompanyDirectoryEntry[];
  categories: { slug: string; name: string }[];
  countries: string[];
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  // A category page links here with ?category=<category slug> so the directory opens already filtered.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (requested && categories.some((item) => item.slug === requested)) setCategory(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const term = query.trim().toLowerCase();
  const visible = companies.filter(
    (company) =>
      (!term || company.search.includes(term)) &&
      (!category || company.categories.includes(category)) &&
      (!country || company.country === country)
  );
  const filtered = Boolean(term || category || country);

  return (
    <section className="company-dir" id="all-companies" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>All companies</h2>
      <div className="company-dir-filters">
        <label>
          Company or brand
          <input type="search" placeholder="Search Miele, BISSELL, Roborock…" value={query} onChange={(event) => setQuery(event.target.value)} aria-controls={`${id}-grid`} />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-controls={`${id}-grid`}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label>
          Headquarters
          <select value={country} onChange={(event) => setCountry(event.target.value)} aria-controls={`${id}-grid`}>
            <option value="">All countries</option>
            {countries.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => { setQuery(""); setCategory(""); setCountry(""); }} disabled={!filtered}>
          Clear
        </button>
      </div>
      <p className="company-dir-count" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? "company" : "companies"}
      </p>
      <ul className="company-dir-grid" id={`${id}-grid`}>
        {visible.map((company) => (
          <li key={company.slug}>
            <Link className="company-dir-card" href={`/brands/${company.slug}`}>
              <span className="company-dir-logo">
                <img src={company.logo} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="company-dir-name">{company.name}</span>
              <span className="company-dir-meta">
                {[company.country ?? "Headquarters not stated", company.ownership].filter(Boolean).join(" · ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {!visible.length ? <p className="company-dir-empty">No matching companies. Try another name or clear the filters.</p> : null}
    </section>
  );
}
