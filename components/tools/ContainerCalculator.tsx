"use client";

import { useMemo, useState } from "react";
import { fixed, money } from "@/lib/tools/catalog";
import { CONTAINER_DEFAULTS, LCL_THRESHOLD_CBM, calculateContainer, cleanContainerInputs, type ContainerInputs } from "@/lib/tools/container";
import { NumberField, ResultRow, Segmented, ToolEmailForm, useFirstUse } from "./ToolParts";

type NumberKey = Exclude<keyof ContainerInputs, "allowTipping">;

export function ContainerCalculator() {
  const [values, setValues] = useState<Record<NumberKey, string>>(
    () => Object.fromEntries(Object.entries(CONTAINER_DEFAULTS).filter(([key]) => key !== "allowTipping").map(([key, value]) => [key, String(value)])) as Record<NumberKey, string>
  );
  const [allowTipping, setAllowTipping] = useState(false);
  const firstUse = useFirstUse("container-loading");
  const set = (key: NumberKey) => (value: string) => {
    firstUse();
    setValues((current) => ({ ...current, [key]: value }));
  };
  const inputs = useMemo(() => cleanContainerInputs({ ...values, allowTipping }), [values, allowTipping]);
  const result = useMemo(() => calculateContainer(inputs), [inputs]);
  const hq = result.fits.find((fit) => fit.key === "40hq")!;

  return (
    <div className="tool-layout">
      <form className="tool-panel" onSubmit={(event) => event.preventDefault()} aria-label="Carton and order details">
        <h2 className="tool-panel-title">Export carton</h2>
        <div className="tool-grid">
          <NumberField label="Length" suffix="cm" value={values.cartonLength} onChange={set("cartonLength")} />
          <NumberField label="Width" suffix="cm" value={values.cartonWidth} onChange={set("cartonWidth")} />
          <NumberField label="Height" suffix="cm" value={values.cartonHeight} onChange={set("cartonHeight")} hint="Outer size of the master carton" />
          <NumberField label="Gross weight" suffix="kg" value={values.cartonWeight} onChange={set("cartonWeight")} hint="One packed carton" />
          <NumberField label="Units per carton" step="1" value={values.unitsPerCarton} onChange={set("unitsPerCarton")} />
          <Segmented<"up" | "any">
            label="Carton orientation"
            value={allowTipping ? "any" : "up"}
            options={[{ value: "up", label: "This side up" }, { value: "any", label: "Any side" }]}
            onChange={(value) => {
              firstUse();
              setAllowTipping(value === "any");
            }}
          />
        </div>
        <h2 className="tool-panel-title">Order and freight</h2>
        <div className="tool-grid">
          <NumberField label="Order quantity" suffix="units" step="1" value={values.orderUnits} onChange={set("orderUnits")} />
          <NumberField label="20GP freight" prefix="$" value={values.freight20} onChange={set("freight20")} hint="Example rate: enter your forwarder's quote" />
          <NumberField label="40GP freight" prefix="$" value={values.freight40} onChange={set("freight40")} />
          <NumberField label="40HQ freight" prefix="$" value={values.freight40hq} onChange={set("freight40hq")} />
        </div>
        <p className="tool-basis">
          Carton {fixed(result.cartonCbm, 3)} m³. The order is {result.orderCartons.toLocaleString("en-US")} cartons, {fixed(result.orderCbm)} m³ and {Math.round(result.orderWeight).toLocaleString("en-US")} kg.
          {result.orderCbm < LCL_THRESHOLD_CBM ? " At under 15 m³, a shared container (LCL) is usually cheaper than a full one." : ""}
        </p>
      </form>

      <section className="tool-result" aria-live="polite" aria-label="Container load">
        <p className="tool-kicker">One 40HQ holds</p>
        <p className="tool-big">{hq.units.toLocaleString("en-US")} units</p>
        <p className="tool-sub">
          {hq.cartons.toLocaleString("en-US")} cartons, limited by {hq.limit}
          {hq.freightPerUnit !== null ? `, ${money(hq.freightPerUnit, "USD", 2)} sea freight per unit` : ""}
        </p>
        <div className="tool-table-wrap">
          <table className="tool-table">
            <thead>
              <tr>
                <th scope="col">Container</th>
                <th scope="col">Cartons</th>
                <th scope="col">Units</th>
                <th scope="col" className="tool-col-space">Space used</th>
                <th scope="col">Freight / unit</th>
              </tr>
            </thead>
            <tbody>
              {result.fits.map((fit) => (
                <tr key={fit.key}>
                  <th scope="row">{fit.label}</th>
                  <td>{fit.cartons.toLocaleString("en-US")}{fit.limit === "weight" ? <small> weight</small> : null}</td>
                  <td>{fit.units.toLocaleString("en-US")}</td>
                  <td className="tool-col-space">{fixed(fit.volumeUsed, 0)}%</td>
                  <td>{fit.freightPerUnit !== null ? money(fit.freightPerUnit, "USD", 2) : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tool-rows">
          {result.fits.map((fit) => (
            <ResultRow
              key={fit.key}
              label={`${inputs.orderUnits.toLocaleString("en-US")} units in ${fit.label}`}
              value={fit.containersForOrder ? `${fit.containersForOrder} × ${fit.label}` : "Does not fit"}
              note={fit.freight > 0 && fit.containersForOrder ? `${money(fit.freightForOrder)} freight` : undefined}
              strong={result.cheapest?.key === fit.key}
            />
          ))}
        </div>
        {result.cheapest ? <p className="tool-sub">Cheapest single container type for this order: {result.cheapest.label}. Mixing sizes (say, 40HQ plus a 20GP for the rest) can cost less again.</p> : null}
        <ToolEmailForm tool="container-loading" inputs={{ ...inputs }} />
      </section>
    </div>
  );
}
