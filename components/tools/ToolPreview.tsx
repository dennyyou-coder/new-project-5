import type { ReactNode } from "react";
import { fixed, money, type ToolId } from "@/lib/tools/catalog";
import { LANDED_DEFAULTS, calculateLanded } from "@/lib/tools/landedCost";
import { ROI_DEFAULTS, calculateRoi } from "@/lib/tools/roi";
import { CONTAINER_DEFAULTS, CONTAINERS, calculateContainer } from "@/lib/tools/container";
import { PRICING_DEFAULTS, calculatePricing } from "@/lib/tools/pricing";
import { BATTERY_DEFAULTS, calculateBattery } from "@/lib/tools/battery";

/**
 * A small picture of each tool's result, worked out from the tool's own defaults, so a reader can see what the
 * tool does before opening it. Decorative: the card's title and summary carry the meaning for screen readers.
 */
function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <span className="tool-preview" aria-hidden="true">
      <span className="tool-preview-caption">{caption}</span>
      {children}
    </span>
  );
}

function LandedPreview() {
  const result = calculateLanded(LANDED_DEFAULTS);
  const units = LANDED_DEFAULTS.units;
  const factory = LANDED_DEFAULTS.unitPrice;
  const duties = result.dutiesAndFees / units;
  const other = Math.max(0, result.landedPerUnit - factory - duties);
  const total = result.landedPerUnit;
  const parts = [
    { label: "Factory", value: factory, className: "is-base" },
    { label: "Freight, fees", value: other, className: "is-soft" },
    { label: "US duties", value: duties, className: "is-hot" }
  ];
  return (
    <Frame caption="Robot vacuum, China to the US">
      <span className="tool-preview-figures">
        <span><small>Factory price</small><b>{money(factory)}</b></span>
        <span className="tool-preview-arrow">→</span>
        <span><small>Landed cost</small><b className="is-accent">{money(total)}</b></span>
      </span>
      <span className="tool-preview-stack">
        {parts.map((part) => (
          <span key={part.label} className={part.className} style={{ flexGrow: part.value }} />
        ))}
      </span>
      <span className="tool-preview-legend">
        {parts.map((part) => (
          <span key={part.label}><i className={part.className} />{part.label} {money(part.value)}</span>
        ))}
      </span>
    </Frame>
  );
}

function CompliancePreview() {
  const rows = [
    { name: "FCC Part 15", market: "US", note: "Required" },
    { name: "CE: radio and low voltage", market: "EU", note: "Required" },
    { name: "UKCA and PSTI security", market: "UK", note: "Required" },
    { name: "EU Batteries Regulation", market: "EU", note: "18 Feb 2027", date: true }
  ];
  return (
    <Frame caption="Robot vacuum, connected">
      <span className="tool-preview-list">
        {rows.map((row) => (
          <span key={row.name} className="tool-preview-check">
            <i className={row.date ? "is-open" : "is-done"} />
            <span className="tool-preview-chip">{row.market}</span>
            <span className="tool-preview-name">{row.name}</span>
            <span className={row.date ? "tool-preview-date" : "tool-preview-note"}>{row.note}</span>
          </span>
        ))}
      </span>
    </Frame>
  );
}

function RoiPreview() {
  const result = calculateRoi(ROI_DEFAULTS);
  const months = ROI_DEFAULTS.life * 12;
  const monthly = result.netSavingPerYear / 12;
  const low = -ROI_DEFAULTS.price;
  const high = Math.max(result.lifetimeNet, 1);
  const w = 260;
  const h = 84;
  const x = (month: number) => (month / months) * w;
  const y = (value: number) => h - ((value - low) / (high - low)) * h;
  const payback = result.paybackMonths;
  return (
    <Frame caption={`Floor robot at ${money(ROI_DEFAULTS.price)}, ${fixed(ROI_DEFAULTS.area, 0)} m² a day`}>
      <span className="tool-preview-figures">
        <span><small>Saves each year</small><b>{money(result.netSavingPerYear)}</b></span>
        <span><small>Pays back in</small><b className="is-accent">{payback !== null ? `${Math.ceil(payback)} months` : "Never"}</b></span>
      </span>
      <svg className="tool-preview-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <line x1="0" x2={w} y1={y(0)} y2={y(0)} className="tool-preview-axis" vectorEffect="non-scaling-stroke" />
        <polygon points={`0,${y(0)} 0,${y(low)} ${payback !== null ? x(payback) : w},${y(0)}`} className="tool-preview-loss" />
        {payback !== null ? <polygon points={`${x(payback)},${y(0)} ${w},${y(result.lifetimeNet)} ${w},${y(0)}`} className="tool-preview-gain" /> : null}
        <line x1="0" y1={y(low)} x2={w} y2={y(low + monthly * months)} className="tool-preview-line" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="tool-preview-scale"><span>Month 0</span><span>Year {ROI_DEFAULTS.life}</span></span>
    </Frame>
  );
}

