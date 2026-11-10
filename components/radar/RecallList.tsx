"use client";

import { useMemo, useState } from "react";
import { SECTORS, recallName, shortDate, type Recall, type Sector } from "@/lib/radar/classify";

type Source = "all" | "CPSC" | "EU Safety Gate";

const PAGE = 30;

export function RecallList({ recalls }: { recalls: Recall[] }) {
  const [sector, setSector] = useState<Sector | "all">("all");
  const [source, setSource] = useState<Source>("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recalls.filter(
      (recall) =>
        (sector === "all" || recall.sector === sector) &&
        (source === "all" || recall.source === source) &&
        (!q || `${recall.product} ${recall.brand ?? ""} ${recall.hazard} ${recall.madeIn ?? ""}`.toLowerCase().includes(q))
    );
  }, [recalls, sector, source, query]);

  const reset = () => setShown(PAGE);

  return (
    <div className="radar-list">
      <div className="radar-filters" role="group" aria-label="Filter recalls">
        <div className="radar-chips">
          {[{ value: "all", label: "All sectors" }, ...SECTORS].map((option) => (
            <button
              key={option.value}
              type="button"
              className={sector === option.value ? "is-on" : undefined}
              aria-pressed={sector === option.value}
              onClick={() => {
                setSector(option.value as Sector | "all");
                reset();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="radar-chips">
          {(["all", "CPSC", "EU Safety Gate"] as Source[]).map((value) => (
            <button
              key={value}
              type="button"
              className={source === value ? "is-on" : undefined}
              aria-pressed={source === value}
              onClick={() => {
                setSource(value);
                reset();
              }}
            >
              {value === "all" ? "US and EU" : value === "CPSC" ? "US (CPSC)" : "EU (Safety Gate)"}
            </button>
          ))}
        </div>
        <label className="radar-search">
          <span className="wcb-lead-sr">Search recalls</span>
          <input
            type="search"
            placeholder="Search product, brand or hazard"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              reset();
            }}
          />
        </label>
      </div>
      <p className="radar-count" aria-live="polite">
        {filtered.length} recall{filtered.length === 1 ? "" : "s"}
      </p>
      <ol className="radar-items">
        {filtered.slice(0, shown).map((recall) => (
          <li key={recall.id} className="radar-item">
            <div className="radar-item-meta">
              <span className={`radar-badge is-${recall.source === "CPSC" ? "us" : "eu"}`}>{recall.source === "CPSC" ? "US" : "EU"}</span>
              <time dateTime={recall.date}>{shortDate(recall.date)}</time>
              <span className="radar-sector">{SECTORS.find((item) => item.value === recall.sector)?.label}</span>
            </div>
            <h3>
              {recallName(recall)}
            </h3>
            <p className="radar-hazard">{recall.hazard}</p>
            <p className="radar-facts">
              {[recall.risk ? `Risk: ${recall.risk}` : null, recall.units ? `${recall.units} units` : null, recall.madeIn ? `Made in ${recall.madeIn}` : null, recall.source === "CPSC" ? "Sold in the US" : `Reported by ${recall.market}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <a className="radar-link" href={recall.url} target="_blank" rel="noopener noreferrer">
              Official notice ↗
            </a>
          </li>
        ))}
      </ol>
      {filtered.length > shown ? (
        <button type="button" className="radar-more" onClick={() => setShown((value) => value + PAGE)}>
          Show more ({filtered.length - shown} left)
        </button>
      ) : null}
    </div>
  );
}
