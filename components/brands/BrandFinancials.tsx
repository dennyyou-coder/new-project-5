import Link from "next/link";
import { Icon } from "@/components/Icon";
import { formatAmount, profitChange, resultsForBrand, revenueChange } from "@/lib/financials";

const tone = (change?: string) => (!change ? "" : change.startsWith("+") || change === "Back to profit" ? "up" : change.startsWith("−") || change.startsWith("Loss") ? "down" : "");

/** Recent quarters from the results tracker: revenue bars plus the reported figures and their sources. */
export function BrandFinancials({ brand }: { brand: string }) {
  const quarters = resultsForBrand(brand);
  if (quarters.length < 2) return null;
  const currency = quarters[quarters.length - 1].currency;
  const peak = Math.max(...quarters.map((quarter) => quarter.revenue));
  const hasDerived = quarters.some((quarter) => quarter.derived);
  const newestFirst = [...quarters].reverse();

  return (
    <section className="bp-card bp-financials" id="financials" aria-labelledby="financials-title">
      <div className="bp-card-head">
        <h2 id="financials-title"><span className="bp-card-icon"><Icon name="bar-chart" /></span>Quarterly results</h2>
        <Link className="wcb-more" href="/markets#markets-results-title">All company results</Link>
      </div>
      <div className="bp-fin-chart" role="img" aria-label={`${quarters[0].revenueLabel} by quarter, ${quarters[0].period} to ${quarters[quarters.length - 1].period}`}>
        {quarters.map((quarter) => (
          <div className="bp-fin-bar" key={quarter.period}>
            <span className="bp-fin-value">{formatAmount(quarter.revenue, quarter.currency).replace(`${quarter.currency} `, "")}</span>
            <span className="bp-fin-track"><span style={{ height: `${Math.max(6, (quarter.revenue / peak) * 100)}%` }} /></span>
            <span className="bp-fin-period">{quarter.period.replace(/^Fiscal /, "").replace(/ \(.*\)$/, "")}</span>
          </div>
        ))}
      </div>
      <div className="bp-fin-table-wrap">
        <table className="bp-fin-table">
          <thead>
            <tr><th scope="col">Period</th><th scope="col">{quarters[quarters.length - 1].revenueLabel}</th><th scope="col">Year on year</th><th scope="col">{quarters[quarters.length - 1].profitLabel ?? "Profit"}</th><th scope="col">Year on year</th></tr>
          </thead>
          <tbody>
            {newestFirst.map((quarter) => {
              const rev = revenueChange(quarter);
              const prof = profitChange(quarter);
              return (
                <tr key={quarter.period}>
                  <th scope="row"><a href={quarter.source.url} target="_blank" rel="noopener noreferrer" title={quarter.source.label}>{quarter.period.replace(/ \(.*\)$/, "")}<small>{quarter.period.match(/ \(.*\)$/)?.[0]}</small></a>{quarter.derived ? <sup>*</sup> : null}</th>
                  <td>{formatAmount(quarter.revenue, quarter.currency)}{rev ? <span className={`bp-fin-chip bp-fin-inline ${tone(rev)}`}>{rev}</span> : null}</td>
                  <td><span className={`bp-fin-chip ${tone(rev)}`}>{rev ?? "—"}</span></td>
                  <td>{quarter.profit === undefined ? "—" : formatAmount(quarter.profit, quarter.currency, quarter.approximate)}{prof ? <span className={`bp-fin-chip bp-fin-inline ${tone(prof)}`}>{prof}</span> : null}</td>
                  <td><span className={`bp-fin-chip ${tone(prof)}`}>{prof ?? "—"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="bp-fin-note">
        As reported in {currency}; each period links to its filing or release. A dash means the filing does not give the year-earlier figure.
        {hasDerived ? " * Worked out from two filed cumulative figures (full year minus nine months, or half year minus first quarter)." : ""}
      </p>
    </section>
  );
}
