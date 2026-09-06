"use client";

import Link from "next/link";
import { useState } from "react";
import type { ImgHTMLAttributes } from "react";

type Card = { slug: string; name: string; brand: string; category: string; summary: string; market: string; announced: string | null; image: ImgHTMLAttributes<HTMLImageElement> };

export function ProductDirectory({ models }: { models: Card[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("selected");
  const filtered = models.filter((model) => (!category || model.category === category) && (!brand || model.brand === brand)
    && query.trim().toLowerCase().split(/\s+/).every((term) => `${model.name} ${model.category} ${model.summary}`.toLowerCase().includes(term)))
    .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "announced" ? (b.announced || "").localeCompare(a.announced || "") : 0);
  function reset() { setQuery(""); setCategory(""); setBrand(""); setSort("selected"); }
  return <section id="model-directory" className="product-directory" aria-label="Browse product models">
    <div className="product-filters">
      <label className="product-search">Search models<input type="search" placeholder="Try Saros, Aiper or robot mower" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <label>Category<select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{[...new Set(models.map((model) => model.category))].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Brand<select aria-label="Brand" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">All brands</option>{[...new Set(models.map((model) => model.brand))].sort().map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Sort by<select aria-label="Sort by" value={sort} onChange={(event) => setSort(event.target.value)}><option value="selected">Editorial selection</option><option value="name">Name A–Z</option><option value="announced">Dated announcements</option></select></label>
    </div>
    <div className="product-result-bar"><p role="status" aria-live="polite">{filtered.length} of {models.length} models</p>{(query || category || brand || sort !== "selected") && <button type="button" onClick={reset}>Clear filters</button>}</div>
    {sort === "announced" && <p className="product-note">Newest confirmed announcement dates first. Models without a verified announcement date follow; an announcement is not a local release date.</p>}
    <div className="product-grid">{filtered.map((model) => <Link className="product-card" key={model.slug} href={`/products/${model.slug}`}>
      <div className="product-card-image"><img {...model.image} alt={model.name} /></div>
      <div className="product-card-copy"><p className="product-eyebrow">{model.category}</p><h2>{model.name}</h2><p>{model.summary}</p><span className="product-market">{model.market}</span><div className="product-card-footer">Explore model <span aria-hidden="true">↗</span></div></div>
    </Link>)}</div>
    {!filtered.length && <div className="product-empty"><h2>No matching models yet</h2><p>Try another model name, brand or category.</p><button type="button" onClick={reset}>Show all models</button></div>}
  </section>;
}
