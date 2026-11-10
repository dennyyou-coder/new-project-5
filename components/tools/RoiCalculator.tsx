"use client";

import { useMemo, useState } from "react";
import { CURRENCIES, fixed, money, type Currency } from "@/lib/tools/catalog";
import { ROI_DEFAULTS, calculateRoi, cleanRoiInputs, type RoiInputs } from "@/lib/tools/roi";
import { NumberField, ResultRow, Segmented, ToolEmailForm, useFirstUse } from "./ToolParts";

export function RoiCalculator() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [values, setValues] = useState<Record<keyof RoiInputs, string>>(
    () => Object.fromEntries(Object.entries(ROI_DEFAULTS).map(([key, value]) => [key, String(value)])) as Record<keyof RoiInputs, string>
  );
  const firstUse = useFirstUse("cleaning-robot-roi");
  const set = (key: keyof RoiInputs) => (value: string) => {
    firstUse();
    setValues((current) => ({ ...current, [key]: value }));
  };
  const inputs = useMemo(() => cleanRoiInputs(values), [values]);
  const result = useMemo(() => calculateRoi(inputs), [inputs]);
  const symbol = CURRENCIES[currency];
  const years = Math.round(inputs.life);
  // Cumulative position at the end of each year, for the small chart.
  const timeline = Array.from({ length: years + 1 }, (_, year) => year * result.netSavingPerYear - inputs.price);
  const extent = Math.max(...timeline.map(Math.abs), 1);

  return (
    <div className="tool-layout">
      <form className="tool-panel" onSubmit={(event) => event.preventDefault()} aria-label="Site and robot details">
        <h2 className="tool-panel-title">Your site</h2>
        <div className="tool-grid">
          <NumberField label="Floor area cleaned per day" suffix="m²" value={values.area} onChange={set("area")} />
          <NumberField label="Cleaned by hand per hour" suffix="m²/h" value={values.manualRate} onChange={set("manualRate")} hint="Mopping 150–300, walk-behind scrubber 800–1,500" />
          <NumberField label="Cleaning days per year" value={values.days} onChange={set("days")} />
          <NumberField label="Labour cost per hour" prefix={symbol} value={values.wage} onChange={set("wage")} hint="Wage plus taxes and benefits" />
        </div>
        <h2 className="tool-panel-title">The robot</h2>
        <div className="tool-grid">
          <NumberField label="Work the robot takes over" suffix="%" value={values.coverage} onChange={set("coverage")} hint="Open floor it can reach; edges stay manual" />
          <NumberField label="Staff time on the robot" suffix="h/day" value={values.supervision} onChange={set("supervision")} hint="Moving, emptying, checking" />
          <NumberField label="Robot price" prefix={symbol} value={values.price} onChange={set("price")} hint="Including dock and setup" />
          <NumberField label="Running costs per year" prefix={symbol} value={values.running} onChange={set("running")} hint="Service, parts, power, software" />
          <NumberField label="Expected life" suffix="years" step="1" value={values.life} onChange={set("life")} />
          <Segmented<Currency>
            label="Currency"
            value={currency}
            options={(Object.keys(CURRENCIES) as Currency[]).map((value) => ({ value, label: value }))}
            onChange={(value) => {
              firstUse();
              setCurrency(value);
            }}
          />
        </div>
      </form>

      <section className="tool-result" aria-live="polite" aria-label="Payback">
        <p className="tool-kicker">Payback</p>
        <p className="tool-big">{result.paybackMonths === null ? "No payback" : `${fixed(result.paybackMonths)} months`}</p>
        <p className="tool-sub">
          {result.paybackMonths === null
            ? "At these numbers the robot saves less than it costs to run. Check the area, the coverage or the labour cost."
            : `Net gain of ${money(result.lifetimeNet, currency)} over ${inputs.life} years`}
        </p>
        <div className="tool-chart" role="img" aria-label={`Cumulative position from ${money(timeline[0], currency)} at purchase to ${money(timeline[timeline.length - 1], currency)} after ${years} years`}>
          {timeline.map((value, year) => (
            <span key={year} className="tool-chart-col">
              <span className="tool-chart-track">
                <span className={value >= 0 ? "tool-chart-bar is-up" : "tool-chart-bar is-down"} style={{ height: `${(Math.abs(value) / extent) * 50}%` }} />
              </span>
              <span className="tool-chart-label">{year === 0 ? "Buy" : `Y${year}`}</span>
            </span>
          ))}
        </div>
        <div className="tool-rows">
          <ResultRow label="Manual cleaning today" value={`${fixed(result.manualHoursPerDay)} h/day`} />
          <ResultRow label="Hours freed" value={`${fixed(result.hoursSavedPerDay)} h/day`} note={`${Math.round(result.hoursSavedPerYear).toLocaleString("en-US")} h a year, ${fixed(result.fteFreed, 2)} full-time cleaners`} />
          <ResultRow label="Labour saved per year" value={money(result.labourSavedPerYear, currency)} />
          <ResultRow label="Running costs per year" value={money(-inputs.running, currency)} />
          <ResultRow label="Net saving per year" value={money(result.netSavingPerYear, currency)} strong />
          {result.lifetimeRoi !== null ? <ResultRow label={`Return over ${inputs.life} years`} value={`${fixed(result.lifetimeRoi, 0)}%`} /> : null}
        </div>
        <ToolEmailForm tool="cleaning-robot-roi" inputs={{ ...inputs, currency }} />
      </section>
    </div>
  );
}
