import type { ReactNode } from "react";
import { fixed, money, type ToolId } from "@/lib/tools/catalog";
import { LANDED_DEFAULTS, calculateLanded } from "@/lib/tools/landedCost";
import { ROI_DEFAULTS, calculateRoi } from "@/lib/tools/roi";
import { CONTAINER_DEFAULTS, CONTAINERS, calculateContainer } from "@/lib/tools/container";
import { PRICING_DEFAULTS, calculatePricing } from "@/lib/tools/pricing";
import { BATTERY_DEFAULTS, calculateBattery } from "@/lib/tools/battery";

/**
 * A miniature of each tool's own screen on the /tools cards: the inputs filled in on the left and the
 * result they give on the right, worked out from the tool's defaults. Decorative: the card's title and
 * summary carry the meaning for screen readers, and nothing in it can be focused.
 */

/** The object each tool's screen sits in, so the kind of tool reads at a glance. */
type Shell = "calculator" | "clipboard" | "container" | "battery";

const KEYS = ["C", "%", "÷", "×", "−", "+", "="];

function Screen({ name, shell, inputs, children }: { name: string; shell: Shell; inputs: ReactNode; children: ReactNode }) {
  return (
    <span className="ts" aria-hidden="true">
      <span className={`ts-shell ts-shell--${shell}`}>
        {shell === "clipboard" ? <span className="ts-clip" /> : null}
        <span className="ts-window">
          <span className="ts-bar">
            <span className="ts-bar-name">{name}</span>
            <span className="ts-bar-tag">Example</span>
          </span>
          <span className="ts-body">
            <span className="ts-inputs">{inputs}</span>
            <span className="ts-flow">→</span>
            <span className="ts-result">{children}</span>
          </span>
        </span>
        {shell === "calculator" ? (
          <span className="ts-keys">
            {KEYS.map((key) => (
              <span key={key} className={key === "=" ? "is-equals" : undefined}>{key}</span>
            ))}
          </span>
        ) : null}
        {shell === "container" ? <span className="ts-doors"><i /><i /><i /><i /></span> : null}
      </span>
    </span>
  );
}

function Field({ label, value, unit, select }: { label: string; value: string; unit?: string; select?: boolean }) {
  return (
    <span className="ts-field">
      <span className="ts-label">{label}</span>
      <span className={select ? "ts-control is-select" : "ts-control"}>
        <span className="ts-value">{value}</span>
        {unit ? <span className="ts-unit">{unit}</span> : null}
      </span>
    </span>
  );
}

function Big({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <>
      <span className="ts-result-label">{label}</span>
      <span className="ts-big">
        {value}
        {unit ? <small>{unit}</small> : null}
      </span>
    </>
  );
}

function LandedScreen() {
  const result = calculateLanded(LANDED_DEFAULTS);
  const factory = LANDED_DEFAULTS.unitPrice;
  const duties = result.dutiesAndFees / LANDED_DEFAULTS.units;
  const freight = Math.max(0, result.landedPerUnit - factory - duties);
  const parts = [
    { label: "Factory price", value: factory, tone: "is-ink" },
    { label: "Freight and costs", value: freight, tone: "is-soft" },
    { label: "Duties and fees", value: duties, tone: "is-accent" }
  ];
  return (
    <Screen
      name="Landed cost"
      shell="calculator"
      inputs={
        <>
          <Field label="Product" value="Robot vacuum" select />
          <Field label="Route" value="China → US" select />
          <Field label="Factory price" value={money(factory)} />
        </>
      }
    >
      <Big label="Landed cost per unit" value={money(result.landedPerUnit)} />
      <span className="ts-stack">
        {parts.map((part) => (
          <span key={part.label} className={part.tone} style={{ flexGrow: part.value }} />
        ))}
      </span>
      <span className="ts-rows">
        {parts.map((part) => (
          <span key={part.label} className="ts-row">
            <span><i className={part.tone} />{part.label}</span>
            <b>{money(part.value)}</b>
          </span>
        ))}
      </span>
    </Screen>
  );
}

