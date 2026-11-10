"use client";

import { useMemo, useState } from "react";
import { SECTORS, shortDate, type Sector } from "@/lib/radar/classify";
import { FILING_TYPE_LABELS, fccIdUrl, type FccCompany, type FccFiling } from "@/lib/radar/fcc";

export function FccFilingList({ filings, companies }: { filings: FccFiling[]; companies: FccCompany[] }) {
  const [sector, setSector] = useState<Sector | "all">("all");
  const [onlyNew, setOnlyNew] = useState(false);
  const sectorOf = useMemo(() => new Map(companies.map((company) => [company.name, company.sector])), [companies]);
  const filtered = filings.filter((filing) => (sector === "all" || sectorOf.get(filing.company) === sector) && (!onlyNew || filing.type === "new"));

  return (
    <div className="radar-list">
      <div className="radar-filters" role="group" aria-label="Filter filings">
        <div className="radar-chips">
          {[{ value: "all", label: "All sectors" }, ...SECTORS].map((option) => (
            <button
              key={option.value}
              type="button"
              className={sector === option.value ? "is-on" : undefined}
              aria-pressed={sector === option.value}
              onClick={() => setSector(option.value as Sector | "all")}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="radar-toggle">
          <input type="checkbox" checked={onlyNew} onChange={(event) => setOnlyNew(event.target.checked)} />
          <span>New products only</span>
        </label>
      </div>
      <p className="radar-count" aria-live="polite">{filtered.length} filings</p>
      <div className="radar-table-wrap" tabIndex={0} role="region" aria-label="FCC filings">
        <table className="radar-table">
          <thead>
            <tr>
              <th scope="col">Granted</th>
              <th scope="col">Company</th>
              <th scope="col">FCC ID</th>
              <th scope="col">Filing</th>
              <th scope="col">Radios</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((filing) => (
              <tr key={`${filing.fccId}-${filing.date}-${filing.type}`}>
                <td><time dateTime={filing.date}>{shortDate(filing.date)}</time></td>
                <td>{filing.company}</td>
                <td>
                  <a href={fccIdUrl(filing.fccId)} target="_blank" rel="noopener noreferrer">{filing.fccId}</a>
                </td>
                <td className={filing.type === "new" ? "is-new" : undefined}>{FILING_TYPE_LABELS[filing.type]}</td>
                <td>{filing.bands.join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
