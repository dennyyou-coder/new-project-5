import Link from "next/link";
import type { ReactNode } from "react";
import type { TopicChart as TopicChartData } from "@/lib/topics";
import { revenueGrowthRanking } from "@/lib/rankings";

type Row = { label: string; segments: number[]; display: string; href?: string };

function format(value: number, unit = "") {
  const rounded = Math.abs(value) >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded}${unit}`;
}

/** Horizontal bars drawn from data in the topic file; negative values extend left of a zero line. */
export function TopicChart({ chart }: { chart: TopicChartData }) {
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
