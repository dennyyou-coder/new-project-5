"use client";

import { useState, type ReactNode } from "react";

type Category = { slug: string; name: string; description: string; profiles: { slug: string; search: string; card: ReactNode }[] };
export function BrandDirectory({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const term = query.trim().toLowerCase();
  const seen = new Set<string>();
  const visible = categories.filter((item) => !category || item.slug === category).map((item) => ({
    ...item, profiles: item.profiles.filter((profile) => {
      if (term && (!profile.search.includes(term) || seen.has(profile.slug))) return false;
      seen.add(profile.slug);
      return true;
    })
  })).filter((item) => item.profiles.length > 0);
  function reset() { setQuery(""); setCategory(""); }
  return <>
    <nav className="brand-jump-links" aria-label="Company buying categories">{categories.map((item) => <a key={item.slug} href={`#${item.slug}`} onClick={reset}>{item.name}</a>)}</nav>
    <div className="company-search insights-page-container">
      <p className="eyebrow">Find a company</p>
      <div className="company-search-row">
        <label>Company or brand name<input type="search" placeholder="Search Miele, BISSELL, Roborock…" value={query} onChange={(event) => setQuery(event.target.value)} aria-controls="company-directory-results" /></label>
        <label>Business category<select value={category} onChange={(event) => setCategory(event.target.value)} aria-controls="company-directory-results"><option value="">All categories</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
        <button className="company-clear" type="button" onClick={reset} disabled={!query && !category}>Clear filters</button>
      </div>
      <p className="company-results" role="status" aria-live="polite">{seen.size} {seen.size === 1 ? "company" : "companies"}{term ? " matching your search." : category ? " in this category." : " · Companies can appear in more than one relevant category."}</p>
    </div>
    <div id="company-directory-results">{visible.map((item, index) => <section className={`section brand-category-list${index % 2 ? " brand-category-list--soft" : ""}`} id={item.slug} key={item.slug}>
      <div className="insights-page-container"><div className="brand-category-list__intro"><p className="eyebrow">Buying category</p><h2>{item.name}</h2><p>{item.description}</p></div>
        <div className="guides-featured-grid brand-directory-grid">{item.profiles.map((profile) => <div className="brand-directory-slot" key={profile.slug}>{profile.card}</div>)}</div>
      </div>
    </section>)}{!visible.length && <p className="company-empty insights-page-container">No matching companies. Try another name or clear the filters.</p>}</div>
  </>;
}
