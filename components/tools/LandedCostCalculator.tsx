"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fixed, money } from "@/lib/tools/catalog";
import {
  EU_VAT,
  LANDED_DEFAULTS,
  ORIGINS,
  PRODUCTS,
  calculateLanded,
  cleanLandedInputs,
  insuranceAmount,
  type Destination,
  type LandedInputs,
  type Mode,
  type Origin,
  type ProductKey
} from "@/lib/tools/landedCost";
import { NumberField, ResultRow, Segmented, SelectField, ToolEmailForm, useFirstUse } from "./ToolParts";

type NumericKey = "unitPrice" | "units" | "freight" | "insurance" | "otherCosts" | "customDuty" | "customUs301" | "antiDumping";

const PRODUCT_OPTIONS: { value: ProductKey; label: string }[] = [
  ...(Object.entries(PRODUCTS) as [Exclude<ProductKey, "custom">, (typeof PRODUCTS)["vacuum"]][]).map(([value, product]) => ({ value, label: `${product.label} (HS ${product.hs})` })),
  { value: "custom", label: "Other product: enter your own rates" }
];
const ORIGIN_OPTIONS = (Object.entries(ORIGINS) as [Origin, { label: string }][]).map(([value, origin]) => ({ value, label: origin.label }));
const EU_OPTIONS = Object.entries(EU_VAT).map(([value, country]) => ({ value, label: `${country.label} (VAT ${country.vat}%)` }));

