"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CERT_MARKETS,
  CERT_PRODUCTS,
  LEVEL_LABELS,
  checklistFor,
  formatCertDate,
  type CertLevel,
  type CertMarket,
  type CertProduct
} from "@/lib/tools/certifications";
import { Segmented, SelectField, ToolEmailForm, useFirstUse } from "./ToolParts";

const LEVEL_ORDER: CertLevel[] = ["required", "retailer", "check"];

export function ComplianceChecklist({ today }: { today: string }) {
  const [product, setProduct] = useState<CertProduct>("robot-vacuum");
  const [market, setMarket] = useState<CertMarket>("eu");
  const [connected, setConnected] = useState(true);
  const firstUse = useFirstUse("export-compliance");

  const items = useMemo(() => checklistFor(market, { product, connected }), [market, product, connected]);
  const upcoming = items.filter((item) => item.date && item.date >= today).sort((a, b) => a.date!.localeCompare(b.date!));

  return (
    <div className="tool-layout tool-layout--wide">
      <form className="tool-panel tool-panel--bar" onSubmit={(event) => event.preventDefault()} aria-label="Product and market">
        <SelectField
          label="Product"
          value={product}
          options={CERT_PRODUCTS.map(({ value, label }) => ({ value, label }))}
          onChange={(value) => {
            firstUse();
            setProduct(value);
            setConnected(CERT_PRODUCTS.find((item) => item.value === value)!.connectedByDefault);
          }}
        />
        <Segmented<CertMarket>
          label="Market"
          value={market}
          options={CERT_MARKETS.map(({ value }) => ({ value, label: value.toUpperCase() }))}
          onChange={(value) => {
            firstUse();
            setMarket(value);
          }}
        />
        <Segmented<"yes" | "no">
          label="Wi-Fi, Bluetooth or app control"
          value={connected ? "yes" : "no"}
          options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
          onChange={(value) => {
            firstUse();
            setConnected(value === "yes");
          }}
        />
      </form>

      <div className="tool-checklist" aria-live="polite">
        <div className="tool-checklist-head">
          <h2>
            {CERT_MARKETS.find((item) => item.value === market)!.label}: {items.length} items
          </h2>
          <p>
            {LEVEL_ORDER.map((level) => [level, items.filter((item) => item.level === level).length] as const)
              .filter(([, count]) => count > 0)
              .map(([level, count]) => `${count} ${LEVEL_LABELS[level].toLowerCase()}`)
              .join(" · ")}
          </p>
        </div>
        {upcoming.length ? (
          <div className="tool-dates">
            <strong>Coming up</strong>
            {upcoming.map((item) => (
              <span key={item.id}>
                {formatCertDate(item.date!)} · {item.name}
              </span>
            ))}
          </div>
        ) : null}
        {LEVEL_ORDER.map((level) => {
          const group = items.filter((item) => item.level === level);
          if (!group.length) return null;
          return (
            <section key={level} className={`tool-cert-group is-${level}`}>
              <h3>{LEVEL_LABELS[level]}</h3>
              <ol>
                {group.map((item) => (
                  <li key={item.id} className="tool-cert">
                    <span className="tool-cert-name">{item.name}</span>
                    {item.date ? (
                      <span className="tool-cert-date">
                        {item.dateLabel} {formatCertDate(item.date)}
                      </span>
                    ) : null}
                    <span className="tool-cert-what">{item.what}</span>
                    {item.href ? (
                      <Link className="tool-cert-link" href={item.href}>
                        Read WCB&apos;s coverage
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
        <div className="tool-result tool-result--inline">
          <ToolEmailForm tool="export-compliance" inputs={{ product, market, connected }} label="Email me this checklist" />
        </div>
      </div>
    </div>
  );
}