function ComplianceScreen() {
  const rows = [
    { market: "US", name: "FCC Part 15" },
    { market: "EU", name: "CE radio, low voltage" },
    { market: "UK", name: "UKCA, PSTI security" },
    { market: "EU", name: "Battery rules", note: "Feb 2027", date: true }
  ];
  return (
    <Screen
      name="Export compliance"
      shell="clipboard"
      inputs={
        <>
          <Field label="Product" value="Robot vacuum" select />
          <Field label="Connected" value="Wi-Fi and app" select />
          <span className="ts-field">
            <span className="ts-label">Markets</span>
            <span className="ts-chips">
              <span>US</span><span>EU</span><span>UK</span>
            </span>
          </span>
        </>
      }
    >
      <span className="ts-result-label">{rows.length} requirements</span>
      <span className="ts-checks">
        {rows.map((row) => (
          <span key={row.name} className="ts-check">
            <i className={row.date ? "is-date" : "is-done"} />
            <span className="ts-check-name"><em>{row.market}</em>{row.name}</span>
            {row.note ? <span className="ts-check-note is-date">{row.note}</span> : null}
          </span>
        ))}
      </span>
    </Screen>
  );
}

function RoiScreen() {
  const result = calculateRoi(ROI_DEFAULTS);
  const months = ROI_DEFAULTS.life * 12;
  const payback = result.paybackMonths;
  const low = -ROI_DEFAULTS.price;
  const high = Math.max(result.lifetimeNet, 1);
  const w = 200;
  const h = 56;
  const x = (month: number) => (month / months) * w;
  const y = (value: number) => h - ((value - low) / (high - low)) * h;
  return (
    <Screen
      name="Cleaning robot payback"
      shell="calculator"
      inputs={
        <>
          <Field label="Robot price" value={money(ROI_DEFAULTS.price)} />
          <Field label="Floor cleaned a day" value={fixed(ROI_DEFAULTS.area, 0)} unit="m²" />
          <Field label="Cleaner wage" value={money(ROI_DEFAULTS.wage)} unit="/ hour" />
        </>
      }
    >
      <Big label="Saved each year" value={money(result.netSavingPerYear)} />
      <span className="ts-payback">
        Pays back in <b>{payback !== null ? `${Math.ceil(payback)} months` : "never"}</b>
      </span>
      <svg className="ts-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {payback !== null ? (
          <>
            <polygon className="ts-chart-loss" points={`0,${y(0)} 0,${y(low)} ${x(payback)},${y(0)}`} />
            <polygon className="ts-chart-gain" points={`${x(payback)},${y(0)} ${w},${y(result.lifetimeNet)} ${w},${y(0)}`} />
          </>
        ) : null}
        <line className="ts-chart-axis" x1="0" x2={w} y1={y(0)} y2={y(0)} vectorEffect="non-scaling-stroke" />
        <line className="ts-chart-line" x1="0" y1={y(low)} x2={w} y2={y(result.lifetimeNet)} vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="ts-scale"><span>Today</span><span>Year {ROI_DEFAULTS.life}</span></span>
    </Screen>
  );
}

function ContainerScreen() {
  const result = calculateContainer(CONTAINER_DEFAULTS);
  const hq = result.fits.find((fit) => fit.key === "40hq")!;
  const spec = CONTAINERS["40hq"];
  const { cartonLength, cartonWidth, cartonHeight, cartonWeight, unitsPerCarton } = CONTAINER_DEFAULTS;
  // Side view as loaded: cartons along the length and up the height.
  const cols = Math.floor((spec.length - 10) / cartonLength);
  const rows = Math.floor((spec.height - 5) / cartonHeight);
  const w = 240;
  const h = 54;
  const cw = (cartonLength / spec.length) * w;
  const ch = (cartonHeight / spec.height) * h;
  const boxes: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      boxes.push(<rect key={`${r}-${c}`} x={c * cw + 0.5} y={h - (r + 1) * ch + 0.5} width={cw - 1} height={ch - 1} />);
    }
  }
  return (
    <Screen
      name="Container loading"
      shell="container"
      inputs={
        <>
          <Field label="Carton (cm)" value={`${cartonLength}×${cartonWidth}×${cartonHeight}`} />
          <Field label="Carton weight" value={String(cartonWeight)} unit="kg" />
          <Field label="Units per carton" value={String(unitsPerCarton)} />
        </>
      }
    >
      <span className="ts-tabs">
        {result.fits.map((fit) => (
          <span key={fit.key} className={fit.key === "40hq" ? "is-on" : undefined}>{fit.label}</span>
        ))}
      </span>
      <Big label="Fits in one 40HQ" value={hq.cartons.toLocaleString("en-US")} unit="cartons" />
      <svg className="ts-box" viewBox={`-2 -2 ${w + 4} ${h + 4}`} preserveAspectRatio="none">
        <g className="ts-box-cartons">{boxes}</g>
        <rect className="ts-box-frame" x="-1" y="-1" width={w + 2} height={h + 2} vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="ts-row ts-row--plain">
        <span>Sea freight</span>
        <b>{hq.freightPerUnit !== null ? `${money(hq.freightPerUnit, "USD", 2)} / unit` : "–"}</b>
      </span>
    </Screen>
  );
}