export function LandedCostCalculator() {
  const [choices, setChoices] = useState({
    product: LANDED_DEFAULTS.product,
    origin: LANDED_DEFAULTS.origin,
    destination: LANDED_DEFAULTS.destination,
    euCountry: LANDED_DEFAULTS.euCountry,
    mode: LANDED_DEFAULTS.mode
  });
  const [numbers, setNumbers] = useState<Record<NumericKey, string>>(() => {
    const d = LANDED_DEFAULTS;
    return {
      unitPrice: String(d.unitPrice),
      units: String(d.units),
      freight: String(d.freight),
      insurance: String(d.insurance),
      otherCosts: String(d.otherCosts),
      customDuty: String(d.customDuty),
      customUs301: String(d.customUs301),
      antiDumping: String(d.antiDumping)
    };
  });
  const firstUse = useFirstUse("landed-cost");
  const setChoice = <K extends keyof typeof choices>(key: K, value: (typeof choices)[K]) => {
    firstUse();
    setChoices((current) => ({ ...current, [key]: value }));
  };
  const setNumber = (key: NumericKey) => (value: string) => {
    firstUse();
    setNumbers((current) => ({ ...current, [key]: value }));
  };

  const inputs: LandedInputs = useMemo(() => cleanLandedInputs({ ...choices, ...numbers }), [choices, numbers]);
  const result = useMemo(() => calculateLanded(inputs), [inputs]);
  const product = inputs.product === "custom" ? undefined : PRODUCTS[inputs.product];
  const showAntiDumping = inputs.destination === "eu" && inputs.product === "mower" && inputs.origin === "cn";

  return (
    <div className="tool-layout">
      <form className="tool-panel" onSubmit={(event) => event.preventDefault()} aria-label="Shipment details">
        <h2 className="tool-panel-title">Your shipment</h2>
        <div className="tool-grid">
          <div className="tool-span">
            <SelectField label="Product" value={choices.product} options={PRODUCT_OPTIONS} onChange={(value) => setChoice("product", value)} />
          </div>
          <SelectField label="Made in" value={choices.origin} options={ORIGIN_OPTIONS} onChange={(value) => setChoice("origin", value)} />
          <Segmented<Destination>
            label="Shipping to"
            value={choices.destination}
            options={[{ value: "us", label: "US" }, { value: "eu", label: "EU" }, { value: "uk", label: "UK" }]}
            onChange={(value) => setChoice("destination", value)}
          />
          {choices.destination === "eu" ? (
            <div className="tool-span">
              <SelectField label="EU country of import" value={choices.euCountry} options={EU_OPTIONS} onChange={(value) => setChoice("euCountry", value)} />
            </div>
          ) : null}
          {choices.destination === "us" ? (
            <div className="tool-span">
              <Segmented<Mode> label="Shipped by" value={choices.mode} options={[{ value: "ocean", label: "Sea" }, { value: "air", label: "Air" }]} onChange={(value) => setChoice("mode", value)} />
            </div>
          ) : null}
          <NumberField label="Factory price per unit (FOB)" prefix="$" value={numbers.unitPrice} onChange={setNumber("unitPrice")} />
          <NumberField label="Units" step="1" value={numbers.units} onChange={setNumber("units")} />
          <NumberField label="Freight, whole shipment" prefix="$" value={numbers.freight} onChange={setNumber("freight")} hint="Port to port" />
          <NumberField label="Cargo insurance" suffix="%" value={numbers.insurance} onChange={setNumber("insurance")} hint="Of goods value" />
          <div className="tool-span">
            <NumberField label="Broker, port and delivery costs" prefix="$" value={numbers.otherCosts} onChange={setNumber("otherCosts")} />
          </div>
          {inputs.product === "custom" ? (
            <>
              <NumberField label={choices.destination === "us" ? "US general duty" : `${choices.destination.toUpperCase()} customs duty`} suffix="%" value={numbers.customDuty} onChange={setNumber("customDuty")} />
              {choices.destination === "us" && choices.origin === "cn" ? (
                <NumberField label="Section 301 China duty" suffix="%" value={numbers.customUs301} onChange={setNumber("customUs301")} hint="Usually 25% or 7.5%" />
              ) : null}
            </>
          ) : null}
          {showAntiDumping ? (
            <div className="tool-span tool-callout">
              <NumberField label="Model an EU anti-dumping duty" suffix="%" value={numbers.antiDumping} onChange={setNumber("antiDumping")} />
              <span className="tool-quick">
                Try:{" "}
                {["0", "45.6", "53.3"].map((rate) => (
                  <button key={rate} type="button" onClick={() => setNumber("antiDumping")(rate)}>{rate}%</button>
                ))}
              </span>
              <span className="tool-hint">
                Rates reported at disclosure, not yet published. <Link href="/topics/eu-robotic-mower-anti-dumping">Follow the case</Link>
              </span>
            </div>
          ) : null}
        </div>
        {product ? <p className="tool-basis"><strong>HS {product.hs}.</strong> {product.basis}</p> : null}
      </form>

      <section className="tool-result" aria-live="polite" aria-label="Landed cost">
        <p className="tool-kicker">Landed cost per unit</p>
        <p className="tool-big">{money(result.landedPerUnit, "USD", 2)}</p>
        <p className="tool-sub">
          {money(result.landedTotal)} for {inputs.units.toLocaleString("en-US")} units · duties and fees {fixed(result.effectiveDutyRate)}% of goods value
        </p>
        <div className="tool-rows">
          <ResultRow label="Goods (FOB)" value={money(result.goods)} />
          <ResultRow label="Freight" value={money(inputs.freight)} />
          <ResultRow label="Insurance" value={money(insuranceAmount(inputs))} />
          {result.lines.map((line) => (
            <ResultRow key={line.label} label={line.label} note={line.note} value={money(line.amount)} />
          ))}
          <ResultRow label="Broker, port and delivery" value={money(inputs.otherCosts)} />
          <ResultRow label="Landed cost" value={money(result.landedTotal)} strong />
          {result.vat ? <ResultRow label={`Import VAT (${result.vatRate}%)`} note="Usually reclaimed by a VAT-registered importer" value={money(result.vat)} /> : null}
        </div>
        <ul className="tool-notes">
          <li>{result.customsBasis}</li>
          {result.rateNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <ToolEmailForm tool="landed-cost" inputs={inputs as unknown as Record<string, unknown>} />
      </section>
    </div>
  );
}
