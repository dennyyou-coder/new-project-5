"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ImgHTMLAttributes } from "react";

type Card = {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  summary: string;
  market: string;
  launchYear: number;
  facts: { label: string; value: string }[];
  image: ImgHTMLAttributes<HTMLImageElement>;
};

const categoryId = (category: string) => `products-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

function ProductCard({ model, showCategory }: { model: Card; showCategory: boolean }) {
  return (
    <Link className="pv-card" href={`/products/${model.slug}`}>
      <span className="pv-card-image"><img {...model.image} alt={model.name} /></span>
      <span className="pv-card-copy">
        <small>{model.brand}{showCategory ? ` · ${model.category}` : ""}</small>
        <b>{model.name}</b>
        <span className="pv-card-summary">{model.summary}</span>
        {model.facts.length ? (
          <span className="pv-card-facts">
            {model.facts.slice(0, 3).map((fact) => (
              <span key={fact.label}><i>{fact.label}</i>{fact.value}</span>
            ))}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

/** Product library: grouped by category when unfiltered, a flat result grid when filtered. */
export function ProductDirectory({ models, aliases = {} }: { models: Card[]; aliases?: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("selected");
  const categories = [...new Set(models.map((model) => model.category))];
  // A category page links here with ?category=… so the library opens already filtered.
  useEffect(() => {
    // Older links may use a product-data name ("Robot mowers") instead of the category name.
    const raw = new URLSearchParams(window.location.search).get("category");
    const requested = raw ? aliases[raw] ?? raw : null;
    if (requested && categories.includes(requested)) setCategory(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filtered = models
    .filter(
      (model) =>
        (!category || model.category === category) &&
        (!brand || model.brand === brand) &&
        query
          .trim()
          .toLowerCase()
          .split(/\s+/)
          .every((term) => `${model.name} ${model.brand} ${model.category} ${model.summary}`.toLowerCase().includes(term))
    )
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : 0));
  const isFiltered = Boolean(query || category || brand || sort !== "selected");
  function reset() {
    setQuery("");
    setCategory("");
    setBrand("");
    setSort("selected");
  }

  return (
    <section id="model-directory" className="product-directory pv-directory" aria-label="Browse product models">
      <div className="product-filters">
        <label className="product-search">Search models<input type="search" placeholder="Try Saros, Aiper or robot mower" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label>Category<select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Brand<select aria-label="Brand" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">All brands</option>{[...new Set(models.map((model) => model.brand))].sort().map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Sort by<select aria-label="Sort by" value={sort} onChange={(event) => setSort(event.target.value)}><option value="selected">Editorial selection</option><option value="name">Name A–Z</option></select></label>
      </div>

      {isFiltered ? (
        <>
          <div className="product-result-bar"><p role="status" aria-live="polite">{filtered.length} of {models.length} models</p><button type="button" onClick={reset}>Clear filters</button></div>
          <div className="pv-grid" id="product-model-grid">{filtered.map((model) => <ProductCard key={model.slug} model={model} showCategory={!category} />)}</div>
          {!filtered.length && <div className="product-empty"><h2>No matching models yet</h2><p>Try another model name, brand or category.</p><button type="button" onClick={reset}>Show all models</button></div>}
        </>
      ) : (
        <>
          <nav className="pv-jump" aria-label="Product categories">
            {categories.map((value) => (
              <a key={value} href={`#${categoryId(value)}`}>{value}<span>{models.filter((model) => model.category === value).length}</span></a>
            ))}
          </nav>
          {categories.map((value) => {
            const group = models.filter((model) => model.category === value);
            return (
              <section className="pv-group" id={categoryId(value)} key={value} aria-labelledby={`${categoryId(value)}-title`}>
                <div className="pv-group-head">
                  <h2 id={`${categoryId(value)}-title`}>{value}</h2>
                  <span>{group.length} models</span>
                </div>
                <div className="pv-grid">{group.map((model) => <ProductCard key={model.slug} model={model} showCategory={false} />)}</div>
              </section>
            );
          })}
        </>
      )}
    </section>
  );
}