function PricingScreen() {
  const result = calculatePricing(PRICING_DEFAULTS);
  const sum = (match: RegExp) => -result.ladder.filter((step) => match.test(step.label)).reduce((total, step) => total + step.amount, 0);
  const steps = [
    { label: "Shelf price", value: result.retailPrice, tone: "is-ink", total: true },
    { label: "Amazon fees", value: sum(/Referral|Fulfilment|Advertising|Returns/), tone: "is-soft" },
    { label: "Margin", value: sum(/Brand margin/), tone: "is-soft" },
    { label: "Duty, freight", value: sum(/duty|Freight|Import costs/i), tone: "is-soft" },
    { label: "Factory price", value: result.fobPrice, tone: "is-accent", total: true }
  ];
  // Waterfall: each cost comes off what is left of the shelf price; the factory price is what remains.
  let left = result.retailPrice;
  const bars = steps.map((step) => {
    if (step.total) return { ...step, start: 0 };
    left -= step.value;
    return { ...step, start: left };
  });
  const pct = (value: number) => `${Math.max(0, (value / result.retailPrice) * 100)}%`;
  return (
    <Screen
      name="Retail price to FOB"
      shell="calculator"
      inputs={
        <>
          <Field label="Sell on" value="Amazon US" select />
          <Field label="Shelf price" value={money(PRICING_DEFAULTS.retailPrice)} />
          <Field label="Brand margin" value={String(PRICING_DEFAULTS.brandMargin)} unit="%" />
        </>
      }
    >
      <Big label="Highest factory price" value={money(result.fobPrice)} unit="FOB" />
      <span className="ts-fall">
        {bars.map((bar) => (
          <span key={bar.label} className="ts-fall-row">
            <span className="ts-fall-name">{bar.label}</span>
            <span className="ts-fall-track"><span className={bar.tone} style={{ marginLeft: pct(bar.start), width: pct(Math.max(bar.value, result.retailPrice * 0.02)) }} /></span>
            <b>{bar.total ? money(bar.value) : `−${money(bar.value)}`}</b>
          </span>
        ))}
      </span>
    </Screen>
  );
}

function BatteryScreen() {
  // A spare pack shipped on its own shows how differently air and sea treat the same battery.
  const inputs = { ...BATTERY_DEFAULTS, packing: "alone" as const };
  const result = calculateBattery(inputs);
  const label = { ok: "Allowed", restricted: "Dangerous goods", forbidden: "Not allowed" } as const;
  const modes = [
    { name: "Passenger air", mode: result.passengerAir },
    { name: "Cargo air", mode: result.cargoAir },
    { name: "Sea", mode: result.sea }
  ];
  return (
    <Screen
      name="Battery shipping"
      shell="battery"
      inputs={
        <>
          <Field label="Pack voltage" value={fixed(inputs.voltage)} unit="V" />
          <Field label="Capacity" value={inputs.capacity.toLocaleString("en-US")} unit="mAh" />
          <Field label="Shipped" value="Spare, alone" select />
        </>
      }
    >
      <span className="ts-result-label">Battery rating</span>
      <span className="ts-big-line">
        <span className="ts-big">{fixed(result.wh, 0)}<small>Wh</small></span>
        <span className="ts-tag">{result.un}</span>
      </span>
      <span className="ts-modes">
        {modes.map(({ name, mode }) => (
          <span key={name} className="ts-mode">
            <span>{name}</span>
            <span className={`ts-verdict is-${mode.verdict}`}>{label[mode.verdict]}</span>
          </span>
        ))}
      </span>
    </Screen>
  );
}

export function ToolScreen({ id }: { id: ToolId }) {
  if (id === "landed-cost") return <LandedScreen />;
  if (id === "export-compliance") return <ComplianceScreen />;
  if (id === "cleaning-robot-roi") return <RoiScreen />;
  if (id === "container-loading") return <ContainerScreen />;
  if (id === "retail-to-fob") return <PricingScreen />;
  return <BatteryScreen />;
}
