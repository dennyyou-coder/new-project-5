"use client";

import { useMemo, useState } from "react";
import { fixed } from "@/lib/tools/catalog";
import { BATTERY_DEFAULTS, BATTERY_PACKINGS, calculateBattery, cleanBatteryInputs, type BatteryInputs, type BatteryMode, type BatteryPacking } from "@/lib/tools/battery";
import { NumberField, ResultRow, SelectField, ToolEmailForm, useFirstUse } from "./ToolParts";

type NumberKey = Exclude<keyof BatteryInputs, "packing">;

const VERDICT_LABEL = { ok: "Simple rules", restricted: "Dangerous goods", forbidden: "Not allowed" } as const;

function ModeCard({ mode }: { mode: BatteryMode }) {
  return (
    <div className={`tool-verdict is-${mode.verdict}`}>
      <div className="tool-verdict-head">
        <strong>{mode.title}</strong>
        <span className="tool-verdict-tag">{VERDICT_LABEL[mode.verdict]}</span>
      </div>
      <p>{mode.headline}</p>
      {mode.points.length ? (
        <ul className="tool-notes">
          {mode.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function BatteryChecker() {
  const [packing, setPacking] = useState<BatteryPacking>(BATTERY_DEFAULTS.packing);
  const [values, setValues] = useState<Record<NumberKey, string>>(
    () => Object.fromEntries(Object.entries(BATTERY_DEFAULTS).filter(([key]) => key !== "packing").map(([key, value]) => [key, String(value)])) as Record<NumberKey, string>
  );
  const firstUse = useFirstUse("battery-shipping");
  const set = (key: NumberKey) => (value: string) => {
    firstUse();
    setValues((current) => ({ ...current, [key]: value }));
  };
  const inputs = useMemo(() => cleanBatteryInputs({ ...values, packing }), [values, packing]);
  const result = useMemo(() => calculateBattery(inputs), [inputs]);

  return (
    <>
    <div className="tool-layout">
      <form className="tool-panel" onSubmit={(event) => event.preventDefault()} aria-label="Battery details">
        <h2 className="tool-panel-title">Battery pack</h2>
        <div className="tool-grid">
          <NumberField label="Nominal voltage" suffix="V" value={values.voltage} onChange={set("voltage")} hint="On the label, e.g. 18, 21.6, 25.2" />
          <NumberField label="Rated capacity" suffix="mAh" value={values.capacity} onChange={set("capacity")} hint="2.5 Ah = 2,500 mAh" />
          <NumberField label="Cell voltage" suffix="V" value={values.cellVoltage} onChange={set("cellVoltage")} hint="3.6 or 3.7 for most lithium-ion cells" />
          <NumberField label="Cell capacity" suffix="mAh" value={values.cellCapacity} onChange={set("cellCapacity")} hint="One cell, e.g. an 18650 or 21700" />
        </div>
        <h2 className="tool-panel-title">Shipment</h2>
        <div className="tool-grid">
          <div className="tool-span">
            <SelectField<BatteryPacking>
              label="How the battery travels"
              value={packing}
              options={(Object.keys(BATTERY_PACKINGS) as BatteryPacking[]).map((value) => ({ value, label: BATTERY_PACKINGS[value].label }))}
              onChange={(value) => {
                firstUse();
                setPacking(value);
              }}
            />
          </div>
          <NumberField label="Batteries per carton" step="1" value={values.batteriesPerPackage} onChange={set("batteriesPerPackage")} />
          <NumberField label="Weight of one battery" suffix="kg" value={values.batteryWeight} onChange={set("batteryWeight")} hint="The battery only, not the product" />
        </div>
        <p className="tool-basis">{result.handCarry}</p>
      </form>

      <section className="tool-result" aria-live="polite" aria-label="Shipping rules">
        <p className="tool-kicker">Watt-hour rating</p>
        <p className="tool-big">{fixed(result.wh)} Wh</p>
        <p className="tool-sub">
          {result.un}, {result.properName.toLowerCase()} ({result.instruction}). {result.small ? "Small battery: cells up to 20 Wh and the pack up to 100 Wh." : "Over the small-battery limits (20 Wh a cell or 100 Wh a pack)."}
        </p>
        <div className="tool-rows">
          <ResultRow label="Cell rating" value={`${fixed(result.cellWh)} Wh`} />
          <ResultRow label="Batteries in one carton" value={`${fixed(result.packageBatteryKg, 2)} kg`} />
        </div>
        <ToolEmailForm tool="battery-shipping" inputs={{ ...inputs }} />
      </section>
    </div>
    <div className="tool-battery-modes" aria-live="polite" aria-label="Rules by transport mode">
      <ModeCard mode={result.passengerAir} />
      <ModeCard mode={result.cargoAir} />
      <ModeCard mode={result.sea} />
    </div>
    <div className="tool-battery-docs">
      <h2 className="tool-panel-title">Documents to have ready</h2>
      <ul className="tool-notes">
        {result.documents.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    </>
  );
}