function ContainerPreview() {
  const result = calculateContainer(CONTAINER_DEFAULTS);
  const hq = result.fits.find((fit) => fit.key === "40hq")!;
  const spec = CONTAINERS["40hq"];
  // Side view: cartons along the length and up the height, as loaded.
  const cols = Math.floor((spec.length - 10) / CONTAINER_DEFAULTS.cartonLength);
  const rows = Math.floor((spec.height - 5) / CONTAINER_DEFAULTS.cartonHeight);
  const w = 260;
  const h = 70;
  const cw = (CONTAINER_DEFAULTS.cartonLength / spec.length) * w;
  const ch = (CONTAINER_DEFAULTS.cartonHeight / spec.height) * h;
  const boxes: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      boxes.push(<rect key={`${r}-${c}`} x={c * cw + 0.6} y={h - (r + 1) * ch + 0.6} width={cw - 1.2} height={ch - 1.2} rx="0.8" />);
    }
  }
  return (
    <Frame caption={`Carton ${CONTAINER_DEFAULTS.cartonLength}×${CONTAINER_DEFAULTS.cartonWidth}×${CONTAINER_DEFAULTS.cartonHeight} cm, ${CONTAINER_DEFAULTS.cartonWeight} kg`}>
      <span className="tool-preview-figures">
        <span><small>One 40HQ holds</small><b>{hq.cartons.toLocaleString("en-US")} cartons</b></span>
        <span><small>Sea freight</small><b className="is-accent">{hq.freightPerUnit !== null ? `${money(hq.freightPerUnit, "USD", 2)}/unit` : "–"}</b></span>
      </span>
      <svg className="tool-preview-container" viewBox={`-3 -3 ${w + 6} ${h + 6}`} preserveAspectRatio="none">
        <g className="tool-preview-cartons">{boxes}</g>
        <rect x="-1.5" y="-1.5" width={w + 3} height={h + 3} rx="2" className="tool-preview-box" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="tool-preview-scale"><span>40HQ side view</span><span>{fixed(hq.volumeUsed, 0)}% of the space</span></span>
    </Frame>
  );
}

function PricingPreview() {
  const result = calculatePricing(PRICING_DEFAULTS);
  const sum = (match: RegExp) => -result.ladder.filter((step) => match.test(step.label)).reduce((total, step) => total + step.amount, 0);
  const rows = [
    { label: "Shelf price", value: result.retailPrice, className: "is-base" },
    { label: "Amazon fees and ads", value: sum(/Referral|Fulfilment|Advertising|Returns/), className: "is-soft" },
    { label: "Brand margin", value: sum(/Brand margin/), className: "is-soft" },
    { label: "Duty, freight, import", value: sum(/duty|Freight|Import costs/i), className: "is-soft" },
    { label: "Factory price (FOB)", value: result.fobPrice, className: "is-hot" }
  ];
  // Waterfall: each cost comes off what is left of the shelf price; the factory price is what remains.
  let left = result.retailPrice;
  const bars = rows.map((row, index) => {
    if (index === 0 || index === rows.length - 1) return { ...row, start: 0 };
    left -= row.value;
    return { ...row, start: left };
  });
  return (
    <Frame caption="Amazon US, robot vacuum from China">
      <span className="tool-preview-ladder">
        {bars.map((row) => (
          <span key={row.label} className="tool-preview-step">
            <span className="tool-preview-name">{row.label}</span>
            <span className="tool-preview-track"><span className={row.className} style={{ marginLeft: `${Math.max(0, (row.start / result.retailPrice) * 100)}%`, width: `${Math.max(2, (row.value / result.retailPrice) * 100)}%` }} /></span>
            <b className={row.className === "is-hot" ? "is-accent" : undefined}>{money(row.value)}</b>
          </span>
        ))}
      </span>
    </Frame>
  );
}

function BatteryPreview() {
  // Spare packs shipped on their own show how differently air and sea treat the same battery.
  const inputs = { ...BATTERY_DEFAULTS, packing: "alone" as const };
  const result = calculateBattery(inputs);
  const label = { ok: "Simple rules", restricted: "Dangerous goods", forbidden: "Not allowed" } as const;
  const modes = [
    { name: "Passenger air", mode: result.passengerAir },
    { name: "Cargo air", mode: result.cargoAir },
    { name: "Sea", mode: result.sea }
  ];
  return (
    <Frame caption={`Spare ${fixed(inputs.voltage)} V vacuum packs, shipped alone`}>
      <span className="tool-preview-battery">
        <span className="tool-preview-cell"><span style={{ width: `${Math.min(100, (result.wh / 160) * 100)}%` }} /></span>
        <span><small>Rating</small><b>{fixed(result.wh)} Wh</b></span>
        <span><small>UN number</small><b>{result.un}</b></span>
      </span>
      <span className="tool-preview-modes">
        {modes.map(({ name, mode }) => (
          <span key={name} className={`tool-preview-mode is-${mode.verdict}`}>
            <small>{name}</small>
            <b>{label[mode.verdict]}</b>
          </span>
        ))}
      </span>
    </Frame>
  );
}

export function ToolPreview({ id }: { id: ToolId }) {
  if (id === "landed-cost") return <LandedPreview />;
  if (id === "export-compliance") return <CompliancePreview />;
  if (id === "cleaning-robot-roi") return <RoiPreview />;
  if (id === "container-loading") return <ContainerPreview />;
  if (id === "retail-to-fob") return <PricingPreview />;
  return <BatteryPreview />;
}
