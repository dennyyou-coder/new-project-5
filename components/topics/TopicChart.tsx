import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { TopicChart as TopicChartData } from "@/lib/topics";
import { revenueGrowthRanking } from "@/lib/rankings";

type Row = { label: string; segments: number[]; display: string; href?: string };

function format(value: number, unit = "") {
  const rounded = Math.abs(value) >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded}${unit}`;
}

/** "2005-10" or "2026-11-09" → a fractional year. */
function yearOf(value: string) {
  const parts = value.split("-").map(Number);
  if (parts.length === 1) return parts[0] + 0.5;
  const [year, month = 1, day = 15] = parts;
  return year + (month - 1) / 12 + (day - 1) / 365;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-09" → days since 1970, for placing dates on a shared axis. */
function dayOf(value: string) {
  const [year, month = 1, day = 1] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}

/** "2026-09-09" → "9 Sep". */
function shortDay(value: string) {
  const [, month = 1, day = 1] = value.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

/** Month starts between two dates, for axis ticks. */
function monthTicks(start: string, end: string) {
  const [y0, m0] = start.split("-").map(Number);
  // Long axes get a tick every six months, labelled with the year in January.
  const long = dayOf(end) - dayOf(start) > 400;
  const ticks: { key: string; label: string; day: number }[] = [];
  for (let y = y0, m = m0 + 1; ; m++) {
    if (m > 12) { m = 1; y++; }
    const key = `${y}-${String(m).padStart(2, "0")}-01`;
    if (dayOf(key) > dayOf(end)) break;
    if (long && m !== 1 && m !== 7) continue;
    ticks.push({ key, label: long && m === 1 ? String(y) : MONTHS[m - 1], day: dayOf(key) });
  }
  return ticks;
}

/** A running total drawn as a step line; highlighted points carry a label. */
function CumulativeChart({ chart }: { chart: Extract<TopicChartData, { type: "cumulative" }> }) {
  const d0 = dayOf(chart.start);
  const span = dayOf(chart.end) - d0 || 1;
  const max = Math.max(1, chart.startValue ?? 0, ...chart.points.map((point) => point.count));
  const x = (date: string) => ((dayOf(date) - d0) / span) * 100;
  const y = (count: number) => 100 - (count / max) * 100;
  const unit = chart.unit ?? "";
  const startValue = chart.startValue ?? 0;
  let path = `M0 ${y(startValue).toFixed(2)}`;
  let last = startValue;
  for (const point of chart.points) {
    path += ` H${x(point.date).toFixed(2)} V${y(point.count).toFixed(2)}`;
    last = point.count;
  }
  path += ` H100`;
  const area = `M0 100 V${y(startValue).toFixed(2)}${path.slice(path.indexOf(" "))} V100 Z`;
  const final = chart.points[chart.points.length - 1];
  const longAxis = span > 400;
  return (
    <figure className="topic-chart topic-cumulative">
      <div className="topic-cumulative-head">
        <figcaption className="topic-chart-title">{chart.title}</figcaption>
        {chart.callout ? <p className="topic-cumulative-callout"><strong>{chart.callout.value}</strong>{chart.callout.label}</p> : null}
      </div>
      <div className="topic-cumulative-plot" aria-hidden="true">
        {chart.zone ? (
          <span className="topic-cumulative-zone" style={{ left: `${x(chart.zone.from)}%` }}><b>{chart.zone.label}</b></span>
        ) : null}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={area} className="topic-cumulative-area" />
          <path d={path} className="topic-cumulative-line" vectorEffect="non-scaling-stroke" />
        </svg>
        {chart.points.map((point) => (
          <span key={point.date} className={`topic-cumulative-dot${point.highlight ? " is-highlight" : ""}`} style={{ left: `${x(point.date)}%`, top: `${y(point.count)}%` }} />
        ))}
        {chart.points.filter((point) => point.highlight && point.label).map((point) => (
          <span key={`l-${point.date}`} className={`topic-cumulative-label${(point.place ?? (x(point.date) > 60 ? "left" : "right")) === "left" ? " is-left" : ""}${y(point.count) < 15 ? " is-below" : ""}`} style={{ left: `${x(point.date)}%`, top: `${y(point.count)}%` }}>
            <b>{shortDay(point.date)}{longAxis ? ` ${point.date.slice(0, 4)}` : ""} · {point.count}{unit}</b>{point.label}
          </span>
        ))}
        {final ? <span className="topic-cumulative-total" style={{ top: `${y(last)}%` }}>{last}{unit}</span> : null}
      </div>
      <div className="topic-cumulative-axis" aria-hidden="true">
        {monthTicks(chart.start, chart.end).map((tick) => <span key={tick.key} style={{ left: `${((tick.day - d0) / span) * 100}%` }}>{tick.label}</span>)}
      </div>
      <ol className="topic-cumulative-keys" aria-hidden="true">
        {chart.points.filter((point) => point.highlight && point.label).map((point) => (
          <li key={point.date}><b>{shortDay(point.date)}{longAxis ? ` ${point.date.slice(0, 4)}` : ""} · {point.count}{unit}</b> {point.label}</li>
        ))}
      </ol>
      <ol className="sr-only">
        {chart.points.map((point) => <li key={point.date}>{shortDay(point.date)} {point.date.slice(0, 4)}: {point.count}{unit}{point.label ? ` (${point.label})` : ""}</li>)}
      </ol>
      {chart.note ? <p className="topic-chart-note">{chart.note}</p> : null}
    </figure>
  );
}

/** One dot per row on a date axis with a marker line; dots before the marker are red. */
function DotsChart({ chart }: { chart: Extract<TopicChartData, { type: "dots" }> }) {
  const d0 = dayOf(chart.start);
  const span = dayOf(chart.end) - d0 || 1;
  const x = (date: string) => Math.min(100, Math.max(0, ((dayOf(date) - d0) / span) * 100));
  const markerDay = dayOf(chart.marker.date);
  const markerLeft = x(chart.marker.date);
  return (
    <figure className="topic-chart topic-dots">
      <figcaption className="topic-chart-title">{chart.title}</figcaption>
      <ul className="topic-chart-legend">
        <li><span className="topic-dots-key is-before" aria-hidden="true" />Last grant before {chart.marker.label.toLowerCase()}</li>
        <li><span className="topic-dots-key is-after" aria-hidden="true" />Grant since then</li>
      </ul>
      <div className="topic-dots-body" style={{ "--marker": `${markerLeft}%` } as CSSProperties}>
        <div className="topic-dots-head" aria-hidden="true">
          <span />
          <span className="topic-dots-track"><b>{chart.marker.label} · {shortDay(chart.marker.date)}</b></span>
          <span />
        </div>
        <ol className="topic-dots-rows">
          {chart.rows.map((row) => {
            const after = dayOf(row.date) >= markerDay;
            return (
              <li key={row.label}>
                <span className="topic-dots-label">{row.href ? <Link href={row.href}>{row.label}</Link> : row.label}</span>
                <span className="topic-dots-track">
                  <span className={`topic-dots-dot ${after ? "is-after" : "is-before"}`} style={{ left: `${x(row.date)}%` }} title={`${row.label}: ${shortDay(row.date)}`} />
                </span>
                <span className="topic-dots-date">{shortDay(row.date)}{row.note ? <small>{row.note}</small> : null}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="topic-dots-axis" aria-hidden="true">
        <span />
        <span className="topic-dots-ticks">
          {monthTicks(chart.start, chart.end).map((tick) => <span key={tick.key} style={{ left: `${((tick.day - d0) / span) * 100}%` }}>{tick.label}</span>)}
        </span>
        <span />
      </div>
      {chart.note ? <p className="topic-chart-note">{chart.note}</p> : null}
    </figure>
  );
}

/** Events on one year axis, one lane per side. */
function LanesChart({ chart }: { chart: Extract<TopicChartData, { type: "lanes" }> }) {
  const span = chart.end - chart.start;
  const at = (value: string) => Math.min(100, Math.max(0, ((yearOf(value) - chart.start) / span) * 100));
  const ticks: number[] = [];
  for (let year = Math.ceil(chart.start / 5) * 5; year <= chart.end; year += 5) ticks.push(year);
  return (
    <figure className="topic-chart topic-lanes">
      <figcaption className="topic-chart-title">{chart.title}</figcaption>
      <ol className="topic-lanes-rows">
        {chart.lanes.map((lane, laneIndex) => {
          // Markers close to their neighbour split up and down so both stay readable.
          const lefts = lane.items.map((item) => at(item.date));
          const place = lefts.map(() => "");
          lefts.forEach((left, index) => {
            if (index > 0 && left - lefts[index - 1] < 6 && !place[index - 1]) {
              place[index - 1] = " is-low";
              place[index] = " is-high";
            }
          });
          return (
            <li key={lane.label} className={`is-${laneIndex}`}>
              <span className="topic-lanes-label">{lane.label}</span>
              <span className="topic-lanes-track">
                {lane.items.map((item, index) => {
                  const left = lefts[index];
                  const title = `${item.n ? `${item.n}. ` : ""}${item.label}`;
                  return item.end ? (
                    <span key={title} className="topic-lanes-span" style={{ left: `${left}%`, width: `${at(item.end) - left}%` }} title={title}>
                      <b>{item.n}</b>
                    </span>
                  ) : (
                    <span key={title} className={`topic-lanes-dot${place[index]}`} style={{ left: `${left}%` }} title={title}>
                      {item.n}
                    </span>
                  );
                })}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="topic-lanes-axis" aria-hidden="true">
        <span />
        <span className="topic-lanes-ticks">
          {ticks.map((year) => <span key={year} style={{ left: `${((year - chart.start) / span) * 100}%` }}>{year}</span>)}
        </span>
      </div>
      <ol className="sr-only">
        {chart.lanes.flatMap((lane) => lane.items.map((item) => <li key={`${lane.label}-${item.label}`}>{lane.label}: {item.label}</li>))}
      </ol>
      {chart.note ? <p className="topic-chart-note">{chart.note}</p> : null}
    </figure>
  );
}

/** Horizontal bars drawn from data in the topic file; negative values extend left of a zero line. */
export function TopicChart({ chart }: { chart: TopicChartData }) {
  if (chart.type === "lanes") return <LanesChart chart={chart} />;
  if (chart.type === "cumulative") return <CumulativeChart chart={chart} />;
  if (chart.type === "dots") return <DotsChart chart={chart} />;
  let rows: Row[];
  let legend: string[] | undefined;
  if (chart.type === "results-growth") {
    rows = revenueGrowthRanking().all.map(({ result, change, growth }) => ({
      label: result.name,
      segments: [growth],
      display: change ?? format(growth, "%"),
      href: `/brands/${result.brand}`
    }));
  } else {
    legend = chart.legend;
    rows = chart.rows.map((row) => ({
      ...row,
      display: row.display ?? format(row.segments.reduce((sum, value) => sum + value, 0), chart.unit)
    }));
  }
  const totals = rows.map((row) => row.segments.reduce((sum, value) => sum + value, 0));
  const max = Math.max(1, ...totals.map((total) => Math.max(total, 0)));
  const min = Math.min(0, ...totals);
  const span = max - min || 1;
  const zero = (-min / span) * 100;

  return (
    <figure className="topic-chart">
      <figcaption className="topic-chart-title">{chart.title}</figcaption>
      {legend?.length ? (
        <ul className="topic-chart-legend">
          {legend.map((item, index) => <li key={item}><span className={`topic-chart-swatch is-${index}`} aria-hidden="true" />{item}</li>)}
        </ul>
      ) : null}
      <ol className="topic-chart-rows">
        {rows.map((row, rowIndex) => {
          const total = totals[rowIndex];
          const negative = total < 0;
          return (
            <li key={row.label}>
              <span className="topic-chart-label">{row.href ? <Link href={row.href}>{row.label}</Link> : row.label}</span>
              <span className="topic-chart-track" aria-hidden="true">
                {min < 0 ? <span className="topic-chart-zero" style={{ left: `${zero}%` }} /> : null}
                {negative ? (
                  <span className="topic-chart-seg is-negative" style={{ left: `${zero - (Math.abs(total) / span) * 100}%`, width: `${(Math.abs(total) / span) * 100}%` }} />
                ) : (
                  row.segments.reduce<{ offset: number; nodes: ReactNode[] }>((acc, value, index) => {
                    if (value > 0) {
                      const width = (value / span) * 100;
                      acc.nodes.push(<span key={index} className={`topic-chart-seg is-${index}`} style={{ left: `${zero + acc.offset}%`, width: `${width}%` }} />);
                      acc.offset += width;
                    }
                    return acc;
                  }, { offset: 0, nodes: [] }).nodes
                )}
              </span>
              <span className={`topic-chart-value${negative ? " is-negative" : ""}`}>{row.display}</span>
            </li>
          );
        })}
      </ol>
      {chart.note ? <p className="topic-chart-note">{chart.note}</p> : null}
    </figure>
  );
}
